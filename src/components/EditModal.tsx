import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, Loader2, Info } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { 
  ExperienceItem, 
  SkillItem, 
  AwardItem, 
  ProjectItem 
} from '../types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'hero' | 'experience' | 'skill' | 'award' | 'project';
  data: any; // Can be any item or the entire hero block
  onSave: (updatedData: any) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export default function EditModal({ 
  isOpen, 
  onClose, 
  type, 
  data, 
  onSave, 
  onDelete 
}: EditModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorWord, setErrorWord] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  // Form states
  const [heroForm, setHeroForm] = useState({
    tag: '',
    heroTitle: '',
    highlight: '',
    heroDescription: '',
    descriptionPara2: '',
    heroImageBase64: ''
  });

  const [experienceForm, setExperienceForm] = useState<Partial<ExperienceItem>>({
    title: '',
    description: '',
    sortOrder: 0
  });

  const [skillForm, setSkillForm] = useState<Partial<SkillItem>>({
    name: '',
    iconName: 'code',
    description: '',
    sortOrder: 0
  });

  const [awardForm, setAwardForm] = useState<Partial<AwardItem>>({
    title: '',
    category: 'AWARD',
    sortOrder: 0
  });

  const [projectForm, setProjectForm] = useState({
    id: '',
    code: '',
    title: '',
    description: '',
    imageBase64: '',
    technologies: [] as string[],
    sortOrder: 0
  });

  // Keep project tags string representation
  const [techString, setTechString] = useState<string>('');

  useEffect(() => {
    setErrorWord('');
    setSuccess(false);
    if (!isOpen) return;

    if (type === 'hero') {
      setHeroForm({
        tag: data?.tag || '',
        heroTitle: data?.heroTitle || '',
        highlight: data?.highlight || '',
        heroDescription: data?.heroDescription || '',
        descriptionPara2: data?.descriptionPara2 || '',
        heroImageBase64: data?.heroImageBase64 || ''
      });
    } else if (type === 'experience') {
      setExperienceForm(data || { title: '', description: '', sortOrder: 0 });
    } else if (type === 'skill') {
      setSkillForm(data || { name: '', iconName: 'code', description: '', sortOrder: 0 });
    } else if (type === 'award') {
      setAwardForm(data || { title: '', category: 'AWARD', sortOrder: 0 });
    } else if (type === 'project') {
      setProjectForm(data || { id: '', code: '', title: '', description: '', imageBase64: '', technologies: [], sortOrder: 0 });
      setTechString(data?.technologies ? data.technologies.join(', ') : '');
    }
  }, [isOpen, type, data]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorWord('');
    setSuccess(false);

    try {
      if (type === 'hero') {
        if (!heroForm.heroTitle || !heroForm.heroDescription) {
          throw new Error('제목과 설명은 필수 입력 사항입니다.');
        }
        if (!heroForm.heroImageBase64) {
          throw new Error('대표 이미지를 업로드해 주세요.');
        }
        await onSave(heroForm);
      } else if (type === 'experience') {
        if (!experienceForm.title || !experienceForm.description) {
          throw new Error('제목과 설명을 기입해 주세요.');
        }
        await onSave(experienceForm);
      } else if (type === 'skill') {
        if (!skillForm.name) {
          throw new Error('스킬명을 기입하십시오.');
        }
        await onSave(skillForm);
      } else if (type === 'award') {
        if (!awardForm.title) {
          throw new Error('상장을 기입해주십시오.');
        }
        await onSave(awardForm);
      } else if (type === 'project') {
        if (!projectForm.title || !projectForm.code || !projectForm.description) {
          throw new Error('시리얼 코드, 설명, 타이틀은 필수 항목입니다.');
        }
        if (!projectForm.imageBase64) {
          throw new Error('프로젝트 이미지를 필수 업로드해야 합니다.');
        }
        
        // convert comma tech string to clean array
        const techList = techString
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0);
        
        await onSave({
          ...projectForm,
          technologies: techList
        });
      }
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      console.error(err);
      setErrorWord(err.message || '저장 과정에서 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!onDelete || !data?.id) return;
    if (!window.confirm('정말로 이 항목을 삭제하시겠습니까?')) return;

    setLoading(true);
    setErrorWord('');
    try {
      await onDelete(data.id);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorWord(err.message || '삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const titleText = {
    hero: '프로필 및 대표 인트로 편집',
    experience: data?.id ? '활동 타임라인 수정' : '새 활동 추가',
    skill: data?.id ? '스킬 정보 수정' : '새 스킬 추가',
    award: data?.id ? '대회 수상 내용 수정' : '새 수상 실적 추가',
    project: data?.id ? '로봇 프로젝트 세부 정보 편집' : '새 로봇 프로젝트 추가'
  }[type];

  // Lucide icon library choices
  const iconOptions = ['code', 'terminal', 'view_in_ar', 'build', 'psychology', 'group', 'co_present', 'menu_book'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative glass-panel rounded-xl max-w-xl w-full p-6 text-on-surface select-none shadow-[0_20px_50px_rgba(0,210,255,0.2)] scrollbar-thin scrollbar-thumb-white/10">
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
          <h3 className="text-lg font-space font-semibold text-glow text-primary tracking-wide">
            {titleText}
          </h3>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-white p-1 rounded-lg bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorWord && (
            <div className="text-xs text-error font-medium bg-error/10 border border-error/20 p-3 rounded-lg flex items-center gap-2">
              <Info size={14} />
              <span>{errorWord}</span>
            </div>
          )}

          {success && (
            <div className="text-xs text-green-400 font-medium bg-green-400/10 border border-green-400/20 p-3 rounded-lg flex items-center gap-2">
              <Check size={14} className="stroke-[3]" />
              <span>수정 사항이 실시간으로 동기화되어 반영되었습니다!</span>
            </div>
          )}

          {/* DYNAMIC FORM INNER CONTENT */}

          {type === 'hero' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">Section Tag</label>
                <input 
                  type="text" 
                  value={heroForm.tag}
                  onChange={e => setHeroForm({ ...heroForm, tag: e.target.value })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none font-mono"
                  placeholder="예: SYS.INIT // STUDENT PROFILE"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">Hero Title (heroTitle)</label>
                <textarea 
                  rows={2}
                  value={heroForm.heroTitle}
                  onChange={e => setHeroForm({ ...heroForm, heroTitle: e.target.value })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none font-bold"
                  placeholder="제목을 입력하세요 (줄바꿈 가능)"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">Highlight Keyword Subtitle</label>
                <input 
                  type="text" 
                  value={heroForm.highlight}
                  onChange={e => setHeroForm({ ...heroForm, highlight: e.target.value })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none"
                  placeholder="예: 로봇을 만들고 코딩하며 문제를 해결한 과정을 소개합니다."
                />
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">Intro Description (heroDescription)</label>
                <textarea 
                  rows={3}
                  value={heroForm.heroDescription}
                  onChange={e => setHeroForm({ ...heroForm, heroDescription: e.target.value })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none leading-relaxed"
                  placeholder="설명 문구를 상세하게 채워넣으세요."
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">Closing Highlight Line</label>
                <input 
                  type="text" 
                  value={heroForm.descriptionPara2}
                  onChange={e => setHeroForm({ ...heroForm, descriptionPara2: e.target.value })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm  rounded-lg p-2.5 outline-none text-primary"
                  placeholder="마지막 한줄 어필 포인트를 적으세요."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block">Hero Model Image (heroImageBase64)</label>
                <ImageUpload 
                  currentUrl={heroForm.heroImageBase64}
                  onUploadSuccess={base64 => setHeroForm({ ...heroForm, heroImageBase64: base64 })}
                />
              </div>
            </div>
          )}

          {type === 'experience' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">이벤트 제목 / 연도</label>
                <input 
                  type="text" 
                  value={experienceForm.title}
                  onChange={e => setExperienceForm({ ...experienceForm, title: e.target.value })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none"
                  placeholder="예: 2025 Robot Challenge: SUMO"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">수행 업무 / 배운 점</label>
                <textarea 
                  rows={2}
                  value={experienceForm.description}
                  onChange={e => setExperienceForm({ ...experienceForm, description: e.target.value })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none"
                  placeholder="예: SUMO 종목에 주도적으로 개발하여 참가했습니다."
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">정렬 가중치 (Sort Link)</label>
                <input 
                  type="number" 
                  value={experienceForm.sortOrder}
                  onChange={e => setExperienceForm({ ...experienceForm, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none font-mono"
                />
              </div>
            </div>
          )}

          {type === 'skill' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">스킬 명칭</label>
                <input 
                  type="text" 
                  value={skillForm.name}
                  onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none"
                  placeholder="예: C CODING, MICRO PYTHON"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">배치 아이콘</label>
                <select 
                  value={skillForm.iconName}
                  onChange={e => setSkillForm({ ...skillForm, iconName: e.target.value })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none font-mono"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon} className="bg-surface-dim text-white">
                      {icon.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">기술 상세 세부 설명 (description)</label>
                <textarea 
                  rows={3}
                  value={skillForm.description || ''}
                  onChange={e => setSkillForm({ ...skillForm, description: e.target.value })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none leading-relaxed"
                  placeholder="예: C 언어로 라인 트레이서 주행을 최적화하고 속도를 프로그래밍할 수 있습니다."
                />
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">정렬 가중치 (Sort Link)</label>
                <input 
                  type="number" 
                  value={skillForm.sortOrder}
                  onChange={e => setSkillForm({ ...skillForm, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none font-mono"
                />
              </div>
            </div>
          )}

          {type === 'award' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">수상 내역 및 상장명</label>
                <input 
                  type="text" 
                  value={awardForm.title}
                  onChange={e => setAwardForm({ ...awardForm, title: e.target.value })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none"
                  placeholder="예: 2026 RoboCup Korea Open : 1등상 수상"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">태그 명 (분류 / 기본 AWARD)</label>
                <input 
                  type="text" 
                  value={awardForm.category}
                  onChange={e => setAwardForm({ ...awardForm, category: e.target.value })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none uppercase font-mono"
                  placeholder="AWARD, CERTIFICATION 등"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">정렬 가중치</label>
                <input 
                  type="number" 
                  value={awardForm.sortOrder}
                  onChange={e => setAwardForm({ ...awardForm, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none font-mono"
                />
              </div>
            </div>
          )}

          {type === 'project' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">시리얼 라벨 코드</label>
                  <input 
                    type="text" 
                    value={projectForm.code}
                    onChange={e => setProjectForm({ ...projectForm, code: e.target.value })}
                    className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none font-mono"
                    placeholder="예: SN-001, APP-002"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">프로젝트 명</label>
                  <input 
                    type="text" 
                    value={projectForm.title}
                    onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none font-bold"
                    placeholder="Project Title"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">프로젝트 기술 태그 (콤마로 구분)</label>
                <input 
                  type="text" 
                  value={techString}
                  onChange={e => setTechString(e.target.value)}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none font-mono text-primary"
                  placeholder="Silicon, Arduino, C Coding, CNC"
                />
                <span className="text-[9px] text-outline-variant mt-1 block">각 태그는 콤마(,)로 적으면 멋진 리스트 모양의 뱃지로 랜더링됩니다.</span>
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">설명 문구 (description)</label>
                <textarea 
                  rows={2}
                  value={projectForm.description}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none"
                  placeholder="어떤 기능을 구현했는지 상세하게 기록하세요."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block">로봇 사진 또는 설계 이미지 (imageBase64)</label>
                <ImageUpload 
                  currentUrl={projectForm.imageBase64 || ''}
                  onUploadSuccess={base64 => setProjectForm({ ...projectForm, imageBase64: base64 })}
                />
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-widest text-outline uppercase block mb-1">정렬 가중치</label>
                <input 
                  type="number" 
                  value={projectForm.sortOrder}
                  onChange={e => setProjectForm({ ...projectForm, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-sm rounded-lg p-2.5 outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* ACTIONS ROW */}
          <div className="flex md:flex-row flex-col justify-between items-center gap-2 pt-4 border-t border-white/10 mt-6 md:space-y-0 space-y-2">
            <div>
              {data?.id && onDelete && (
                <button
                  type="button"
                  onClick={handleDeleteItem}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 text-red-400 font-semibold border border-red-500/20 transition-colors w-full md:w-auto"
                >
                  <Trash2 size={13} />
                  <span>삭제하기</span>
                </button>
              )}
            </div>

            <div className="flex gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-on-surface-variant transition-colors w-full md:w-auto"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-1.5 px-5 py-2 text-xs rounded-lg bg-primary text-on-primary font-bold hover:opacity-90 active:opacity-80 transition-opacity w-full md:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={13} />
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <Check size={13} />
                    <span>저장 및 동기화</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
