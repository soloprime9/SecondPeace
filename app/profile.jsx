// ✅ Updated ProfileScreen with:
// - Posts and videos shown together in one modern grid like Instagram
// - Removed "Videos" section and "Highlights"

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const Colors = {
  primary: '#007BFF',
  secondary: '#FF4500',
  tertiary: '#6A5ACD',
  background: '#FFFFFF',
  cardBackground: '#FFFFFF',
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  border: '#E0E0E0',
  shadow: 'rgba(0,0,0,0.15)',
  destructive: '#DC3545',
  gradient1: ['#007BFF', '#6A5ACD'],
};

const Spacing = { xs: 4, s: 8, m: 16, l: 24, xl: 32, xxl: 48 };
const BorderRadius = { s: 8, m: 12, l: 25, xl: 40, xxl: 80 };
const ScreenWidth = Dimensions.get('window').width;

const decodeJWT = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');
  const payload = parts[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = JSON.parse(atob(base64));
  return decoded;
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOwnProfile = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return router.replace('/login');
      try {
        const decoded = decodeJWT(token);
        const userId = decoded.UserId;
        setLoggedUserId(userId);
        const res = await axios.get(`https://backend-k.vercel.app/user/profile/${userId}`, { headers: { 'x-auth-token': token } });
        setProfile(res.data.Profile);
      } catch (err) {
        setError(err);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchOwnProfile();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/login');
      }}
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  if (error || !profile) return <View style={styles.center}><Text>Error loading profile</Text></View>;

  const { user, posts } = profile;
  const isOwner = user?._id === loggedUserId;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={Colors.gradient1} style={styles.header}>
          <Image source={{ uri: user.profilePicture || 'https://via.placeholder.com/150' }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.userHandle}>@{user.username?.toLowerCase()}</Text>
        </LinearGradient>

        <View style={styles.statsRow}>
          <Text style={styles.stat}><Text style={styles.bold}>{user.Followers?.length}</Text> Followers</Text>
          <Text style={styles.stat}><Text style={styles.bold}>{user.Followings?.length}</Text> Following</Text>
          <Text style={styles.stat}><Text style={styles.bold}>{posts?.length}</Text> Posts</Text>
        </View>

        <View style={styles.actions}>
          {isOwner ? (
            <>
              <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Edit Profile</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}><Text style={styles.buttonText}>Logout</Text></TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Follow</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.message]}><Text style={styles.buttonText}>Message</Text></TouchableOpacity>
            </>
          )}
        </View>

        <Text style={styles.sectionTitle}>Posts</Text>
        <View style={styles.gridContainer}>
          {posts.length > 0 ? posts.map((post, i) => (
            post.mediaType === 'video' ? (
              <Video
                key={i}
                source={{ uri: post.media }}
                style={styles.gridItem}
                useNativeControls
                resizeMode="cover"
                isLooping
              />
            ) : (
              <Image key={i} source={{ uri: post.media }} style={styles.gridItem} />
            )
          )) : (
            <Text style={styles.emptyText}>Start sharing your moments!</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', padding: Spacing.xl, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#fff', marginBottom: Spacing.m },
  username: { fontSize: 22, fontWeight: '700', color: '#fff' },
  userHandle: { color: '#fff', marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: Spacing.l },
  stat: { fontSize: 16, color: Colors.textPrimary },
  bold: { fontWeight: 'bold' },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing.l },
  button: { padding: Spacing.s, paddingHorizontal: Spacing.l, backgroundColor: Colors.primary, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  logout: { backgroundColor: Colors.destructive },
  message: { backgroundColor: Colors.tertiary },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: Spacing.m, marginTop: Spacing.m, marginBottom: Spacing.s },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: Spacing.m },
  gridItem: { width: (ScreenWidth - Spacing.m * 3) / 2, height: 220, marginBottom: Spacing.m, borderRadius: 10 },
  emptyText: { textAlign: 'center', color: Colors.textSecondary, fontStyle: 'italic', padding: Spacing.l },
});
