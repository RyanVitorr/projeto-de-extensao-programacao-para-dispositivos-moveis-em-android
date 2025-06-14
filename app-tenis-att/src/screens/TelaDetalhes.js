import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ContextoFavoritos } from '../components/ContextoFavoritos';
import { OrientationContext } from '../../App';
import tenis from '../data/tenis';

const TelaDetalhes = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { idTenis } = route.params;
  const { isFavorito, toggleFavorito } = useContext(ContextoFavoritos);
  const orientation = useContext(OrientationContext);
  const [tenisDetalhe, setTenisDetalhe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const id = Number(idTenis) || idTenis;
        const produto = tenis.find(item => item.id == id); 
        
        if (produto) {
          setTenisDetalhe(produto);
        } else {
          console.warn('Produto não encontrado para ID:', idTenis);
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [idTenis]);

  const handleBack = () => navigation.goBack();

  const formatPrice = (price) => {
    if (typeof price === 'string' && price.startsWith('R$')) {
      return price;
    }
    
    const num = typeof price === 'string' ? 
      parseFloat(price.replace('.', '').replace(',', '.')) : 
      price;
      
    return isNaN(num) ? 'Preço indisponível' : 
      num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!tenisDetalhe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Produto não encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[
        styles.container, 
        orientation === 'LANDSCAPE' ? styles.landscapeContainer : null
      ]}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{tenisDetalhe.brand}</Text>
          <TouchableOpacity onPress={() => toggleFavorito(tenisDetalhe.id)} style={styles.favButton}>
            <Ionicons
              name={isFavorito(tenisDetalhe.id) ? 'heart' : 'heart-outline'}
              size={28}
              color="#e91e63"
            />
          </TouchableOpacity>
        </View>

        
        <ScrollView 
          contentContainerStyle={[
            styles.contentContainer,
            orientation === 'LANDSCAPE' && styles.landscapeContent
          ]}
        >
          
          <View style={orientation === 'LANDSCAPE' ? styles.landscapeImageContainer : null}>
            <Image 
              source={{ uri: tenisDetalhe.image }} 
              style={[
                styles.productImage,
                orientation === 'LANDSCAPE' && styles.landscapeImage
              ]}
              resizeMode="contain"
            />
          </View>
          
         
          <View style={[
            styles.detailsContainer,
            orientation === 'LANDSCAPE' && styles.landscapeDetails
          ]}>
            <Text style={styles.productName}>{tenisDetalhe.name}</Text>
            <Text style={styles.price}>{formatPrice(tenisDetalhe.price)}</Text>
            
            {tenisDetalhe.description && (
              <>
                <Text style={styles.sectionTitle}>Descrição</Text>
                <Text style={styles.description}>{tenisDetalhe.description}</Text>
              </>
            )}
            
            <Text style={styles.sectionTitle}>Onde Comprar</Text>
            <View style={[
              styles.storesContainer,
              orientation === 'LANDSCAPE' && styles.landscapeStores
            ]}>
              {tenisDetalhe.stores?.map((store, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.storeButton}
                  onPress={() => Linking.openURL(store.url)}
                >
                  <Text style={styles.storeText}>{store.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        
        
      </View>
    </SafeAreaView>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
 
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
 
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 35,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  favButton: {
    padding: 5,
  },
  

  contentContainer: {
    paddingBottom: 20,
  },
  productImage: {
    width: '100%',
    height: windowHeight * 0.35,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  detailsContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  storesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  storeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  storeText: {
    color: '#000',
    fontWeight: '500',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  

  landscapeContainer: {
    
  },
  landscapeContent: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'flex-start',
  },
  landscapeImageContainer: {
    width: '45%',
    justifyContent: 'flex-start',
  },
  landscapeImage: {
    height: 180,
    width: '100%',
    marginRight: 15,
    marginTop: 10,
  },
  landscapeDetails: {
    width: '55%',
    padding: 10,
  },
  landscapeStores: {
    justifyContent: 'flex-start',
  },
});

export default TelaDetalhes;