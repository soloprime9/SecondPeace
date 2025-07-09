// app/Login.jsx

import { View } from 'react-native'; // ✅ Correct import
import Login from '../components/Login';

export default function LoginPage() {
  return (
    <View style={{ flex: 1 }}>
      <Login />
    </View>
  );
}
