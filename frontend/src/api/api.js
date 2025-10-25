import axios from "axios";

const REG_API_BASE = "http://localhost:5001/api/registrations";

/**
 * Upload CSV file to backend
 * @param {File} file - CSV file object
 * @returns {Object} response from backend
 */
export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${REG_API_BASE}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
