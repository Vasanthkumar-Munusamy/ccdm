"use client";

import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      ["color", "background"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
    handlers: {
      color: function () {
        let input = document.getElementById("quill-hidden-color-picker") as HTMLInputElement;
        if (!input) {
          input = document.createElement("input");
          input.setAttribute("type", "color");
          input.setAttribute("id", "quill-hidden-color-picker");
          input.style.position = "absolute";
          input.style.opacity = "0";
          input.style.pointerEvents = "none";
          document.body.appendChild(input);
        }
        input.onchange = () => {
          // @ts-ignore
          this.quill.format("color", input.value);
        };
        input.click();
      },
      background: function () {
        let input = document.getElementById("quill-hidden-bg-picker") as HTMLInputElement;
        if (!input) {
          input = document.createElement("input");
          input.setAttribute("type", "color");
          input.setAttribute("id", "quill-hidden-bg-picker");
          input.style.position = "absolute";
          input.style.opacity = "0";
          input.style.pointerEvents = "none";
          document.body.appendChild(input);
        }
        input.onchange = () => {
          // @ts-ignore
          this.quill.format("background", input.value);
        };
        input.click();
      },
    },
  },
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = "120px",
  className = "",
}: RichTextEditorProps) {
  return (
    <div
      className={`rich-text-wrapper bg-white text-slate-900 border border-slate-300 rounded-lg overflow-hidden ${className}`}
    >
      <style jsx global>{`
        .rich-text-wrapper .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 6px 8px;
        }
        .rich-text-wrapper .ql-container.ql-snow {
          border: none;
          font-family: inherit;
          font-size: 0.95rem;
        }
        .rich-text-wrapper .ql-editor {
          min-height: ${minHeight};
          max-height: 380px;
          overflow-y: auto;
          line-height: 1.6;
        }
        .rich-text-wrapper .ql-editor.ql-blank::before {
          font-style: normal;
          color: #94a3b8;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={quillModules}
        placeholder={placeholder}
      />
    </div>
  );
}
