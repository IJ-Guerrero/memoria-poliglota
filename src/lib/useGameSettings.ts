import { useEffect, useState } from 'react';
import type { GameSettings, Language } from '@/types';
import { getLanguages } from '@/lib/api';

const STORAGE_KEY = 'lingua-match-settings';

const defaultSettings: GameSettings = {
  idiomaOrigen: null,
  idiomaDestino: null,
  categoryId: null,
  difficulty: {
    id: 'facil',
    nombre: 'Fácil',
    cantidadParejas: 4,
  },
  nombreJugador: ''
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
  const [loadedDefaults, setLoadedDefaults] = useState(false);

  useEffect(() => {
    async function setDefaultLanguages() {
      if (loadedDefaults) return;

      if (settings.idiomaOrigen || settings.idiomaDestino) {
        setLoadedDefaults(true);
        return;
      }

      try {
        const languages = await getLanguages();

        const idiomaOrigen = languages.find(
          (l: Language) => l.code === 'es'
        ) ?? null;

        const idiomaDestino = languages.find(
          (l: Language) => l.code === 'en'
        ) ?? null;

        setSettings(prev => ({
          ...prev,
          idiomaOrigen,
          idiomaDestino
        }));

      } catch (error) {
        console.error('No se pudieron cargar idiomas por defecto', error);
      }

      setLoadedDefaults(true);
    }

    setDefaultLanguages();

  }, [settings.idiomaOrigen, settings.idiomaDestino, loadedDefaults]);


  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore write errors
    }
  }, [settings]);


  function update(patch: Partial<GameSettings>) {
    setSettings(prev => ({
      ...prev,
      ...patch
    }));
  }

  return { settings, update };
}