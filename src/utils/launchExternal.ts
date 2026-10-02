// Utility for smooth external application launches and redirects

export interface RedirectEventDetail {
  name: string;
  url: string;
  type: 'youtube' | 'spotify';
}

export const launchExternalApp = (url: string, name: string, type: 'youtube' | 'spotify') => {
  // Dispatch custom event for smooth in-OS notification toast
  const event = new CustomEvent<RedirectEventDetail>('os:redirect', {
    detail: { name, url, type }
  });
  window.dispatchEvent(event);

  // Smooth micro-delay (180ms) allowing the user to experience the tactile click & visual toast
  setTimeout(() => {
    try {
      const newWin = window.open(url, '_blank', 'noopener,noreferrer');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        // Fallback for strict popup blockers
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
  }, 180);
};
