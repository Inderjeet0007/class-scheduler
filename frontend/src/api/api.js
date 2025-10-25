import axios from "axios";

const REG_API_BASE = `${process.env.REACT_APP_PROD_API_BASE}/registrations`;
const CONFIG_API_BASE = `${process.env.REACT_APP_PROD_API_BASE}/config`;

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
 */
export const getStats = async () => {
  const response = await axios.get(`${REG_API_BASE}/stats`);
  return response.data.data;
};

/**
 * Fetch class schedule report
 */
export const getReport = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const url = params ? `${REG_API_BASE}/report?${params}` : `${REG_API_BASE}/report`;

  const response = await axios.get(url);
  return response.data.data;
};

/**
 * Fetch all config entries
 */
export const getConfigs = async () => {
  const response = await axios.get(CONFIG_API_BASE);
  return response.data.data;
};

/**
 * Update a single config entry by key
 */
export const updateConfig = async (key, value) => {
  const response = await axios.put(`${CONFIG_API_BASE}/${key}`, { value });
  return response.data;
};