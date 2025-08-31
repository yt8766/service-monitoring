export const getUniqueID = () => {
  return `yt-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
};
