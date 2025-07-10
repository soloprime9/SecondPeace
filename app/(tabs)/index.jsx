import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Feed from '../../components/Classic';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width * 0.75));
  const navigation = useNavigation();

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? -width * 0.75 : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setIsDrawerOpen(!isDrawerOpen));
  };

  const goToScreen = (screen) => {
    toggleDrawer();
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Toggle button */}
      <Pressable
        style={({ pressed }) => [
          styles.menuButton,
          pressed && { opacity: 0.6 },
        ]}
        onPress={toggleDrawer}
        hitSlop={10}
      >
        <Text style={styles.menuText}>{isDrawerOpen ? '✕' : '☰'}</Text>
      </Pressable>

      {/* Drawer */}
      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
      >
        <Text style={styles.drawerHeader}>Menu</Text>

        <Pressable
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
          onPress={() => goToScreen('index')}
        >
          <Text style={styles.drawerItemText}>🏠 Home</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
          onPress={() => goToScreen('search')}
        >
          <Text style={styles.drawerItemText}>🔍 Search</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
          onPress={() => goToScreen('shorta')}
        >
          <Text style={styles.drawerItemText}>🎬 Shorts</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
          onPress={() => goToScreen('profile')}
        >
          <Text style={styles.drawerItemText}>👤 Profile</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
          onPress={() => goToScreen('login')}
        >
          <Text style={styles.drawerItemText}>🔐 Login</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
          onPress={() => goToScreen('signup')}
        >
          <Text style={styles.drawerItemText}>📝 Signup</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
          onPress={() => goToScreen('upload')}
        >
          <Text style={styles.drawerItemText}>⬆️ Upload</Text>
        </Pressable>
      </Animated.View>

      {/* Main content */}
      <View style={styles.mainContent}>
        <Feed />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 3, height: 0 },
  },
  drawerHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#111',
  },
  drawerItem: {
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  drawerItemPressed: {
    backgroundColor: '#eee',
  },
  drawerItemText: {
    fontSize: 18,
    color: '#333',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuButton: {
    position: 'absolute',
    top: 45,
    right: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    elevation: 6,
    zIndex: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  menuText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
  },
});
