import { 
  Code, 
  Terminal, 
  Box, 
  Wrench, 
  Brain, 
  Users, 
  Presentation, 
  BookOpen, 
  Award, 
  LucideIcon 
} from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function CustomLucideIcon({ name, className, size = 18 }: LucideIconProps) {
  let IconComponent: LucideIcon;

  switch (name.toLowerCase()) {
    case 'code':
      IconComponent = Code;
      break;
    case 'terminal':
      IconComponent = Terminal;
      break;
    case 'view_in_ar':
      IconComponent = Box;
      break;
    case 'build':
      IconComponent = Wrench;
      break;
    case 'psychology':
      IconComponent = Brain;
      break;
    case 'group':
      IconComponent = Users;
      break;
    case 'co_present':
      IconComponent = Presentation;
      break;
    case 'menu_book':
      IconComponent = BookOpen;
      break;
    case 'award':
      IconComponent = Award;
      break;
    default:
      IconComponent = Code;
  }

  return <IconComponent className={className} size={size} />;
}
