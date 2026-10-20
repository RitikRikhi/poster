import { AttendeeRole } from '../types/poster';

export interface RoleRealmConfig {
  id: AttendeeRole;
  label: string;
  badge: string;
  tagline: string;
  defaultRoleTitle: string;
  description: string;
  sampleCaption: string;
}

export const ATTENDEE_ROLES: RoleRealmConfig[] = [
  {
    id: 'Speaker',
    label: 'Speaker',
    badge: 'OFFICIAL SPEAKER',
    tagline: 'Inspiring tomorrow’s breakthrough minds.',
    defaultRoleTitle: 'Keynote Speaker & Tech Visionary',
    description: 'Sharing insights, leading masterclasses & inspiring creators',
    sampleCaption: `Thrilled to announce that I will be speaking at Saviskar 2026 at CGC University, Mohali! 🎙️⚡ Excited to connect with 35,000+ ambitious students and innovators. See you on Oct 28–29!\n\n#Saviskar2026 #Speaker #Keynote #CGCUniversity`,
  },
  {
    id: 'Startup',
    label: 'Startup',
    badge: 'STARTUP FOUNDER',
    tagline: 'Building the next breakthrough invention.',
    defaultRoleTitle: 'Founder & Innovator • Srijan Realm',
    description: 'Showcasing innovations, demoing products & pitching to investors',
    sampleCaption: `Excited to showcase our startup at Saviskar 2026 — CGC University, Mohali! 🚀💡 Come visit our booth in the Innovation Realm on Oct 28–29.\n\n#Saviskar2026 #Startup #Founder #Innovation #CGCUniversity`,
  },
  {
    id: 'Investor',
    label: 'Investor',
    badge: 'VENTURE INVESTOR',
    tagline: 'Backing visionary student founders.',
    defaultRoleTitle: 'Venture Partner & Ecosystem Angel',
    description: 'Discovering next-generation student founders and breakthrough IP',
    sampleCaption: `Proud to join Saviskar 2026 as an Investor & Mentor! 💼📈 Looking forward to discovering and backing exceptional student builders at CGC University Mohali.\n\n#Saviskar2026 #Investor #VentureCapital #Startups #CGCUniversity`,
  },
  {
    id: 'Host',
    label: 'Host',
    badge: 'OFFICIAL FEST HOST',
    tagline: 'Bringing the energy to Saviskar 2026.',
    defaultRoleTitle: 'Mainstage Emcee & Fest Host',
    description: 'Anchoring the mainstage, introducing artists & powering the vibe',
    sampleCaption: `HONORED & HYPED to be your official host for Saviskar 2026 at CGC University, Mohali! 🎤🔥 Two days of electric energy and 35,000 voices under the stars. Let's make history!\n\n#Saviskar2026 #OfficialHost #Emcee #StarNight #CGCUniversity`,
  },
];

export interface BrandAssetConfig {
  festivalName: string;
  themeTitle: string;
  themeTagline: string;
  themePhilosophy: string;
  universityName: string;
  campusLocation: string;
  edition: string;
  dates: string;
  coordinates: string;
  hashTags: string[];
  badges: string[];
}

export const BRAND_CONFIG: BrandAssetConfig = {
  festivalName: 'SAVISKAR',
  themeTitle: 'AEVORIAN REVERIE',
  themeTagline: 'Where Tomorrow Dreams Awake',
  themePhilosophy: 'A future imagined so vividly, it begins to exist.',
  universityName: 'CGC University, Mohali',
  campusLocation: 'Landran, Mohali, Punjab',
  edition: '2026',
  dates: 'October 28 – 29, 2026',
  coordinates: '30.6942° N, 76.6653° E',
  hashTags: ['#Saviskar2026', '#AevorianReverie', '#CGCUniversity', '#WhereTomorrowDreamsAwake'],
  badges: [
    'OFFICIAL SPEAKER',
    'STARTUP FOUNDER',
    'VENTURE INVESTOR',
    'OFFICIAL FEST HOST',
    'AEVORIAN PASS',
    'ALL-ACCESS PASS',
    'STAR NIGHT PASS',
  ],
};
