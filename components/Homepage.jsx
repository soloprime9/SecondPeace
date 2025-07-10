import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl, // This is the key component for pull-to-refresh
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';

// Helper to format time ago
const formatPostTime = (timestamp) => {
  const diff = Math.floor((Date.now() - new Date(timestamp)) / 60000); // minutes ago
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} minute${diff > 1 ? 's' : ''} ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export default function Posts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State to control the refresh indicator

  // Fetch posts from backend
  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://backendk-z915.onrender.com/content/get');
      setData(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch posts.');
    }
    setLoading(false);
  };

  // Pull-to-refresh handler
  // This function is called when the user pulls down on the FlatList
  const onRefresh = useCallback(async () => {
    setRefreshing(true); // Show the refreshing indicator
    try {
      const response = await axios.get('https://backendk-z915.onrender.com/content/get');
      setData(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh posts.');
    }
    setRefreshing(false); // Hide the refreshing indicator after data is fetched
  }, []); // useCallback ensures this function is stable and doesn't recreate unnecessarily

  useEffect(() => {
    fetchContent();
  }, []);

  // Clipboard copy & toast notification
  const handleShare = async (post) => {
    // Assuming 'your-app-domain.com' is replaced with the actual domain in a real app
    const postURL = `https://your-app-domain.com/post/${post._id}`;
    const shareText = `${post.content}\nFond Peace\n${postURL}`;

    try {
      await Clipboard.setStringAsync(shareText);
      Toast.show({
        type: 'success',
        text1: 'Copied to Clipboard',
        visibilityTime: 1500,
      });
    } catch (err) {
      Alert.alert('Clipboard Error', 'Failed to copy to clipboard.');
    }
  };

  // Render individual post
  const renderPostItem = ({ item }) => (
    <View style={styles.postContainer}>
      {/* The Link component now wraps the Pressable, and the Pressable's onPress is removed to avoid conflict */}
      <Link
        href={{
          pathname: '/viewpost/[postId]',
          params: { postId: item._id },
        }}
        asChild
      >
        <Pressable
          // Removed the onPress handler from here, as Link with asChild will handle navigation
          android_ripple={{ color: '#ccc' }}
          style={({ pressed }) => [styles.pressablePost, pressed && styles.pressed]}
        >
          <View style={styles.postHeader}>
            <Image
              source={{
                uri:
                  'https://images.macrumors.com/t/5K1xePYg0aiVFhfzTAd8181ROw8=/800x0/article-new/2024/07/Apple-TV-Plus-Feature-2-Magenta-and-Blue.jpg?lossy',
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.username}>Human Cant</Text>
              <Text style={styles.postTime}>{formatPostTime(item.timestamp)}</Text>
            </View>
            <Text style={styles.moreDots}>...</Text>
          </View>

          <Text style={styles.postContent}>{item.content}</Text>

          {item.imageURL ? (
            <Image source={{ uri: item.imageURL }} style={styles.postImage} resizeMode="contain" />
          ) : null}
        </Pressable>
      </Link>

      <View style={styles.postActions}>
        <Pressable android_ripple={{ color: '#ddd' }} style={styles.actionButton}>
          <Text style={styles.actionText}>Like</Text>
        </Pressable>
        <Pressable android_ripple={{ color: '#ddd' }} style={styles.actionButton}>
          <Text style={styles.actionText}>Comment</Text>
        </Pressable>
        <Pressable android_ripple={{ color: '#ddd' }} style={styles.actionButton} onPress={() => handleShare(item)}>
          <Text style={[styles.actionText, styles.shareText]}>Share</Text>
        </Pressable>
      </View>
    </View>
  );

  // Sidebar data
  const leftSidebarItems = ['Worlds', 'Search', 'Account', 'Setting', 'Privacy'];
  const rightSidebarProfiles = new Array(5).fill({
    avatar:
      'https://images.news18.com/ibnlive/uploads/2024/10/apple-iphone-16-pro-review-2024-10-b233e14934d84136a958a7011aa-16x9.jpg?impolicy=website&width=640&height=360',
    name: 'Human Cant',
  });

  // Responsive logic
  const windowWidth = Dimensions.get('window').width;
  const isLargeScreen = windowWidth >= 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#555" />
            <Text>Loading posts...</Text>
          </View>
        )}

        <View style={styles.innerContainer}>
          {isLargeScreen && (
            <ScrollView style={styles.leftSidebar} showsVerticalScrollIndicator={false}>
              {leftSidebarItems.map((item, i) => (
                <Text key={i} style={styles.leftSidebarItem}>
                  {item}
                </Text>
              ))}
            </ScrollView>
          )}

          <View style={styles.mainContent}>
            {data.length === 0 && !loading ? (
              <Text style={styles.noPostsText}>No posts found.</Text>
            ) : (
              <FlatList
                data={[...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))}
                keyExtractor={(item) => item._id}
                renderItem={renderPostItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                // RefreshControl is already correctly implemented here
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing} // Controls the visibility of the refresh indicator
                    onRefresh={onRefresh}   // Function to call when pull-to-refresh is triggered
                  />
                }
              />
            )}
          </View>

          {isLargeScreen && (
            <ScrollView style={styles.rightSidebar} showsVerticalScrollIndicator={false}>
              {rightSidebarProfiles.map((profile, i) => (
                <View key={i} style={styles.profileItem}>
                  <View style={styles.profileInfo}>
                    <Image source={{ uri: profile.avatar }} style={styles.avatarSmall} />
                    <Text style={styles.profileName} numberOfLines={1}>
                      {profile.name}
                    </Text>
                  </View>
                  <Pressable style={styles.profileButton} android_ripple={{ color: '#ccc' }} activeOpacity={0.7}>
                    <Text style={styles.profileButtonText}>Profile</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <Toast />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffffcc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leftSidebar: {
    width: 150,
    padding: 2,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  leftSidebarItem: {
    fontWeight: '700',
    fontSize: 18,
    marginVertical: 1,
    color: '#333',
  },
  mainContent: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  noPostsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
  postContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 1,
    marginBottom: 18,
    backgroundColor: '#fafafa',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  pressablePost: {
    borderRadius: 12,
  },
  pressed: {
    opacity: 0.6,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 14,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#222',
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  moreDots: {
    fontSize: 28,
    fontWeight: '900',
    marginLeft: 'auto',
    color: '#999',
  },
  postContent: {
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
    lineHeight: 22,
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    backgroundColor: '#eaeaea',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '600',
  },
  shareText: {
    color: '#007bff',
    fontWeight: '700',
  },
  rightSidebar: {
    width: 280,
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatarSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 12,
  },
  profileName: {
    fontWeight: '700',
    fontSize: 16,
    flexShrink: 1,
    color: '#222',
  },
  profileButton: {
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#333',
  },
});
