import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserId = async () => {
  try {
    const user = await AsyncStorage.getItem('@user');
    return user ? JSON.parse(user).id : null;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
};
