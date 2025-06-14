import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  Text, 
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CardTenis from '../components/CardTenis';
import tenis from '../data/tenis';

const TelaBusca = () => {
  const navigation = useNavigation();
  const [termoBusca, setTermoBusca] = useState('');
  
  const { width } = Dimensions.get('window');
  const GAP = 4;
  const ITEM_WIDTH = 142;
  
  const calculateColumns = () => {
    let calculatedColumns = Math.max(1, Math.floor((width + GAP) / (ITEM_WIDTH + GAP)));
    return calculatedColumns >= 3 ? calculatedColumns - 1 : calculatedColumns;
  };

  const numColumns = calculateColumns();

 
  const resultados = termoBusca.trim() 
    ? tenis.filter(item => {
        
        const normalizeText = (text) => 
          text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        
        const nomeNormalizado = normalizeText(item.name);
        const termoNormalizado = normalizeText(termoBusca);
        
        
        return nomeNormalizado.includes(termoNormalizado);
      })
    : [];

  const abrirDetalhes = (id) => {
    navigation.navigate('Detalhes', { idTenis: id });
  };

  const renderItem = ({ item }) => (
    <View style={{ 
      width: ITEM_WIDTH,
      marginRight: GAP,
      marginBottom: GAP
    }}>
      <CardTenis
        tenis={item}
        onPress={() => abrirDetalhes(item.id)}
        isFavorito={false}
        onToggleFavorito={() => {}}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar tênis..."
          placeholderTextColor="#999"
          value={termoBusca}
          onChangeText={setTermoBusca}
          autoCorrect={false}
          clearButtonMode="while-editing"
          autoCapitalize="none"
        />

        {resultados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {termoBusca.trim() ? 'Nenhum tênis encontrado' : 'Digite o nome do tênis para buscar'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={resultados}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            numColumns={numColumns}
            contentContainerStyle={{
              paddingBottom: 16,
              marginHorizontal: -GAP/2
            }}
            columnWrapperStyle={numColumns > 1 ? {
              marginHorizontal: GAP/2,
              justifyContent: 'center' 
            } : null}
            key={`${numColumns}-${width}`}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
  },
  searchInput: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    margin: 12,
    fontSize: 16,
    elevation: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default TelaBusca;