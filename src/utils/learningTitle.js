// A separate, more granular leveling scale used ONLY for the Profile
// Header's "learning title" badge — not the same 6-tier scale
// utils/xpLevel.js drives for the XP progress bar shown elsewhere
// (ProfileStats, XPCard). That scale tops out around 5000 XP by design;
// the title tiers below intentionally go all the way to "Level 50+", so
// they need their own, finer-grained level number computed from XP.
const XP_PER_TITLE_LEVEL = 100; // one average lesson's worth of XP

const TITLE_TIERS = [
  { minLevel: 1, title: "Fedora Newcomer" },
  { minLevel: 5, title: "Fedora Explorer" },
  { minLevel: 10, title: "Linux Apprentice" },
  { minLevel: 20, title: "Fedora Administrator" },
  { minLevel: 30, title: "Linux Engineer" },
  { minLevel: 40, title: "Fedora Expert" },
  { minLevel: 50, title: "Open Source Champion" },
];

export function getTitleLevel(xp) {
  return Math.max(1, Math.floor((xp || 0) / XP_PER_TITLE_LEVEL) + 1);
}

// Returns both the level number and its title so callers never have to
// compute the level separately just to look up the tier.
export function getLearningTitle(xp) {
  const level = getTitleLevel(xp);

  let title = TITLE_TIERS[0].title;
  for (const tier of TITLE_TIERS) {
    if (level >= tier.minLevel) title = tier.title;
  }

  const nextTier = TITLE_TIERS.find((tier) => tier.minLevel > level);

  return {
    level,
    title,
    nextTitle: nextTier?.title || null,
    levelsToNextTitle: nextTier ? nextTier.minLevel - level : 0,
  };
}
