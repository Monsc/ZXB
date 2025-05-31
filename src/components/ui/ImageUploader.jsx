import React, { useRef, useState } from 'react';
import Button from './Button';

export default function ImageUploader({ onUpload, className = '' }) {
  const fileInput = useRef();
  const [preview, setPreview] = useState(null);

  const handleChange = e => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload && onUpload(file);
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {preview && (
        <img src={preview} alt="预览" className="w-32 h-32 object-cover rounded-xl border border-border" />
      )}
      <Button type="button" onClick={() => fileInput.current.click()}>
        选择图片
      </Button>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
} 