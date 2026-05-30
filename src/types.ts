export interface ExperienceItem {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface SkillItem {
  id: string;
  name: string;
  iconName: string;
  sortOrder: number;
}

export interface AwardItem {
  id: string;
  title: string;
  category: string;
  sortOrder: number;
}

export interface ProjectItem {
  id: string;
  code: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  sortOrder: number;
}

export interface PortfolioData {
  hero: {
    tag: string;
    title: string;
    highlight: string;
    description: string;
    descriptionPara2: string;
    imageUrl: string;
  };
  experiences: ExperienceItem[];
  skills: SkillItem[];
  awards: AwardItem[];
  projects: ProjectItem[];
}
