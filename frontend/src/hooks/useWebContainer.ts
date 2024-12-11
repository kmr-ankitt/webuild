import { useState, useEffect } from 'react';
import { WebContainer } from '@webcontainer/api';

let webContainerInstance: WebContainer | null = null;

export function useWebContainer() {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);

  useEffect(() => {
    async function bootWebContainer() {
      if (!webContainerInstance) {
        webContainerInstance = await WebContainer.boot();
      }
      setWebContainer(webContainerInstance);
    }

    bootWebContainer();
  }, []);

  return webContainer;
}