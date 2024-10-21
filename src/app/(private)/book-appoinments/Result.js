import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Quill styles

// Sử dụng dynamic import để tránh lỗi SSR (Server-Side Rendering)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Result = ({ setResults, results }) => {
  const handleContentChange = (value) => {
    setResults(value);
  };

  return (
    <div>
      <p>Kết quả:</p>
      <ReactQuill
        value={results}
        onChange={handleContentChange}
        className="editor"
      />
    </div>
  );
};

export default Result;
