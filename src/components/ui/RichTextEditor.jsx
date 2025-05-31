import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange, className = '' }) {
  return (
    <div className={`bg-card rounded-2xl border border-border p-2 ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        className="text-white"
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        }}
        style={{ background: 'transparent', color: 'white' }}
      />
    </div>
  );
} 