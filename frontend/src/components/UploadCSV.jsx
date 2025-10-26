import React, { useState } from "react";
import { uploadCSV } from "../api/api";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const MAX_SIZE_MB = 5;

  // Trigger CSV upload
  const handleUpload = async () => {
    setLoading(true);
    if (!file) return alert("Please select a file!");
    if (file) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`File is too large! Maximum allowed size is ${MAX_SIZE_MB} MB.`);
        setFile(null); // clear file
      }
    }
    try {
      const res = await uploadCSV(file);
      setResult(res.results);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Class Schedule CSV</h2>

      <p style={{ color: "#555", marginBottom: "20px" }}>
        Use this section to upload the schedule of driving classes in CSV
        format. Make sure your CSV follows the required format:{" "}
        <strong>
          Registration ID, Student ID, Instructor ID, Class ID, Start Time,
          Action
        </strong>
        . You can add new entries, update existing ones, or delete records by
        specifying the action.
      </p>

      {/* Upload Input + Button */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="file"
          id="fileUpload"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
        />
        <label
          htmlFor="fileUpload"
          style={{
            flex: 1,
            padding: "10px 15px",
            border: "2px dashed #3b5dcc",
            borderRadius: "8px",
            textAlign: "center",
            cursor: "pointer",
            color: file ? "#333" : "#888",
            fontWeight: "500",
            transition: "0.2s",
          }}
        >
          {file ? file.name : "Choose CSV file..."}
        </label>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            padding: "10px 20px",
            backgroundColor: file && !loading ? "#3b5dcc" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: file && !loading ? "pointer" : "not-allowed",
            fontWeight: "bold",
            transition: "0.2s",
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Upload Status */}
      {loading && (
        <p style={{ color: "#1976d2", fontWeight: "500" }}>
          Uploading CSV, please wait...
        </p>
      )}

      {/* Upload Results */}
      {result.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Upload Results</h3>
          <table>
            <thead>
              <tr>
                <th style={{ padding: "10px", textAlign: "center" }}>Line</th>
                <th style={{ padding: "10px", textAlign: "center" }}>Status</th>
                <th style={{ padding: "10px", textAlign: "center" }}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {result.map((r, idx) => (
                <tr
                  key={idx}
                  style={{ color: r.status === "success" ? "green" : "red" }}
                >
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {r.line}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {r.status}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {r.reason || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadCSV;
