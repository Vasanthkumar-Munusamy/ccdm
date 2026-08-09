"use client";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfThumbnail({ url }: { url: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="w-full h-full flex items-start justify-center overflow-hidden bg-white pointer-events-none">
      <Document
        file={url}
        className="flex items-start justify-center w-full"
        loading={<div className="text-sm text-gray-400">Loading preview...</div>}
        error={<div className="text-sm text-red-400">Preview not available</div>}
      >
        <Page 
          pageNumber={1} 
          width={350}
          renderTextLayer={false} 
          renderAnnotationLayer={false} 
          className="shadow-sm"
        />
      </Document>
    </div>
  );
}
