import React, { useEffect, useState } from "react";
import { getConfigs, updateConfig } from "../api/api";
import { FaTimes, FaEdit, FaSave } from "react-icons/fa";

const ConfigSettings = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const data = await getConfigs();
      setConfigs(data);
    } catch (err) {
      setStatusMessage("Failed to load configurations");
      setStatusType("error");
      setTimeout(() => setStatusMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key) => {
    try {
      await updateConfig(key, newValue);
      setEditingKey(null);
      fetchConfigs();
      setStatusMessage("Configuration updated successfully!");
      setStatusType("success");
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to update configuration");
      setStatusType("error");
    } finally {
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  return (
    <div className="config-container">
      <h2>System Configuration</h2>
      <p className="config-desc">
        This section allows you to view and adjust the system configuration
        settings that control scheduling rules, such as class duration and
        maximum daily limits.
      </p>

      {statusMessage && (
        <div
          style={{
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "4px",
            color: statusType === "success" ? "#155724" : "#721c24",
            backgroundColor: statusType === "success" ? "#d4edda" : "#f8d7da",
            border: `1px solid ${statusType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          {statusMessage}
        </div>
      )}

      {loading ? (
        <p>Loading configurations...</p>
      ) : (
        <table className="config-table">
          <thead style={{ backgroundColor: "#f1f3f6", color: "#333" }}>
            <tr>
              <th style={{ textAlign: "center" }}>Key</th>
              <th style={{ textAlign: "center" }}>Value</th>
              <th style={{ textAlign: "center" }}>Description</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {configs.map((conf) => (
              <tr key={conf.key}>
                <td style={{ fontSize: "14px" }}>{conf.key}</td>
                <td style={{ fontSize: "14px", textAlign: "center" }}>
                  {editingKey === conf.key ? (
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      style={{
                        padding: "6px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        width: "30px",
                      }}
                    />
                  ) : (
                    conf.value
                  )}
                </td>
                <td style={{ fontSize: "14px" }}>{conf.description || "-"}</td>
                <td style={{ textAlign: "center" }}>
                  {editingKey === conf.key ? (
                    <>
                      <button
                        className="save-btn"
                        onClick={() => handleSave(conf.key)}
                        style={{
                          marginRight: "8%",
                          backgroundColor: "#4caf50",
                        }}
                      >
                        <FaSave />
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditingKey(null)}
                        style={{ backgroundColor: "#c73c40ff" }}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingKey(conf.key);
                        setNewValue(conf.value);
                      }}
                    >
                      <FaEdit />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConfigSettings;
