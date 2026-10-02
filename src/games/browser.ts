import { FalloutHackingGame } from './engine';

declare global {
  interface Window {
    game: FalloutHackingGame;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Ensure font is loaded
  try {
    if (document.fonts) {
      await document.fonts.load("21px 'VCR_OSD_MONO_1.001'");
    }
  } catch (err) {
    console.warn('Font preload exception:', err);
  }

  const canvas = document.getElementById('terminal-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element #terminal-canvas not found!');
    return;
  }

  const game = new FalloutHackingGame(canvas);
  window.game = game;

  // Bind Word Length Select
  const lettersSelect = document.getElementById('letters') as HTMLSelectElement;
  if (lettersSelect) {
    lettersSelect.addEventListener('change', (e) => {
      const val = parseInt((e.target as HTMLSelectElement).value, 10);
      game.setWordLength(val);
      lettersSelect.blur();
    });
  }

  // Bind Reset / Reboot Button
  const resetBtn = document.getElementById('btn-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      game.reset();
    });
  }

  // Bind Sound Toggle Button
  const soundBtn = document.getElementById('btn-sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const enabled = game.toggleSound();
      soundBtn.textContent = enabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
      soundBtn.classList.toggle('active', enabled);
    });
  }

  // Bind Theme Switcher
  const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const themeKey = (e.target as HTMLSelectElement).value;
      game.setTheme(themeKey);
      themeSelect.blur();
    });
  }

  // Bind How to Play Modal
  const helpBtn = document.getElementById('btn-help');
  const helpModal = document.getElementById('help-modal');
  const helpClose = document.getElementById('help-close');

  if (helpBtn && helpModal) {
    helpBtn.addEventListener('click', () => {
      helpModal.classList.toggle('hidden');
    });
  }

  if (helpClose && helpModal) {
    helpClose.addEventListener('click', () => {
      helpModal.classList.add('hidden');
    });
  }

  // Close modal on escape or background click
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && helpModal && !helpModal.classList.contains('hidden')) {
      helpModal.classList.add('hidden');
    }
  });

  if (helpModal) {
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        helpModal.classList.add('hidden');
      }
    });
  }
});
