import { View } from 'react-native';

import LatestVideo from '../../components/LatestVideo';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <LatestVideo />
    </View>
  );
}