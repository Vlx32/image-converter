import { useState } from 'react';
import { convertImage } from './services/api';
import './App.css';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('jpeg');
  const [quality, setQuality] = useState(80);
  const [isConverting, setIsConverting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setConvertedUrl(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    try {
      const blob = await convertImage(file, format, quality);
      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Failed to convert image. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedUrl) return;

    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = `converted.${format}`;
    link.click();
  };

  return (
    <div className="container">
      <h1>Image Converter</h1>
      
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isConverting}
        />
      </div>

      {file && (
        <div className="controls">
          <div className="form-group">
            <label htmlFor="format">Output Format:</label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              disabled={isConverting}
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quality">
              Quality: {quality}%
            </label>
            <input
              type="range"
              id="quality"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={isConverting}
            />
          </div>

          <button
            onClick={handleConvert}
            disabled={isConverting}
            className="convert-btn"
          >
            {isConverting ? 'Converting...' : 'Convert Image'}
          </button>
        </div>
      )}

      <div className="preview-section">
        {previewUrl && (
          <div className="preview-box">
            <h3>Original</h3>
            <img src={previewUrl} alt="Original" />
          </div>
        )}

        {convertedUrl && (
          <div className="preview-box">
            <h3>Converted</h3>
            <img src={convertedUrl} alt="Converted" />
            <button onClick={handleDownload} className="download-btn">
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
