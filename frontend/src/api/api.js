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

/**
 * Fetch stats for line graph (number of classes per day)
 * Add API in backend for /stats
 */
export const getStats = async () => {
  const response = await axios.get(`${REG_API_BASE}/stats`);
  return response.data.data;
};

/**
 * Fetch class schedule report
 * Add API in backend for /report
 */
export const getReport = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const url = params ? `${REG_API_BASE}/report?${params}` : `${REG_API_BASE}/report`;

  const response = await axios.get(url);
  return response.data.data;
};
