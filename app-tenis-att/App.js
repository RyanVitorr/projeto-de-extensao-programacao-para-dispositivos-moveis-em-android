import React, { useState, useEffect } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ProvedorFavoritos } from './src/components/ContextoFavoritos';
import TelaInicial from './src/screens/TelaInicial';
import TelaFavoritos from './src/screens/TelaFavoritos';
import TelaBusca from './src/screens/TelaBusca';
import TelaDetalhes from './src/screens/TelaDetalhes';
import TelaSplash from './src/screens/TelaSplash';

const Tab = createBottomTabNavigator();
const MainStack = createStackNavigator();


export const OrientationContext = React.createContext();

function OrientationProvider({ children }) {
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').height > Dimensions.get('window').width 
      ? 'PORTRAIT' 
      : 'LANDSCAPE'
  );

  useEffect(() => {
    const updateOrientation = ({ window }) => {
      setOrientation(window.height > window.width ? 'PORTRAIT' : 'LANDSCAPE');
    };

    Dimensions.addEventListener('change', updateOrientation);
    
    return () => {
      Dimensions.removeEventListener('change', updateOrientation);
    };
  }, []);

  return (
    <OrientationContext.Provider value={orientation}>
      <View style={orientation === 'LANDSCAPE' ? styles.landscapeContainer : styles.portraitContainer}>
        {children}
      </View>
    </OrientationContext.Provider>
  );
}

const styles = StyleSheet.create({
  portraitContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});

function HomeStack() {
  const Stack = createStackNavigator();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Inicio" component={TelaInicial} />
      <Stack.Screen name="Detalhes" component={TelaDetalhes} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  const Stack = createStackNavigator();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Favoritos" component={TelaFavoritos} />
      <Stack.Screen name="Detalhes" component={TelaDetalhes} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  const Stack = createStackNavigator();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Busca" component={TelaBusca} />
      <Stack.Screen name="Detalhes" component={TelaDetalhes} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Início') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Favoritos') iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Busca') iconName = focused ? 'search' : 'search-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          paddingBottom: 4,
          height: 60,
          paddingTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Início" component={HomeStack} />
      <Tab.Screen name="Favoritos" component={FavoritesStack} />
      <Tab.Screen name="Busca" component={SearchStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ProvedorFavoritos>
      <OrientationProvider>
        <NavigationContainer>
          <MainStack.Navigator 
            initialRouteName="Splash" 
            screenOptions={{ 
              headerShown: false,
              animationEnabled: true,
              gestureEnabled: false,
            }}
          >
            <MainStack.Screen name="Splash" component={TelaSplash} />
            <MainStack.Screen name="MainTabs" component={MainTabs} />
          </MainStack.Navigator>
        </NavigationContainer>
      </OrientationProvider>
    </ProvedorFavoritos>
  );
}