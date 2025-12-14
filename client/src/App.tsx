import { useState } from 'react';
import { FileUploader } from './components/converter/FileUploader';
import { FormatSelector } from './components/converter/FormatSelector';
import { AdBanner } from './components/AdBanner';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import type { ImageFormat } from './types/conversion';
import { convertImage } from './services/api';
import './App.css';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<ImageFormat>('jpeg');
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const qualityMap: Record<ImageFormat, number> = {
    jpeg: 75,
    webp: 60,
    avif: 55
  };

  const handleConvert = async () => {
  if (files.length === 0) return;

  setLoading(true);
  setError(null);

  try {
    const quality = qualityMap[format];
    const blob = await convertImage(files[0], format, quality);
    
    const originalName = files[0].name.substring(0, files[0].name.lastIndexOf('.'));
    const filename = originalName ? `${originalName}.${format}` : `converted.${format}`;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);

    setFiles([]);
    setShowAd(true);

  } catch (err) {
    setError('Ошибка конвертации. Попробуйте еще раз.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  if (showPrivacy) {
    return (
      <div className="app-container">
        <div className="app-main" style={{ maxWidth: '800px' }}>
          <button 
            onClick={() => setShowPrivacy(false)}
            className="back-button"
          >
            ← Назад
          </button>
          <PrivacyPolicy />
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🖼️ Конвертер изображений</h1>
        <p className="subtitle">
          Быстрая конвертация и сжатие изображений
        </p>
        <p className="privacy-notice">
          🔒 Ваши файлы не сохраняются на сервере
        </p>
      </header>

      <main className="app-main">
        <FileUploader 
          onFileSelect={setFiles}
          acceptFiles="image/*"
          multiple={false}
        />

        {files.length > 0 && (
          <div className="file-info">
            <h3>Выбран файл:</h3>
            <p className="file-name">{files[0].name}</p>
            <p className="file-size">
              {(files[0].size / 1024 / 1024).toFixed(2)} МБ
            </p>
          </div>
        )}

        {files.length > 0 && (
          <>
            <FormatSelector 
              selectedFormat={format}
              onFormatChange={setFormat}
               disabled={loading} 
            />

            <button
              className={`convert-button ${loading ? 'loading' : ''}`}
              onClick={handleConvert}
              disabled={loading}
            >
              {loading ? '⏳ Конвертирую...' : '✨ Конвертировать'}
            </button>
          </>
        )}

       {!loading && showAd && <AdBanner />}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <button 
          onClick={() => setShowPrivacy(true)}
          className="footer-link"
        >
          Политика конфиденциальности
        </button>
        <p className="footer-text">© 2025 Image Converter</p>
      </footer>
    </div>
  );
}

export default App;
