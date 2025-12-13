import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const convertImage = async (file: File, format: string, quality?: number) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('format', format);
  if (quality) formData.append('quality', quality.toString());

  const response = await axios.post(`${API_URL}/convert`, formData, {
    responseType: 'blob'
  });

  return response.data;
};
