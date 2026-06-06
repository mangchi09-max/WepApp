import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Check, Loader2, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  currentUrl: string; // This will hold the Base64 data string
  onUploadSuccess: (base64Data: string) => void;
  className?: string;
}

export default function ImageUpload({ currentUrl, onUploadSuccess, className = '' }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl);
  const [status, setStatus] = useState<'idle' | 'compressing' | 'saving' | 'completed' | 'failed'>('idle');
  const [errorText, setErrorText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial state if currentUrl changes
  useEffect(() => {
    setPreviewUrl(currentUrl);
    if (currentUrl) {
      setStatus('completed');
    } else {
      setStatus('idle');
    }
  }, [currentUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. File Validation - Size (Max 10MB)
    const maxOriginalSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxOriginalSize) {
      setStatus('failed');
      setErrorText('파일 크기가 너무 큽니다. 원본 파일은 최대 10MB까지만 업로드 가능합니다.');
      return;
    }

    // 2. File Validation - Allowed Formats (jpg, jpeg, png, webp)
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      setStatus('failed');
      setErrorText('허용되지 않는 파일 형식입니다. (jpg, jpeg, png, webp 파일 형식만 가능)');
      return;
    }

    setErrorText('');
    setStatus('compressing');

    // 3. Image Compression & Base64 Generation
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxWidth = 1200;

          // Maintain Aspect Ratio (Maximum width limit 1200px)
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas 2D context를 생성하지 못했습니다.');
          }

          // Draw image to canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Generate compressed JPEG Base64
          const base64Data = canvas.toDataURL('image/jpeg', 0.7);

          // 4. Firestore Document Size Protection (Max 700KB for base64 string)
          if (base64Data.length > 700000) {
            setStatus('failed');
            setErrorText('이미지가 너무 복잡하여 압축 후 크기가 700KB 한도를 초과했습니다. 다른 이미지를 선택해 주세요.');
            return;
          }

          // 5. Success Flow
          setStatus('saving');
          setPreviewUrl(base64Data);
          
          // Mimic Firestore saving state nicely before finalizing
          setTimeout(() => {
            onUploadSuccess(base64Data);
            setStatus('completed');
          }, 400);

        } catch (error: any) {
          console.error('Image compression error:', error);
          setStatus('failed');
          setErrorText('이미지를 압축하는 과정에서 오류가 발생했습니다.');
        }
      };

      img.onerror = () => {
        setStatus('failed');
        setErrorText('이미지 파일을 해석하지 못했습니다. 손상된 파일인지 확인해 주세요.');
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      setStatus('failed');
      setErrorText('파일을 읽어들이는 중 오류가 발생했습니다.');
    };

    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div 
        className={`relative group border-2 border-dashed rounded-xl overflow-hidden cursor-pointer h-44 bg-surface-container/40 flex flex-col items-center justify-center transition-all ${
          status === 'failed' 
            ? 'border-red-500/50 bg-red-500/5' 
            : status === 'completed' 
            ? 'border-green-500/30' 
            : 'border-white/20 hover:border-primary/50'
        }`}
        onClick={triggerFileInput}
      >
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Uploaded file preview" 
              className="w-full h-full object-cover group-hover:brightness-50 transition-all"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%2312131a'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23555' font-size='10'>No Image</text></svg>";
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-background/50 text-white transition-opacity text-xs gap-1 font-medium">
              <Upload size={18} className="text-primary animate-bounce" />
              <span>이미지 업로드 (Base64)</span>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <Upload className="mx-auto text-on-surface-variant/60 mb-2" size={24} />
            <span className="text-xs text-on-surface-variant block font-medium">기기에서 이미지 선택하여 압축 업로드</span>
            <span className="text-[10px] text-outline-variant block mt-1">(최대 10MB 원본 허용, 1200px 제한 고압축)</span>
          </div>
        )}

        {/* Status Indicators overlay */}
        {status === 'compressing' && (
          <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary mb-2" size={24} />
            <span className="text-xs text-primary font-mono tracking-wider animate-pulse">압축 중...</span>
            <span className="text-[9px] text-outline-variant mt-1">픽셀 리사이징 및 품질 압축 연산</span>
          </div>
        )}

        {status === 'saving' && (
          <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-amber-500 mb-2" size={24} />
            <span className="text-xs text-amber-500 font-mono tracking-wider">저장 중...</span>
            <span className="text-[9px] text-outline-variant mt-1">고압축 Base64 버퍼 마운트 중</span>
          </div>
        )}
      </div>

      {/* Hidden high quality input using correct format according to strict instructions */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      {/* Upload/Save statuses rendering helper */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
        {status === 'completed' && (
          <p className="text-xs text-green-400 font-medium flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-md">
            <Check size={13} className="stroke-[3]" />
            <span>저장 완료 (Base64 변환 성공)</span>
          </p>
        )}

        {status === 'failed' && (
          <p className="text-xs text-red-400 font-medium flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md">
            <AlertCircle size={13} />
            <span>저장 실패</span>
          </p>
        )}
      </div>

      {errorText && (
        <p className="text-xs text-red-400 font-medium bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg flex items-start gap-1.5 leading-relaxed">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{errorText}</span>
        </p>
      )}
    </div>
  );
}
