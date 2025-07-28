export function maskUserId(userId: string) {
  if (!userId) return '';
  return userId[0] + '**';
}
