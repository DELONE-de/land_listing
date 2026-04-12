'use client';

import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'landapp_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse favorites:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav !== id));
  };

  const toggleFavorite = (id: string) => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    isLoaded,
  };
}