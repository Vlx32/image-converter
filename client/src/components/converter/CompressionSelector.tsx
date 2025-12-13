import type { CompressionLevel } from '../../types/conversion';
import './CompressionSelector.css';

interface CompressionSelectorProps {
  selectedCompression: CompressionLevel;
  onCompressionChange: (level: CompressionLevel) => void;
}

export const CompressionSelector = ({ selectedCompression, onCompressionChange }: CompressionSelectorProps) => {
  const levels: { value: CompressionLevel; label: string; desc: string }[] = [
    { value: 'high', label: 'Лучшее качество', desc: 'Минимальные потери' },
    { value: 'medium', label: 'Среднее качество', desc: 'Баланс размера и качества' },
    { value: 'low', label: 'Меньший размер', desc: 'Максимальное сжатие' }
  ];

  return (
    <div className="compression-selector">
      <h3>Выберите качество:</h3>
      <div className="compression-buttons">
        {levels.map(({ value, label, desc }) => (
          <button
            key={value}
            className={`compression-button ${selectedCompression === value ? 'active' : ''}`}
            onClick={() => onCompressionChange(value)}
          >
            <span className="compression-label">{label}</span>
            <span className="compression-desc">{desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
