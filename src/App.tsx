import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Shield, 
  Plus, 
  Edit, 
  LogOut, 
  Check, 
  X, 
  Loader2, 
  Eye, 
  EyeOff,
  Info,
  Sliders,
  Menu,
  ChevronRight,
  Sparkles,
  Award,
  History,
  Grid,
  User,
  Mail,
  Github,
  AlertCircle
} from 'lucide-react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { defaultPortfolioData } from './defaultData';
import { PortfolioData, ExperienceItem, SkillItem, AwardItem, ProjectItem } from './types';
import CustomLucideIcon from './components/LucideIcon';
import AdminBar from './components/AdminBar';
import EditModal from './components/EditModal';

// Mandatory SVG-encoded Fallback Image according to guidelines
const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='100%25' height='100%25' fill='%2312131a'/><circle cx='400' cy='300' r='80' fill='%231d2030' stroke='%233b82f6' stroke-width='2'/><path d='M370 300 H430 M400 270 V330' stroke='%233b82f6' stroke-width='4' stroke-linecap='round'/><text x='50%25' y='430' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='16' fill='%23475569'>ROBOT PORTFOLIO // fallback_image</text></svg>";

export default function App() {
  // Master Portfolio States
  const [portfolio, setPortfolio] = useState<PortfolioData>(defaultPortfolioData);
  const [loadingDb, setLoadingDb] = useState<boolean>(true);

  // Read-only and permission states
  const [isReadOnlyMode, setIsReadOnlyMode] = useState<boolean>(false);
  const [permissionMessage, setPermissionMessage] = useState<string>('');

  // Admin Verification States
  const [rawPassword, setRawPassword] = useState<string>('');
  const [customPassword, setCustomPassword] = useState<string>('1234');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [showPasswordHint, setShowPasswordHint] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return sessionStorage.getItem('portfolio_admin_authorized') === 'true';
  });

  // Password Modification States
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');
  const [passwordChangeError, setPasswordChangeError] = useState<string>('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string>('');

  // Editor Modal Control
  const [activeModal, setActiveModal] = useState<'hero' | 'experience' | 'skill' | 'award' | 'project' | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Navigation Scrolling State
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // 1. Firebase Firestore Listeners
  useEffect(() => {
    // Scroll event listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial database connection setup - listen to siteContent/main
    const unsubscribeHero = onSnapshot(doc(db, 'siteContent', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPortfolio(prev => ({
          ...prev,
          hero: {
            tag: data.tag || defaultPortfolioData.hero.tag,
            title: data.heroTitle || defaultPortfolioData.hero.title, // Mapping heroTitle to UI Title
            highlight: data.highlight || defaultPortfolioData.hero.highlight,
            description: data.heroDescription || defaultPortfolioData.hero.description, // Mapping heroDescription to UI Description
            descriptionPara2: data.descriptionPara2 || defaultPortfolioData.hero.descriptionPara2,
            imageUrl: data.heroImageBase64 || defaultPortfolioData.hero.imageUrl // Mapping heroImageBase64 to UI Image
          }
        }));
      }
      setLoadingDb(false);
    }, (error) => {
      console.warn('Hero loading failed, using fallback static data:', error);
      // Soft transition to read-only Mode on restricted permissions
      if (error.message?.includes('permissions') || error.message?.includes('denied') || error.message?.includes('Unauthenticated')) {
        setIsReadOnlyMode(true);
        setPermissionMessage('Firestore 접근 권한이 부족합니다. 읽기 전용 모드로 실행합니다.');
      }
      setLoadingDb(false);
    });

    // Listen to custom Password Settings
    const unsubscribePassword = onSnapshot(doc(db, 'siteContent', 'passwordSettings'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && typeof data.password === 'string') {
          setCustomPassword(data.password);
        }
      }
    }, (error) => {
      console.warn('PasswordSettings loading failed (this is normal if not initialized on database yet):', error);
    });

    // Listen to Experiences
    const qExp = query(collection(db, 'experiences'), orderBy('sortOrder', 'asc'));
    const unsubscribeExp = onSnapshot(qExp, (snap) => {
      const items: ExperienceItem[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as ExperienceItem);
      });
      if (items.length > 0) {
        setPortfolio(prev => ({ ...prev, experiences: items }));
      }
    }, (error) => {
      console.warn('Experiences snapshot error:', error);
      if (error.message?.includes('permissions') || error.message?.includes('denied')) {
        setIsReadOnlyMode(true);
        setPermissionMessage('Firestore 권한 제한으로 일부 데이터를 불러오지 못해 읽기 전용으로 작동합니다.');
      }
    });

    // Listen to Skills
    const qSkills = query(collection(db, 'skills'), orderBy('sortOrder', 'asc'));
    const unsubscribeSkills = onSnapshot(qSkills, (snap) => {
      const items: SkillItem[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as SkillItem);
      });
      if (items.length > 0) {
        setPortfolio(prev => ({ ...prev, skills: items }));
      }
    }, (error) => {
      console.warn('Skills snapshot error:', error);
    });

    // Listen to Awards
    const qAwards = query(collection(db, 'awards'), orderBy('sortOrder', 'asc'));
    const unsubscribeAwards = onSnapshot(qAwards, (snap) => {
      const items: AwardItem[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as AwardItem);
      });
      if (items.length > 0) {
        setPortfolio(prev => ({ ...prev, awards: items }));
      }
    }, (error) => {
      console.warn('Awards snapshot error:', error);
    });

    // Listen to Projects from portfolioItems collection as required
    const qProjects = query(collection(db, 'portfolioItems'), orderBy('sortOrder', 'asc'));
    const unsubscribeProjects = onSnapshot(qProjects, (snap) => {
      const items: ProjectItem[] = [];
      snap.forEach((doc) => {
        const d = doc.data();
        items.push({
          id: doc.id,
          code: d.code || 'CODE',
          title: d.title || '',
          description: d.description || '',
          imageUrl: d.imageBase64 || '', // imageBase64 mapped to react state
          technologies: d.technologies || [],
          sortOrder: d.sortOrder || 0
        } as ProjectItem);
      });
      if (items.length > 0) {
        setPortfolio(prev => ({ ...prev, projects: items }));
      }
    }, (error) => {
      console.warn('PortfolioItems snapshot error:', error);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribeHero();
      unsubscribePassword();
      unsubscribeExp();
      unsubscribeSkills();
      unsubscribeAwards();
      unsubscribeProjects();
    };
  }, []);

  // 2. Admin Verification
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rawPassword === customPassword) {
      setIsAdminMode(true);
      sessionStorage.setItem('portfolio_admin_authorized', 'true');
      setIsPasswordModalOpen(false);
      setPasswordError('');
      setRawPassword('');
    } else {
      setPasswordError('비밀번호가 올바르지 않습니다. 다시 입력해 주세요.');
    }
  };

  const handleExitAdmin = () => {
    setIsAdminMode(false);
    sessionStorage.removeItem('portfolio_admin_authorized');
  };

  // 3. Save / Delete actions callback for entities
  const handleSaveData = async (updatedData: any) => {
    if (isReadOnlyMode) {
      alert('보안/권한 문제로 읽기 전용 모드에서는 데이터를 저장할 수 없습니다.');
      return;
    }

    try {
      if (activeModal === 'hero') {
        const payload = {
          tag: updatedData.tag || '',
          heroTitle: updatedData.heroTitle || '',
          highlight: updatedData.highlight || '',
          heroDescription: updatedData.heroDescription || '',
          descriptionPara2: updatedData.descriptionPara2 || '',
          heroImageBase64: updatedData.heroImageBase64 || '',
          updatedAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'siteContent', 'main'), payload);
      } else if (activeModal === 'project') {
        const itemId = updatedData.id || `proj_${Date.now()}`;
        const payload = {
          id: itemId,
          code: updatedData.code || '',
          title: updatedData.title || '',
          description: updatedData.description || '',
          imageBase64: updatedData.imageBase64 || '', // imageBase64 saved to Firestore
          technologies: updatedData.technologies || [],
          sortOrder: updatedData.sortOrder || 0,
          createdAt: updatedData.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'portfolioItems', itemId), payload);
      } else {
        const collectionName = {
          experience: 'experiences',
          skill: 'skills',
          award: 'awards'
        }[activeModal!];

        if (collectionName) {
          if (updatedData.id) {
            await setDoc(doc(db, collectionName, updatedData.id), updatedData);
          } else {
            const docId = `${collectionName}_${Date.now()}`;
            await setDoc(doc(db, collectionName, docId), {
              ...updatedData,
              id: docId
            });
          }
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `write/${activeModal}`);
    } finally {
      setActiveModal(null);
    }
  };

  const handleDeleteData = async (id: string) => {
    if (isReadOnlyMode) {
      alert('보안/권한 문제로 읽기 전용 모드에서는 데이터를 삭제할 수 없습니다.');
      return;
    }

    const collectionName = {
      experience: 'experiences',
      skill: 'skills',
      award: 'awards',
      project: 'portfolioItems' // Correct collection name
    }[activeModal!];

    if (!collectionName) return;

    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${id}`);
    } finally {
      setActiveModal(null);
    }
  };

  // Active navigational menu link selector
  const [activeSection, setActiveSection] = useState<string>('about');
  useEffect(() => {
    const handleSectionScroll = () => {
      const sections = ['about', 'experience', 'skills', 'certifications', 'portfolio'];
      let current = 'about';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleSectionScroll);
    return () => window.removeEventListener('scroll', handleSectionScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-sans relative">
      
      {/* 0. SECURITY READ-ONLY MODE WARNING BANNER */}
      {isReadOnlyMode && (
        <div className="bg-red-900/60 border-b border-red-500/30 text-red-200 text-xs text-center py-2 px-margin-mobile flex items-center justify-center gap-2 backdrop-blur-2xl z-50 fixed w-full">
          <AlertCircle size={14} className="stroke-red-400 shrink-0" />
          <span>{permissionMessage || '현재 읽기 전용 모드로 작동하고 있습니다. 콘텐츠를 저장하는 행위는 차단됩니다.'}</span>
        </div>
      )}

      {/* 1. ADMIN HEADER BAR */}
      {isAdminMode && <AdminBar onExit={handleExitAdmin} onPasswordChangeClick={() => setIsChangePasswordOpen(true)} />}

      {/* 2. NAVIGATION BAR */}
      <nav className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
        isReadOnlyMode ? 'top-[36px]' : ''
      } ${
        isAdminMode ? (isReadOnlyMode ? 'top-[88px]' : 'top-[52px]') : 'top-0'
      } ${
        isScrolled 
          ? 'bg-background/80 border-b border-white/10 shadow-[0_0_20px_rgba(0,210,255,0.15)] backdrop-blur-xl' 
          : 'bg-transparent border-b border-white/5'
      }`}>
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-20">
          <a href="#" className="font-space text-headline-md font-bold text-primary flex items-center gap-2 group">
            <Sliders className="text-primary group-hover:rotate-180 transition-transform duration-500" size={24} />
            <span className="text-glow tracking-tight">Robot Portfolio</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {[
              { id: 'about', label: 'About' },
              { id: 'experience', label: 'Experience' },
              { id: 'skills', label: 'Skills' },
              { id: 'certifications', label: 'Certifications & Awards' },
              { id: 'portfolio', label: 'Portfolio' }
            ].map(item => (
              <a 
                key={item.id}
                href={`#${item.id}`}
                className={`text-label-md font-medium tracking-wide transition-colors ${
                  activeSection === item.id 
                    ? 'text-primary border-b-2 border-primary pb-1 font-bold' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Quick Actions / Locking Indicator */}
          <div className="flex items-center gap-3">
            {!isAdminMode ? (
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="text-primary-fixed-dim hover:text-white p-2 text-xs font-mono font-bold flex items-center gap-1 bg-primary/10 border border-primary/20 hover:border-primary/50 py-1.5 px-3 rounded-lg transition-all"
                title="관리자 인증"
              >
                <Lock size={13} />
                <span>ADMIN LOCK</span>
              </button>
            ) : (
              <button
                onClick={handleExitAdmin}
                className="text-amber-400 hover:text-white p-2 text-xs font-mono font-bold flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/50 py-1.5 px-3 rounded-lg transition-all"
              >
                <Shield size={13} className="animate-pulse" />
                <span>EDIT READY</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-primary p-2 focus:outline-none hover:bg-white/5 rounded-lg"
              aria-label="메뉴 열기"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-panel border-t-0 p-4 shrink-0 flex flex-col items-center gap-3 animate-fade-in">
            {[
              { id: 'about', label: 'About' },
              { id: 'experience', label: 'Experience' },
              { id: 'skills', label: 'Skills' },
              { id: 'certifications', label: 'Certifications & Awards' },
              { id: 'portfolio', label: 'Portfolio' }
            ].map(item => (
              <a 
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-label-md py-1.5 w-full text-center transition-colors ${
                  activeSection === item.id 
                    ? 'text-primary font-bold' 
                    : 'text-on-surface-variant hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* 3. MAIN CONTENTS CONTAINER */}
      <main className={`flex-1 ${
        isAdminMode ? 'pt-36' : 'pt-24'
      } pb-xl px-margin-mobile md:px-margin-desktop space-y-20 md:space-y-32 overflow-hidden`}>
        
        {/* SECTION 1: HERO / ABOUT ENTRY */}
        <section className="relative min-h-[75vh] flex flex-col md:flex-row items-center gap-10" id="about">
          <div className="flex-1 space-y-6 z-10">
            <div className="flex items-center gap-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-label-sm tracking-widest font-mono">
                {portfolio.hero.tag}
              </span>

              {isAdminMode && (
                <button
                  onClick={() => {
                    setSelectedData({
                      tag: portfolio.hero.tag,
                      heroTitle: portfolio.hero.title,
                      highlight: portfolio.hero.highlight,
                      heroDescription: portfolio.hero.description,
                      descriptionPara2: portfolio.hero.descriptionPara2,
                      heroImageBase64: portfolio.hero.imageUrl
                    });
                    setActiveModal('hero');
                  }}
                  className="bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold p-1 rounded-full flex items-center justify-center transition-all shadow-md ml-2"
                  title="프로필 영역 편집"
                >
                  <Edit size={12} className="m-0.5" />
                </button>
              )}
            </div>

            <h1 className="text-display-lg-mobile md:text-display-lg font-space font-bold text-on-surface text-glow leading-tight break-all">
              {portfolio.hero.title.split('\n')[0]}
              {portfolio.hero.title.split('\n')[1] && <><br /><span className="text-primary">{portfolio.hero.title.split('\n')[1]}</span></>}
            </h1>

            <p className="text-body-lg font-medium text-on-surface-variant border-l-2 border-primary/50 pl-4 py-2">
              {portfolio.hero.highlight}
            </p>

            <div className="space-y-4 text-body-md text-on-surface-variant/80 max-w-2xl glass-panel p-6 rounded-xl hover:border-white/20 transition-all">
              <p className="leading-relaxed whitespace-pre-line">{portfolio.hero.description}</p>
              <p className="text-primary-fixed-dim font-bold tracking-tight text-glow">
                {portfolio.hero.descriptionPara2}
              </p>
            </div>
          </div>

          {/* Model Arm image preview */}
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10 animate-pulse"></div>
            <div className="glass-panel p-2 rounded-2xl relative z-10 transform hover:scale-[1.01] transition-transform duration-500">
              {(() => {
                const safeImage = typeof portfolio.hero.imageUrl === "string" && portfolio.hero.imageUrl.trim() !== "" 
                  ? portfolio.hero.imageUrl 
                  : FALLBACK_IMAGE;

                return (
                  <img 
                    src={safeImage} 
                    alt="Robot Hero Arm" 
                    className="w-full h-auto rounded-xl object-cover border border-white/5 aspect-[4/3] md:aspect-auto"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                );
              })()}
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-md text-label-sm text-primary border border-primary/30 tracking-widest font-mono flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                <span>STATUS: ACTIVE</span>
              </div>
            </div>
          </div>
        </section>


        {/* SECTION 2: EXPERIENCE TIMELINE */}
        <section className="scroll-mt-32" id="experience">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="text-headline-lg font-space font-bold text-on-surface flex items-center gap-3">
                <History className="text-primary" size={28} />
                <span>Experience</span>
              </h2>
              <p className="text-body-md text-on-surface-variant mt-2">로봇 수업과 프로젝트를 통해 경험한 활동들을 정리했습니다.</p>
            </div>

            {isAdminMode && (
              <button
                onClick={() => {
                  setSelectedData(null);
                  setActiveModal('experience');
                }}
                className="flex items-center gap-1 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/10"
              >
                <Plus size={14} />
                <span>활동 타임라인 추가</span>
              </button>
            )}
          </div>

          <div className="relative pl-6 md:pl-0">
            {/* Horizontal timeline core track line */}
            <div className="absolute left-[11px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2"></div>
            
            <div className="space-y-12">
              {portfolio.experiences.map((exp, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div 
                    key={exp.id} 
                    className={`relative flex flex-col md:flex-row items-start md:items-center group ${
                      isEven ? '' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Ring dot handle item */}
                    <div className="absolute left-[-17px] md:left-1/2 md:-translate-x-1/2 w-4.5 h-4.5 rounded-full bg-surface border-2 border-primary z-10 group-hover:bg-primary group-hover:shadow-[0_0_12px_rgba(0,210,255,0.7)] transition-all"></div>

                    {/* Timeline Left block */}
                    <div className={`md:w-1/2 w-full pl-6 md:pl-0 ${
                      isEven ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'
                    }`}>
                      <div className="flex items-center gap-2 md:justify-end md:group-hover:translate-x-[-4px] transition-transform">
                        {isAdminMode && isEven && (
                          <button
                            onClick={() => {
                              setSelectedData(exp);
                              setActiveModal('experience');
                            }}
                            className="bg-primary/20 hover:bg-primary/40 text-primary p-1 rounded-lg transition-colors border border-primary/20 animate-scaleUp"
                          >
                            <Edit size={12} />
                          </button>
                        )}
                        <h3 className="text-headline-md font-space font-semibold text-primary">
                          {exp.title}
                        </h3>
                        {isAdminMode && !isEven && (
                          <button
                            onClick={() => {
                              setSelectedData(exp);
                              setActiveModal('experience');
                            }}
                            className="bg-primary/20 hover:bg-primary/40 text-primary p-1 rounded-lg transition-colors border border-primary/20 animate-scaleUp"
                          >
                            <Edit size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Timeline Right block */}
                    <div className={`md:w-1/2 w-full pl-6 md:pl-0 mt-2 md:mt-0 ${
                      isEven ? 'md:pl-10' : 'md:pr-10'
                    }`}>
                      <div className="glass-panel p-5 rounded-xl hover:border-primary/40 transition-all hover:bg-surface-container-low/40">
                        <p className="text-body-md text-on-surface-variant leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        {/* SECTION 3: SKILLS CARD CHIPS */}
        <section className="scroll-mt-32" id="skills">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="text-headline-lg font-space font-bold text-on-surface flex items-center gap-3">
                <Sliders className="text-primary" size={28} />
                <span>Skills</span>
              </h2>
              <p className="text-body-md text-on-surface-variant mt-2">로봇 프로젝트를 진행하며 배운 기술과 역량입니다.</p>
            </div>

            {isAdminMode && (
              <button
                onClick={() => {
                  setSelectedData(null);
                  setActiveModal('skill');
                }}
                className="flex items-center gap-1 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <Plus size={14} />
                <span>기술 역량 추가</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolio.skills.map((skill) => (
              <div 
                key={skill.id} 
                className="glass-panel p-5 rounded-xl border-white/5 flex flex-col justify-between hover:bg-white/5 hover:border-primary/30 transition-all duration-300 group cursor-default relative shadow-md"
              >
                {isAdminMode && (
                  <button
                    onClick={() => {
                      setSelectedData(skill);
                      setActiveModal('skill');
                    }}
                    className="absolute top-3 right-3 bg-primary hover:bg-primary-fixed text-on-primary p-1.5 rounded-lg transition-all scale-0 group-hover:scale-100 shadow scale-up ease-out z-10"
                    title="기술 편집"
                  >
                    <Edit size={12} />
                  </button>
                )}
                
                <div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <CustomLucideIcon name={skill.iconName || 'code'} className="text-primary text-glow" size={18} />
                  </div>
                  <h3 className="text-label-lg text-on-surface font-bold tracking-wider font-mono uppercase mb-2">
                    {skill.name}
                  </h3>
                  {skill.description ? (
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {skill.description}
                    </p>
                  ) : (
                    <p className="text-xs text-outline-variant italic">
                      상세 설명이 비어 있습니다. 관리자 모드에서 상세 설명을 추가해 보세요.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* SECTION 4: CERTIFICATIONS & TOURNAMENT AWARDS */}
        <section className="scroll-mt-32" id="certifications">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="text-headline-lg font-space font-bold text-on-surface flex items-center gap-3">
                <Award className="text-primary" size={28} />
                <span>Certifications &amp; Awards</span>
              </h2>
              <p className="text-body-md text-on-surface-variant mt-2">로봇 대회 참가 및 수상 내용을 정리했습니다.</p>
            </div>

            {isAdminMode && (
              <button
                onClick={() => {
                  setSelectedData(null);
                  setActiveModal('award');
                }}
                className="flex items-center gap-1 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <Plus size={14} />
                <span>수상 기록 추가</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {portfolio.awards.map((award) => (
              <div 
                key={award.id} 
                className="glass-panel p-6 rounded-2xl border-l-4 border-l-primary flex items-center justify-between gap-6 relative overflow-hidden group hover:border-primary/40 transition-all"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] -z-10 translate-x-12 -translate-y-12"></div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 text-primary font-mono font-bold tracking-widest text-xs uppercase">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>{award.category || 'AWARD'}</span>
                  </div>
                  <h3 className="text-headline-md font-space font-semibold text-on-surface leading-snug">
                    {award.title}
                  </h3>
                </div>

                {isAdminMode && (
                  <button
                    onClick={() => {
                      setSelectedData(award);
                      setActiveModal('award');
                    }}
                    className="bg-primary/20 hover:bg-primary/45 p-2 rounded-lg text-primary border border-primary/30 hover:scale-105 transition-all self-center"
                    title="수정하기"
                  >
                    <Edit size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>


        {/* SECTION 5: GRID OF PORTFOLIO CARDS */}
        <section className="scroll-mt-32" id="portfolio">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="text-headline-lg font-space font-bold text-on-surface flex items-center gap-3">
                <Grid className="text-primary" size={28} />
                <span>Portfolio</span>
              </h2>
              <p className="text-body-md text-on-surface-variant mt-2">완성한 로봇 프로젝트와 웹앱 결과물을 소개합니다.</p>
            </div>

            {isAdminMode && (
              <button
                onClick={() => {
                  setSelectedData(null);
                  setActiveModal('project');
                }}
                className="flex items-center gap-1 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <Plus size={14} />
                <span>새 프로젝트 추가</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolio.projects.map((proj, idx) => {
              const isFullWidthSpan = proj.code === 'APP-001' || proj.id === 'proj4' || (idx === portfolio.projects.length - 1 && portfolio.projects.length % 3 !== 0);
              return (
                <div 
                  key={proj.id} 
                  className={`glass-panel rounded-xl overflow-hidden group hover:border-primary/50 transition-all hover:shadow-[0_0_35px_rgba(0,210,255,0.15)] flex flex-col h-full relative ${
                    isFullWidthSpan ? 'md:col-span-3' : ''
                  }`}
                >
                  {isAdminMode && (
                    <button
                      onClick={() => {
                        setSelectedData({
                          id: proj.id,
                          code: proj.code,
                          title: proj.title,
                          description: proj.description,
                          imageBase64: proj.imageUrl, // Map local imageUrl back to state imageBase64
                          technologies: proj.technologies,
                          sortOrder: proj.sortOrder
                        });
                        setActiveModal('project');
                      }}
                      className="absolute top-4 left-4 z-20 bg-primary hover:bg-primary-fixed text-on-primary p-2 rounded-lg transition-all shadow-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit size={11} /> <span>구성 편집</span>
                    </button>
                  )}

                  <div className={`flex flex-col h-full ${isFullWidthSpan ? 'md:flex-row' : ''}`}>
                    
                    {/* Visual Card Image */}
                    <div className={`relative overflow-hidden shrink-0 bg-surface-container-low/50 ${
                      isFullWidthSpan ? 'h-52 md:h-64 md:w-1/3' : 'h-52'
                    }`}>
                      <div className="absolute top-3 right-3 z-10 bg-surface/85 backdrop-blur text-primary text-[10px] font-bold font-mono px-2 py-1 rounded border border-primary/20">
                        {proj.code}
                      </div>
                      {(() => {
                        const safeImage = typeof proj.imageUrl === "string" && proj.imageUrl.trim() !== "" 
                          ? proj.imageUrl 
                          : FALLBACK_IMAGE;

                        return (
                          <img 
                            src={safeImage} 
                            alt={proj.title} 
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_IMAGE;
                            }}
                          />
                        );
                      })()}
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-dim to-transparent opacity-85"></div>
                    </div>

                    {/* Card text details */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-headline-md font-space font-semibold text-primary mb-2">
                          {proj.title}
                        </h3>
                        <p className="text-body-md text-on-surface-variant/90 leading-relaxed max-w-2xl break-all">
                          {proj.description}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-white/5 pt-4">
                        <p className="text-[10px] font-mono tracking-widest text-outline uppercase mb-2">Technologies</p>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.technologies.map(tech => (
                            <span 
                              key={tech} 
                              className="bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-[10px] px-2.5 py-1 rounded-md font-semibold tracking-wide font-mono transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>


      {/* 4. FOOTER & DETAILS AT THE BOTTOM */}
      <footer className="bg-surface-dim w-full py-10 border-t border-white/5 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-6">
          <div className="text-label-md text-primary font-mono flex items-center justify-center gap-1.5 text-center md:text-left">
            <Sliders size={14} className="animate-spin duration-3000" />
            <span>© 2026 My Robot Portfolio. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-body-md">
            <a href="#" className="text-on-surface-variant hover:text-primary-fixed-dim underline decoration-primary/20 ease-in-out transition-all flex items-center gap-1 text-sm font-medium">
              <User size={14} /> <span>Student Name</span>
            </a>
            <a href="#" className="text-on-surface-variant hover:text-primary-fixed-dim underline decoration-primary/20 ease-in-out transition-all flex items-center gap-1 text-sm font-medium">
              <Mail size={14} /> <span>Email</span>
            </a>
            <a href="#" className="text-on-surface-variant hover:text-primary-fixed-dim underline decoration-primary/20 ease-in-out transition-all flex items-center gap-1 text-sm font-medium">
              <Github size={14} /> <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>


      {/* 5. GUEST ADMINISTRATOR PASSWORD MODAL ENTRY */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)} />
          
          <div className="relative glass-panel rounded-xl max-w-sm w-full p-6 text-on-surface animate-scaleUp">
            <button 
              onClick={() => setIsPasswordModalOpen(false)} 
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="h-10 w-10 bg-primary/10 border border-primary/30 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock size={18} className="animate-pulse" />
              </div>
              <h3 className="text-md font-space font-bold text-glow tracking-wider text-primary uppercase">
                Administrate Login
              </h3>
              <p className="text-xs text-on-surface-variant mt-1.5">
                포트폴리오 콘텐츠의 실시간 편집이 가능합니다.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-widest text-outline block mb-1">
                  Manager Password
                </label>
                <div className="relative">
                  <input 
                    type={isPasswordVisible ? "text" : "password"}
                    value={rawPassword}
                    onChange={e => setRawPassword(e.target.value)}
                    className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-center tracking-widest rounded-lg p-2.5 pr-10 outline-none text-white text-md font-bold"
                    placeholder="••••"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white"
                    title={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <p className="text-[11px] text-error font-medium text-center bg-error/10 border border-error/20 p-2 rounded-lg animate-shake">
                  {passwordError}
                </p>
              )}

              <div className="text-center py-1">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordHint(!showPasswordHint)}
                  className="text-[10px] text-outline hover:text-primary transition-colors focus:outline-none underline"
                >
                  {showPasswordHint ? '평가용 안내 숨기기' : '평가용 기본 비밀번호 안내 보기'}
                </button>
                {showPasswordHint && (
                  <p className="text-[10px] text-outline-variant mt-2 leading-relaxed animate-fade-in">
                    현재 비밀번호는 <span className="font-bold underline text-primary">{customPassword}</span> 입니다. (관리자 로그인 후 비밀번호 수정 가능)
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold py-2.5 rounded-lg text-xs leading-none tracking-wide transition-all uppercase"
              >
                인증 및 편집 시작
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5.5 ADMINISTRATOR PASSWORD CHANGE MODAL */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsChangePasswordOpen(false)} />
          
          <div className="relative glass-panel rounded-xl max-w-sm w-full p-6 text-on-surface animate-scaleUp">
            <button 
              onClick={() => setIsChangePasswordOpen(false)} 
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield size={18} className="animate-pulse" />
              </div>
              <h3 className="text-md font-space font-bold text-glow tracking-wider text-amber-500 uppercase">
                비밀번호 수정
              </h3>
              <p className="text-xs text-on-surface-variant mt-1.5">
                관리자 모드 접속 비밀번호를 새로운 설정으로 변경합니다.
              </p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (newPassword.length < 4) {
                setPasswordChangeError('비밀번호는 최소 4글자 이상이어야 합니다.');
                return;
              }
              if (newPassword !== newPasswordConfirm) {
                setPasswordChangeError('새 비밀번호가 일치하지 않습니다.');
                return;
              }
              
              setPasswordChangeError('');
              setPasswordChangeSuccess('');
              try {
                await setDoc(doc(db, 'siteContent', 'passwordSettings'), { password: newPassword });
                setPasswordChangeSuccess('비밀번호가 성공적으로 변경되었습니다!');
                setNewPassword('');
                setNewPasswordConfirm('');
                setTimeout(() => {
                  setIsChangePasswordOpen(false);
                  setPasswordChangeSuccess('');
                }, 1500);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, 'siteContent/passwordSettings');
                setPasswordChangeError('비밀번호를 변경하는 중 오류가 발생했습니다.');
              }
            }} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-widest text-outline block mb-1">
                  새 비밀번호 입력
                </label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-center tracking-widest rounded-lg p-2.5 outline-none text-white text-md font-bold"
                  placeholder="••••"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-widest text-outline block mb-1">
                  새 비밀번호 확인
                </label>
                <input 
                  type="password"
                  value={newPasswordConfirm}
                  onChange={e => setNewPasswordConfirm(e.target.value)}
                  className="w-full bg-surface-container/60 border border-white/10 focus:border-primary/50 text-center tracking-widest rounded-lg p-2.5 outline-none text-white text-md font-bold"
                  placeholder="••••"
                  required
                />
              </div>

              {passwordChangeError && (
                <p className="text-[11px] text-error font-medium text-center bg-error/10 border border-error/20 p-2 rounded-lg animate-shake">
                  {passwordChangeError}
                </p>
              )}

              {passwordChangeSuccess && (
                <p className="text-[11px] text-green-400 font-medium text-center bg-green-500/10 border border-green-500/20 p-2 rounded-lg">
                  {passwordChangeSuccess}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold py-2.5 rounded-lg text-xs leading-none tracking-wide transition-all uppercase"
              >
                비밀번호 변경 완료
              </button>
            </form>
          </div>
        </div>
      )}


      {/* 6. GENERAL REUSABLE DETAILED EDITOR TRIGGER MODAL */}
      <EditModal 
        isOpen={activeModal !== null}
        onClose={() => {
          setActiveModal(null);
          setSelectedData(null);
        }}
        type={activeModal || 'hero'}
        data={selectedData}
        onSave={handleSaveData}
        onDelete={handleDeleteData}
      />

    </div>
  );
}
