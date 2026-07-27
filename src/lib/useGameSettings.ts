import { useEffect, useState } from 'react';
import type { GameSettings } from '@/types';

const STORAGE_KEY = 'lingua-match-settings';

const defaultSettings: GameSettings = {
  languageCode: 'es',
  categoryId: null,
  difficulty: 'medium',
};

function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch {
    // ignore parse errors
  }
  return defaultSettings;
}

export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore write errors
    }
  }, [settings]);

  function update(patch: Partial<GameSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  return { settings, update };
}
