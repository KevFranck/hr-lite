export function mediaUrl(photoUrl: string) {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  return `${baseURL}${photoUrl}`;
}
