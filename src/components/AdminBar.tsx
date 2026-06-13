import { Shield, Eye, LogOut, Info, Key } from 'lucide-react';

interface AdminBarProps {
  onExit: () => void;
  onPasswordChangeClick: () => void;
}

export default function AdminBar({ onExit, onPasswordChangeClick }: AdminBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/10 border-b border-amber-500/30 backdrop-blur-md px-margin-mobile md:px-margin-desktop py-3 flex items-center justify-between shadow-[0_4px_12px_rgba(245,158,11,0.15)] animate-slideDown">
      <div className="flex items-center gap-2">
        <Shield size={16} className="text-amber-400 animate-pulse" />
        <span className="text-xs md:text-sm font-semibold tracking-wider text-amber-400 uppercase font-mono">
          ADMIN EDIT MODE ACTIVE
        </span>
        <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-on-surface-variant bg-white/5 px-2 py-0.5 rounded-full">
          <Info size={11} /> 텍스트 및 이미지를 클릭하여 실시간 수정, 자동 연동됩니다.
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onPasswordChangeClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-amber-400 font-bold text-xs transition-colors"
        >
          <Key size={13} />
          <span>비밀번호 수정</span>
        </button>

        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-background font-bold text-xs transition-colors shadow-lg shadow-amber-500/20"
        >
          <Eye size={13} />
          <span>일반 모드 보기 (종료)</span>
        </button>
      </div>
    </div>
  );
}
