export type PosterRatio = 'portrait' | 'story' | 'square';

export type AttendeeRole = 'Speaker' | 'Startup' | 'Investor' | 'Host';

export type TemplateId = 
  | 'official-template'
  | 'celestial-horizon'
  | 'cyber-pulse'
  | 'editorial-monolith'
  | 'prism-haze'
  | 'mainstage-anthem'
  | 'holographic-pass';

export interface PosterData {
  name: string;
  designation?: string;
  organization?: string;
  department?: string;
  tagline?: string;
  handle?: string;
  photoUrl: string | null;
  role: AttendeeRole;
  badgeType?: string;
  ratio?: PosterRatio;
  templateId?: TemplateId;
}

export interface PosterTemplate {
  id: TemplateId;
  name: string;
  tagline: string;
  description: string;
  aesthetic: string;
  supportsPhoto: boolean;
  recommendedPhotoStyle?: string;
  defaultBadge: string;
  accentColor: string;
  glowColor: string;
  sampleName: string;
  sampleDepartment: string;
  sampleTagline: string;
  samplePhoto: string;
}

export type CaptionStyle = 'role' | 'hype' | 'cool' | 'emotional' | 'minimal';

export interface CaptionOption {
  id: CaptionStyle;
  label: string;
  tag: string;
  text: string;
}
