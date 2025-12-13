import { useState } from 'react';
import { convertImage } from '../services/api';

export const useConversion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convert = async (file: File, format: string, quality?: number) => {
    setLoading(true);
    setError(null);

    try {
      const blob = await convertImage(file, format, quality);

      const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
      const newFileName = `${originalName}.${format}`;
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = newFileName;
      link.click();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch {
      setError('Conversion failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { convert, loading, error };
};
