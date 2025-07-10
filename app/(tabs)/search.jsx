import { ScrollView, StyleSheet, View } from 'react-native';

import CreateGo from '../../components/CreateGo';
import Posts from '../../components/Homepage';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <CreateGo />
        <Posts />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // soft background
  },
  scrollContainer: {
    padding: 1,
    paddingBottom: 100, // some space at bottom
  },
});
