import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

const CommentModal = ({ visible, onDismiss, postId }) => {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [errorComments, setErrorComments] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoadingComments(true);
    setErrorComments(null);
    try {
      const response = await fetch(`https://backend-k.vercel.app/post/comment/${postId}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      const msg = error.message || 'Failed to fetch comments';
      setErrorComments(msg);
      Toast.show({ type: 'error', text1: 'Failed to load comments', text2: msg });
    } finally {
      setLoadingComments(false);
    }
  }, [postId]);

  const postComment = useCallback(async () => {
    if (!postId || !newCommentText.trim()) {
      Toast.show({ type: 'info', text1: 'Comment cannot be empty!' });
      return;
    }
    setIsPostingComment(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('UserId');

      if (!token || !userId) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Error',
          text2: 'Please log in to post comments.',
        });
        throw new Error('User not authenticated locally');
      }

      const response = await fetch(`https://backend-k.vercel.app/post/comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ CommentText: newCommentText, userId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      setNewCommentText('');
      await fetchComments();
      Toast.show({ type: 'success', text1: 'Comment posted successfully!' });
    } catch (error) {
      console.error(error);
      const errMsg = error.message.includes('authentication')
        ? 'Please log in.'
        : error.message;
      Toast.show({ type: 'error', text1: 'Failed to post comment', text2: errMsg });
    } finally {
      setIsPostingComment(false);
    }
  }, [newCommentText, postId, fetchComments]);

  useEffect(() => {
    if (visible && postId) {
      fetchComments();
    } else if (!visible) {
      setComments([]);
      setErrorComments(null);
      setNewCommentText('');
      setIsPostingComment(false);
    }
  }, [visible, postId, fetchComments]);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onDismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Comments</Text>

          {loadingComments ? (
            <ActivityIndicator size="large" color="#007AFF" style={styles.activityIndicator} />
          ) : !!errorComments ? (
            <Text style={styles.errorText}>
              Error: {errorComments}. Unable to fetch comments.
            </Text>
          ) : comments.length === 0 ? (
            <Text style={styles.noCommentsText}>
              No comments yet. Be the first to comment!
            </Text>
          ) : (
            <ScrollView style={styles.commentsList}>
              {comments.map((comment) => (
                <View key={comment._id} style={styles.commentItem}>
                  <Text style={styles.commentUser}>
                    @{comment.userId?.username || 'Unknown User'}
                  </Text>
                  <Text style={styles.commentText}>{comment.CommentText}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentTextInput}
              placeholder="Add a comment..."
              placeholderTextColor="#888"
              value={newCommentText}
              onChangeText={setNewCommentText}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.postButton,
                (!newCommentText.trim() || isPostingComment) && styles.postButtonDisabled,
              ]}
              onPress={postComment}
              disabled={!newCommentText.trim() || isPostingComment}
            >
              {isPostingComment ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.postButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <Toast />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    width: '100%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  activityIndicator: {
    paddingVertical: 20,
  },
  commentsList: {
    flexGrow: 1,
    marginBottom: 15,
  },
  commentItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  commentUser: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: '#222',
  },
  commentText: {
    fontSize: 14,
    color: '#444',
  },
  noCommentsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    paddingBottom: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
    paddingBottom: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 10,
  },
  commentTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#A0C8FF',
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CommentModal;
