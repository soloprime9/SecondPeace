// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { Video } from "expo-av";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function Feed() {
//   const [posts, setPosts] = useState([]);
//   const [commentText, setCommentText] = useState("");
//   const [commentBoxOpen, setCommentBoxOpen] = useState({});
//   const [userId, setUserId] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [authReady, setAuthReady] = useState(false);

//   // Load token & userId once
//   useEffect(() => {
//     const loadAuth = async () => {
//       try {
//         const storedToken = await AsyncStorage.getItem("token");
//         const storedUserId = await AsyncStorage.getItem("UserId");

//         if (!storedToken || !storedUserId) {
//           Alert.alert("Authentication Error", "Please login again.");
//           // Optionally redirect to login
//           return;
//         }

//         setToken(storedToken);
//         setUserId(storedUserId);
//         setAuthReady(true);
//       } catch (e) {
//         console.log("Auth error:", e);
//         Alert.alert("Auth Error", "Could not read token.");
//       }
//     };

//     loadAuth();
//   }, []);

//   // Fetch posts after auth ready
//   useEffect(() => {
//     if (authReady) {
//       fetchPosts();
//     }
//   }, [authReady]);

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(
//         "https://backend-k.vercel.app/post/mango/getall"
//       );
//       setPosts(data);
//     } catch (err) {
//       Alert.alert("Error", "Failed to fetch posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLikePost = async (postId) => {
//     if (!token) return Alert.alert("Error", "User not authenticated");

//     try {
//       await axios.post(
//         `https://backend-k.vercel.app/post/like/${postId}`,
//         {},
//         {
//           headers: {
//             "x-auth-token": token,
//           },
//         }
//       );
//       fetchPosts();
//     } catch (err) {
//       Alert.alert("Error", "Failed to like post");
//     }
//   };

//   const handleComment = async (postId) => {
//     if (!token || !userId) return Alert.alert("Error", "User not authenticated");
//     if (!commentText.trim()) return Alert.alert("Error", "Comment cannot be empty");

//     try {
//       await axios.post(
//         `https://backend-k.vercel.app/post/comment/${postId}`,
//         { CommentText: commentText, UserId: userId },
//         {
//           headers: {
//             "x-auth-token": token,
//           },
//         }
//       );
//       setCommentText("");
//       setCommentBoxOpen((prev) => ({ ...prev, [postId]: false }));
//       fetchPosts();
//     } catch (err) {
//       Alert.alert("Error", "Failed to post comment");
//     }
//   };

//   const toggleCommentBox = (postId) => {
//     setCommentBoxOpen((prev) => ({
//       ...prev,
//       [postId]: !prev[postId],
//     }));
//   };

//   const renderPost = ({ item: post }) => {
//     const isVideo = post.media?.endsWith(".mp4");

//     return (
//       <View style={styles.postContainer}>
//         <View style={styles.postHeader}>
//           <Image
//             source={{ uri: post?.UserId?.profilePic || "https://via.placeholder.com/40" }}
//             style={styles.profilePic}
//           />
//           <Text style={styles.username}>
//             {post?.userId?.username || "Unknown User"}
//           </Text>
//         </View>

//         {post.media ? (
//           isVideo ? (
//             <Video
//               source={{ uri: post.media }}
//               style={styles.media}
//               resizeMode="cover"
//               isMuted
//               shouldPlay={false}
//               useNativeControls={false}
//             />
//           ) : (
//             <Image source={{ uri: post.media }} style={styles.media} />
//           )
//         ) : null}

//         <View style={styles.actionRow}>
//           <TouchableOpacity
//             style={styles.likeButton}
//             onPress={() => handleLikePost(post._id)}
//           >
//             <Text style={styles.actionText}>
//               Like ({post.likes?.length || 0})
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.commentButton}
//             onPress={() => toggleCommentBox(post._id)}
//           >
//             <Text style={styles.actionText}>Comment</Text>
//           </TouchableOpacity>
//         </View>

//         {commentBoxOpen[post._id] && (
//           <View style={styles.commentBox}>
//             <TextInput
//               style={styles.commentInput}
//               placeholder="Write a comment..."
//               value={commentText}
//               onChangeText={setCommentText}
//             />
//             <TouchableOpacity
//               style={styles.postCommentButton}
//               onPress={() => handleComment(post._id)}
//             >
//               <Text style={styles.postCommentText}>Post Comment</Text>
//             </TouchableOpacity>

//             {post.comments?.length > 0 && (
//               <View style={styles.commentsList}>
//                 {post.comments.map((comment) => (
//                   <View key={comment._id} style={styles.commentItem}>
//                     <Text style={styles.commentAuthor}>
//                       {comment.UserId?.username || "Anonymous"}:
//                     </Text>
//                     <Text style={styles.commentText}>{comment.CommentText}</Text>
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>
//         )}
//       </View>
//     );
//   };

