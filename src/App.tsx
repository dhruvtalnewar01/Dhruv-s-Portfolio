import React, { useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { useStore } from './store/useStore';

function App() {
  const { isDarkMode } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="w-full h-screen overflow-hidden text-gray-900 font-sans select-none relative">
      <Desktop />
    </div>
  );
}

export default App;
