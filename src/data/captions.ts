import { CaptionOption, AttendeeRole } from '../types/poster';
import { BRAND_CONFIG, ATTENDEE_ROLES } from '../config/brandConfig';

export const getRoleCaption = (role: AttendeeRole = 'Speaker'): string => {
  const roleConfig = ATTENDEE_ROLES.find((r) => r.id === role);
  return roleConfig?.sampleCaption || ATTENDEE_ROLES[0].sampleCaption;
};

export const getCaptionsForRole = (role: AttendeeRole = 'Speaker'): CaptionOption[] => {
  const roleConfig = ATTENDEE_ROLES.find((r) => r.id === role) || ATTENDEE_ROLES[0];

  return [
    {
      id: 'role',
      label: `${roleConfig.label} Official`,
      tag: 'Official',
      text: roleConfig.sampleCaption,
    },
    {
      id: 'hype',
      label: 'Hype & Energy',
      tag: 'High Energy',
      text: `IT'S OFFICIAL!! 🚀✨ I'm attending ${BRAND_CONFIG.festivalName} 2026 — ${BRAND_CONFIG.themeTitle} at ${BRAND_CONFIG.universityName}! Two days, 50+ realms, and 35,000+ creators. Can't wait for Star Night! Who else is coming? 👀🎉\n\n${BRAND_CONFIG.hashTags.join(' ')}`,
    },
    {
      id: 'cool',
      label: 'Cool & Confident',
      tag: 'Sleek',
      text: `Where tomorrow dreams awake. Saviskar 2026 attendee confirmed. Catch me at CGC University, Mohali on ${BRAND_CONFIG.dates}. ⚡🎟️\n\n${BRAND_CONFIG.hashTags.join(' ')}`,
    },
    {
      id: 'emotional',
      label: 'Aevorian Reverie',
      tag: 'Official Anthem',
      text: `“A future imagined so vividly, it begins to exist.” Thrilled to be a part of Saviskar 2026 at CGC University Mohali! Here's to good music, great friends, and unforgettable memories under the stars. 🌌✨\n\n${BRAND_CONFIG.hashTags.join(' ')}`,
    },
    {
      id: 'minimal',
      label: 'Short & Simple',
      tag: 'Punchy',
      text: `Saviskar '26 bound. Oct 28–29 at CGC Mohali. See you there! 🔥🎟️\n\n${BRAND_CONFIG.hashTags.join(' ')}`,
    },
  ];
};

export const CAPTIONS: CaptionOption[] = getCaptionsForRole('Speaker');
