import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Format timestamp to relative time string
const formatPostTime = (timestamp) => {
  const diff = Math.floor((Date.now() - new Date(timestamp)) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} minute${diff > 1 ? 's' : ''} ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const PostScreen = () => {
  const route = useRoute();
  const router = useRouter();
  const { id } = route.params;

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPostData = useCallback(() => {
    return axios
      .get(`https://backend-k.vercel.app/content/post/${id}`)
      .then((response) => {
        setPost(response.data.post);
        setRelatedPosts(response.data.relatedPosts || []);
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
      });
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchPostData().finally(() => setLoading(false));
  }, [fetchPostData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPostData().finally(() => setRefreshing(false));
  }, [fetchPostData]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, marginTop: 100 }} size="large" color="#333" />;
  }

  if (!post) {
    return <Text style={styles.errorText}>Error loading post</Text>;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Main Post Header */}
      <View style={styles.header}>
        <Image source={{ uri: 'https://www.fondpeace.com/og-image.jpg' }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>Human Cant</Text>
          <Text style={styles.time}>{formatPostTime(post.timestamp)}</Text>
        </View>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.imageURL && (
        <Image source={{ uri: post.imageURL }} style={styles.image} resizeMode="cover" />
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        {['Like', 'Comment', 'Share', 'Save'].map((text, i) => (
          <TouchableOpacity key={i} style={styles.actionBtn}>
            <Text style={styles.actionText}>{text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Related Posts */}
      <Text style={styles.relatedTitle}>Related Posts</Text>
      {relatedPosts.map((rPost) => (
        <TouchableOpacity
          key={rPost._id}
          style={styles.relatedPost}
          onPress={() => router.push(`/viewpost/${rPost._id}`)}
          activeOpacity={0.8}
        >
          {/* Related Post Header */}
          <View style={styles.relatedHeader}>
            <Image
              source={{ uri: rPost.userImageURL || 'https://www.fondpeace.com/og-image.jpg' }}
              style={styles.avatarSmall}
            />
            <Text style={styles.usernameSmall}>{rPost.username || 'Relate Curv'}</Text>
            <Text style={styles.relatedTime}>{formatPostTime(rPost.timestamp)}</Text>
          </View>

          {/* Related Post Content */}
          <Text numberOfLines={3} style={styles.relatedContent}>
            {rPost.content}
          </Text>

          {/* Related Post Image */}
          {rPost.imageURL && (
            <Image
              source={{ uri: rPost.imageURL }}
              style={styles.relatedImage}
              resizeMode="cover"
              loadingIndicatorSource={{ uri: 'https://fondpeace.com/og-image.jpg' }}
            />
          )}

          {/* Related Post Actions */}
          <View style={styles.relatedActions}>
            {['Like', 'Comment', 'Share', 'Save'].map((text, i) => (
              <TouchableOpacity key={i} style={styles.relatedActionBtn}>
                <Text style={styles.relatedActionText}>{text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flexDirection: 'column',
  },
  username: {
    fontWeight: '700',
    fontSize: 18,
    color: '#111',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  content: {
    fontSize: 17,
    color: '#222',
    lineHeight: 24,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 14,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    backgroundColor: '#fafafa',
  },
  actionText: {
    fontSize: 15,
    color: '#333',
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 14,
  },
  relatedPost: {
    backgroundColor: '#fefefe',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  relatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
  },
  usernameSmall: {
    fontWeight: '600',
    color: '#222',
    fontSize: 15,
  },
  relatedTime: {
    marginLeft: 8,
    fontSize: 11,
    color: '#999',
  },
  relatedContent: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 10,
  },
  relatedImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  relatedActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  relatedActionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    backgroundColor: '#fafafa',
  },
  relatedActionText: {
    fontSize: 12,
    color: '#555',
  },
  errorText: {
    flex: 1,
    padding: 20,
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PostScreen;
