import { useRef, useState } from 'react';
import './FileUploader.css';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  acceptFiles: string;
  multiple: boolean;
}

export const FileUploader = ({ onFileSelect, acceptFiles, multiple }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(Array.from(files));
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      );
      
      if (imageFiles.length > 0) {
        onFileSelect(multiple ? imageFiles : [imageFiles[0]]);
      }
    }
  };

  return (
    <div className="file-uploader">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="upload-icon">
          {isDragging ? '📂' : '📁'}
        </div>
        <p className="upload-text">
          {isDragging ? 'Отпустите файл' : 'Выберите изображение'}
        </p>
        <p className="upload-hint">
          или перетащите файл сюда
        </p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptFiles}
        multiple={multiple}
        onChange={handleFileChange}
        className="file-input"
      />
    </div>
  );
};
