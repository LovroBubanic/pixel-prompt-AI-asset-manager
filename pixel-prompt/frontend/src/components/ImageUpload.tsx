import { useRef, useState } from 'react';
import { useImageUpload } from '../hooks/useImageUpload';

export const ImageUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading, uploadProgress } = useImageUpload();
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus(null);
    const result = await uploadImage(file);

    if (result.success) {
      setUploadStatus({ type: 'success', message: '✨ Image uploaded successfully! AI is analyzing...' });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => setUploadStatus(null), 5000);
    } else {
      setUploadStatus({ type: 'error', message: result.error || 'Upload failed' });
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (!file) return;

    setUploadStatus(null);
    const result = await uploadImage(file);

    if (result.success) {
      setUploadStatus({ type: 'success', message: '✨ Image uploaded successfully! AI is analyzing...' });
      setTimeout(() => setUploadStatus(null), 5000);
    } else {
      setUploadStatus({ type: 'error', message: result.error || 'Upload failed' });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500
          ${isDragOver 
            ? 'scale-[1.02] shadow-2xl shadow-indigo-500/20' 
            : 'hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-500/10'
          }
          ${isUploading ? 'pointer-events-none' : ''}
        `}
      >
        {/* Gradient border effect */}
        <div className={`
          absolute inset-0 rounded-2xl transition-opacity duration-300
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
          ${isDragOver ? 'opacity-100' : 'opacity-50'}
        `}></div>
        
        {/* Inner content */}
        <div className="relative m-[2px] rounded-2xl bg-[#0f0f23] p-8 sm:p-12">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-6 py-4">
              {/* Animated upload icon */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-2 rounded-full bg-[#0f0f23] flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xl font-semibold text-white mb-2">Uploading your image...</p>
                <p className="text-gray-400">{uploadProgress}% complete</p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-xs h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 py-4">
              {/* Upload icon with glow */}
              <div className={`
                relative w-20 h-20 rounded-2xl 
                bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20
                flex items-center justify-center
                transition-all duration-300
                ${isDragOver ? 'scale-110 animate-pulse-glow' : 'hover:scale-105'}
              `}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl"></div>
                <svg className="relative w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Text */}
              <div className="text-center">
                <p className="text-xl font-semibold text-white mb-2">
                  {isDragOver ? 'Drop your image here!' : 'Drop your image here'}
                </p>
                <p className="text-gray-400">
                  or <span className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">browse</span> to upload
                </p>
              </div>

              {/* File info */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  PNG, JPG
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Max 2MB
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status message */}
      {uploadStatus && (
        <div
          className={`
            mt-6 p-4 rounded-xl flex items-center gap-3 animate-fade-in-up
            ${uploadStatus.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/20 text-red-300'
            }
          `}
        >
          {uploadStatus.type === 'success' ? (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="font-medium">{uploadStatus.message}</span>
        </div>
      )}
    </div>
  );
};
