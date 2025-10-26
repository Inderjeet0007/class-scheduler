import fs from "fs";
import csv from "csv-parser";
import Student from "../models/Student.js";
import Instructor from "../models/Instructor.js";
import ClassType from "../models/ClassType.js";
import Registration from "../models/Registration.js";
import { validateSchedule } from "../utils/validateSchedule.js";

/**
 * Handle uploaded CSV and process each instruction
 */
export const uploadRegistrations = async (req, res) => {
  const filePath = req.file.path;
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => results.push(row))
    .on("end", async () => {
      const responses = [];

      for (const [index, row] of results.entries()) {
        const {
          "Registration ID": registrationId,
          "Student ID": studentId,
          "Instructor ID": instructorId,
          "Class ID": classId,
          "Class Start Time": classStart,
          Action: action,
        } = row;

        try {
          if (action === "new") {
            // Ensure IDs are valid
            if (!studentId || !instructorId || !classId || !classStart) {
              responses.push({
                line: index + 1,
                status: "error",
                reason: "Missing required fields",
              });
              continue;
            }

            // Check if instructor/classId exist
            const instructor = await Instructor.findOne({ instructorId });
            const classType = await ClassType.findOne({ classId });

            if (!instructor) {
              responses.push({
                line: index + 1,
                status: "error",
                reason: "Invalid instructorId",
              });
              continue;
            }
            if (!classType) {
              responses.push({
                line: index + 1,
                status: "error",
                reason: "Invalid classId",
              });
              continue;
            }

            // Add new student if not exists
            let student = await Student.findOne({ studentId });
            if (!student) {
              student = await Student.create({ studentId });
            }

            // Validate schedule
            const validation = await validateSchedule({
              studentId,
              instructorId,
              classId,
              startTime: new Date(classStart),
              registrationId,
            });

            if (!validation.valid) {
              responses.push({
                line: index + 1,
                status: "error",
                reason: validation.reason,
              });
              continue;
            }

            const newRegistration = await Registration.create({
              registrationId: Math.floor(Math.random() * 1000).toString(),
              studentId,
              instructorId,
              classId,
              startTime: new Date(classStart),
              endTime: validation.endTime,
              date: validation.date,
            });

            responses.push({
              line: index + 1,
              status: "success",
              registrationId: newRegistration.registrationId,
            });
          } else if (action === "update") {
            const existing = await Registration.findOne({ registrationId });
            if (!existing) {
              responses.push({
                line: index + 1,
                status: "error",
                reason: "Registration ID not found",
              });
              continue;
            }

            // Perform validation with new data
            const validation = await validateSchedule({
              studentId: studentId || existing.studentId,
              instructorId: instructorId || existing.instructorId,
              classId: classId || existing.classId,
              startTime: new Date(classStart),
              registrationId,
            });

            if (!validation.valid) {
              responses.push({
                line: index + 1,
                status: "error",
                reason: validation.reason,
              });
              continue;
            }

            existing.studentId = studentId || existing.studentId;
            existing.instructorId = instructorId || existing.instructorId;
            existing.classId = classId || existing.classId;
            existing.startTime = new Date(classStart);
            existing.endTime = validation.endTime;
            existing.date = validation.date;
            await existing.save();

            responses.push({
              line: index + 1,
              status: "success",
              registrationId: existing.registrationId,
            });
          } else if (action === "delete") {
            const deleted = await Registration.findOneAndDelete({
              registrationId,
            });
            if (!deleted) {
              responses.push({
                line: index + 1,
                status: "error",
                reason: "Registration ID not found",
              });
              continue;
            }
            responses.push({
              line: index + 1,
              status: "success",
              message: "Deleted successfully",
            });
          } else {
            responses.push({
              line: index + 1,
              status: "error",
              reason: "Invalid action",
            });
          }
        } catch (error) {
          responses.push({
            line: index + 1,
            status: "error",
            reason: error.message,
          });
        }
      }

      fs.unlinkSync(filePath); // delete file after processing
      res.json({ results: responses });
    });
};

/**
 * Get daily registration stats
 * Returns array of objects: [{ date: "YYYY-MM-DD", count: 5 }, ...]
 */
export const getStats = async (req, res) => {
  try {
    // Aggregate registrations by date
    const stats = await Registration.aggregate([
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // sort by date ascending
    ]);

    if (!stats || stats.length === 0) {
      return res
        .status(200)
        .json({ message: "No registration stats found", data: [] });
    }

    // Map _id to date field
    const result = stats.map((item) => ({
      date: item._id,
      count: item.count,
    }));

    res.json({ message: "Stats retrieved successfully", data: result });
  } catch (error) {
    console.error("Stats Error:", error.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

/**
 * Get all registrations for report
 */
export const getReport = async (req, res) => {
  try {
    const { date, instructorName } = req.query;
    const filter = {};

    if (date) filter.date = date;

    if (instructorName) {
      // Find instructor by name
      const instructor = await Instructor.findOne({
        name: { $regex: instructorName, $options: "i" }, // case-insensitive match
      });

      if (!instructor) {
        return res
          .status(200)
          .json({ message: "Instructor not found", data: [] });
      }

      filter.instructorId = instructor.instructorId;
    }

    const registrations = await Registration.find(filter).sort({
      date: 1,
      startTime: 1,
    });

    if (!registrations || registrations.length === 0) {
      return res
        .status(200)
        .json({ message: "No registrations found", data: [] });
    }

    // Fetch all related instructors, students, and classes once
    const instructors = await Instructor.find();
    const students = await Student.find();
    const classes = await ClassType.find();
    const enrichedData = registrations.map((reg) => {
      const instr = instructors.find(
        (i) => i.instructorId === reg.instructorId,
      );
      const student = students.find((s) => s.studentId === reg.studentId);
      const classType = classes.find((c) => c.classId === reg.classId);

      return {
        ...reg._doc,
        instructorName: instr ? instr.name : "Unknown Instructor",
        studentName: student ? student.name : "Unknown Student",
        className: classType ? classType.name : "Unknown Class",
      };
    });

    res.json({ message: "Report retrieved successfully", data: enrichedData });
  } catch (error) {
    console.error("Report Error:", error.message);
    res.status(500).json({ error: "Failed to fetch report" });
  }
};
