import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import * as Clipboard from 'expo-clipboard';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

const { height, width } = Dimensions.get('window');

const API = 'https://backend-k.vercel.app/post/shorts';

const ReelsFeed = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [commentTextMap, setCommentTextMap] = useState({});
  const [commentBoxOpen, setCommentBoxOpen] = useState({});

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const refs = useRef([]);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('UserId');
        console.log("Token", storedToken, "UserId",storedUserId)
        setToken(storedToken);
        setUserId(storedUserId);
      } catch (err) {
        console.error('Auth Load Error:', err);
        Toast.show({ type: 'error', text1: 'Auth Error' });
      }
    };
    loadAuth();
  }, []);

  useEffect(() => {
    if (!isFocused) refs.current.forEach(r => r?.pauseAsync());
  }, [isFocused]);

  const fetchVideos = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}?page=${page}&limit=5`);
      const data = await res.json();
      console.log("Posts : ", data)
      setVideos(prev => [...prev, ...data.videos.filter(v => !prev.some(p => p._id === v._id))]);
      setHasMore(page < data.totalPages);
    } catch (e) {
      console.error('Fetch error', e);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const toggleLike = async postId => {
    if (!token) return Toast.show({ type: 'error', text1: 'Login required' });
    try {
      const res = await fetch(`https://backend-k.vercel.app/post/like/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setVideos(prev => prev.map(v => (v._id === postId ? updated : v)));
    } catch (err) {
      console.error('Like error:', err);
      Toast.show({ type: 'error', text1: 'Like failed', text2: err.message });
    }
  };

  const handleComment = async postId => {
    const text = commentTextMap[postId];
    if (!token || !userId || !text?.trim()) return;
    try {
      const res = await fetch(`https://backend-k.vercel.app/post/comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ CommentText: text, userId }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setVideos(prev => prev.map(v => (v._id === postId ? updated : v)));
      setCommentTextMap(prev => ({ ...prev, [postId]: '' }));
      setCommentBoxOpen(prev => ({ ...prev, [postId]: false }));
    } catch (err) {
      console.error('Comment error:', err);
      Toast.show({ type: 'error', text1: 'Comment failed', text2: err.message });
    }
  };

  const copyToClipboard = async (item) => {
    const shareText = `Check out this reel: ${item.title}\n${item.media}`;
    try {
      await Clipboard.setStringAsync(shareText);
      Toast.show({ type: 'success', text1: 'Copied to clipboard!' });
      console.log("Text Copied")
    } catch (err) {
      console.error('Clipboard error:', err);
      Toast.show({ type: 'error', text1: 'Copy failed' });
    }
  };

  const renderItem = ({ item, index }) => {
    const liked = Array.isArray(item.likes) && userId && item.likes.includes(userId);
    const commentsOpen = commentBoxOpen[item._id];
    const commentText = commentTextMap[item._id] || '';

    return (
      <View style={{ height, width }}>
        <Video
          ref={r => (refs.current[index] = r)}
          source={{ uri: item.media }}
          resizeMode="cover"
          shouldPlay={false}
          isLooping
          style={{ width: '100%', height: '100%' }}
          useNativeControls={false}
        />
        <View style={styles.overlayRowContainer}>
          <View style={styles.leftContent}>
            <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { username: item.userId?.username })}>
              <Image
                source={{ uri: item?.userId?.profilePic || 'https://www.fondpeace.com/og-image.jpg' }}
                style={styles.profilePic}
              />
            </TouchableOpacity>
            <Text style={styles.username}>@{item.userId?.username}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>

          <View style={styles.rightActions}>
            <TouchableOpacity onPress={() => toggleLike(item._id)}>
              <Text style={[styles.icon, { color: liked ? 'red' : '#fff' }]}>❤️ {item.likes?.length || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCommentBoxOpen(prev => ({ ...prev, [item._id]: !prev[item._id] }))}>
              <Text style={styles.icon}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => copyToClipboard(item)}>
              <Text style={styles.icon}>📋</Text>
            </TouchableOpacity>
          </View>
        </View>

        {commentsOpen && (
          <View style={styles.commentSection}>
            <TextInput
              placeholder="Add a comment"
              placeholderTextColor="#aaa"
              value={commentText}
              onChangeText={text => setCommentTextMap(prev => ({ ...prev, [item._id]: text }))}
              style={styles.commentInput}
            />
            <TouchableOpacity onPress={() => handleComment(item._id)}>
              <Text style={[styles.icon, { fontSize: 16 }]}>Post</Text>
            </TouchableOpacity>
            {item.comments?.length > 0 && item.comments.map(comment => (
              <View key={comment._id} style={{ marginTop: 6 }}>
                <Text style={{ color: '#fff' }}>
                  {comment.userId?.username || 'User'}: {comment.CommentText}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.root}>
        <FlatList
          data={videos}
          keyExtractor={i => i._id}
          pagingEnabled
          renderItem={renderItem}
          onEndReached={() => setPage(p => p + 1)}
          onEndReachedThreshold={0.7}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => setPage(1)} />}
          ListFooterComponent={loading && <ActivityIndicator size="large" color="#fff" />}
          viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
          onViewableItemsChanged={useRef(({ viewableItems }) => {
            refs.current.forEach((r, i) => {
              const visible = viewableItems.some(v => v.index === i && v.isViewable);
              visible ? r?.playAsync() : r?.pauseAsync();
            });
          }).current}
          getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
          snapToInterval={height}
          decelerationRate="fast"
          snapToAlignment="start"
          showsVerticalScrollIndicator={false}
        />
        <Toast />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  overlayRowContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  leftContent: {
    flex: 1,
  },
  rightActions: {
    alignItems: 'flex-end',
    gap: 10,
  },
  profilePic: { height: 40, width: 40, borderRadius: 20, marginBottom: 10 },
  username: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 14, marginTop: 4 },
  icon: { fontSize: 22, marginBottom: 10, color: '#fff' },
  commentInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    color: '#fff',
    paddingVertical: 6,
    marginBottom: 10,
  },
  commentSection: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
});

export default ReelsFeed;