//   if (loading || !authReady) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007bff" />
//         <Text style={{ marginTop: 10 }}>Loading feed...</Text>
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//       style={styles.container}
//     >
//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item._id}
//         renderItem={renderPost}
//         contentContainerStyle={{ paddingBottom: 80 }}
//       />
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFA500",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   postContainer: {
//     backgroundColor: "white",
//     margin: 10,
//     borderRadius: 10,
//     padding: 10,
//     elevation: 3,
//   },
//   postHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   profilePic: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   username: {
//     fontWeight: "700",
//     fontSize: 16,
//   },
//   media: {
//     width: "100%",
//     height: 250,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   likeButton: {
//     backgroundColor: "#007bff",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },
//   commentButton: {
//     backgroundColor: "#28a745",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },
//   actionText: {
//     color: "white",
//     fontWeight: "600",
//   },
//   commentBox: {
//     marginTop: 10,
//   },
//   commentInput: {
//     borderWidth: 1,
//     borderColor: "#007bff",
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//     backgroundColor: "white",
//   },
//   postCommentButton: {
//     backgroundColor: "#007bff",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   postCommentText: {
//     color: "white",
//     fontWeight: "700",
//   },
//   commentsList: {
//     marginTop: 10,
//   },
//   commentItem: {
//     flexDirection: "row",
//     marginBottom: 5,
//   },
//   commentAuthor: {
//     fontWeight: "bold",
//     marginRight: 5,
//   },
//   commentText: {
//     flexShrink: 1,
//   },
// });





import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Video } from "expo-av";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentBoxOpen, setCommentBoxOpen] = useState({});
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUserId = await AsyncStorage.getItem("UserId");

        if (!storedToken || !storedUserId) {
          Alert.alert("Authentication Error", "Please login again.");
          return;
        }

        setToken(storedToken);
        setUserId(storedUserId);
        setAuthReady(true);
      } catch (e) {
        console.log("Auth error:", e);
        Alert.alert("Auth Error", "Could not read token.");
      }
    };
    loadAuth();
  }, []);

  useEffect(() => {
    if (authReady) {
      fetchPosts();
    }
  }, [authReady]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://backend-k.vercel.app/post/mango/getall"
      );

      // Debug log: print posts and comment usernames
      console.log("Fetched posts:", data);

      data.forEach(post => {
        console.log(`Post ID: ${post._id}, User: ${post.userId?.username}`);
        if (post.comments && post.comments.length > 0) {
          post.comments.forEach(comment => {
            console.log(
              `  Comment ID: ${comment._id}, Text: "${comment.CommentText}", User: ${comment.userId?.username || "No username"}`
            );
          });
        } else {
          console.log("  No comments");
        }
      });

      setPosts(data);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    if (!token) return Alert.alert("Error", "User not authenticated");

    try {
      await axios.post(
        `https://backend-k.vercel.app/post/like/${postId}`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      fetchPosts();
    } catch (err) {
      Alert.alert("Error", "Failed to like post");
    }
  };

  const handleComment = async (postId) => {
    if (!token || !userId)
      return Alert.alert("Error", "User not authenticated");
    if (!commentText.trim())
      return Alert.alert("Error", "Comment cannot be empty");

    try {
      await axios.post(
        `https://backend-k.vercel.app/post/comment/${postId}`,
        { CommentText: commentText, userId: userId },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setCommentText("");
      setCommentBoxOpen((prev) => ({ ...prev, [postId]: false }));
      fetchPosts();
    } catch (err) {
      Alert.alert("Error", "Failed to post comment");
    }
  };

  const toggleCommentBox = (postId) => {
    setCommentBoxOpen((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const renderPost = ({ item: post }) => {
    const isVideo = post.media?.endsWith(".mp4");

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Image
            source={{
              uri: post?.userId?.profilePic || "https://www.fondpeace.com/og-image.jpg",
            }}
            style={styles.profilePic}
          />
          <Text style={styles.username}>
            {post?.userId?.username || "Unknown User"}
          </Text>
        </View>

        {post.media ? (
          isVideo ? (
            <Video
              source={{ uri: post.media }}
              style={styles.media}
              resizeMode="contain"
              useNativeControls
              shouldPlay={false}
              isLooping={false}
            />
          ) : (
            <Image source={{ uri: post.media }} style={styles.media} />
          )
        ) : null}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => handleLikePost(post._id)}
          >
            <Text style={styles.actionText}>
              Like ({post.likes?.length || 0})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.commentButton}
            onPress={() => toggleCommentBox(post._id)}
          >
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
        </View>

        {commentBoxOpen[post._id] && (
          <View style={styles.commentBox}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              style={styles.postCommentButton}
              onPress={() => handleComment(post._id)}
            >
              <Text style={styles.postCommentText}>Post Comment</Text>
            </TouchableOpacity>

            {post.comments?.length > 0 && (
              <View style={styles.commentsList}>
                {post.comments.map((comment) => (
                  <View key={comment._id} style={styles.commentItem}>
                    <Text style={styles.commentAuthor}>
                      {comment.userId?.username || "Fond Peace" }:
                    </Text>
                    <Text style={styles.commentText}>{comment.CommentText}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  if (loading || !authReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Loading feed...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderPost}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFA500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postContainer: {
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "700",
    fontSize: 16,
  },
  media: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  commentButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionText: {
    color: "white",
    fontWeight: "600",
  },
  commentBox: {
    marginTop: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  postCommentButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  postCommentText: {
    color: "white",
    fontWeight: "700",
  },
  commentsList: {
    marginTop: 10,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  commentAuthor: {
    fontWeight: "bold",
    marginRight: 5,
  },
  commentText: {
    flexShrink: 1,
  },
});
