// ✅ React Native version of your web profile page
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const { username } = useLocalSearchParams(); // passed via navigation
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [iOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const loggedUserId = decoded.UserId;

        const res = await axios.get(
          `https://backendk-z915.onrender.com/user/${username}`,
          {
            headers: { 'x-auth-token': token },
          }
        );

        const data = res.data.Profile;
        setProfile(data);
        setIsOwner(data.user._id === loggedUserId);
        setIsFollowing(data.user.Followers.includes(loggedUserId));
      } catch (err) {
        setError(err.message || 'Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    const token = await AsyncStorage.getItem('token');
    const loggedUserId = jwtDecode(token).UserId;

    try {
      await axios.post(
        `https://backendk-z915.onrender.com/user/follow/${profile.user._id}`,
        {},
        {
          headers: { 'x-auth-token': token },
        }
      );
      setIsFollowing(!isFollowing);
      setProfile((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          Followers: isFollowing
            ? prev.user.Followers.filter((id) => id !== loggedUserId)
            : [...prev.user.Followers, loggedUserId],
        },
      }));
    } catch (err) {
      alert('Error following/unfollowing');
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );

  const { user, posts } = profile;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: user.coverPicture || 'https://fondpeace.com/og-image.jpg' }} style={styles.banner} />
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.profilePicture || 'https://fondpeace.com/og-image.jpg' }} style={styles.avatar} />
        <Text style={styles.username}>{user.username}</Text>
        <Text>{user.Followers.length} Followers</Text>
        <Text>{user.Followings.length} Following</Text>
        {iOwner ? (
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleFollow}
            style={[styles.followBtn, isFollowing ? styles.unfollow : styles.follow]}
          >
            <Text style={styles.followText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.bio}>{user.bio || 'No bio added'}</Text>
      <View style={styles.postsGrid}>
        {posts.length ? (
          posts.map((post, index) => (
            <Image
              key={index}
              source={{ uri: post.media }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ))
        ) : (
          <Text>No posts yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red' },
  banner: { width: '100%', height: 100 },
  profileHeader: { alignItems: 'center', marginVertical: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  username: { fontSize: 20, fontWeight: 'bold' },
  editBtn: { marginTop: 8, padding: 8, backgroundColor: '#16a34a', borderRadius: 6 },
  editText: { color: '#fff' },
  followBtn: { marginTop: 8, padding: 8, borderRadius: 6 },
  follow: { backgroundColor: '#3b82f6' },
  unfollow: { backgroundColor: '#ef4444' },
  followText: { color: '#fff' },
  bio: { marginVertical: 10, textAlign: 'center' },
  postsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 6,
  },
  postImage: {
    width: (Dimensions.get('window').width - 40) / 3,
    height: 120,
    borderRadius: 6,
    marginBottom: 6,
  },
});














import ShimmerSkeleton from './Skeleton'; // 👈

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [iOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (!decoded?.exp || decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return;
      }
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const path = window.location.pathname;
      const username = path.split('/').pop();
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get(`https://backendk-z915.onrender.com/user/${username}`, {
          headers: { 'x-auth-token': token }
        });

        const loggedUserId = jwtDecode(token).UserId;
        const userData = res.data.Profile.user;

        setProfile(res.data.Profile);
        setIsOwner(userData._id === loggedUserId);
        setIsFollowing(userData.Followers.includes(loggedUserId));
      } catch (err) {
        console.log("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    const loggedUserId = jwtDecode(token).UserId;

    try {
      await axios.post(
        `https://backendk-z915.onrender.com/user/follow/${profile.user._id}`,
        {},
        {
          headers: { 'x-auth-token': token },
        }
      );

      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err);
    }
  };

  // ⏳ Show shimmer while loading
  if (loading) return <ShimmerSkeleton />;

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Profile not found.</Text>
      </View>
    );
  }

  const { user, posts } = profile;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: '/1.jpg' }} style={styles.banner} />

      <View style={styles.header}>
        <Image source={{ uri: user.profilePicture || '/1.jpg' }} style={styles.avatar} />
        <Text style={styles.username}>{user.username}</Text>
      </View>

      <View style={styles.stats}>
        <Text>{user.Followers.length} Followers</Text>
        <Text>{user.Followings.length} Following</Text>
        {iOwner ? (
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleFollow}
            style={[styles.followBtn, isFollowing ? styles.unfollow : styles.follow]}
          >
            <Text style={styles.followText}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.bio}>{user.bio || "Add about you"}</Text>

      <View style={styles.postsGrid}>
        {posts.length > 0 ? (
          posts.map((post, idx) => (
            <Image
              key={idx}
              source={{ uri: post.media }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ))
        ) : (
          <Text style={styles.noPosts}>No posts yet.</Text>
        )}
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red' },
  banner: { width: '100%', height: 80 },
  header: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  avatar: { width: 50, height: 50, borderRadius: 999, marginRight: 12 },
  username: { fontSize: 20, fontWeight: 'bold' },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  editBtn: { padding: 8, backgroundColor: '#16a34a', borderRadius: 6 },
  editText: { color: '#fff' },
  followBtn: { padding: 8, borderRadius: 6 },
  follow: { backgroundColor: '#3b82f6' },
  unfollow: { backgroundColor: '#ef4444' },
  followText: { color: '#fff' },
  bio: { textAlign: 'center', marginVertical: 8 },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'space-between',
  },
  postImage: {
    width: (Dimensions.get('window').width - 40) / 3,
    height: 120,
    borderRadius: 6,
  },
  noPosts: { textAlign: 'center', marginVertical: 16, fontSize: 16 },
});

