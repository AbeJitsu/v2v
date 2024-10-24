import axios from 'axios';
import { getBackendUrl } from '../utils/envUtils';

// Use getBackendUrl as a fallback if process.env.SERVER_API_URL is not set
const API_URL = process.env.SERVER_API_URL || getBackendUrl();

/**
 * Upload CSV files to the server.
 * @param formData - Form data containing CSV files to upload.
 * @returns The response data from the server after uploading the CSV files.
 * @throws Error if the upload fails.
 */
export const uploadCSVFiles = async (formData: FormData): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/api/upload-csv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      'Error uploading CSV files:',
      error.response?.data || error.message || error
    );
    throw new Error('Failed to upload CSV files.');
  }
};
