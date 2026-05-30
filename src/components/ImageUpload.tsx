import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  currentUrl: string;
  onUploadSuccess: (url: string) => void;
  className?: string;
}

export default function ImageUpload({ currentUrl, onUploadSuccess, className = '' }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl);
  const [uploadProgress, setUploadProgress] = useState<number>(-1);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorText('파일 크기가 너무 큽니다. (최대 5MB)');
      return;
    }

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorText('허용되지 않는 파일 형식입니다. (jpg, jpeg, png, webp 가능)');
      return;
    }

    setErrorText('');
    
    // Create instant local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.url) {
              setIsUploading(false);
              setUploadProgress(100);
              onUploadSuccess(data.url);
            } else {
              throw new Error('응답에 URL이 포함되어 있지 않습니다.');
            }
          } catch (e: any) {
            console.error('Parsing error: ', e);
            setErrorText('서버 응답을 처리하는 중 오류가 발생했습니다.');
            setIsUploading(false);
            setUploadProgress(-1);
          }
        } else {
          try {
            const data = JSON.parse(xhr.responseText);
            setErrorText(`업로드 실패: ${data.error || xhr.statusText}`);
          } catch {
            setErrorText(`업로드 실패: 서버 오류가 발생했습니다. (상태 코드: ${xhr.status})`);
          }
          setIsUploading(false);
          setUploadProgress(-1);
        }
      };

      xhr.onerror = () => {
        setErrorText('서버로 요청을 보내는 중 네트워크 오류가 발생했습니다.');
        setIsUploading(false);
        setUploadProgress(-1);
      };

      xhr.send(formData);
    } catch (err: any) {
      console.error('Upload catch error: ', err);
      setErrorText('업로드 준비 과정에서 오류가 발생했습니다.');
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div 
        className="relative group border-2 border-dashed border-white/20 hover:border-primary/50 rounded-xl overflow-hidden cursor-pointer h-40 bg-surface-container/40 flex items-center justify-center transition-colors"
        onClick={triggerFileInput}
      >
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover group-hover:brightness-50 transition-all"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-background/50 text-white transition-opacity text-xs gap-1 font-medium">
              <Upload size={18} className="text-primary animate-bounce" />
              <span>이미지 변경</span>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <Upload className="mx-auto text-on-surface-variant/60 mb-2" size={24} />
            <span className="text-xs text-on-surface-variant block font-medium">기기에서 이미지 업로드</span>
            <span className="text-[10px] text-outline-variant block mt-1">(5MB 이하, jpeg, png, webp)</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary mb-2" size={24} />
            <span className="text-xs text-primary font-mono">{uploadProgress}% 업로드 중...</span>
            <div className="w-2/3 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-primary-fixed-dim transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/png, image/jpeg, image/jpg, image/webp"
      />

      {errorText && (
        <p className="text-xs text-error font-medium bg-error/10 border border-error/20 p-2 rounded-lg">
          {errorText}
        </p>
      )}

      {uploadProgress === 100 && !isUploading && (
        <p className="text-xs text-green-400 font-medium flex items-center gap-1">
          <Check size={14} /> 이미지 업로드 및 URL 반영 완료!
        </p>
      )}
    </div>
  );
}
