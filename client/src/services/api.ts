import axios from 'axios';

const API_URL = 'https://image-converter-production-15fc.up.railway.app/api';

export const convertImage = async (
  file: File,
  format: string,
  quality: number
): Promise<Blob> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('format', format);
  formData.append('quality', quality.toString());

  const response = await axios.post(`${API_URL}/convert/image`, formData, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};
