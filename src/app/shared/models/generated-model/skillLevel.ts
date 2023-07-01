export const SKILL_LEVELS = ['Novice', 'Intermediate', 'Advanced', 'Expert'] as const;

export type SkillLevel = typeof SKILL_LEVELS[number];

export const SkillLevel = {
    Novice: 'Novice' as SkillLevel,
    Intermediate: 'Intermediate' as SkillLevel,
    Advanced: 'Advanced' as SkillLevel,
    Expert: 'Expert' as SkillLevel
};