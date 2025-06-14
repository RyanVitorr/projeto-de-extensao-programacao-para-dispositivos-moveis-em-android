import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ContextoFavoritos = createContext();

export const ProvedorFavoritos = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem('favoritos');
        if (saved) setFavoritos(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    if (!loading) {
      const saveFavorites = async () => {
        try {
          await AsyncStorage.setItem('favoritos', JSON.stringify(favoritos));
        } catch (error) {
          console.error('Erro ao salvar favoritos:', error);
        }
      };
      saveFavorites();
    }
  }, [favoritos, loading]);

  const toggleFavorito = useCallback((id) => {
    setFavoritos(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  }, []);

  const isFavorito = useCallback((id) => favoritos.includes(id), [favoritos]);

  return (
    <ContextoFavoritos.Provider value={{ favoritos, toggleFavorito, isFavorito }}>
      {children}
    </ContextoFavoritos.Provider>
  );
};