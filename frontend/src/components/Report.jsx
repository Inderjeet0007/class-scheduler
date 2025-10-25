import React, { useEffect, useState } from "react";
import { getReport } from "../api/api";

const Report = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);       // Track loading state
  const [message, setMessage] = useState("");         // Track no data or error messages
  const [filterInstructor, setFilterInstructor] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const fetchReport = async () => {
        setLoading(true);
    try {

         const filters = {};
        if (filterInstructor) filters.instructorName = filterInstructor;
        if (filterDate) filters.date = filterDate;

            const report = await getReport(filters);
    
            if (!report || report.length === 0) {
            setData([]);
            setMessage("No scheduled classes available.");
            } else {
            setData(report);
            setMessage("");
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            setData([]);
            setMessage("Failed to fetch stats. Try again later.");
        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    fetchReport();
    const interval = setInterval(fetchReport, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [filterInstructor, filterDate]);

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Class Schedule Report</h2>

      <p style={{ color: "#555", marginBottom: "20px" }}>
    This report displays all scheduled driving classes with detailed information about 
    students, instructors, and class types. Use the filters below to refine the report 
    by instructor name or specific date.
  </p>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by Instructor Name"
          value={filterInstructor}
          onChange={(e) => setFilterInstructor(e.target.value)}
          style={{
        flex: 1,
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        outline: "none",
        transition: "0.2s",
      }}
      onFocus={(e) => e.target.style.borderColor = "#3b5dcc"}
      onBlur={(e) => e.target.style.borderColor = "#ccc"}
        />
        <div style={{ position: "relative", flex: 1 }}>
            <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{
            width: "90%",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        outline: "none",
        transition: "0.2s",
        color: filterDate ? "#000" : "#aaa",
      }}
      onFocus={(e) => e.target.style.borderColor = "#3b5dcc"}
      onBlur={(e) => e.target.style.borderColor = "#ccc"}

        />
        </div>
        <button
    onClick={() => {
      setFilterInstructor("");
      setFilterDate("");
    }}
    disabled={!filterInstructor && !filterDate}
    style={{
      padding: "8px 16px",
      backgroundColor: !filterInstructor && !filterDate ? "#ccc" : "#3b5dcc",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: !filterInstructor && !filterDate ? "not-allowed" : "pointer",
      transition: "0.2s",
    }}
  >
    Reset
  </button>
      </div>

      {loading ? (
    <p style={{ color: "#555" }}>Loading report...</p>
  ) : message ? (
    <p style={{ color: "#e53935", fontWeight: "500" }}>{message}</p>
  ) : (
    <div style={{ overflowX: "auto" }}>
        <div style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "600", color: "#333" }}>
  {filterInstructor || filterDate ? "Search Result" : "All Records"}
</div>
        <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px"
      }}>
        <thead style={{ backgroundColor: "#f1f3f6", color: "#333" }}>
          <tr>
            <th rowSpan="2" style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center", }}>Reg. ID</th>
            <th colSpan="2" style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center", }}>Student</th>
            <th colSpan="2" style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center", }}>Instructor</th>
            <th colSpan="2" style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center", }}>Class</th>
            <th rowSpan="2" style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center", }}>Start Time</th>
            <th rowSpan="2" style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center", }}>End Time</th>
          </tr>
          <tr style={{ backgroundColor: "#f9fafc" }}>
            <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>ID</th>
            <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>Name</th>
            <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>ID</th>
            <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>Name</th>
            <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>ID</th>
            <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, idx) => (
              <tr key={idx} style={{
              backgroundColor: idx % 2 === 0 ? "#fff" : "#f7f8fa",
              transition: "0.2s"
            }}>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>{r.registrationId}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>{r.studentId}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>{r.studentName}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>{r.instructorId}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>{r.instructorName}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>{r.classId}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>{r.className}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>{new Date(r.startTime).toLocaleString()}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center", }}>{new Date(r.endTime).toLocaleString()}</td>
            </tr>
            ))}
        </tbody>
      </table>
    </div>
      )}
    </div>
  );
};

export default Report;
