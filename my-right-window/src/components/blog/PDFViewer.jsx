import { useState } from 'react';
import PropTypes from 'prop-types';

export default function PDFViewer({ pdfUrl, pdfName }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load PDF. Please try downloading it instead.');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfName || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!pdfUrl) return null;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <svg className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          Attached Document
        </h3>
        <button
          onClick={handleDownload}
          className="btn-secondary flex items-center gap-2"
          aria-label="Download PDF"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </button>
      </div>

      {pdfName && (
        <p className="text-gray-500 text-sm mb-4">
          {pdfName}
        </p>
      )}

      <div className="relative w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500">Loading PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 p-6">
            <div className="text-center">
              <svg className="w-16 h-16 text-gold mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-gray-600 mb-4">{error}</p>
              <button onClick={handleDownload} className="btn-primary">
                Download PDF
              </button>
            </div>
          </div>
        )}

        <iframe
          src={`${pdfUrl}#view=FitH`}
          className="w-full h-[600px]"
          title="PDF Viewer"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">
          <span className="text-navy font-medium">Tip:</span> If the PDF doesn&apos;t display correctly, try downloading it using the button above.
        </p>
      </div>
    </div>
  );
}

PDFViewer.propTypes = {
  pdfUrl: PropTypes.string,
  pdfName: PropTypes.string,
};
