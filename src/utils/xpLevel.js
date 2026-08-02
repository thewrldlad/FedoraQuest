// Shared XP level thresholds/titles. Mirrors the values already used
// inline in components/XPCard/XPCard.jsx.
export const XP_LEVELS = [
  { xp: 0, title: "Fedora Beginner" },
  { xp: 500, title: "Terminal Apprentice" },
  { xp: 1000, title: "Linux Explorer" },
  { xp: 2000, title: "Fedora Navigator" },
  { xp: 3500, title: "Linux Professional" },
  { xp: 5000, title: "Fedora Master" },
];

export function getLevelInfo(xp) {
  let currentLevel = XP_LEVELS[0];
  let nextLevel = XP_LEVELS[1];

  for (let i = 0; i < XP_LEVELS.length; i++) {
    if (xp >= XP_LEVELS[i].xp) {
      currentLevel = XP_LEVELS[i];
      nextLevel = XP_LEVELS[i + 1] || null;
    }
  }

  const levelNumber = XP_LEVELS.indexOf(currentLevel) + 1;

  let percentage = 100;
  if (nextLevel) {
    percentage =
      ((xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100;
  }

  return {
    levelNumber,
    title: currentLevel.title,
    percentage: Math.min(percentage, 100),
    nextLevel,
  };
}
