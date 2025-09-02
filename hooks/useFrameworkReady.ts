import { useEffect, useState } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.frameworkReady?.();
    setReady(true); // 挂载完成，标记 ready
  }, []);

  return ready;
}
