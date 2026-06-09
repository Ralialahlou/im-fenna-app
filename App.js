import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  AbhayaLibre_400Regular,
  AbhayaLibre_500Medium,
  AbhayaLibre_700Bold,
} from '@expo-google-fonts/abhaya-libre';
import {
  Raleway_300Light,
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from '@expo-google-fonts/raleway';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS, FONTS } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    AbhayaLibre_400Regular,
    AbhayaLibre_500Medium,
    AbhayaLibre_700Bold,
    Raleway_300Light,
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.maroon} />
        <Text style={styles.loadingText}>I'M FENNA</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <CartProvider>
        <WishlistProvider>
          <AppNavigator />
        </WishlistProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.cinnamon,
    letterSpacing: 6,
    fontWeight: '300',
  },
});
