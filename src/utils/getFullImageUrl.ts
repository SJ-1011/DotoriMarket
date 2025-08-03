const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://fesp-api.koyeb.app/market';

export const getFullImageUrl = (imagePath?: string): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `${baseUrl}/${imagePath}`;
};
