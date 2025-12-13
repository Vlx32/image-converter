import type { ImageFormat } from '../../types/conversion';
import './FormatSelector.css';

interface FormatSelectorProps {
  selectedFormat: ImageFormat;
  onFormatChange: (format: ImageFormat) => void;
}

export const FormatSelector = ({ selectedFormat, onFormatChange }: FormatSelectorProps) => {
  const formats: { value: ImageFormat; label: string; desc: string }[] = [
    { value: 'jpeg', label: 'JPEG', desc: 'Универсальный' },
    { value: 'webp', label: 'WebP', desc: 'Малый размер' },
    { value: 'avif', label: 'AVIF', desc: 'Новейший формат' }
  ];

  return (
    <div className="format-selector">
      <h3>Выберите формат:</h3>
      <div className="format-buttons">
        {formats.map(({ value, label, desc }) => (
          <button
            key={value}
            onClick={() => onFormatChange(value)}
            className={`format-button ${selectedFormat === value ? 'active' : ''}`}
          >
            <span className="format-label">{label}</span>
            <span className="format-desc">{desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
