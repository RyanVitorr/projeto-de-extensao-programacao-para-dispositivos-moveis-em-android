import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  StatusBar,
  SafeAreaView 
} from 'react-native';

const TelaSplash = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(1));

  const handlePress = () => {

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {

      navigation.replace('MainTabs');
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      <TouchableOpacity 
        style={styles.touchable} 
        activeOpacity={0.7}
        onPress={handlePress}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Image 
            source={require('../components/Logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.instruction}>
            Toque no logo para entrar
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
  flex: 1,
  backgroundColor: '#fff',
},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  instruction: {
    fontSize: 18,
    color: '#666',
    marginTop: 30,
    fontStyle: 'italic',
  },
});

export default TelaSplash;