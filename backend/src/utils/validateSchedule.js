import Registration from "../models/Registration.js";
import moment from "moment";
import Config from "../models/Config.js";

/**
 * Validate if a new class schedule is allowed.
 * Checks student/instructor limits and overlapping sessions.
 */
export const validateSchedule = async ({ studentId, instructorId, classId, startTime, registrationId = null }) => {

  // Fetch configuration from DB
  const configs = await Config.find({
    key: {
      $in: [
        "CLASS_DURATION_MINUTES",
        "MAX_CLASSES_PER_STUDENT_PER_DAY",
        "MAX_CLASSES_PER_INSTRUCTOR_PER_DAY",
        "MAX_CLASSES_PER_TYPE_PER_DAY"
      ]
    }
  });

  // Convert array of configs to a lookup object
  const configMap = configs.reduce((acc, conf) => {
    acc[conf.key] = parseInt(conf.value); // store as number
    return acc;
  }, {});


  const duration = configMap.CLASS_DURATION_MINUTES || 45;
  const maxStudentPerDay = configMap.MAX_CLASSES_PER_STUDENT_PER_DAY || 3;
  const maxInstructorPerDay = configMap.MAX_CLASSES_PER_INSTRUCTOR_PER_DAY || 5;
  const maxClassTypePerDay = configMap.MAX_CLASSES_PER_TYPE_PER_DAY || 10;
  const endTime = moment(startTime).add(duration, "minutes").toDate();
  const date = moment(startTime).format("YYYY-MM-DD");

  // Build a filter to exclude the current registration if updating
  const excludeCurrent = registrationId ? { _id: { $ne: registrationId } } : {};

  // Check overlapping sessions (for same student or instructor)
  const overlapping = await Registration.findOne({
    date,
    $or: [{ studentId }, { instructorId }],
    $and: [
      { startTime: { $lt: endTime } },
      { endTime: { $gt: startTime } }
    ],
    ...excludeCurrent
  });

  if (overlapping) {
    const conflictFor = overlapping.studentId === studentId ? "student" : "instructor";
    return { valid: false, reason: `Overlapping session for ${conflictFor}` };
  }

  // Student class count per day
  const studentCount = await Registration.countDocuments({
    studentId,
    date,
    ...excludeCurrent
  });
  if (studentCount >= maxStudentPerDay) {
    return { valid: false, reason: "Student daily class limit reached" };
  }

  // Instructor class count per day
  const instructorCount = await Registration.countDocuments({
    instructorId,
    date,
    ...excludeCurrent
  });
  if (instructorCount >= maxInstructorPerDay) {
    return { valid: false, reason: "Instructor daily class limit reached" };
  }

  // Limit per class type
  if (maxClassTypePerDay) {
    const typeCount = await Registration.countDocuments({
      classId,
      date,
      ...excludeCurrent
    });
    if (typeCount >= maxClassTypePerDay) {
      return { valid: false, reason: "Class-type daily limit reached" };
    }
  }

  return { valid: true, endTime, date };
};
