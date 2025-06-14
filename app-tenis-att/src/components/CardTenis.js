import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CardTenis = memo(({ tenis, onPress, isFavorito, onToggleFavorito }) => {
  const handlePress = () => onPress(tenis.id);
  const handleFavoritoPress = (e) => {
    e.stopPropagation();
    onToggleFavorito(tenis.id);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.card}>
        <Image 
          source={{ uri: tenis.image }} 
          style={styles.image}
          resizeMode="contain"
          onError={() => console.log('Erro ao carregar imagem')}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.nome} numberOfLines={1}>{tenis.name}</Text>
          <Text style={styles.preco}>{tenis.price}</Text>
        </View>
        <TouchableOpacity onPress={handleFavoritoPress} style={styles.favButton}>
          <Ionicons
            name={isFavorito ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorito ? '#e91e63' : '#333'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 142,
    marginBottom: 16,
    marginTop: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
    marginBottom: 8,
  },
  infoContainer: {
    paddingHorizontal: 4,
  },
  nome: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  preco: {
    fontSize: 13,
    color: '#666',
  },
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
});

export default CardTenis;