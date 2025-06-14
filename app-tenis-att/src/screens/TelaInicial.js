import React, { useContext, useState } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  useWindowDimensions,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CardTenis from '../components/CardTenis';
import tenis from '../data/tenis';
import { ContextoFavoritos } from '../components/ContextoFavoritos';

const itemMargin = 8;
const itemWidth = 142;

export default function TelaInicial() {
  const navigation = useNavigation();
  const { isFavorito, toggleFavorito } = useContext(ContextoFavoritos);
  const [modalVisible, setModalVisible] = useState(false);
  const [marcaSelecionada, setMarcaSelecionada] = useState('todas');
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');

  const { width } = useWindowDimensions();
  const GAP = 4;
  const ITEM_WIDTH = 142;
  
  const calculateColumns = () => {
    let calculatedColumns = Math.max(1, Math.floor((width + GAP) / (ITEM_WIDTH + GAP)));
    return calculatedColumns >= 3 ? calculatedColumns - 1 : calculatedColumns;
  };

  const numColumns = calculateColumns();

  const marcas = ['todas', ...new Set(tenis.map(item => item.brand))];

  const abrirDetalhes = (id) => {
    navigation.navigate('Detalhes', { idTenis: id });
  };

  const aplicarFiltro = () => {
    setModalVisible(false);
  };

  const limparFiltros = () => {
    setMarcaSelecionada('todas');
    setPrecoMin('');
    setPrecoMax('');
  };

  // Função para converter preço para número
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      // Remove 'R$', pontos e vírgulas
      const numericString = price.replace('R$', '').replace('.', '').replace(',', '.').trim();
      return parseFloat(numericString) || 0;
    }
    return 0;
  };

  const tenisFiltrados = tenis.filter(item => {
    const marcaFiltro = marcaSelecionada === 'todas' || item.brand === marcaSelecionada;
    
    const precoItem = parsePrice(item.price);
    const minPrice = precoMin ? parseFloat(precoMin) : Number.MIN_SAFE_INTEGER;
    const maxPrice = precoMax ? parseFloat(precoMax) : Number.MAX_SAFE_INTEGER;
    
    const precoFiltro = precoItem >= minPrice && precoItem <= maxPrice;
    
    return marcaFiltro && precoFiltro;
  });

  const renderItem = ({ item }) => (
    <View style={{ 
      width: ITEM_WIDTH,
      marginRight: GAP,
      marginBottom: GAP
    }}>
      <CardTenis
        tenis={item}
        onPress={abrirDetalhes}
        isFavorito={isFavorito(item.id)}
        onToggleFavorito={toggleFavorito}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={tenisFiltrados}
          keyExtractor={(item) => item.id}
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
        />

        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filtrar Produtos</Text>
              
              <Text style={styles.filterLabel}>Marca:</Text>
              <ScrollView 
                style={styles.marcaScroll}
                contentContainerStyle={styles.marcaScrollContent}
              >
                <View style={styles.marcaContainer}>
                  {marcas.map(marca => (
                    <TouchableOpacity
                      key={marca}
                      style={[
                        styles.marcaOption,
                        marcaSelecionada === marca && styles.marcaSelecionada
                      ]}
                      onPress={() => setMarcaSelecionada(marca)}
                    >
                      <Text style={marcaSelecionada === marca ? styles.marcaTextSelecionada : null}>
                        {marca === 'todas' ? 'Todas' : marca}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              
              <Text style={styles.filterLabel}>Faixa de Preço:</Text>
              <View style={styles.precoContainer}>
                <View style={styles.precoInputContainer}>
                  <Text style={styles.precoLabel}>Mín:</Text>
                  <TextInput
                    style={styles.precoInput}
                    placeholder="0"
                    keyboardType="numeric"
                    value={precoMin}
                    onChangeText={text => setPrecoMin(text.replace(/[^0-9]/g, ''))}
                  />
                </View>
                <Text style={styles.precoSeparator}>-</Text>
                <View style={styles.precoInputContainer}>
                  <Text style={styles.precoLabel}>Máx:</Text>
                  <TextInput
                    style={styles.precoInput}
                    placeholder="9999"
                    keyboardType="numeric"
                    value={precoMax}
                    onChangeText={text => setPrecoMax(text.replace(/[^0-9]/g, ''))}
                  />
                </View>
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.limparButton]}
                  onPress={limparFiltros}
                >
                  <Text style={styles.buttonText}>Limpar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.aplicarButton]}
                  onPress={aplicarFiltro}
                >
                  <Text style={styles.buttonText}>Aplicar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>    
      </View>
    </SafeAreaView>
  );
}

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
  listContent: {
    paddingBottom: 16,
    paddingRight: 5,
  },
  columnWrapper: {
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    right: 20,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400, 
    maxHeight: '80%', 
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  filterLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  marcaScroll: {
    maxHeight: 150, 
    marginBottom: 15,
  },
  marcaScrollContent: {
    flexGrow: 1,
  },
  marcaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  marcaOption: {
    padding: 8,
    margin: 4,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    minWidth: 80, 
    alignItems: 'center',
  },
  marcaSelecionada: {
    backgroundColor: '#000',
  },
  marcaTextSelecionada: {
    color: 'white',
  },
  precoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  precoInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  precoLabel: {
    marginRight: 5,
    color: '#666',
  },
  precoInput: {
    flex: 1,
    paddingVertical: 8,
    minWidth: 60,
  },
  precoSeparator: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  limparButton: {
    backgroundColor: '#000',
  },
  aplicarButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white'
  },
});