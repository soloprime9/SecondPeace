import * as ImagePicker from 'expo-image-picker';
import { createContext, useContext, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create context to share votes between screens
const VoteContext = createContext();
function useVotes() {
  return useContext(VoteContext);
}

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [imageA, setImageA] = useState(null);
  const [imageB, setImageB] = useState(null);
  const { addVote } = useVotes();

  const pickImage = async (setter) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Permission denied', 'Please allow access to your media library');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  };

  const handleVote = (choice) => {
    if (!imageA || !imageB) {
      Alert.alert('Upload both thumbnails', 'Please upload images for both thumbnails.');
      return;
    }
    addVote(choice);
    Alert.alert('Vote counted!', `You voted for Thumbnail ${choice.toUpperCase()}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload two thumbnails to compare</Text>

      <View style={styles.uploadContainer}>
        <TouchableOpacity onPress={() => pickImage(setImageA)} style={styles.imageBox}>
          {imageA ? (
            <Image source={{ uri: imageA }} style={styles.image} />
          ) : (
            <Text style={styles.uploadText}>Tap to upload Thumbnail A</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => pickImage(setImageB)} style={styles.imageBox}>
          {imageB ? (
            <Image source={{ uri: imageB }} style={styles.image} />
          ) : (
            <Text style={styles.uploadText}>Tap to upload Thumbnail B</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.instruction}>Tap the thumbnail you think will perform better:</Text>

      <View style={styles.voteContainer}>
        <TouchableOpacity
          onPress={() => handleVote('a')}
          style={[styles.voteButton, { backgroundColor: '#fbbf24' }]}
        >
          <Text style={styles.voteText}>Vote Thumbnail A</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleVote('b')}
          style={[styles.voteButton, { backgroundColor: '#3b82f6' }]}
        >
          <Text style={[styles.voteText, { color: '#fff' }]}>Vote Thumbnail B</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 30 }}>
        <Button title="View Analytics" onPress={() => navigation.navigate('Analytics')} />
      </View>
    </ScrollView>
  );
}

function AnalyticsScreen() {
  const { votes, resetVotes } = useVotes();
  const total = votes.a + votes.b;

  const percentA = total ? ((votes.a / total) * 100).toFixed(1) : 0;
  const percentB = total ? ((votes.b / total) * 100).toFixed(1) : 0;

  const handleReset = () => {
    Alert.alert('Reset Votes', 'Are you sure you want to reset all votes?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => resetVotes(),
      },
    ]);
  };

  return (
    <View style={styles.analyticsContainer}>
      <Text style={styles.title}>CTR Analytics</Text>

      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Thumbnail A Votes</Text>
        <Text style={styles.statValue}>{votes.a}</Text>
        <Text style={styles.statPercent}>{percentA}%</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Thumbnail B Votes</Text>
        <Text style={styles.statValue}>{votes.b}</Text>
        <Text style={styles.statPercent}>{percentB}%</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Total Votes</Text>
        <Text style={styles.statValue}>{total}</Text>
      </View>

      <View style={{ marginTop: 30 }}>
        <Button title="Reset Votes" color="#dc2626" onPress={handleReset} />
      </View>
    </View>
  );
}

export default function App() {
  const [votes, setVotes] = useState({ a: 0, b: 0 });

  const addVote = (choice) => {
    setVotes((prev) => ({ ...prev, [choice]: prev[choice] + 1 }));
  };

  const resetVotes = () => setVotes({ a: 0, b: 0 });

  return (
    <VoteContext.Provider value={{ votes, addVote, resetVotes }}>
      
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Thumbnail A/B Test' }} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'CTR Analytics' }} />
        </Stack.Navigator>
      
    </VoteContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9fafb',
    flexGrow: 1,
  },
  analyticsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#dc2626',
  },
  uploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  imageBox: {
    width: 150,
    height: 85,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  instruction: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
    color: '#374151',
  },
  voteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  voteButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  voteText: {
    fontWeight: '700',
    fontSize: 16,
  },
  statBox: {
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 40,
    fontWeight: '700',
    color: '#111827',
  },
  statPercent: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
    marginTop: 4,
  },
});