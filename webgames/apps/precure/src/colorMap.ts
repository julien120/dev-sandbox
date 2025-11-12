export const EMOTION_COLORS: Record<string, string> = {
  Hope: '#ff7fbf',
  Healing: '#f2c6ff',
  Courage: '#ffb347',
  Compassion: '#94d8ff',
  Harmony: '#7dd87d',
  Joy: '#ffd966',
  Adventure: '#ffa45b',
  Friendship: '#7ed1ff',
  Determination: '#f07167',
  Wonder: '#c492ff',
  Gratitude: '#ffbfae',
  Nurture: '#b6f2c4',
  Community: '#8ad0ff',
  Resolve: '#f28482',
  Skyward: '#8ed2ff',
  Innovation: '#9ad5ff',
  Trust: '#7dd87d',
  Companionship: '#7ed1ff',
  Empathy: '#9be0d4',
  Playfulness: '#ffd26f',
  Protection: '#f59f7d',
  Fear: '#8f9bb3',
  Rebirth: '#ff94d2',
  Solidarity: '#6ed3ff',
  Memory: '#c7b8ff',
  Future: '#8febc6',
};

export const getEmotionColor = (id: string, fallback?: string) => {
  return EMOTION_COLORS[id] ?? fallback ?? '#f0f4ff';
};
