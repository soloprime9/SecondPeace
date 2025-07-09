// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';

// // Custom function to decode JWT
// // Using atob for base64 decoding, which is available in React Native's JS runtime
// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) {
//     throw new Error('Invalid token format');
//   }
//   const payload = parts[1];
//   // Replace base64url characters with base64 characters
//   const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//   // Decode base64 and then parse JSON
//   const decoded = JSON.parse(atob(base64));
//   return decoded;
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOwnProfile = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/');
//         return;
//       }

//       try {
//         const decoded = decodeJWT(token);
//         const loggedUserId = decoded.UserId;

//         const res = await axios.get(
//           `https://backend-k.vercel.app/user/profile/${loggedUserId}`,
//           {
//             headers: { 'x-auth-token': token },
//           }
//         );

//         setProfile(res.data.Profile);
//       } catch (err) {
//         console.error('Error fetching profile:', err); // Log the error for debugging
//         setError(err);
//         // You might want to uncomment this line if you want to redirect to login on error
//         // router.replace('/login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwnProfile();
//   }, []); // Empty dependency array means this effect runs once after the initial render

//   // Logout handler
//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             router.replace('/login');
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   if (error || !profile) { // Added !profile check in case profile is null after loading
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error ? error.message : 'Could not load profile. Please try again.'}
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/')}>
//           <Text style={styles.retryButtonText}>Go to Home</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { user, posts } = profile;

//   return (
//     <ScrollView style={styles.container}>
//       <Image
//         source={{ uri: user.coverPicture || 'https://fondpeace.com/og-image.jpg' }}
//         style={styles.banner}
//       />
//       <View style={styles.profileHeader}>
//         <Image
//           source={{ uri: user.profilePicture || 'https://fondpeace.com/og-image.jpg' }}
//           style={styles.avatar}
//         />
//         <Text style={styles.username}>{user.username}</Text>
//         {/* ENSURE NO STRAY NEWLINES/SPACES BETWEEN THESE TEXT COMPONENTS */}
//         <Text>{user.Followers?.length || 0} Followers</Text>
//         <Text>{user.Followings?.length || 0} Following</Text>

//         <TouchableOpacity style={styles.editBtn}>
//           <Text style={styles.editText}>Edit Profile</Text>
//         </TouchableOpacity>

//         {/* Logout Button */}
//         <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.bio}>{user.bio || 'No bio added'}</Text>
//       <View style={styles.postsGrid}>
//         {posts && posts.length > 0 ? (
//           posts.map((post, index) => (
//             <Image
//               key={index}
//               source={{ uri: post.media }}
//               style={styles.postImage}
//               resizeMode="cover"
//             />
//           ))
//         ) : (
//           // ENSURE NO STRAY NEWLINES/SPACES AROUND THIS TEXT COMPONENT
//           <Text style={styles.noPostsText}>No posts yet.</Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 10, backgroundColor: '#f0f2f5' }, // Added background color
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginBottom: 10 },
//   banner: { width: '100%', height: 120, borderRadius: 8, marginBottom: 10 }, // Increased height, added border radius
//   profileHeader: {
//     alignItems: 'center',
//     marginVertical: 12,
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   avatar: {
//     width: 100, // Increased size
//     height: 100, // Increased size
//     borderRadius: 50, // Half of width/height for perfect circle
//     marginBottom: 10,
//     borderWidth: 3, // Added border
//     borderColor: '#16a34a', // Border color
//   },
//   username: { fontSize: 24, fontWeight: 'bold', marginBottom: 5, color: '#333' },
//   editBtn: {
//     marginTop: 15,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#16a34a',
//     borderRadius: 25, // More rounded
//     width: 150, // Wider button
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   editText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

//   logoutBtn: {
//     marginTop: 15,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#dc2626', // red
//     borderRadius: 25, // More rounded
//     width: 150, // Wider button
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

//   bio: {
//     marginVertical: 15,
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#555',
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   postsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'flex-start', // Changed to flex-start for consistent left alignment
//     gap: 8, // Increased gap
//     marginTop: 10,
//   },
//   postImage: {
//     width: (Dimensions.get('window').width - 36) / 3, // Adjusted width for 3 items with 8 gap and 10 padding each side
//     height: 120,
//     borderRadius: 8, // Added border radius
//     marginBottom: 8, // Added bottom margin
//     // Optional: Add shadow for images
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   noPostsText: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//     color: '#777',
//     width: '100%', // Ensure text takes full width
//   },
//   retryButton: {
//     marginTop: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#007bff',
//     borderRadius: 25,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });




// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// // JWT decode using built-in atob
// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) throw new Error('Invalid token');
//   const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
//   return JSON.parse(atob(base64));
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/');
//         return;
//       }
//       try {
//         const decoded = decodeJWT(token);
//         const res = await axios.get(
//           `https://backend-k.vercel.app/user/profile/${decoded.UserId}`,
//           { headers: { 'x-auth-token': token } }
//         );
//         setProfile(res.data.Profile);
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleLogout = () => {
//     Alert.alert(
//       'Logout',
//       'Do you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             router.replace('/login');
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#16a34a" />
//       </View>
//     );
//   }

//   if (error || !profile) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error ? error.message : 'Failed to load profile.'}
//         </Text>
//         <TouchableOpacity
//           style={styles.retryButton}
//           onPress={() => router.replace('/')}
//         >
//           <Text style={styles.retryButtonText}>Go Home</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { user, posts } = profile;

//   return (
//     <ScrollView style={styles.container}>
//       <Image
//         source={{
//           uri: user.coverPicture || 'https://fondpeace.com/og-image.jpg',
//         }}
//         style={styles.banner}
//       />
//       <View style={styles.profileCard}>
//         <Image
//           source={{
//             uri: user.profilePicture || 'https://fondpeace.com/og-image.jpg',
//           }}
//           style={styles.avatar}
//         />
//         <Text style={styles.username}>{user.username}</Text>
//         <Text style={styles.subText}>
//           {user.Followers?.length || 0} Followers •{' '}
//           {user.Followings?.length || 0} Following
//         </Text>
//         <View style={styles.buttonRow}>
//           <TouchableOpacity style={styles.actionBtn}>
//             <Text style={styles.actionBtnText}>Edit Profile</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       <Text style={styles.bio}>{user.bio || 'No bio yet.'}</Text>
//       <View style={styles.postsGrid}>
//         {posts && posts.length > 0 ? (
//           posts.map((p, i) => (
//             <Image
//               key={i}
//               source={{ uri: p.media }}
//               style={styles.postImage}
//               resizeMode="cover"
//             />
//           ))
//         ) : (
//           <Text style={styles.noPostsText}>No posts yet.</Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f6fa' },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   banner: { width: '100%', height: 150 },
//   profileCard: {
//     alignItems: 'center',
//     marginTop: -40,
//     padding: 20,
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     borderRadius: 12,
//     shadowColor: '#0002',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: '#fff',
//     marginBottom: 10,
//   },
//   username: { fontSize: 22, fontWeight: 'bold', color: '#333' },
//   subText: { fontSize: 14, color: '#666', marginBottom: 12 },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '80%',
//     marginTop: 10,
//   },
//   actionBtn: {
//     flex: 1,
//     marginRight: 8,
//     backgroundColor: '#16a34a',
//     paddingVertical: 10,
//     borderRadius: 25,
//   },
//   actionBtnText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
//   logoutBtn: {
//     flex: 1,
//     backgroundColor: '#dc2626',
//     paddingVertical: 10,
//     borderRadius: 25,
//   },
//   logoutText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
//   bio: {
//     backgroundColor: '#fff',
//     margin: 16,
//     padding: 15,
//     borderRadius: 12,
//     fontSize: 16,
//     color: '#555',
//     shadowColor: '#0002',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   postsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     margin: 8,
//     justifyContent: 'space-between',
//   },
//   postImage: {
//     width: (Dimensions.get('window').width - 48) / 3,
//     height: 110,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   noPostsText: {
//     width: '100%',
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#777',
//     fontSize: 16,
//   },
//   errorText: { fontSize: 18, color: '#dc2626', textAlign: 'center' },
//   retryButton: {
//     marginTop: 10,
//     backgroundColor: '#007bff',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   retryButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
// });





// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// // Custom JWT decode (same logic)
// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) throw new Error('Invalid token');
//   const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
//   return JSON.parse(atob(base64));
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetch = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) return router.replace('/');
//       try {
//         const { UserId } = decodeJWT(token);
//         const res = await axios.get(
//           `https://backend-k.vercel.app/user/profile/${UserId}`,
//           { headers: { 'x-auth-token': token } }
//         );
//         setProfile(res.data.Profile);
//       } catch (e) {
//         console.error(e);
//         setError(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetch();
//   }, []);

//   const handleLogout = () => {
//     Alert.alert('Logout', 'Are you sure?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Logout', style: 'destructive',
//         onPress: async () => {
//           await AsyncStorage.removeItem('token');
//           router.replace('/login');
//         },
//       },
//     ]);
//   };

//   if (loading)
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0066cc" />
//       </View>
//     );

//   if (error || !profile)
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error?.message || 'Failed to load profile.'}
//         </Text>
//         <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
//           <Text style={styles.buttonText}>Go Home</Text>
//         </TouchableOpacity>
//       </View>
//     );

//   const { user, posts } = profile;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.header}>
//         <Image
//           source={{ uri: user.coverPicture || 'https://fondpeace.com/og-image.jpg' }}
//           style={styles.cover}
//         />
//         <Image
//           source={{ uri: user.profilePicture || 'https://fondpeace.com/og-image.jpg' }}
//           style={styles.avatar}
//         />
//       </View>

//       <Text style={styles.name}>{user.username}</Text>
//       <View style={styles.stats}>
//         <View style={styles.statBox}>
//           <Text style={styles.statNumber}>{posts?.length || 0}</Text>
//           <Text style={styles.statLabel}>Posts</Text>
//         </View>
//         <View style={styles.statBox}>
//           <Text style={styles.statNumber}>{user.Followers?.length || 0}</Text>
//           <Text style={styles.statLabel}>Followers</Text>
//         </View>
//         <View style={styles.statBox}>
//           <Text style={styles.statNumber}>{user.Followings?.length || 0}</Text>
//           <Text style={styles.statLabel}>Following</Text>
//         </View>
//       </View>

//       <Text style={styles.bio}>{user.bio || 'No bio yet.'}</Text>

//       <View style={styles.buttonRow}>
//         <TouchableOpacity style={[styles.smallButton, styles.editBtn]}>
//           <Text style={styles.smallButtonText}>Edit Profile</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.smallButton, styles.logoutBtn]} onPress={handleLogout}>
//           <Text style={styles.smallButtonText}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.postsGrid}>
//         {posts && posts.length > 0 ? (
//           posts.map((p, i) => (
//             <Image key={i} source={{ uri: p.media }} style={styles.postImage} />
//           ))
//         ) : (
//           <Text style={styles.noPosts}>No posts yet.</Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingBottom: 30,
//     backgroundColor: '#fafafa',
//   },
//   center: {
//     flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
//     backgroundColor: '#fafafa',
//   },
//   errorText: { color: '#cc0000', fontSize: 18, marginBottom: 12, textAlign: 'center' },
//   button: {
//     backgroundColor: '#0066cc', paddingVertical: 12, paddingHorizontal: 24,
//     borderRadius: 8,
//   },
//   buttonText: { color: '#fff', fontSize: 16 },

//   header: { position: 'relative' },
//   cover: { width: '100%', height: 160, backgroundColor: '#ddd' },
//   avatar: {
//     width: 120, height: 120, borderRadius: 60,
//     borderWidth: 4, borderColor: '#fff',
//     position: 'absolute', bottom: -60, left: (Dimensions.get('window').width / 2) - 60,
//   },

//   name: {
//     marginTop: 70, fontSize: 24, fontWeight: 'bold',
//     textAlign: 'center', color: '#333',
//   },
//   stats: {
//     flexDirection: 'row', justifyContent: 'space-around',
//     marginTop: 20, paddingHorizontal: 40,
//   },
//   statBox: { alignItems: 'center' },
//   statNumber: { fontSize: 20, fontWeight: '600', color: '#333' },
//   statLabel: { fontSize: 14, color: '#888', marginTop: 4 },

//   bio: {
//     margin: 20, fontSize: 16, color: '#555',
//     textAlign: 'center', paddingHorizontal: 10,
//   },

//   buttonRow: {
//     flexDirection: 'row', justifyContent: 'center', marginBottom: 20,
//   },
//   smallButton: {
//     paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginHorizontal: 8,
//   },
//   editBtn: { backgroundColor: '#28a745' },
//   logoutBtn: { backgroundColor: '#dc3545' },
//   smallButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },

//   postsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingHorizontal: 10,
//     justifyContent: 'space-between',
//   },
//   postImage: {
//     width: (Dimensions.get('window').width - 40) / 3,
//     height: 100,
//     borderRadius: 8,
//     marginBottom: 10,
//     backgroundColor: '#eee',
//   },
//   noPosts: { textAlign: 'center', color: '#888', fontSize: 16, marginTop: 30 },
// });






// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) {
//     throw new Error('Invalid token format');
//   }
//   const payload = parts[1];
//   const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//   const decoded = JSON.parse(atob(base64));
//   return decoded;
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/');
//         return;
//       }

//       try {
//         const decoded = decodeJWT(token);
//         const userId = decoded.UserId;
//         const response = await axios.get(`https://backend-k.vercel.app/user/profile/${userId}`, {
//           headers: { 'x-auth-token': token },
//         });
//         setProfile(response.data.Profile);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             router.replace('/login');
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#6200ea" />
//       </View>
//     );
//   }

//   if (error || !profile) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error ? error.message : 'Could not load profile. Please try again.'}
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/')}>
//           <Text style={styles.retryButtonText}>Go to Home</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { user, posts } = profile;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Image source={{ uri: user.coverPicture || 'https://fondpeace.com/og-image.jpg' }} style={styles.coverImage} />
//       <View style={styles.profileHeader}>
//         <Image source={{ uri: user.profilePicture || 'https://fondpeace.com/og-image.jpg' }} style={styles.avatar} />
//         <Text style={styles.username}>{user.username}</Text>
//         <View style={styles.stats}>
//           <Text style={styles.statText}>{user.Followers?.length || 0} Followers</Text>
//           <Text style={styles.statText}>{user.Followings?.length || 0} Following</Text>
//         </View>
//         <TouchableOpacity style={styles.editButton}>
//           <Text style={styles.editButtonText}>Edit Profile</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Text style={styles.logoutButtonText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//       <Text style={styles.bio}>{user.bio || 'No bio added'}</Text>
//       <View style={styles.postsGrid}>
//         {posts && posts.length > 0 ? (
//           posts.map((post, index) => (
//             <Image key={index} source={{ uri: post.media }} style={styles.postImage} />
//           ))
//         ) : (
//           <Text style={styles.noPostsText}>No posts yet.</Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#f4f4f9',
//     paddingBottom: 20,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   coverImage: {
//     width: '100%',
//     height: 200,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     marginBottom: -20,
//   },
//   profileHeader: {
//     alignItems: 'center',
//     marginTop: -40,
//     marginBottom: 20,
//     paddingHorizontal: 20,
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 4,
//     borderColor: '#fff',
//     marginBottom: 10,
//   },
//   username: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   stats: {
//     flexDirection: 'row',
//     marginBottom: 15,
//   },
//   statText: {
//     fontSize: 14,
//     color: '#777',
//     marginHorizontal: 10,
//   },
//   editButton: {
//     backgroundColor: '#6200ea',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     marginBottom: 10,
//   },
//   editButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   logoutButton: {
//     backgroundColor: '#e53935',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   logoutButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   bio: {
//     fontSize: 16,
//     color: '#555',
//     textAlign: 'center',
//     marginHorizontal: 20,
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   postsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   postImage: {
//     width: (Dimensions.get('window').width - 40) / 3,
//     height: 120,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   noPostsText: {
//     textAlign: 'center',
//     width: '100%',
//     fontSize: 16,
//     color: '#777',
//     marginTop: 20,
//   },
//   retryButton: {
//     marginTop: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#6200ea',
//     borderRadius: 25,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   errorText: {
//     fontSize: 18,
//     color: '#e53935',
//     marginBottom: 10,
//   },
// });






// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) {
//     throw new Error('Invalid token format');
//   }
//   const payload = parts[1];
//   const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//   const decoded = JSON.parse(atob(base64));
//   return decoded;
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/login');
//         return;
//       }

//       try {
//         const decoded = decodeJWT(token);
//         const userId = decoded.UserId;
//         const response = await axios.get(`https://backend-k.vercel.app/user/profile/${userId}`, {
//           headers: { 'x-auth-token': token },
//         });
//         setProfile(response.data.Profile);
//       } catch (err) {
//         setError(err);
//         router.replace("/login")
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             router.replace('/login');
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#6200ea" />
//       </View>
//     );
//   }

//   if (error || !profile) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error ? error.message : 'Could not load profile. Please try again.'}
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/')}>
//           <Text style={styles.retryButtonText}>Go to Home</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { user, posts } = profile;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.profileHeader}>
//         <Image source={{ uri: user.profilePicture || 'https://fondpeace.com/og-image.jpg' }} style={styles.avatar} />
//         <Text style={styles.username}>{user.username}</Text>
//         <View style={styles.stats}>
//           <Text style={styles.statText}>{user.Followers?.length || 0} Followers</Text>
//           <Text style={styles.statText}>{user.Followings?.length || 0} Following</Text>
//         </View>
//         <TouchableOpacity style={styles.editButton}>
//           <Text style={styles.editButtonText}>Edit Profile</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Text style={styles.logoutButtonText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//       <Text style={styles.bio}>{user.bio || 'No bio added'}</Text>
//       <View style={styles.postsGrid}>
//         {posts && posts.length > 0 ? (
//           posts.map((post, index) => (
//             <Image key={index} source={{ uri: post.media }} style={styles.postImage} />
//           ))
//         ) : (
//           <Text style={styles.noPostsText}>No posts yet.</Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#f4f4f9',
//     paddingBottom: 20,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileHeader: {
//     alignItems: 'center',
//     marginTop: 20,
//     marginBottom: 20,
//     paddingHorizontal: 20,
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 4,
//     borderColor: '#fff',
//     marginBottom: 10,
//   },
//   username: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   stats: {
//     flexDirection: 'row',
//     marginBottom: 15,
//   },
//   statText: {
//     fontSize: 14,
//     color: '#777',
//     marginHorizontal: 10,
//   },
//   editButton: {
//     backgroundColor: '#6200ea',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     marginBottom: 10,
//   },
//   editButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   logoutButton: {
//     backgroundColor: '#e53935',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   logoutButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   bio: {
//     fontSize: 16,
//     color: '#555',
//     textAlign: 'center',
//     marginHorizontal: 20,
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   postsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   postImage: {
//     width: '48%',
//     height: 120,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   noPostsText: {
//     textAlign: 'center',
//     width: '100%',
//     fontSize: 16,
//     color: '#777',
//     marginTop: 20,
//   },
//   retryButton: {
//     marginTop: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#6200ea',
//     borderRadius: 25,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   errorText: {
//     fontSize: 18,
//     color: '#e53935',
//     marginBottom: 10,
//   },
// });






// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// // Custom function to decode JWT (NO CHANGES HERE)
// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) {
//     throw new Error('Invalid token format');
//   }
//   const payload = parts[1];
//   const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//   const decoded = JSON.parse(atob(base64));
//   return decoded;
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOwnProfile = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/');
//         return;
//       }

//       try {
//         const decoded = decodeJWT(token);
//         const loggedUserId = decoded.UserId;

//         const res = await axios.get(
//           `https://backend-k.vercel.app/user/profile/${loggedUserId}`,
//           {
//             headers: { 'x-auth-token': token },
//           }
//         );

//         setProfile(res.data.Profile);
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//         setError(err);
//         // router.replace('/login'); // Keep commented as per original
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwnProfile();
//   }, []);

//   // Logout handler (NO CHANGES HERE)
//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             router.replace('/login');
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   // Loading and Error States (SLIGHT UI IMPROVEMENTS)
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#4CAF50" /> {/* Changed color */}
//         <Text style={styles.loadingText}>Loading profile...</Text> {/* Added loading text */}
//       </View>
//     );
//   }

//   if (error || !profile) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error ? error.message : 'Could not load profile. Please try again.'}
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/')}>
//           <Text style={styles.retryButtonText}>Go to Home</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { user, posts } = profile;

//   return (
//     <ScrollView style={styles.container}>
//       {/* Banner/Cover Picture */}
//       <Image
//         source={{ uri: user.coverPicture || 'https://fondpeace.com/og-image.jpg' }}
//         style={styles.banner}
//         resizeMode="cover"
//       />

//       <View style={styles.profileContentWrapper}>
//         {/* Profile Header */}
//         <View style={styles.profileHeader}>
//           <Image
//             source={{ uri: user.profilePicture || 'https://fondpeace.com/og-image.jpg' }}
//             style={styles.avatar}
//           />
//           <Text style={styles.username}>{user.username}</Text>

//           {/* Follower/Following Counts */}
//           <View style={styles.followStatsContainer}>
//             <Text style={styles.followStatText}>
//               <Text style={styles.followStatNumber}>{user.Followers?.length || 0}</Text> Followers
//             </Text>
//             <Text style={styles.followStatText}>
//               <Text style={styles.followStatNumber}>{user.Followings?.length || 0}</Text> Following
//             </Text>
//           </View>

//           {/* Action Buttons */}
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.editBtn}>
//               <Text style={styles.editText}>Edit Profile</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//               <Text style={styles.logoutText}>Logout</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Bio Section */}
//         <View style={styles.bioContainer}>
//           <Text style={styles.bioLabel}>About Me</Text>
//           <Text style={styles.bioText}>{user.bio || 'No bio added yet. Tell us something about yourself!'}</Text>
//         </View>

//         {/* Posts Grid */}
//         <View style={styles.postsSection}>
//           <Text style={styles.postsSectionTitle}>My Posts</Text>
//           <View style={styles.postsGrid}>
//             {posts && posts.length > 0 ? (
//               posts.map((post, index) => (
//                 <TouchableOpacity // Made post images touchable
//                   key={index}
//                   style={styles.postImageWrapper}
//                   onPress={() => Alert.alert('Post Clicked', `You clicked post: ${post.media}`)} // Example action
//                 >
//                   <Image
//                     source={{ uri: post.media }}
//                     style={styles.postImage}
//                     resizeMode="cover"
//                   />
//                 </TouchableOpacity>
//               ))
//             ) : (
//               <Text style={styles.noPostsText}>No posts to display yet. Share something!</Text>
//             )}
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F0F2F5', // Light gray background
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F0F2F5',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#555',
//   },
//   errorText: {
//     fontSize: 18,
//     color: '#D32F2F', // Darker red for error
//     textAlign: 'center',
//     marginBottom: 20,
//     paddingHorizontal: 20,
//   },
//   retryButton: {
//     marginTop: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     backgroundColor: '#2196F3', // Blue for action
//     borderRadius: 30,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   retryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   banner: {
//     width: '100%',
//     height: 180, // Taller banner for more impact
//     borderBottomLeftRadius: 15, // Rounded bottom corners
//     borderBottomRightRadius: 15,
//     overflow: 'hidden', // Ensures border radius works with image
//     marginBottom: -60, // Pull avatar up over banner
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 8,
//   },
//   profileContentWrapper: {
//     paddingHorizontal: 15, // Overall padding for content
//   },
//   profileHeader: {
//     alignItems: 'center',
//     marginTop: 0, // Adjusted by banner's negative margin
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     paddingTop: 80, // Space for avatar to overlap
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.25,
//     shadowRadius: 10,
//     elevation: 10,
//     marginBottom: 20, // Space before next section
//   },
//   avatar: {
//     width: 120, // Larger avatar
//     height: 120,
//     borderRadius: 60, // Perfect circle
//     borderWidth: 5, // Thicker border
//     borderColor: '#FFFFFF', // White border to stand out
//     position: 'absolute', // Position avatar over banner
//     top: -60, // Half of avatar height to center on banner bottom
//     zIndex: 1, // Ensure avatar is above other elements
//   },
//   username: {
//     fontSize: 28, // Larger font size
//     fontWeight: '800', // Bolder
//     color: '#2C3E50', // Darker text
//     marginTop: 15, // Space after avatar
//     marginBottom: 5,
//   },
//   followStatsContainer: {
//     flexDirection: 'row',
//     marginTop: 10,
//     marginBottom: 15,
//     width: '80%',
//     justifyContent: 'space-around', // Distribute stats evenly
//   },
//   followStatText: {
//     fontSize: 16,
//     color: '#7F8C8D', // Muted text color
//     fontWeight: '500',
//   },
//   followStatNumber: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#34495E', // Stronger number color
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: 20,
//   },
//   editBtn: {
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     backgroundColor: '#4CAF50', // Green for positive action
//     borderRadius: 30,
//     alignItems: 'center',
//     flex: 1, // Take up available space
//     marginHorizontal: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   editText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   logoutBtn: {
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     backgroundColor: '#F44336', // Red for destructive action
//     borderRadius: 30,
//     alignItems: 'center',
//     flex: 1,
//     marginHorizontal: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   logoutText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   bioContainer: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//     marginBottom: 20,
//   },
//   bioLabel: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#34495E',
//     marginBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ECEFF1',
//     paddingBottom: 5,
//   },
//   bioText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#555',
//     textAlign: 'left', // Align bio text left
//   },
//   postsSection: {
//     backgroundColor: '#FFFFFF',
//     padding: 15,
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//     marginBottom: 20,
//   },
//   postsSectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#34495E',
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ECEFF1',
//     paddingBottom: 5,
//   },
//   postsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'flex-start', // Start from left
//     marginHorizontal: -4, // Counteract internal post image margin for full width
//   },
//   postImageWrapper: {
//     width: (Dimensions.get('window').width / 3) - 16, // Adjusted width for 3 columns with padding/margin
//     height: (Dimensions.get('window').width / 3) - 16, // Make it square
//     margin: 4, // Space around each image
//     borderRadius: 8,
//     overflow: 'hidden', // Ensure image corners are rounded
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   postImage: {
//     width: '100%',
//     height: '100%',
//   },
//   noPostsText: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//     color: '#777',
//     width: '100%',
//     padding: 10,
//   },
// });








// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// // Constants for consistent theming
// const Colors = {
//   primary: '#2E8B57', // Sea Green - a fresh, natural accent
//   secondary: '#FF6347', // Tomato - a warm, inviting accent
//   background: '#F0F2F5', // Light grey
//   cardBackground: '#FFFFFF', // White
//   textPrimary: '#2C3E50', // Dark Slate Gray
//   textSecondary: '#7F8C8D', // Muted Grey
//   border: '#E0E0E0', // Light border grey
//   shadow: 'rgba(0,0,0,0.08)', // Subtle shadow
// };

// const Spacing = {
//   s: 8,
//   m: 16,
//   l: 24,
//   xl: 32,
// };

// const BorderRadius = {
//   m: 12,
//   l: 20,
//   xl: 30, // For buttons
//   xxl: 50, // For avatar
// };

// // Custom function to decode JWT (NO CHANGES HERE)
// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) {
//     throw new Error('Invalid token format');
//   }
//   const payload = parts[1];
//   const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//   const decoded = JSON.parse(atob(base64));
//   return decoded;
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOwnProfile = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/');
//         return;
//       }

//       try {
//         const decoded = decodeJWT(token);
//         const loggedUserId = decoded.UserId;

//         const res = await axios.get(
//           `https://backend-k.vercel.app/user/profile/${loggedUserId}`,
//           {
//             headers: { 'x-auth-token': token },
//           }
//         );

//         setProfile(res.data.Profile);
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwnProfile();
//   }, []);

//   // Logout handler (NO CHANGES HERE)
//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             router.replace('/login');
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   // Loading and Error States (UI updated)
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Just a moment...</Text>
//       </View>
//     );
//   }

//   if (error || !profile) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error ? error.message : 'Oops! Failed to load profile. Please try again.'}
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/')}>
//           <Text style={styles.retryButtonText}>Go Back Home</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { user, posts } = profile;

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header Section (Banner + Avatar) */}
//       <View style={styles.headerContainer}>
//         <Image
//           source={{ uri: user.coverPicture || 'https://fondpeace.com/og-image.jpg' }}
//           style={styles.banner}
//           resizeMode="cover"
//         />
//         <View style={styles.avatarContainer}>
//           <Image
//             source={{ uri: user.profilePicture || 'https://fondpeace.com/og-image.jpg' }}
//             style={styles.avatar}
//           />
//         </View>
//       </View>

//       {/* Profile Details Card */}
//       <View style={styles.profileDetailsCard}>
//         <Text style={styles.username}>{user.username}</Text>

//         <View style={styles.followStatsContainer}>
//           <View style={styles.followStatItem}>
//             <Text style={styles.followStatNumber}>{user.Followers?.length || 0}</Text>
//             <Text style={styles.followStatLabel}>Followers</Text>
//           </View>
//           <View style={styles.followStatSeparator} />
//           <View style={styles.followStatItem}>
//             <Text style={styles.followStatNumber}>{user.Followings?.length || 0}</Text>
//             <Text style={styles.followStatLabel}>Following</Text>
//           </View>
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
//             <Text style={styles.actionButtonText}>Edit Profile</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout} activeOpacity={0.8}>
//             <Text style={styles.actionButtonText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Bio Section */}
//       <View style={styles.infoCard}>
//         <Text style={styles.cardTitle}>About Me</Text>
//         <Text style={styles.bioText}>{user.bio || 'No bio added yet. Share a bit about yourself!'}</Text>
//       </View>

//       {/* Posts Grid Section */}
//       <View style={styles.infoCard}>
//         <Text style={styles.cardTitle}>My Posts</Text>
//         <View style={styles.postsGrid}>
//           {posts && posts.length > 0 ? (
//             posts.map((post, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.postImageWrapper}
//                 onPress={() => Alert.alert('Post View', `Viewing post by ${user.username}`)}
//                 activeOpacity={0.7}
//               >
//                 <Image
//                   source={{ uri: post.media }}
//                   style={styles.postImage}
//                   resizeMode="cover"
//                 />
//               </TouchableOpacity>
//             ))
//           ) : (
//             <Text style={styles.noPostsText}>Looks like you haven't posted anything yet. Start sharing!</Text>
//           )}
//         </View>
//       </View>
//       <View style={{ height: Spacing.xl }} />{/* Extra space at bottom */}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.background,
//   },
//   loadingText: {
//     marginTop: Spacing.s,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     fontFamily: 'System' // Or a custom modern font if loaded
//   },
//   errorText: {
//     fontSize: 18,
//     color: Colors.secondary, // Red for error
//     textAlign: 'center',
//     marginBottom: Spacing.m,
//     paddingHorizontal: Spacing.l,
//     fontFamily: 'System'
//   },
//   retryButton: {
//     paddingVertical: Spacing.s * 1.5,
//     paddingHorizontal: Spacing.xl,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.xl,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   retryButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: 'bold',
//     fontFamily: 'System'
//   },

//   // Header Section
//   headerContainer: {
//     width: '100%',
//     height: 250, // Taller header for more visual impact
//     marginBottom: Spacing.l,
//     position: 'relative',
//   },
//   banner: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//   },
//   avatarContainer: {
//     position: 'absolute',
//     bottom: -Spacing.m, // Position slightly below banner to overlap
//     left: '50%',
//     transform: [{ translateX: -75 }], // Center horizontally (half of avatar width)
//     width: 150,
//     height: 150,
//     borderRadius: BorderRadius.xxl,
//     backgroundColor: Colors.cardBackground, // White background for avatar border effect
//     padding: Spacing.s / 2, // Creates a subtle white border
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.35,
//     shadowRadius: 10,
//     elevation: 12,
//     zIndex: 1, // Ensure avatar is above other elements
//   },
//   avatar: {
//     width: '100%',
//     height: '100%',
//     borderRadius: BorderRadius.xxl,
//     borderWidth: 3, // Inner border to differentiate from padding
//     borderColor: Colors.primary, // Primary accent color for avatar border
//   },

//   // Profile Details Card
//   profileDetailsCard: {
//     marginHorizontal: Spacing.m,
//     marginTop: Spacing.m, // Space from avatar
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.l,
//     padding: Spacing.l,
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//     marginBottom: Spacing.m,
//   },
//   username: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//     marginBottom: Spacing.m,
//     fontFamily: 'System'
//   },
//   followStatsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: Spacing.l,
//   },
//   followStatItem: {
//     alignItems: 'center',
//     paddingHorizontal: Spacing.m,
//   },
//   followStatNumber: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.primary, // Accent color for numbers
//     fontFamily: 'System'
//   },
//   followStatLabel: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     fontFamily: 'System'
//   },
//   followStatSeparator: {
//     width: 1,
//     height: 30, // Adjust height as needed
//     backgroundColor: Colors.border,
//     marginHorizontal: Spacing.s,
//   },

//   // Action Buttons
//   buttonContainer: {
//     flexDirection: 'row',
//     width: '100%',
//     justifyContent: 'space-around',
//   },
//   actionButton: {
//     flex: 1,
//     marginHorizontal: Spacing.s,
//     paddingVertical: Spacing.s * 1.5,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.xl,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   logoutButton: {
//     backgroundColor: Colors.secondary, // Red for logout
//   },
//   actionButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: 'bold',
//     fontFamily: 'System'
//   },

//   // Info Cards (Bio and Posts)
//   infoCard: {
//     marginHorizontal: Spacing.m,
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.l,
//     padding: Spacing.l,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//     marginBottom: Spacing.m,
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//     marginBottom: Spacing.m,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//     paddingBottom: Spacing.s,
//     fontFamily: 'System'
//   },
//   bioText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: Colors.textPrimary,
//     fontFamily: 'System'
//   },

//   // Posts Grid
//   postsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'flex-start',
//     marginHorizontal: -Spacing.s / 2, // Adjust for internal item margin
//   },
//   postImageWrapper: {
//     width: (Dimensions.get('window').width / 3) - (Spacing.m + Spacing.s), // Calculate for 3 columns + margins
//     height: (Dimensions.get('window').width / 3) - (Spacing.m + Spacing.s), // Square aspect ratio
//     margin: Spacing.s / 2, // Small margin around each image
//     borderRadius: BorderRadius.m - 4, // Slightly rounded image corners
//     overflow: 'hidden',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 3,
//     backgroundColor: Colors.border, // Placeholder color for loading
//   },
//   postImage: {
//     width: '100%',
//     height: '100%',
//   },
//   noPostsText: {
//     textAlign: 'center',
//     marginTop: Spacing.m,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     width: '100%',
//     paddingHorizontal: Spacing.m,
//     fontFamily: 'System'
//   },
// });








// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// // Optional: Import Feather Icons if you have expo-vector-icons installed
// // import { Feather } from '@expo/vector-icons'; 

// // Constants for consistent theming
// const Colors = {
//   primary: '#007AFF', // A vibrant blue, common in social apps
//   secondary: '#FF4500', // A strong orange for destructive actions/highlights
//   background: '#F0F2F5', // Light grey, almost off-white
//   cardBackground: '#FFFFFF', // Pure white for cards
//   textPrimary: '#1A1A1A', // Very dark grey for main text
//   textSecondary: '#666666', // Medium grey for secondary text/labels
//   border: '#EAEAEA', // Very light grey for subtle borders
//   shadow: 'rgba(0,0,0,0.08)', // Subtle shadow
//   accentGreen: '#28A745', // For edit profile / positive actions
// };

// const Spacing = {
//   xs: 4,
//   s: 8,
//   m: 16,
//   l: 24,
//   xl: 32,
//   xxl: 48,
// };

// const BorderRadius = {
//   s: 8,
//   m: 12,
//   l: 20,
//   xl: 30, // For buttons
//   xxl: 60, // For avatar
// };

// const ScreenWidth = Dimensions.get('window').width;

// // Custom function to decode JWT (NO CHANGES HERE)
// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) {
//     throw new Error('Invalid token format');
//   }
//   const payload = parts[1];
//   const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//   const decoded = JSON.parse(atob(base64));
//   return decoded;
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOwnProfile = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/');
//         return;
//       }

//       try {
//         const decoded = decodeJWT(token);
//         const loggedUserId = decoded.UserId;

//         const res = await axios.get(
//           `https://backend-k.vercel.app/user/profile/${loggedUserId}`,
//           {
//             headers: { 'x-auth-token': token },
//           }
//         );

//         setProfile(res.data.Profile);
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwnProfile();
//   }, []);

//   // Logout handler (NO CHANGES HERE)
//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             router.replace('/login');
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   // Loading and Error States (UI updated)
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Loading your profile...</Text>
//       </View>
//     );
//   }

//   if (error || !profile) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error ? error.message : 'Failed to load profile. Please check your connection.'}
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/')}>
//           <Text style={styles.retryButtonText}>Go Back Home</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { user, posts } = profile;

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header Section (Banner + Avatar) */}
//       <View style={styles.headerContainer}>
//         <Image
//           source={{ uri: user.coverPicture || 'https://fondpeace.com/og-image.jpg' }}
//           style={styles.banner}
//           resizeMode="cover"
//         />
//         <View style={styles.avatarContainer}>
//           <Image
//             source={{ uri: user.profilePicture || 'https://fondpeace.com/og-image.jpg' }}
//             style={styles.avatar}
//           />
//         </View>
//       </View>

//       {/* Profile Details Card */}
//       <View style={styles.profileDetailsCard}>
//         <Text style={styles.username}>{user.username}</Text>
//         <Text style={styles.userHandle}>@{user.username.toLowerCase().replace(/\s/g, '') || 'userhandle'}</Text> {/* Mock handle */}

//         <View style={styles.followStatsContainer}>
//           <View style={styles.followStatItem}>
//             <Text style={styles.followStatNumber}>{user.Followers?.length || 0}</Text>
//             <Text style={styles.followStatLabel}>Followers</Text>
//           </View>
//           <View style={styles.followStatSeparator} />
//           <View style={styles.followStatItem}>
//             <Text style={styles.followStatNumber}>{user.Followings?.length || 0}</Text>
//             <Text style={styles.followStatLabel}>Following</Text>
//           </View>
//         </View>

//         {/* Action Buttons & Follow */}
//         <View style={styles.buttonRow}>
//           <TouchableOpacity style={[styles.actionButton, styles.editProfileButton]} activeOpacity={0.8}>
//             {/* {Feather && <Feather name="edit-3" size={16} color={Colors.cardBackground} style={styles.buttonIcon} />} */}
//             <Text style={styles.actionButtonText}>Edit Profile</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.followButton} activeOpacity={0.8}>
//             {/* {Feather && <Feather name="user-plus" size={16} color={Colors.cardBackground} style={styles.buttonIcon} />} */}
//             <Text style={styles.followButtonText}>Follow</Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
//           {/* {Feather && <Feather name="log-out" size={16} color={Colors.cardBackground} style={styles.buttonIcon} />} */}
//           <Text style={styles.logoutButtonText}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Bio Section */}
//       <View style={styles.infoCard}>
//         <Text style={styles.cardTitle}>About Me</Text>
//         <Text style={styles.bioText}>{user.bio || 'This user has not added a bio yet. Stay tuned for more updates!'}</Text>
//       </View>

//       {/* Highlight/Story Reel (Conceptual) */}
//       <View style={styles.infoCard}>
//         <Text style={styles.cardTitle}>Highlights</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlightsContainer}>
//           {/* Mock Highlights */}
//           <TouchableOpacity style={styles.highlightItem}>
//             <Image source={{ uri: 'https://fondpeace.com/og-image.jpg' }} style={styles.highlightImage} />
//             <Text style={styles.highlightText}>Travel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.highlightItem}>
//             <Image source={{ uri: 'https://fondpeace.com/og-image.jpg' }} style={styles.highlightImage} />
//             <Text style={styles.highlightText}>Food</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.highlightItem}>
//             <Image source={{ uri: 'https://fondpeace.com/og-image.jpg' }} style={styles.highlightImage} />
//             <Text style={styles.highlightText}>Hobbies</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.highlightItem}>
//             <Image source={{ uri: 'https://fondpeace.com/og-image.jpg' }} style={styles.highlightImage} />
//             <Text style={styles.highlightText}>Pets</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </View>

//       {/* Posts Grid Section */}
//       <View style={styles.infoCard}>
//         <Text style={styles.cardTitle}>My Posts</Text>
//         <View style={styles.postsGrid}>
//           {posts && posts.length > 0 ? (
//             posts.map((post, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.postImageWrapper}
//                 onPress={() => Alert.alert('Post Opened', `Content ID: ${index + 1}`)} // Example action
//                 activeOpacity={0.7}
//               >
//                 <Image
//                   source={{ uri: post.media }}
//                   style={styles.postImage}
//                   resizeMode="cover"
//                 />
//               </TouchableOpacity>
//             ))
//           ) : (
//             <Text style={styles.noPostsText}>No posts yet! Tap the + button to share your first moment.</Text>
//           )}
//         </View>
//       </View>
//       <View style={{ height: Spacing.xl }} />{/* Extra space at bottom */}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.background,
//   },
//   loadingText: {
//     marginTop: Spacing.s,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   errorText: {
//     fontSize: 18,
//     color: Colors.secondary,
//     textAlign: 'center',
//     marginBottom: Spacing.m,
//     paddingHorizontal: Spacing.l,
//     fontWeight: '600',
//   },
//   retryButton: {
//     paddingVertical: Spacing.m,
//     paddingHorizontal: Spacing.xl,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.xl,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   retryButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   // Header Section
//   headerContainer: {
//     width: '100%',
//     height: 280, // Taller header for more visual impact
//     position: 'relative',
//     backgroundColor: Colors.cardBackground, // Background for smooth transition
//     marginBottom: Spacing.xl, // Pushes content below
//   },
//   banner: {
//     width: '100%',
//     height: '70%', // Banner takes 70% of header height
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     borderBottomLeftRadius: BorderRadius.l,
//     borderBottomRightRadius: BorderRadius.l,
//     overflow: 'hidden',
//   },
//   avatarContainer: {
//     position: 'absolute',
//     bottom: 0, // Aligned to the bottom of the headerContainer
//     left: ScreenWidth / 2 - (ScreenWidth * 0.2 / 2), // Center Avatar, based on 20% width
//     width: ScreenWidth * 0.2, // Avatar takes 20% of screen width
//     height: ScreenWidth * 0.2,
//     borderRadius: BorderRadius.xxl,
//     backgroundColor: Colors.cardBackground,
//     padding: Spacing.xs, // White ring around avatar
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 8,
//     elevation: 10,
//     zIndex: 1,
//   },
//   avatar: {
//     width: '100%',
//     height: '100%',
//     borderRadius: BorderRadius.xxl,
//     borderWidth: 2,
//     borderColor: Colors.primary, // Primary accent for avatar border
//   },

//   // Profile Details Card
//   profileDetailsCard: {
//     marginHorizontal: Spacing.m,
//     marginTop: -Spacing.l, // Pulls card up to meet avatar
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.l,
//     padding: Spacing.l,
//     paddingTop: Spacing.xxl, // Extra padding top for username/handle
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//     marginBottom: Spacing.m,
//   },
//   username: {
//     fontSize: 26,
//     fontWeight: '800',
//     color: Colors.textPrimary,
//     marginBottom: Spacing.xs,
//   },
//   userHandle: {
//     fontSize: 15,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.m,
//     fontWeight: '500',
//   },
//   followStatsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '80%',
//     marginBottom: Spacing.l,
//     paddingVertical: Spacing.s,
//     borderTopWidth: StyleSheet.hairlineWidth, // Very thin line
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderColor: Colors.border,
//   },
//   followStatItem: {
//     alignItems: 'center',
//   },
//   followStatNumber: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//   },
//   followStatLabel: {
//     fontSize: 13,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   followStatSeparator: {
//     width: 1,
//     backgroundColor: Colors.border,
//     marginHorizontal: Spacing.s,
//     opacity: 0.7,
//   },

//   // Action Buttons Row
//   buttonRow: {
//     flexDirection: 'row',
//     width: '100%',
//     marginBottom: Spacing.m,
//     justifyContent: 'space-between',
//   },
//   actionButton: {
//     flexDirection: 'row', // For icon + text
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     marginHorizontal: Spacing.xs,
//     paddingVertical: Spacing.s * 1.2,
//     borderRadius: BorderRadius.xl,
//     backgroundColor: Colors.accentGreen, // Different color for edit
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   editProfileButton: {
//     backgroundColor: Colors.primary, // Blue for primary action
//   },
//   followButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     marginHorizontal: Spacing.xs,
//     paddingVertical: Spacing.s * 1.2,
//     borderRadius: BorderRadius.xl,
//     backgroundColor: Colors.primary,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   actionButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   followButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   buttonIcon: {
//     marginRight: Spacing.xs,
//   },

//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//     paddingVertical: Spacing.s * 1.2,
//     backgroundColor: Colors.secondary, // Red for logout
//     borderRadius: BorderRadius.xl,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//     marginTop: Spacing.m,
//   },
//   logoutButtonText: {
//     color: Colors.cardBackground,
//     fontWeight: '600',
//     fontSize: 15,
//   },

//   // Info Cards (Bio and Posts)
//   infoCard: {
//     marginHorizontal: Spacing.m,
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.l,
//     padding: Spacing.l,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     elevation: 5,
//     marginBottom: Spacing.m,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//     marginBottom: Spacing.m,
//     borderBottomWidth: StyleSheet.hairlineWidth, // Ultra-thin divider
//     borderBottomColor: Colors.border,
//     paddingBottom: Spacing.s,
//   },
//   bioText: {
//     fontSize: 15,
//     lineHeight: 22,
//     color: Colors.textSecondary,
//   },

//   // Highlights/Stories
//   highlightsContainer: {
//     marginTop: Spacing.s,
//     paddingVertical: Spacing.s,
//   },
//   highlightItem: {
//     alignItems: 'center',
//     marginRight: Spacing.m,
//     width: 70, // Fixed width for highlight item
//   },
//   highlightImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30, // Circle
//     borderWidth: 2,
//     borderColor: Colors.primary, // Accent border
//     marginBottom: Spacing.xs,
//   },
//   highlightText: {
//     fontSize: 12,
//     color: Colors.textPrimary,
//     fontWeight: '500',
//     textAlign: 'center',
//   },

//   // Posts Grid
//   postsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'flex-start',
//     marginHorizontal: -Spacing.xs, // Counteract individual item margin
//   },
//   postImageWrapper: {
//     width: (ScreenWidth / 3) - (Spacing.m + Spacing.xs), // For 3 columns with padding and internal margin
//     height: (ScreenWidth / 3) - (Spacing.m + Spacing.xs), // Square aspect ratio
//     margin: Spacing.xs, // Small margin around each image
//     borderRadius: BorderRadius.s, // Slightly rounded image corners
//     overflow: 'hidden',
//     backgroundColor: Colors.border, // Placeholder color
//   },
//   postImage: {
//     width: '100%',
//     height: '100%',
//   },
//   noPostsText: {
//     textAlign: 'center',
//     marginTop: Spacing.m,
//     fontSize: 15,
//     color: Colors.textSecondary,
//     width: '100%',
//     paddingHorizontal: Spacing.m,
//     lineHeight: 22,
//   },
// });









// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// // Optional: Import Feather Icons if you have expo-vector-icons installed
// // import { Feather from '@expo/vector-icons'; 

// // Constants for consistent theming
// const Colors = {
//   primary: '#7B68EE', // MediumSlateBlue - a sophisticated, calming purple
//   secondary: '#FF6F61', // Coral - a warm, inviting accent
//   background: '#F5F5F5', // Soft light grey
//   cardBackground: '#FFFFFF', // Pure white
//   textPrimary: '#343A40', // Dark charcoal for main text
//   textSecondary: '#6C757D', // Muted grey for labels
//   border: '#E9ECEF', // Very light grey for subtle lines
//   shadow: 'rgba(0,0,0,0.06)', // Subtle shadow
//   destructive: '#DC3545', // Red for logout
// };

// const Spacing = {
//   xs: 4,
//   s: 8,
//   m: 16,
//   l: 24,
//   xl: 32,
//   xxl: 48,
// };

// const BorderRadius = {
//   s: 8,
//   m: 12,
//   l: 20,
//   xl: 30, // For buttons
//   xxl: 60, // For avatar
// };

// const ScreenWidth = Dimensions.get('window').width;

// // Custom function to decode JWT (NO CHANGES HERE)
// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) {
//     throw new Error('Invalid token format');
//   }
//   const payload = parts[1];
//   const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//   const decoded = JSON.parse(atob(base64));
//   return decoded;
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOwnProfile = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/');
//         return;
//       }

//       try {
//         const decoded = decodeJWT(token);
//         const loggedUserId = decoded.UserId;

//         const res = await axios.get(
//           `https://backend-k.vercel.app/user/profile/${loggedUserId}`,
//           {
//             headers: { 'x-auth-token': token },
//           }
//         );

//         setProfile(res.data.Profile);
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwnProfile();
//   }, []);

//   // Logout handler (NO CHANGES HERE)
//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             router.replace('/login');
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   // Loading and Error States (UI updated)
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Loading your personalized space...</Text>
//       </View>
//     );
//   }

//   if (error || !profile) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error ? error.message : 'Failed to load profile. Please try again.'}
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/')}>
//           <Text style={styles.retryButtonText}>Go Back Home</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { user, posts } = profile;

//   // For Asymmetrical Grid: Divide posts into two columns
//   const column1Posts = posts?.filter((_, i) => i % 2 === 0) || [];
//   const column2Posts = posts?.filter((_, i) => i % 2 !== 0) || [];

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>

//         {/* Hero Section: Avatar, Name, Handle, Bio */}
//         <View style={styles.heroSection}>
//           <Image
//             source={{ uri: user.profilePicture || 'https://fondpeace.com/og-image.jpg' }}
//             style={styles.heroAvatar}
//           />
//           <Text style={styles.heroUsername}>{user.username}</Text>
//           <Text style={styles.heroUserHandle}>@{user.username.toLowerCase().replace(/\s/g, '') || 'yourhandle'}</Text>

//           <Text style={styles.heroBioText}>{user.bio || 'Building my digital presence one step at a time. Sharing my journey and passions here.'}</Text>

//           {/* Follow Stats */}
//           <View style={styles.followStatsContainer}>
//             <View style={styles.followStatItem}>
//               <Text style={styles.followStatNumber}>{user.Followers?.length || 0}</Text>
//               <Text style={styles.followStatLabel}>Followers</Text>
//             </View>
//             <View style={styles.followStatSeparator} />
//             <View style={styles.followStatItem}>
//               <Text style={styles.followStatNumber}>{user.Followings?.length || 0}</Text>
//               <Text style={styles.followStatLabel}>Following</Text>
//             </View>
//           </View>
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionButtonsContainer}>
//           <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.8}>
//             {/* {Feather && <Feather name="plus-circle" size={18} color={Colors.cardBackground} style={styles.buttonIcon} />} */}
//             <Text style={styles.primaryActionButtonText}>Follow User</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.secondaryActionButton} activeOpacity={0.8}>
//             {/* {Feather && <Feather name="edit" size={18} color={Colors.textPrimary} style={styles.buttonIcon} />} */}
//             <Text style={styles.secondaryActionButtonText}>Edit Profile</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Highlights Section (Card) */}
//         <View style={styles.infoCard}>
//           <Text style={styles.cardTitle}>My Interests</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlightsContainer}>
//             {/* Mock Highlights/Interests */}
//             <TouchableOpacity style={styles.highlightItem}>
//               <Image source={{ uri: 'https://via.placeholder.com/100/A569BD/FFFFFF?text=Tech' }} style={styles.highlightImage} />
//               <Text style={styles.highlightText}>Tech</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.highlightItem}>
//               <Image source={{ uri: 'https://via.placeholder.com/100/5DADE2/FFFFFF?text=Art' }} style={styles.highlightImage} />
//               <Text style={styles.highlightText}>Art</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.highlightItem}>
//               <Image source={{ uri: 'https://via.placeholder.com/100/48C9B0/FFFFFF?text=Gaming' }} style={styles.highlightImage} />
//               <Text style={styles.highlightText}>Gaming</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.highlightItem}>
//               <Image source={{ uri: 'https://via.placeholder.com/100/F1C40F/FFFFFF?text=Books' }} style={styles.highlightImage} />
//               <Text style={styles.highlightText}>Books</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.highlightItem}>
//               <Image source={{ uri: 'https://via.placeholder.com/100/E74C3C/FFFFFF?text=Fitness' }} style={styles.highlightImage} />
//               <Text style={styles.highlightText}>Fitness</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>

//         {/* Asymmetrical Posts Grid */}
//         <View style={styles.infoCard}>
//           <Text style={styles.cardTitle}>My Gallery</Text>
//           <View style={styles.postsMasonryGrid}>
//             <View style={styles.postsColumn}>
//               {column1Posts.length > 0 ? (
//                 column1Posts.map((post, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.postMasonryImageWrapper}
//                     onPress={() => Alert.alert('Image View', `Post ID: ${index * 2 + 1}`)}
//                     activeOpacity={0.8}
//                   >
//                     <Image
//                       source={{ uri: post.media }}
//                       style={{
//                         width: '100%',
//                         height: index % 3 === 0 ? 200 : 120, // Vary height for masonry effect
//                         borderRadius: BorderRadius.s,
//                       }}
//                       resizeMode="cover"
//                     />
//                   </TouchableOpacity>
//                 ))
//               ) : null}
//             </View>
//             <View style={styles.postsColumn}>
//               {column2Posts.length > 0 ? (
//                 column2Posts.map((post, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.postMasonryImageWrapper}
//                     onPress={() => Alert.alert('Image View', `Post ID: ${index * 2 + 2}`)}
//                     activeOpacity={0.8}
//                   >
//                     <Image
//                       source={{ uri: post.media }}
//                       style={{
//                         width: '100%',
//                         height: index % 2 === 0 ? 150 : 220, // Vary height for masonry effect
//                         borderRadius: BorderRadius.s,
//                       }}
//                       resizeMode="cover"
//                     />
//                   </TouchableOpacity>
//                 ))
//               ) : null}
//             </View>
//             {posts && posts.length === 0 && (
//               <Text style={styles.noPostsText}>Your gallery is empty. Time to create some art!</Text>
//             )}
//           </View>
//         </View>

//         <View style={{ height: Spacing.xl }} />{/* Extra space at bottom */}
//       </ScrollView>

//       {/* Floating Action Button (FAB) for adding content */}
//       <TouchableOpacity style={styles.fab} onPress={handleLogout}> {/* Using logout for FAB for now */}
//         {/* {Feather && <Feather name="log-out" size={24} color={Colors.cardBackground} />} */}
//         <Text style={styles.fabText}>Logout</Text>
//       </TouchableOpacity>
//       {/* Example for a 'New Post' FAB, if you want a second one or to change the function: */}
//       {/* <TouchableOpacity style={[styles.fab, { right: Spacing.l + 80 }]} onPress={() => Alert.alert('New Post', 'Create new content!')}>
//         <Feather name="plus" size={28} color={Colors.cardBackground} />
//       </TouchableOpacity> */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   scrollViewContent: {
//     paddingVertical: Spacing.l,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.background,
//   },
//   loadingText: {
//     marginTop: Spacing.s,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   errorText: {
//     fontSize: 18,
//     color: Colors.destructive,
//     textAlign: 'center',
//     marginBottom: Spacing.m,
//     paddingHorizontal: Spacing.l,
//     fontWeight: '600',
//   },
//   retryButton: {
//     paddingVertical: Spacing.m,
//     paddingHorizontal: Spacing.xl,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.xl,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   retryButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   // Hero Section
//   heroSection: {
//     marginHorizontal: Spacing.m,
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.l,
//     padding: Spacing.l,
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.15,
//     shadowRadius: 15,
//     elevation: 12,
//     marginBottom: Spacing.m,
//   },
//   heroAvatar: {
//     width: 130, // Even larger avatar
//     height: 130,
//     borderRadius: BorderRadius.xxl,
//     borderWidth: 4,
//     borderColor: Colors.primary, // Primary color border
//     marginBottom: Spacing.m,
//   },
//   heroUsername: {
//     fontSize: 30, // Larger and bolder
//     fontWeight: '900', // Extra bold
//     color: Colors.textPrimary,
//     marginBottom: Spacing.xs,
//   },
//   heroUserHandle: {
//     fontSize: 18,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.m,
//     fontWeight: '500',
//   },
//   heroBioText: {
//     fontSize: 15,
//     lineHeight: 22,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     marginHorizontal: Spacing.s,
//     marginBottom: Spacing.l,
//   },
//   followStatsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%', // Take full width
//     paddingVertical: Spacing.m,
//     borderTopWidth: StyleSheet.hairlineWidth,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderColor: Colors.border,
//     marginBottom: Spacing.s, // Add some space below
//   },
//   followStatItem: {
//     alignItems: 'center',
//     paddingHorizontal: Spacing.m,
//   },
//   followStatNumber: {
//     fontSize: 22, // Slightly larger numbers
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//   },
//   followStatLabel: {
//     fontSize: 15, // Slightly larger label
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   followStatSeparator: {
//     width: 1,
//     height: '100%', // Separator stretches to full height
//     backgroundColor: Colors.border,
//     marginHorizontal: Spacing.s,
//     opacity: 0.7,
//   },

//   // Action Buttons Below Hero
//   actionButtonsContainer: {
//     flexDirection: 'row',
//     marginHorizontal: Spacing.m,
//     marginBottom: Spacing.l,
//     justifyContent: 'space-between',
//   },
//   primaryActionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     marginRight: Spacing.s,
//     paddingVertical: Spacing.m,
//     backgroundColor: Colors.primary, // Primary action color
//     borderRadius: BorderRadius.xl,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   primaryActionButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 17,
//     fontWeight: 'bold',
//   },
//   secondaryActionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     marginLeft: Spacing.s,
//     paddingVertical: Spacing.m,
//     backgroundColor: Colors.cardBackground, // White background for secondary
//     borderRadius: BorderRadius.xl,
//     borderWidth: 1.5, // Subtle border
//     borderColor: Colors.border,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   secondaryActionButtonText: {
//     color: Colors.textPrimary,
//     fontSize: 17,
//     fontWeight: '600',
//   },
//   buttonIcon: {
//     marginRight: Spacing.xs,
//   },

//   // Info Cards (Highlights/Posts)
//   infoCard: {
//     marginHorizontal: Spacing.m,
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.l,
//     padding: Spacing.l,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 6,
//     marginBottom: Spacing.m,
//   },
//   cardTitle: {
//     fontSize: 20, // Slightly larger title
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//     marginBottom: Spacing.m,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: Colors.border,
//     paddingBottom: Spacing.s,
//   },

//   // Highlights/Interests
//   highlightsContainer: {
//     marginTop: Spacing.s,
//     paddingVertical: Spacing.xs,
//   },
//   highlightItem: {
//     alignItems: 'center',
//     marginRight: Spacing.m,
//     width: 75, // Wider for text
//   },
//   highlightImage: {
//     width: 65,
//     height: 65,
//     borderRadius: BorderRadius.xxl, // Circle
//     borderWidth: 2.5,
//     borderColor: Colors.primary, // Primary color ring
//     marginBottom: Spacing.xs,
//   },
//   highlightText: {
//     fontSize: 13,
//     color: Colors.textPrimary,
//     fontWeight: '500',
//     textAlign: 'center',
//     marginTop: Spacing.xs,
//   },

//   // Asymmetrical Posts Grid (Masonry-like)
//   postsMasonryGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: Spacing.s,
//   },
//   postsColumn: {
//     width: (ScreenWidth - (Spacing.m * 2) - Spacing.s) / 2, // Two columns, accounting for card padding and column spacing
//   },
//   postMasonryImageWrapper: {
//     marginBottom: Spacing.s, // Spacing between images in the same column
//     backgroundColor: Colors.border, // Placeholder color
//     borderRadius: BorderRadius.s, // Ensure rounded corners
//     overflow: 'hidden', // Make sure image respects border radius
//   },
//   // Individual image heights are set inline for masonry effect

//   noPostsText: {
//     textAlign: 'center',
//     marginTop: Spacing.m,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     width: '100%',
//     paddingHorizontal: Spacing.m,
//     lineHeight: 24,
//   },

//   // Floating Action Button (FAB)
//   fab: {
//     position: 'absolute',
//     bottom: Spacing.l,
//     right: Spacing.l,
//     backgroundColor: Colors.destructive, // Using red for logout FAB as per example
//     width: Spacing.xxl + 20, // Larger width for text
//     height: Spacing.xxl + 8,
//     borderRadius: BorderRadius.xl, // Pill-shaped FAB
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.4,
//     shadowRadius: 10,
//     elevation: 15,
//     zIndex: 10,
//     flexDirection: 'row', // For text + icon if needed
//     paddingHorizontal: Spacing.m, // Add padding for text
//   },
//   fabText: {
//     color: Colors.cardBackground,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });







// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// // Optional: Import Feather Icons if you have expo-vector-icons installed
// // import { Feather } from '@expo/vector-icons';

// // --- Constants for Consistent Theming ---
// const Colors = {
//   primary: '#4CAF50', // A fresh, vibrant green
//   accent: '#007BFF', // A strong, clear blue for actions
//   background: '#F0F2F5', // Light grey for the overall background
//   cardBackground: '#FFFFFF', // Pure white for content cards/sections
//   textPrimary: '#212529', // Dark charcoal for main text
//   textSecondary: '#6C757D', // Muted grey for labels and secondary info
//   border: '#E0E0E0', // Light grey for subtle dividers
//   shadow: 'rgba(0,0,0,0.08)', // Subtle shadow
//   destructive: '#DC3545', // Red for logout/delete
//   activeTab: '#4CAF50', // Green for active tab underline
//   inactiveTab: '#B0B0B0', // Lighter grey for inactive tab text
// };

// const Spacing = {
//   xs: 4,
//   s: 8,
//   m: 16,
//   l: 24,
//   xl: 32,
// };

// const BorderRadius = {
//   s: 6,
//   m: 10,
//   l: 15,
//   xl: 25, // For buttons
//   xxl: 60, // For avatar
// };

// const ScreenWidth = Dimensions.get('window').width;

// // --- Custom function to decode JWT (NO CHANGES HERE) ---
// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) {
//     throw new Error('Invalid token format');
//   }
//   const payload = parts[1];
//   const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//   const decoded = JSON.parse(atob(base64));
//   return decoded;
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('posts'); // State for active tab: 'posts', 'liked', 'saved' (or whatever)
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOwnProfile = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/');
//         return;
//       }

//       try {
//         const decoded = decodeJWT(token);
//         const loggedUserId = decoded.UserId;

//         const res = await axios.get(
//           `https://backend-k.vercel.app/user/profile/${loggedUserId}`,
//           {
//             headers: { 'x-auth-token': token },
//           }
//         );

//         setProfile(res.data.Profile);
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwnProfile();
//   }, []);

//   // --- Logout handler (NO CHANGES HERE) ---
//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             router.replace('/login');
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   // --- Loading and Error States (UI updated) ---
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Loading your awesome profile...</Text>
//       </View>
//     );
//   }

//   if (error || !profile) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error ? error.message : 'Failed to load profile. Please try again.'}
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/')}>
//           <Text style={styles.retryButtonText}>Go Back Home</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { user, posts } = profile;

//   return (
//     <View style={styles.container}>
//       {/* --- Top Bar (Optional: for back button/settings) --- */}
//       <View style={styles.topBar}>
//         {/* <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
//         </TouchableOpacity> */}
//         <Text style={styles.topBarTitle}>Profile</Text>
//         <TouchableOpacity onPress={handleLogout} style={styles.topBarLogout}>
//           {/* <Feather name="log-out" size={24} color={Colors.textPrimary} /> */}
//           <Text style={styles.topBarLogoutText}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* --- Profile Header Section --- */}
//         <View style={styles.profileHeader}>
//           <Image
//             source={{ uri: user.profilePicture || 'https://via.placeholder.com/150/A2D4AB/FFFFFF?text=User' }}
//             style={styles.avatar}
//           />
//           <Text style={styles.username}>{user.username}</Text>
//           <Text style={styles.userHandle}>@{user.username.toLowerCase().replace(/\s/g, '') || 'yourhandle'}</Text>

//           <Text style={styles.bioText}>{user.bio || 'Your bio here. Share a bit about yourself, your passions, or what you\'re up to!'}</Text>

//           {/* --- Stats Bar (Followers, Following, Posts) --- */}
//           <View style={styles.statsBar}>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>{user.Followers?.length || 0}</Text>
//               <Text style={styles.statLabel}>Followers</Text>
//             </View>
//             <View style={styles.statSeparator} />
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>{user.Followings?.length || 0}</Text>
//               <Text style={styles.statLabel}>Following</Text>
//             </View>
//             <View style={styles.statSeparator} />
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>{posts?.length || 0}</Text>
//               <Text style={styles.statLabel}>Posts</Text>
//             </View>
//           </View>

//           {/* --- Action Buttons --- */}
//           <View style={styles.actionButtonsRow}>
//             <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
//               {/* {Feather && <Feather name="user-plus" size={18} color={Colors.cardBackground} style={styles.buttonIcon} />} */}
//               <Text style={styles.primaryButtonText}>Follow</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
//               {/* {Feather && <Feather name="edit" size={18} color={Colors.textPrimary} style={styles.buttonIcon} />} */}
//               <Text style={styles.secondaryButtonText}>Edit Profile</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* --- Tab Navigation --- */}
//         <View style={styles.tabContainer}>
//           <TouchableOpacity
//             style={[styles.tabItem, activeTab === 'posts' && styles.activeTabItem]}
//             onPress={() => setActiveTab('posts')}
//           >
//             <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Posts</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tabItem, activeTab === 'liked' && styles.activeTabItem]}
//             onPress={() => setActiveTab('liked')}
//           >
//             <Text style={[styles.tabText, activeTab === 'liked' && styles.activeTabText]}>Liked</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tabItem, activeTab === 'saved' && styles.activeTabItem]}
//             onPress={() => setActiveTab('saved')}
//           >
//             <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>Saved</Text>
//           </TouchableOpacity>
//         </View>

//         {/* --- Content Display Area (based on activeTab) --- */}
//         <View style={styles.contentArea}>
//           {activeTab === 'posts' && (
//             <View style={styles.postsGrid}>
//               {posts && posts.length > 0 ? (
//                 posts.map((post, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.postImageWrapper}
//                     onPress={() => Alert.alert('Post View', `Post by ${user.username}`)}
//                     activeOpacity={0.8}
//                   >
//                     <Image
//                       source={{ uri: post.media }}
//                       style={styles.postImage}
//                       resizeMode="cover"
//                     />
//                   </TouchableOpacity>
//                 ))
//               ) : (
//                 <Text style={styles.noPostsText}>No posts yet! Tap the '+' button to share your first moment.</Text>
//               )}
//             </View>
//           )}

//           {activeTab === 'liked' && (
//             <View style={styles.emptyTabContent}>
//               <Text style={styles.emptyTabContentText}>No liked posts yet. Start exploring!</Text>
//             </View>
//           )}

//           {activeTab === 'saved' && (
//             <View style={styles.emptyTabContent}>
//               <Text style={styles.emptyTabContentText}>No saved posts. Save your favorites!</Text>
//             </View>
//           )}
//         </View>
//         <View style={{ height: Spacing.xl * 2 }} /> {/* Extra space at bottom for FAB */}
//       </ScrollView>

//       {/* --- Floating Action Button (FAB) --- */}
//       <TouchableOpacity style={styles.fab} onPress={() => Alert.alert('New Post', 'Ready to share something?')}>
//         {/* {Feather && <Feather name="plus" size={28} color={Colors.cardBackground} />} */}
//         <Text style={styles.fabText}>+</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// // --- Styles ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.background,
//   },
//   loadingText: {
//     marginTop: Spacing.s,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   errorText: {
//     fontSize: 18,
//     color: Colors.destructive,
//     textAlign: 'center',
//     marginBottom: Spacing.m,
//     paddingHorizontal: Spacing.l,
//     fontWeight: '600',
//   },
//   retryButton: {
//     paddingVertical: Spacing.m,
//     paddingHorizontal: Spacing.xl,
//     backgroundColor: Colors.accent,
//     borderRadius: BorderRadius.xl,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   retryButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   // --- Top Bar (New) ---
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: Spacing.m,
//     paddingVertical: Spacing.s + 4, // Adjusted padding for balance
//     backgroundColor: Colors.cardBackground,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: Colors.border,
//     // Shadow is optional here, as it's a top bar.
//   },
//   topBarTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//   },
//   topBarLogout: {
//     padding: Spacing.xs, // make tappable area slightly larger
//   },
//   topBarLogoutText: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },

//   // --- Profile Header Section ---
//   profileHeader: {
//     backgroundColor: Colors.cardBackground,
//     padding: Spacing.l,
//     alignItems: 'center',
//     marginBottom: Spacing.s, // Smaller margin below header
//     borderBottomLeftRadius: BorderRadius.l, // Soft corners for the bottom of the header card
//     borderBottomRightRadius: BorderRadius.l,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   avatar: {
//     width: 110, // Slightly smaller than previous for a more compact header
//     height: 110,
//     borderRadius: BorderRadius.xxl,
//     borderWidth: 3,
//     borderColor: Colors.primary,
//     marginBottom: Spacing.m,
//   },
//   username: {
//     fontSize: 26,
//     fontWeight: '800',
//     color: Colors.textPrimary,
//     marginBottom: Spacing.xs,
//   },
//   userHandle: {
//     fontSize: 15,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.m,
//     fontWeight: '500',
//   },
//   bioText: {
//     fontSize: 14,
//     lineHeight: 20,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     marginHorizontal: Spacing.s,
//     marginBottom: Spacing.l,
//   },

//   // --- Stats Bar ---
//   statsBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     paddingVertical: Spacing.m,
//     borderTopWidth: StyleSheet.hairlineWidth,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderColor: Colors.border,
//     marginBottom: Spacing.l,
//   },
//   statItem: {
//     alignItems: 'center',
//     paddingHorizontal: Spacing.s,
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//   },
//   statLabel: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   statSeparator: {
//     width: 1,
//     backgroundColor: Colors.border,
//     marginHorizontal: Spacing.s,
//     opacity: 0.7,
//   },

//   // --- Action Buttons ---
//   actionButtonsRow: {
//     flexDirection: 'row',
//     width: '100%',
//     justifyContent: 'space-around',
//   },
//   primaryButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     marginRight: Spacing.s,
//     paddingVertical: Spacing.s * 1.2,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.xl,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   primaryButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   secondaryButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     marginLeft: Spacing.s,
//     paddingVertical: Spacing.s * 1.2,
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.xl,
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   secondaryButtonText: {
//     color: Colors.textPrimary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   buttonIcon: {
//     marginRight: Spacing.xs,
//   },

//   // --- Tab Navigation (New) ---
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: Colors.cardBackground,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: Colors.border,
//     marginBottom: Spacing.m,
//   },
//   tabItem: {
//     flex: 1,
//     alignItems: 'center',
//     paddingVertical: Spacing.m,
//     borderBottomWidth: 2, // Underline for active tab
//     borderBottomColor: 'transparent', // Default transparent
//   },
//   activeTabItem: {
//     borderBottomColor: Colors.activeTab, // Active tab underline color
//   },
//   tabText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: Colors.inactiveTab,
//   },
//   activeTabText: {
//     color: Colors.activeTab, // Active tab text color
//   },

//   // --- Content Display Area ---
//   contentArea: {
//     flex: 1,
//     paddingHorizontal: Spacing.m, // Padding around the grid
//   },
//   postsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   postImageWrapper: {
//     width: (ScreenWidth - (Spacing.m * 2) - (Spacing.s * 2)) / 3, // 3 columns with spacing
//     height: (ScreenWidth - (Spacing.m * 2) - (Spacing.s * 2)) / 3, // Square aspect ratio
//     marginBottom: Spacing.s, // Spacing between rows
//     borderRadius: BorderRadius.s,
//     overflow: 'hidden',
//     backgroundColor: Colors.border,
//   },
//   postImage: {
//     width: '100%',
//     height: '100%',
//   },
//   noPostsText: {
//     textAlign: 'center',
//     marginTop: Spacing.xl,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     width: '100%',
//     paddingHorizontal: Spacing.l,
//     lineHeight: 24,
//   },
//   emptyTabContent: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: Spacing.xl * 2, // Large empty space
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.l,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   emptyTabContentText: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     paddingHorizontal: Spacing.l,
//   },

//   // --- Floating Action Button (FAB) ---
//   fab: {
//     position: 'absolute',
//     bottom: Spacing.l,
//     right: Spacing.l,
//     backgroundColor: Colors.accent, // Use accent color for FAB
//     width: Spacing.xl + Spacing.m, // Slightly larger circle for plus
//     height: Spacing.xl + Spacing.m,
//     borderRadius: (Spacing.xl + Spacing.m) / 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.4,
//     shadowRadius: 10,
//     elevation: 15,
//     zIndex: 10,
//   },
//   fabText: {
//     color: Colors.cardBackground,
//     fontSize: 32,
//     lineHeight: 32, // Adjust to center vertically
//     fontWeight: '300',
//   },
// });









// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// // Optional: Import Feather Icons if you have expo-vector-icons installed
// // import { Feather } from '@expo/vector-icons';

// // --- Constants for Consistent Theming ---
// const Colors = {
//   primary: '#6A5ACD', // SlateBlue - A rich, deep purple-blue
//   accent: '#FFD700', // Gold - A vibrant, luxurious accent
//   background: '#F0F2F5', // Light grey for the overall background
//   cardBackground: '#FFFFFF', // Pure white for content cards/sections
//   textPrimary: '#2C3E50', // Dark Navy for main text
//   textSecondary: '#7F8C8D', // Muted grey for labels and secondary info
//   border: '#EAEAEA', // Light grey for subtle dividers
//   shadow: 'rgba(0,0,0,0.1)', // More pronounced shadow for depth
//   destructive: '#E74C3C', // Alizarin Red for logout/delete
//   gradientStart: '#8E44AD', // Amethyst for a rich gradient
//   gradientEnd: '#3498DB', // Peter River for a cool gradient
// };

// const Spacing = {
//   xs: 4,
//   s: 8,
//   m: 16,
//   l: 24,
//   xl: 32,
//   xxl: 48,
// };

// const BorderRadius = {
//   s: 8,
//   m: 12,
//   l: 20,
//   xl: 30, // For buttons
//   xxl: 70, // For avatar
// };

// const ScreenWidth = Dimensions.get('window').width;

// // --- Custom function to decode JWT (NO CHANGES HERE) ---
// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) {
//     throw new Error('Invalid token format');
//   }
//   const payload = parts[1];
//   const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//   const decoded = JSON.parse(atob(base64));
//   return decoded;
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [fabExpanded, setFabExpanded] = useState(false); // State for FAB expansion
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOwnProfile = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/');
//         return;
//       }

//       try {
//         const decoded = decodeJWT(token);
//         const loggedUserId = decoded.UserId;

//         const res = await axios.get(
//           `https://backend-k.vercel.app/user/profile/${loggedUserId}`,
//           {
//             headers: { 'x-auth-token': token },
//           }
//         );

//         setProfile(res.data.Profile);
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwnProfile();
//   }, []);

//   // --- Logout handler (NO CHANGES HERE) ---
//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             router.replace('/login');
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   // --- Loading and Error States ---
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Unveiling your profile...</Text>
//       </View>
//     );
//   }

//   if (error || !profile) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error ? error.message : 'Failed to load profile. Please try again.'}
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/')}>
//           <Text style={styles.retryButtonText}>Go Back Home</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { user, posts } = profile;

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>

//         {/* --- Profile Header --- */}
//         <View style={styles.profileHeader}>
//           <Image
//             source={{ uri: user.profilePicture || 'https://via.placeholder.com/160/6A5ACD/FFFFFF?text=User' }}
//             style={styles.avatar}
//           />
//           <Text style={styles.username}>{user.username}</Text>
//           <Text style={styles.userHandle}>@{user.username.toLowerCase().replace(/\s/g, '') || 'yourhandle'}</Text>
//           <Text style={styles.bioText}>{user.bio || 'Crafting my digital story, one moment at a time. Join my journey!'}</Text>

//           {/* --- Action Buttons --- */}
//           <View style={styles.actionButtonsContainer}>
//             <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.8}>
//               {/* {Feather && <Feather name="user-plus" size={18} color={Colors.cardBackground} style={styles.buttonIcon} />} */}
//               <Text style={styles.primaryActionButtonText}>Follow</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.secondaryActionButton} activeOpacity={0.8}>
//               {/* {Feather && <Feather name="message-square" size={18} color={Colors.textPrimary} style={styles.buttonIcon} />} */}
//               <Text style={styles.secondaryActionButtonText}>Message</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* --- Key Metrics / Activity Bubbles --- */}
//         <View style={styles.metricsContainer}>
//           <View style={styles.metricBubble}>
//             <Text style={styles.metricNumber}>{user.Followers?.length || 0}</Text>
//             <Text style={styles.metricLabel}>Followers</Text>
//           </View>
//           <View style={styles.metricBubble}>
//             <Text style={styles.metricNumber}>{user.Followings?.length || 0}</Text>
//             <Text style={styles.metricLabel}>Following</Text>
//           </View>
//           <View style={styles.metricBubble}>
//             <Text style={styles.metricNumber}>{posts?.length || 0}</Text>
//             <Text style={styles.metricLabel}>Posts</Text>
//           </View>
//         </View>

//         {/* --- Recent Activity / Feed Section --- */}
//         <View style={styles.feedSection}>
//           <Text style={styles.sectionTitle}>Recent Activity</Text>
//           {posts && posts.length > 0 ? (
//             posts.slice(0, 3).map((post, index) => ( // Show only top 3 recent posts
//               <TouchableOpacity
//                 key={index}
//                 style={styles.feedPostCard}
//                 onPress={() => Alert.alert('Post Detail', `Exploring: ${post.title || 'Untitled Post'}`)}
//                 activeOpacity={0.8}
//               >
//                 <Image source={{ uri: post.media }} style={styles.feedPostImage} resizeMode="cover" />
//                 <View style={styles.feedPostContent}>
//                   <Text style={styles.feedPostTitle}>{post.title || `Moment #${index + 1}`}</Text>
//                   <Text style={styles.feedPostDate}>{new Date().toLocaleDateString()}</Text> {/* Mock date */}
//                   {/* {Feather && <Feather name="heart" size={16} color={Colors.textSecondary} />} */}
//                   <Text style={styles.feedPostLikes}>{(Math.floor(Math.random() * 500) + 50)} Likes</Text> {/* Mock likes */}
//                 </View>
//               </TouchableOpacity>
//             ))
//           ) : (
//             <Text style={styles.noPostsText}>No recent activity. Start sharing your world!</Text>
//           )}

//           {posts && posts.length > 3 && (
//             <TouchableOpacity style={styles.viewAllButton} onPress={() => Alert.alert('All Posts', 'Navigating to full gallery.')}>
//               <Text style={styles.viewAllButtonText}>View All Posts</Text>
//               {/* {Feather && <Feather name="arrow-right" size={14} color={Colors.primary} style={{ marginLeft: Spacing.xs }} />} */}
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* --- Explore Section (Optional, mimics discovery) --- */}
//         <View style={styles.exploreSection}>
//           <Text style={styles.sectionTitle}>Discover More</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exploreScroll}>
//             {['Photography', 'Travel', 'Foodie', 'Art', 'Gaming'].map((item, index) => (
//               <TouchableOpacity key={index} style={styles.exploreItem}>
//                 <Image source={{ uri: `https://via.placeholder.com/80/DDA0DD/FFFFFF?text=${item}` }} style={styles.exploreImage} />
//                 <Text style={styles.exploreItemText}>{item}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         <View style={{ height: Spacing.xl * 3 }} /> {/* Extra space at bottom for FAB */}
//       </ScrollView>

//       {/* --- Floating Action Button (FAB) with Expandable Menu --- */}
//       {fabExpanded && (
//         <View style={styles.fabMenu}>
//           <TouchableOpacity style={styles.fabMenuItem} onPress={() => { Alert.alert('New Photo'); setFabExpanded(false); }}>
//             {/* {Feather && <Feather name="camera" size={24} color={Colors.cardBackground} />} */}
//             <Text style={styles.fabMenuItemText}>Photo</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.fabMenuItem} onPress={() => { Alert.alert('New Video'); setFabExpanded(false); }}>
//             {/* {Feather && <Feather name="video" size={24} color={Colors.cardBackground} />} */}
//             <Text style={styles.fabMenuItemText}>Video</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.fabMenuItem} onPress={() => { Alert.alert('New Text Post'); setFabExpanded(false); }}>
//             {/* {Feather && <Feather name="file-text" size={24} color={Colors.cardBackground} />} */}
//             <Text style={styles.fabMenuItemText}>Text</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//       <TouchableOpacity
//         style={[styles.fab, fabExpanded && styles.fabExpanded]}
//         onPress={() => setFabExpanded(!fabExpanded)}
//         activeOpacity={0.8}
//       >
//         {/* {Feather && <Feather name={fabExpanded ? "x" : "plus"} size={28} color={Colors.cardBackground} />} */}
//         <Text style={styles.fabMainText}>{fabExpanded ? '✕' : '+'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// // --- Styles ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   scrollViewContent: {
//     paddingVertical: Spacing.l,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.background,
//   },
//   loadingText: {
//     marginTop: Spacing.s,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   errorText: {
//     fontSize: 18,
//     color: Colors.destructive,
//     textAlign: 'center',
//     marginBottom: Spacing.m,
//     paddingHorizontal: Spacing.l,
//     fontWeight: '600',
//   },
//   retryButton: {
//     paddingVertical: Spacing.m,
//     paddingHorizontal: Spacing.xl,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.xl,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   retryButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   // --- Profile Header ---
//   profileHeader: {
//     backgroundColor: Colors.cardBackground,
//     padding: Spacing.l,
//     marginHorizontal: Spacing.m,
//     borderRadius: BorderRadius.l,
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.15,
//     shadowRadius: 15,
//     elevation: 12,
//     marginBottom: Spacing.l,
//   },
//   avatar: {
//     width: 130,
//     height: 130,
//     borderRadius: BorderRadius.xxl,
//     borderWidth: 4,
//     borderColor: Colors.accent, // Accent color for avatar border
//     marginBottom: Spacing.m,
//   },
//   username: {
//     fontSize: 28,
//     fontWeight: '900',
//     color: Colors.textPrimary,
//     marginBottom: Spacing.xs,
//   },
//   userHandle: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.m,
//     fontWeight: '500',
//   },
//   bioText: {
//     fontSize: 15,
//     lineHeight: 22,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     marginHorizontal: Spacing.s,
//     marginBottom: Spacing.l,
//   },
//   actionButtonsContainer: {
//     flexDirection: 'row',
//     width: '100%',
//     justifyContent: 'space-around',
//   },
//   primaryActionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     marginRight: Spacing.s,
//     paddingVertical: Spacing.m,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.xl,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   primaryActionButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 17,
//     fontWeight: 'bold',
//   },
//   secondaryActionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     marginLeft: Spacing.s,
//     paddingVertical: Spacing.m,
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.xl,
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   secondaryActionButtonText: {
//     color: Colors.textPrimary,
//     fontSize: 17,
//     fontWeight: '600',
//   },
//   buttonIcon: {
//     marginRight: Spacing.xs,
//   },

//   // --- Key Metrics / Activity Bubbles ---
//   metricsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginHorizontal: Spacing.m,
//     marginBottom: Spacing.xl,
//     backgroundColor: Colors.cardBackground, // Background for the metrics section
//     borderRadius: BorderRadius.l,
//     paddingVertical: Spacing.l,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   metricBubble: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: 80, // Ensure some minimum width
//     paddingHorizontal: Spacing.s,
//   },
//   metricNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: Colors.primary, // Primary color for numbers
//     marginBottom: Spacing.xs,
//   },
//   metricLabel: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },

//   // --- Recent Activity / Feed Section ---
//   feedSection: {
//     marginHorizontal: Spacing.m,
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.l,
//     padding: Spacing.l,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 6,
//     marginBottom: Spacing.l,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//     marginBottom: Spacing.m,
//     paddingBottom: Spacing.s,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: Colors.border,
//   },
//   feedPostCard: {
//     flexDirection: 'row',
//     backgroundColor: Colors.background, // Lighter background for individual post cards
//     borderRadius: BorderRadius.m,
//     marginBottom: Spacing.m,
//     overflow: 'hidden',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   feedPostImage: {
//     width: 100, // Fixed width for image in feed item
//     height: 100,
//     borderRadius: BorderRadius.m, // Rounded corners for image
//     marginRight: Spacing.m,
//   },
//   feedPostContent: {
//     flex: 1,
//     paddingVertical: Spacing.s,
//     justifyContent: 'space-between',
//   },
//   feedPostTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//     marginBottom: Spacing.xs,
//   },
//   feedPostDate: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.s,
//   },
//   feedPostLikes: {
//     fontSize: 13,
//     color: Colors.primary, // Highlight likes with primary color
//     fontWeight: '600',
//   },
//   noPostsText: {
//     textAlign: 'center',
//     marginTop: Spacing.xl,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     width: '100%',
//     paddingHorizontal: Spacing.l,
//     lineHeight: 24,
//   },
//   viewAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: Spacing.s,
//     marginTop: Spacing.m,
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.xl,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   viewAllButtonText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: Colors.primary,
//   },

//   // --- Explore Section ---
//   exploreSection: {
//     marginHorizontal: Spacing.m,
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.l,
//     padding: Spacing.l,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 6,
//     marginBottom: Spacing.l,
//   },
//   exploreScroll: {
//     paddingVertical: Spacing.s,
//   },
//   exploreItem: {
//     alignItems: 'center',
//     marginRight: Spacing.m,
//   },
//   exploreImage: {
//     width: 60,
//     height: 60,
//     borderRadius: BorderRadius.m, // Square with rounded corners
//     marginBottom: Spacing.xs,
//     borderWidth: 2,
//     borderColor: Colors.accent, // Accent border for discovery items
//   },
//   exploreItemText: {
//     fontSize: 13,
//     color: Colors.textPrimary,
//     fontWeight: '500',
//   },

//   // --- Floating Action Button (FAB) and Menu ---
//   fab: {
//     position: 'absolute',
//     bottom: Spacing.l,
//     right: Spacing.l,
//     backgroundColor: Colors.primary,
//     width: Spacing.xxl,
//     height: Spacing.xxl,
//     borderRadius: BorderRadius.xxl,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.4,
//     shadowRadius: 10,
//     elevation: 15,
//     zIndex: 10,
//   },
//   fabExpanded: {
//     transform: [{ rotate: '45deg' }], // Rotate the '+' to an 'X'
//     backgroundColor: Colors.destructive, // Change color when expanded
//   },
//   fabMainText: {
//     color: Colors.cardBackground,
//     fontSize: 32,
//     lineHeight: 32,
//     fontWeight: '300',
//   },
//   fabMenu: {
//     position: 'absolute',
//     bottom: Spacing.l + Spacing.xxl + Spacing.m, // Position above FAB
//     right: Spacing.l,
//     alignItems: 'flex-end', // Align menu items to the right
//     zIndex: 9,
//   },
//   fabMenuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.accent, // Use accent for menu items
//     paddingVertical: Spacing.s,
//     paddingHorizontal: Spacing.m,
//     borderRadius: BorderRadius.xl, // Pill shape
//     marginBottom: Spacing.s,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   fabMenuItemText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: '500',
//     marginLeft: Spacing.s,
//   },
// });




// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// // Optional: Import Feather Icons if you have expo-vector-icons installed
// // import { Feather } from '@expo/vector-icons';

// // --- Constants for Consistent Theming ---
// const Colors = {
//   primary: '#1E90FF', // Dodger Blue - A strong, vibrant, and approachable blue
//   secondary: '#FF6347', // Tomato - A warm, inviting accent for highlights/buttons
//   background: '#F8F9FA', // Very light grey for a clean canvas
//   cardBackground: '#FFFFFF', // Pure white
//   textPrimary: '#2C3E50', // Dark Charcoal for main text
//   textSecondary: '#7F8C8D', // Muted Grey for labels
//   border: 'rgba(0,0,0,0.1)', // Subtle border/divider for transparency effects
//   shadow: 'rgba(0,0,0,0.1)', // General shadow
//   overlay: 'rgba(0,0,0,0.3)', // Dark overlay for header text legibility
//   destructive: '#DC3545', // Red for logout
// };

// const Spacing = {
//   xs: 4,
//   s: 8,
//   m: 16,
//   l: 24,
//   xl: 32,
//   xxl: 48,
// };

// const BorderRadius = {
//   s: 6,
//   m: 10,
//   l: 18,
//   xl: 25, // Buttons
//   xxl: 70, // Avatar
// };

// const ScreenWidth = Dimensions.get('window').width;
// const HeaderHeight = ScreenWidth * 0.7; // Dynamic header height

// // --- Custom function to decode JWT (NO CHANGES HERE) ---
// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) {
//     throw new Error('Invalid token format');
//   }
//   const payload = parts[1];
//   const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//   const decoded = JSON.parse(atob(base64));
//   return decoded;
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOwnProfile = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/');
//         return;
//       }

//       try {
//         const decoded = decodeJWT(token);
//         const loggedUserId = decoded.UserId;

//         const res = await axios.get(
//           `https://backend-k.vercel.app/user/profile/${loggedUserId}`,
//           {
//             headers: { 'x-auth-token': token },
//           }
//         );

//         setProfile(res.data.Profile);
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//         setError(err);
//         router.replace("/login")
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwnProfile();
//   }, []);

//   // --- Logout handler (NO CHANGES HERE) ---
//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             router.replace('/login');
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   // --- Loading and Error States ---
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Crafting your visual story...</Text>
//       </View>
//     );
//   }

//   if (error || !profile) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error ? error.message : 'Failed to load profile. Please try again.'}
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/')}>
//           <Text style={styles.retryButtonText}>Go Back Home</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { user, posts } = profile;

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>

//         {/* --- Immersive Header Section --- */}
//         <View style={styles.headerBackgroundContainer}>
//           <Image
//             source={{ uri: user.profilePicture || 'https://via.placeholder.com/600x400/87CEEB/FFFFFF?text=Background' }} // Placeholder for a background image
//             style={styles.headerBackground}
//             resizeMode="cover"
//           />
//           <View style={styles.headerOverlay} />

//           <View style={styles.headerContent}>
//             <Image
//               source={{ uri: user.profilePicture || 'https://via.placeholder.com/120/1E90FF/FFFFFF?text=User' }}
//               style={styles.avatar}
//             />
//             <Text style={styles.username}>{user.username}</Text>
//             <Text style={styles.userHandle}>@{user.username.toLowerCase().replace(/\s/g, '') || 'yourhandle'}</Text>
//             <Text style={styles.bioText}>{user.bio || 'Sharing my world, one visual story at a time. Photography & adventures.'}</Text>

//             {/* --- Action Buttons on Header --- */}
//             <View style={styles.headerActionButtons}>
//               <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.8}>
//                 {/* {Feather && <Feather name="user-plus" size={16} color={Colors.cardBackground} style={styles.buttonIcon} />} */}
//                 <Text style={styles.primaryActionButtonText}>Follow</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.secondaryActionButton} activeOpacity={0.8}>
//                 {/* {Feather && <Feather name="edit" size={16} color={Colors.cardBackground} style={styles.buttonIcon} />} */}
//                 <Text style={styles.secondaryActionButtonText}>Edit Profile</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {/* --- Floating Stats Bar --- */}
//         <View style={styles.statsBarFloating}>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>{user.Followers?.length || 0}</Text>
//             <Text style={styles.statLabel}>Followers</Text>
//           </View>
//           <View style={styles.statSeparator} />
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>{user.Followings?.length || 0}</Text>
//             <Text style={styles.statLabel}>Following</Text>
//           </View>
//           <View style={styles.statSeparator} />
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>{posts?.length || 0}</Text>
//             <Text style={styles.statLabel}>Posts</Text>
//           </View>
//         </View>

//         {/* --- Content Grid --- */}
//         <View style={styles.contentGrid}>
//           {posts && posts.length > 0 ? (
//             posts.map((post, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.gridItem}
//                 onPress={() => Alert.alert('Post View', `Viewing: ${post.title || 'Post'}`)}
//                 activeOpacity={0.8}
//               >
//                 <Image
//                   source={{ uri: post.media }}
//                   style={styles.gridImage}
//                   resizeMode="cover"
//                 />
//               </TouchableOpacity>
//             ))
//           ) : (
//             <Text style={styles.noPostsText}>Your gallery is empty. Time to create some art!</Text>
//           )}
//         </View>

//         <View style={{ height: Spacing.xl * 2 }} /> {/* Extra space at bottom */}
//       </ScrollView>

//       {/* --- Floating Action Button (FAB) --- */}
//       <TouchableOpacity style={styles.fab} onPress={handleLogout}> {/* Logout as main FAB action for now */}
//         {/* {Feather && <Feather name="log-out" size={28} color={Colors.cardBackground} />} */}
//         <Text style={styles.fabText}>LOGOUT</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// // --- Styles ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.background,
//   },
//   loadingText: {
//     marginTop: Spacing.s,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   errorText: {
//     fontSize: 18,
//     color: Colors.destructive,
//     textAlign: 'center',
//     marginBottom: Spacing.m,
//     paddingHorizontal: Spacing.l,
//     fontWeight: '600',
//   },
//   retryButton: {
//     paddingVertical: Spacing.m,
//     paddingHorizontal: Spacing.xl,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.xl,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   retryButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   // --- Immersive Header Section ---
//   headerBackgroundContainer: {
//     width: ScreenWidth,
//     height: HeaderHeight,
//     position: 'relative',
//     marginBottom: Spacing.l, // Space before the content grid starts
//   },
//   headerBackground: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//   },
//   headerOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: Colors.overlay, // Dark overlay for text readability
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerContent: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'flex-end', // Align content to the bottom
//     alignItems: 'center',
//     paddingBottom: Spacing.l + Spacing.xxl, // Make space for the floating stats bar below
//   },
//   avatar: {
//     width: 120, // Slightly smaller avatar for balance
//     height: 120,
//     borderRadius: BorderRadius.xxl,
//     borderWidth: 4,
//     borderColor: Colors.secondary, // Accent color for avatar border
//     marginBottom: Spacing.m,
//   },
//   username: {
//     fontSize: 30,
//     fontWeight: '900',
//     color: Colors.cardBackground, // White text over dark background
//     marginBottom: Spacing.xs,
//   },
//   userHandle: {
//     fontSize: 18,
//     color: 'rgba(255,255,255,0.8)', // Semi-transparent white
//     marginBottom: Spacing.m,
//     fontWeight: '500',
//   },
//   bioText: {
//     fontSize: 15,
//     lineHeight: 22,
//     color: 'rgba(255,255,255,0.9)', // Semi-transparent white
//     textAlign: 'center',
//     marginHorizontal: Spacing.l,
//     marginBottom: Spacing.l,
//   },
//   headerActionButtons: {
//     flexDirection: 'row',
//     width: '80%', // Constrain buttons
//     justifyContent: 'space-around',
//     marginTop: Spacing.m, // Space from bio
//   },
//   primaryActionButton: {
//     flex: 1,
//     marginRight: Spacing.s,
//     paddingVertical: Spacing.m,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.xl,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   primaryActionButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   secondaryActionButton: {
//     flex: 1,
//     marginLeft: Spacing.s,
//     paddingVertical: Spacing.m,
//     backgroundColor: Colors.secondary, // Accent color for secondary
//     borderRadius: BorderRadius.xl,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   secondaryActionButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   buttonIcon: {
//     marginRight: Spacing.xs,
//   },

//   // --- Floating Stats Bar ---
//   statsBarFloating: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: 'rgba(255,255,255,0.95)', // Semi-transparent white background
//     borderRadius: BorderRadius.l,
//     marginHorizontal: Spacing.l, // Inset from edges
//     paddingVertical: Spacing.m,
//     position: 'absolute',
//     width: ScreenWidth - (Spacing.l * 2), // Match margin
//     top: HeaderHeight - Spacing.xxl, // Position partly over header, partly over content
//     zIndex: 5, // Ensure it floats above other elements
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   statItem: {
//     alignItems: 'center',
//     paddingHorizontal: Spacing.s,
//   },
//   statNumber: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },
//   statLabel: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   statSeparator: {
//     width: 1,
//     backgroundColor: Colors.border,
//     marginHorizontal: Spacing.s,
//     opacity: 0.7,
//   },

//   // --- Content Grid ---
//   contentGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: Spacing.s, // Padding for the grid
//     paddingTop: Spacing.l, // Space from the floating stats bar
//   },
//   gridItem: {
//     width: (ScreenWidth - (Spacing.s * 3)) / 2, // 2 columns with spacing
//     height: (ScreenWidth - (Spacing.s * 3)) / 2, // Square aspect ratio
//     marginBottom: Spacing.s,
//     borderRadius: BorderRadius.s,
//     overflow: 'hidden',
//     backgroundColor: Colors.cardBackground, // Background for loading image
//     shadowColor: Colors.shadow, // Subtle shadow for grid items
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   gridImage: {
//     width: '100%',
//     height: '100%',
//   },
//   noPostsText: {
//     textAlign: 'center',
//     marginTop: Spacing.xl,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     width: '100%',
//     paddingHorizontal: Spacing.l,
//     lineHeight: 24,
//   },

//   // --- Floating Action Button (FAB) ---
//   fab: {
//     position: 'absolute',
//     bottom: Spacing.l,
//     right: Spacing.l,
//     backgroundColor: Colors.primary,
//     width: Spacing.xxl + 40, // Wider for text
//     height: Spacing.xxl,
//     borderRadius: BorderRadius.xl, // Pill-shaped
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.4,
//     shadowRadius: 10,
//     elevation: 15,
//     zIndex: 10,
//   },
//   fabText: {
//     color: Colors.cardBackground,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });







// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   ImageBackground, // Import ImageBackground for the blurred header
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// // If using Expo, you might need 'expo-blur' for a true blur effect.
// // import { BlurView } from 'expo-blur'; 

// // --- Constants for Consistent Theming ---
// const Colors = {
//   primary: '#8A2BE2', // Blue Violet - vibrant, modern purple
//   accent: '#FF4500', // Orange Red - bold, energetic accent
//   background: '#F0F2F5', // Light grey for the overall canvas
//   glassOverlay: 'rgba(255, 255, 255, 0.4)', // Translucent white for glass effect
//   glassBorder: 'rgba(255, 255, 255, 0.6)', // Slightly more opaque white for glass border
//   textPrimary: '#2C3E50', // Dark Charcoal
//   textSecondary: '#6C757D', // Muted Grey
//   shadow: 'rgba(0,0,0,0.15)', // More distinct shadow for floating elements
//   destructive: '#DC3545',
// };

// const Spacing = {
//   xs: 4,
//   s: 8,
//   m: 16,
//   l: 24,
//   xl: 32,
//   xxl: 48,
// };

// const BorderRadius = {
//   s: 8,
//   m: 12,
//   l: 25, // For larger cards/sections
//   xl: 35, // For buttons
//   xxl: 75, // For avatar
// };

// const ScreenWidth = Dimensions.get('window').width;
// const HeaderHeight = ScreenWidth * 0.9; // Taller, more immersive header

// // --- Custom function to decode JWT (NO CHANGES HERE) ---
// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) {
//     throw new Error('Invalid token format');
//   }
//   const payload = parts[1];
//   const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//   const decoded = JSON.parse(atob(base64));
//   return decoded;
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOwnProfile = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/');
//         return;
//       }

//       try {
//         const decoded = decodeJWT(token);
//         const loggedUserId = decoded.UserId;

//         const res = await axios.get(
//           `https://backend-k.vercel.app/user/profile/${loggedUserId}`,
//           {
//             headers: { 'x-auth-token': token },
//           }
//         );

//         setProfile(res.data.Profile);
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwnProfile();
//   }, []);

//   // --- Logout handler (NO CHANGES HERE) ---
//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             router.replace('/login');
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   // --- Loading and Error States ---
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Brewing your unique profile...</Text>
//       </View>
//     );
//   }

//   if (error || !profile) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error ? error.message : 'Failed to load profile. Please try again.'}
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/')}>
//           <Text style={styles.retryButtonText}>Go Back Home</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { user, posts } = profile;

//   // Mock categories based on user posts for demonstration
//   const categories = [
//     { name: 'My Posts', count: posts?.length || 0, image: posts?.[0]?.media || 'https://via.placeholder.com/150/8A2BE2/FFFFFF?text=Posts' },
//     { name: 'Favorites', count: 12, image: 'https://via.placeholder.com/150/FF4500/FFFFFF?text=Fav' },
//     { name: 'Saved', count: 8, image: 'https://via.placeholder.com/150/ADD8E6/FFFFFF?text=Saved' },
//     { name: 'Drafts', count: 3, image: 'https://via.placeholder.com/150/9370DB/FFFFFF?text=Drafts' },
//   ];

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>

//         {/* --- Header with Blurred Background --- */}
//         <ImageBackground
//           source={{ uri: user.profilePicture || 'https://via.placeholder.com/600x800/6A5ACD/FFFFFF?text=Header' }} // Use profile pic or generic for background
//           style={styles.headerBg}
//           imageStyle={styles.headerBgImage}
//           blurRadius={8} // Apply blur directly if using ImageBackground, or use BlurView
//         >
//           {/* A simple overlay for better text readability on top of blur */}
//           <View style={styles.headerBlurOverlay} />

//           {/* Header Content */}
//           <View style={styles.headerContent}>
//             <Image
//               source={{ uri: user.profilePicture || 'https://via.placeholder.com/150/8A2BE2/FFFFFF?text=User' }}
//               style={styles.avatar}
//             />
//             <Text style={styles.username}>{user.username}</Text>
//             <Text style={styles.userHandle}>@{user.username.toLowerCase().replace(/\s/g, '') || 'yourhandle'}</Text>
//             <Text style={styles.bioText}>{user.bio || 'Crafting digital experiences with a touch of elegance and a lot of passion.'}</Text>
//           </View>

//           {/* --- Translucent Stats Bar (Glassmorphism Effect) --- */}
//           {/* We'll layer a View that mimics BlurView if expo-blur isn't used */}
//           <View style={styles.statsBarGlassmorphism}>
//             <View style={styles.statsInnerContainer}>
//               <View style={styles.statItem}>
//                 <Text style={styles.statNumber}>{user.Followers?.length || 0}</Text>
//                 <Text style={styles.statLabel}>Followers</Text>
//               </View>
//               <View style={styles.statSeparator} />
//               <View style={styles.statItem}>
//                 <Text style={styles.statNumber}>{user.Followings?.length || 0}</Text>
//                 <Text style={styles.statLabel}>Following</Text>
//               </View>
//               <View style={styles.statSeparator} />
//               <View style={styles.statItem}>
//                 <Text style={styles.statNumber}>{posts?.length || 0}</Text>
//                 <Text style={styles.statLabel}>Posts</Text>
//               </View>
//             </View>
//           </View>
//         </ImageBackground>

//         {/* --- Action Buttons (Below Header, but aligned with general design) --- */}
//         <View style={styles.actionButtonsContainer}>
//           <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.8}>
//             {/* {Feather && <Feather name="user-plus" size={18} color={Colors.cardBackground} />} */}
//             <Text style={styles.primaryActionButtonText}>Follow User</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.secondaryActionButton} activeOpacity={0.8}>
//             {/* {Feather && <Feather name="edit-3" size={18} color={Colors.textPrimary} />} */}
//             <Text style={styles.secondaryActionButtonText}>Edit Profile</Text>
//           </TouchableOpacity>
//         </View>

//         {/* --- Content Categories / Collections --- */}
//         <View style={styles.contentCategoriesSection}>
//           <Text style={styles.sectionTitle}>My Creations</Text>
//           <View style={styles.categoryGrid}>
//             {categories.map((category, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.categoryCard}
//                 onPress={() => Alert.alert('Category View', `Viewing ${category.name}`)}
//                 activeOpacity={0.8}
//               >
//                 <Image
//                   source={{ uri: category.image }}
//                   style={styles.categoryCardImage}
//                   resizeMode="cover"
//                 />
//                 <View style={styles.categoryCardOverlay}>
//                   <Text style={styles.categoryCardName}>{category.name}</Text>
//                   <Text style={styles.categoryCardCount}>{category.count} items</Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* --- User Bio Section (if not in header) --- */}
//         {/* Removed this section as bio is now in header */}

//         <View style={{ height: Spacing.xl * 2 }} /> {/* Extra space at bottom */}
//       </ScrollView>

//       {/* --- Floating Action Button (FAB) --- */}
//       <TouchableOpacity style={styles.fab} onPress={handleLogout}>
//         {/* {Feather && <Feather name="log-out" size={28} color={Colors.cardBackground} />} */}
//         <Text style={styles.fabText}>LOGOUT</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// // --- Styles ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   scrollViewContent: {
//     paddingBottom: Spacing.l, // Add padding bottom for scroll view
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.background,
//   },
//   loadingText: {
//     marginTop: Spacing.s,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   errorText: {
//     fontSize: 18,
//     color: Colors.destructive,
//     textAlign: 'center',
//     marginBottom: Spacing.m,
//     paddingHorizontal: Spacing.l,
//     fontWeight: '600',
//   },
//   retryButton: {
//     paddingVertical: Spacing.m,
//     paddingHorizontal: Spacing.xl,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.xl,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   retryButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   // --- Header with Blurred Background (Glassmorphism inspired) ---
//   headerBg: {
//     width: ScreenWidth,
//     height: HeaderHeight,
//     alignItems: 'center',
//     justifyContent: 'flex-end', // Align content to bottom of header
//     marginBottom: Spacing.l, // Space below header before next elements
//   },
//   headerBgImage: {
//     // This style applies to the Image component rendered by ImageBackground
//     // We can apply blurRadius directly here if it's not a true BlurView component
//   },
//   headerBlurOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.2)', // Slight dark tint for readability
//   },
//   headerContent: {
//     position: 'absolute', // Position content over background
//     bottom: Spacing.xxl + Spacing.m, // Adjusted to make space for floating stats bar
//     alignItems: 'center',
//     width: '100%',
//     paddingHorizontal: Spacing.m,
//   },
//   avatar: {
//     width: 140, // Larger avatar
//     height: 140,
//     borderRadius: BorderRadius.xxl,
//     borderWidth: 5,
//     borderColor: Colors.accent, // Striking accent color border
//     marginBottom: Spacing.m,
//     shadowColor: Colors.shadow, // Shadow for floating effect
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.5,
//     shadowRadius: 10,
//     elevation: 15,
//   },
//   username: {
//     fontSize: 34, // Very large name
//     fontWeight: '900',
//     color: Colors.cardBackground, // White text for contrast
//     marginBottom: Spacing.xs,
//     textShadowColor: 'rgba(0,0,0,0.5)', // Text shadow for legibility
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   userHandle: {
//     fontSize: 18,
//     color: 'rgba(255,255,255,0.9)',
//     marginBottom: Spacing.s,
//     fontWeight: '500',
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   bioText: {
//     fontSize: 15,
//     lineHeight: 22,
//     color: 'rgba(255,255,255,0.9)',
//     textAlign: 'center',
//     marginHorizontal: Spacing.l,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },

//   // --- Translucent Stats Bar (Glassmorphism Effect) ---
//   statsBarGlassmorphism: {
//     position: 'absolute', // Absolutely positioned within ImageBackground
//     bottom: Spacing.m, // Position above the bottom edge of headerBg
//     width: ScreenWidth - (Spacing.l * 2), // Match the horizontal margin
//     marginHorizontal: Spacing.l,
//     backgroundColor: Colors.glassOverlay, // Translucent background
//     borderRadius: BorderRadius.l,
//     borderWidth: 1, // Subtle border
//     borderColor: Colors.glassBorder, // Slightly more opaque border
//     paddingVertical: Spacing.m,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 12,
//     alignSelf: 'center', // Center it horizontally within the ImageBackground
//     overflow: 'hidden', // Ensure content respects border radius
//     // For true glassmorphism, you'd use <BlurView> here from 'expo-blur'
//     // fallback for regular RN: backdropFilter: 'blur(10px)' - but not supported in RN styles directly
//   },
//   statsInnerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: Colors.textPrimary, // Dark text over light glass
//   },
//   statLabel: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   statSeparator: {
//     width: 1,
//     height: '100%',
//     backgroundColor: Colors.glassBorder,
//     opacity: 0.8,
//   },

//   // --- Action Buttons (Below Header) ---
//   actionButtonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginHorizontal: Spacing.m,
//     marginTop: Spacing.xl, // Space from the header bottom
//     marginBottom: Spacing.xl,
//   },
//   primaryActionButton: {
//     flex: 1,
//     marginRight: Spacing.s,
//     paddingVertical: Spacing.m,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.xl,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   primaryActionButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   secondaryActionButton: {
//     flex: 1,
//     marginLeft: Spacing.s,
//     paddingVertical: Spacing.m,
//     backgroundColor: Colors.cardBackground, // White background for secondary
//     borderRadius: BorderRadius.xl,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   secondaryActionButtonText: {
//     color: Colors.textPrimary,
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   // --- Content Categories / Collections ---
//   contentCategoriesSection: {
//     marginHorizontal: Spacing.m,
//     marginBottom: Spacing.l,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//     marginBottom: Spacing.m,
//   },
//   categoryGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   categoryCard: {
//     width: (ScreenWidth - (Spacing.m * 2) - Spacing.m) / 2, // 2 columns with outer/inner spacing
//     height: (ScreenWidth - (Spacing.m * 2) - Spacing.m) / 2, // Square aspect ratio
//     borderRadius: BorderRadius.l, // More rounded corners for cards
//     overflow: 'hidden',
//     marginBottom: Spacing.m,
//     backgroundColor: Colors.cardBackground,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 10,
//   },
//   categoryCardImage: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//   },
//   categoryCardOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.4)', // Dark overlay for text
//     justifyContent: 'flex-end', // Align text to bottom
//     padding: Spacing.s,
//   },
//   categoryCardName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: Colors.cardBackground,
//   },
//   categoryCardCount: {
//     fontSize: 13,
//     color: 'rgba(255,255,255,0.8)',
//   },

//   noPostsText: {
//     textAlign: 'center',
//     marginTop: Spacing.xl,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     width: '100%',
//     paddingHorizontal: Spacing.l,
//     lineHeight: 24,
//   },

//   // --- Floating Action Button (FAB) ---
//   fab: {
//     position: 'absolute',
//     bottom: Spacing.l,
//     right: Spacing.l,
//     backgroundColor: Colors.accent, // Using accent for a pop
//     width: Spacing.xxl + 40,
//     height: Spacing.xxl,
//     borderRadius: BorderRadius.xl,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.4,
//     shadowRadius: 10,
//     elevation: 15,
//     zIndex: 10,
//   },
//   fabText: {
//     color: Colors.cardBackground,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });







// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// const Colors = {
//   primary: '#007BFF',
//   secondary: '#FF4500',
//   tertiary: '#6A5ACD',
//   background: '#F0F2F5',
//   cardBackground: '#FFFFFF',
//   textPrimary: '#212529',
//   textSecondary: '#6C757D',
//   border: '#E0E0E0',
//   shadow: 'rgba(0,0,0,0.15)',
//   destructive: '#DC3545',
//   gradient1: ['#007BFF', '#6A5ACD'],
//   gradient2: ['#FF4500', '#FFD700'],
// };

// const Spacing = {
//   xs: 4,
//   s: 8,
//   m: 16,
//   l: 24,
//   xl: 32,
//   xxl: 48,
// };

// const BorderRadius = {
//   s: 8,
//   m: 12,
//   l: 25,
//   xl: 40,
//   xxl: 80,
// };

// const ScreenWidth = Dimensions.get('window').width;
// const HeaderHeight = ScreenWidth * 0.9;

// const decodeJWT = (token) => {
//   const parts = token.split('.');
//   if (parts.length !== 3) throw new Error('Invalid token format');
//   const payload = parts[1];
//   const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//   const decoded = JSON.parse(atob(base64));
//   return decoded;
// };

// export default function ProfileScreen() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [loggedUserId, setLoggedUserId] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOwnProfile = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/login');
//         return;
//       }

//       try {
//         const decoded = decodeJWT(token);
//         const userId = decoded.UserId;
//         setLoggedUserId(userId);

//         const res = await axios.get(
//           `https://backend-k.vercel.app/user/profile/${userId}`,
//           { headers: { 'x-auth-token': token } }
//         );

//         setProfile(res.data.Profile);
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//         setError(err);
//         router.replace('/login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwnProfile();
//   }, []);

//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             router.replace('/login');
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Building your masterpiece...</Text>
//       </View>
//     );
//   }

//   if (error || !profile) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           {error ? error.message : 'Failed to load profile.'}
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/')}>
//           <Text style={styles.retryButtonText}>Go Back Home</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { user, posts } = profile;
//   const isOwner = user?._id === loggedUserId;

//   const highlights = [
//     { id: '1', title: 'Adventures', image: 'https://via.placeholder.com/80/7F8C8D/FFFFFF?text=Adv' },
//     { id: '2', title: 'Foodies', image: 'https://via.placeholder.com/80/FF4500/FFFFFF?text=Food' },
//     { id: '3', title: 'Creations', image: 'https://via.placeholder.com/80/007BFF/FFFFFF?text=Art' },
//     { id: '4', title: 'Thoughts', image: 'https://via.placeholder.com/80/6A5ACD/FFFFFF?text=Txt' },
//     { id: '5', title: 'Trips', image: 'https://via.placeholder.com/80/F0F2F5/212529?text=Trip' },
//   ];

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>

//         {/* --- Header --- */}
//         <LinearGradient colors={Colors.gradient1} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGradient}>
//           <View style={styles.headerContent}>
//             <Image
//               source={{ uri: user.profilePicture || 'https://via.placeholder.com/160/FFFFFF/007BFF?text=User' }}
//               style={styles.avatar}
//             />
//             <Text style={styles.username}>{user.username}</Text>
//             <Text style={styles.userHandle}>@{user.username?.toLowerCase().replace(/\s/g, '')}</Text>
//             <Text style={styles.bioText}>
//               {user.bio || 'Architect of dreams, curator of moments. Crafting my narrative in pixels and passion.'}
//             </Text>
//           </View>
//         </LinearGradient>

//         {/* --- Stats --- */}
//         <View style={styles.statChipsContainer}>
//           <View style={styles.statChip}>
//             <Text style={styles.statChipNumber}>{user.Followers?.length || 0}</Text>
//             <Text style={styles.statChipLabel}>Followers</Text>
//           </View>
//           <View style={styles.statChip}>
//             <Text style={styles.statChipNumber}>{user.Followings?.length || 0}</Text>
//             <Text style={styles.statChipLabel}>Following</Text>
//           </View>
//           <View style={styles.statChip}>
//             <Text style={styles.statChipNumber}>{posts?.length || 0}</Text>
//             <Text style={styles.statChipLabel}>Posts</Text>
//           </View>
//         </View>

//         {/* --- Profile Mode Info --- */}
//         {!isOwner && (
//           <View style={{ alignSelf: 'center', backgroundColor: Colors.tertiary, padding: 6, borderRadius: 8, marginBottom: Spacing.s }}>
//             <Text style={{ color: 'white', fontSize: 12 }}>Viewing Public Profile</Text>
//           </View>
//         )}

//         {/* --- Buttons --- */}
//         <View style={styles.actionButtonsContainer}>
//           {isOwner ? (
//             <>
//               <TouchableOpacity style={styles.primaryActionButton}>
//                 <Text style={styles.primaryActionButtonText}>Edit Profile</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.secondaryActionButton} onPress={handleLogout}>
//                 <Text style={styles.secondaryActionButtonText}>Logout</Text>
//               </TouchableOpacity>
//             </>
//           ) : (
//             <>
//               <TouchableOpacity style={styles.primaryActionButton}>
//                 <Text style={styles.primaryActionButtonText}>Follow</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.secondaryActionButton}>
//                 <Text style={styles.secondaryActionButtonText}>Message</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>

//         {/* --- Highlights --- */}
//         <View style={styles.highlightsSection}>
//           <Text style={styles.sectionTitle}>Story Highlights</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlightsScrollContent}>
//             {highlights.map((item) => (
//               <TouchableOpacity key={item.id} style={styles.highlightItem}>
//                 <LinearGradient colors={Colors.gradient2} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.highlightRing}>
//                   <Image source={{ uri: item.image }} style={styles.highlightImage} />
//                 </LinearGradient>
//                 <Text style={styles.highlightText}>{item.title}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         {/* --- Posts --- */}
//         <View style={styles.contentModuleSection}>
//           <Text style={styles.sectionTitle}>My Gallery</Text>
//           <View style={styles.postModulesContainer}>
//             {posts && posts.length > 0 ? (
//               posts.map((post, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.postModuleCard,
//                     index % 3 === 0 ? styles.postModuleFullWidth : styles.postModuleHalfWidth,
//                     { backgroundColor: Colors.cardBackground },
//                   ]}
//                   onPress={() => Alert.alert('Post Detail', `Post ${index + 1}`)}
//                   activeOpacity={0.8}
//                 >
//                   <Image
//                     source={{ uri: post.media }}
//                     style={[styles.postModuleImage, index % 3 === 0 ? { height: 220 } : { height: 120 }]}
//                     resizeMode="cover"
//                   />
//                   <View style={styles.postModuleTextContent}>
//                     <Text style={styles.postModuleTitle}>{post.title || `Moment ${index + 1}`}</Text>
//                     <Text style={styles.postModuleDate}>July 3, 2025</Text>
//                   </View>
//                 </TouchableOpacity>
//               ))
//             ) : (
//               <Text style={styles.noPostsText}>Your creative journey begins now. Share your first post!</Text>
//             )}
//           </View>
//         </View>

//         <View style={{ height: Spacing.xl * 2 }} />
//       </ScrollView>

//       {/* --- Logout FAB for owner only --- */}
//       {isOwner && (
//         <TouchableOpacity style={styles.fab} onPress={handleLogout}>
//           <Text style={styles.fabText}>LOGOUT</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }


// // --- Styles --
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   scrollViewContent: {
//     paddingBottom: Spacing.l,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.background,
//   },
//   loadingText: {
//     marginTop: Spacing.s,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   errorText: {
//     fontSize: 18,
//     color: Colors.destructive,
//     textAlign: 'center',
//     marginBottom: Spacing.m,
//     paddingHorizontal: Spacing.l,
//     fontWeight: '600',
//   },
//   retryButton: {
//     paddingVertical: Spacing.m,
//     paddingHorizontal: Spacing.xl,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.xl,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   retryButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   // --- Dynamic Header Section ---
//   headerGradient: {
//     width: ScreenWidth,
//     height: HeaderHeight,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: Spacing.xl * 2, // Space from top status bar
//     paddingBottom: Spacing.xxl + Spacing.l, // Space for content below it
//     marginBottom: Spacing.l, // Space below header
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     elevation: 20,
//   },
//   headerContent: {
//     alignItems: 'center',
//     marginTop: - Spacing.xxl * 2, // Pull content up slightly over gradient bottom
//   },
//   avatar: {
//     width: 150, // Very large avatar
//     height: 150,
//     borderRadius: BorderRadius.xxl,
//     borderWidth: 6,
//     borderColor: Colors.cardBackground, // White border for contrast on gradient
//     marginBottom: Spacing.m,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.6,
//     shadowRadius: 12,
//     elevation: 15,
//   },
//   username: {
//     fontSize: 36,
//     fontWeight: '900',
//     color: Colors.cardBackground,
//     marginBottom: Spacing.xs,
//     textShadowColor: 'rgba(0,0,0,0.3)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   userHandle: {
//     fontSize: 20,
//     color: 'rgba(255,255,255,0.9)',
//     marginBottom: Spacing.m,
//     fontWeight: '500',
//     textShadowColor: 'rgba(0,0,0,0.3)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   bioText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: 'rgba(255,255,255,0.9)',
//     textAlign: 'center',
//     marginHorizontal: Spacing.xl,
//     fontWeight: '300', // Lighter weight for a softer feel
//     textShadowColor: 'rgba(0,0,0,0.3)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },

//   // --- Interactive Stat Chips ---
//   statChipsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '90%', // Keep it slightly narrower than screen
//     alignSelf: 'center',
//     marginTop: -Spacing.xxl * 1.5, // Pulls it up into the header gradient
//     marginBottom: Spacing.xl,
//     zIndex: 2, // Ensure it's above other content
//   },
//   statChip: {
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.xl, // Pill-shaped
//     paddingVertical: Spacing.s,
//     paddingHorizontal: Spacing.m,
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 10,
//     minWidth: 90, // Ensure consistent size
//   },
//   statChipNumber: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//   },
//   statChipLabel: {
//     fontSize: 13,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },

//   // --- Action Buttons (Slightly Floating) ---
//   actionButtonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginHorizontal: Spacing.m,
//     marginBottom: Spacing.xl,
//     zIndex: 1, // Ensure above other general content
//   },
//   primaryActionButton: {
//     flex: 1,
//     marginRight: Spacing.s,
//     paddingVertical: Spacing.m,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.xl,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   primaryActionButtonText: {
//     color: Colors.cardBackground,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   secondaryActionButton: {
//     flex: 1,
//     marginLeft: Spacing.s,
//     paddingVertical: Spacing.m,
//     backgroundColor: Colors.cardBackground,
//     borderRadius: BorderRadius.xl,
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   secondaryActionButtonText: {
//     color: Colors.textPrimary,
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   // --- Story Highlights Section ---
//   highlightsSection: {
//     marginHorizontal: Spacing.m,
//     marginBottom: Spacing.xl,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//     marginBottom: Spacing.m,
//     marginLeft: Spacing.s, // Indent title slightly
//   },
//   highlightsScrollContent: {
//     paddingHorizontal: Spacing.s, // Add some padding inside scroll
//   },
//   highlightItem: {
//     alignItems: 'center',
//     marginRight: Spacing.m,
//   },
//   highlightRing: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: Spacing.xs,
//     padding: 3, // Create a border effect with padding
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   highlightImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 35, // Smaller radius inside the ring
//     borderWidth: 3,
//     borderColor: Colors.cardBackground, // White border around actual image
//   },
//   highlightText: {
//     fontSize: 13,
//     color: Colors.textPrimary,
//     fontWeight: '500',
//     marginTop: Spacing.xs,
//   },

//   // --- Modular Content Display (Posts) ---
//   contentModuleSection: {
//     marginHorizontal: Spacing.m,
//     marginBottom: Spacing.l,
//   },
//   postModulesContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: Spacing.s, // Padding around the modules
//   },
//   postModuleCard: {
//     borderRadius: BorderRadius.l, // Rounded corners for each module
//     overflow: 'hidden',
//     marginBottom: Spacing.m,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 12,
//   },
//   postModuleFullWidth: {
//     width: ScreenWidth - (Spacing.m * 2) - (Spacing.s * 2), // Full width of the content area
//     marginHorizontal: 0, // No extra margin needed as it's full width
//   },
//   postModuleHalfWidth: {
//     width: (ScreenWidth - (Spacing.m * 2) - (Spacing.s * 3)) / 2, // Half width for two columns
//   },
//   postModuleImage: {
//     width: '100%',
//   },
//   postModuleTextContent: {
//     padding: Spacing.m,
//   },
//   postModuleTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//     marginBottom: Spacing.xs,
//   },
//   postModuleDate: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//   },
//   noPostsText: {
//     textAlign: 'center',
//     marginTop: Spacing.xl,
//     fontSize: 16,
//     color: Colors.textSecondary,
//     width: '100%',
//     paddingHorizontal: Spacing.l,
//     lineHeight: 24,
//   },

//   // --- Floating Action Button (FAB) ---
//   fab: {
//     position: 'absolute',
//     bottom: Spacing.l,
//     right: Spacing.l,
//     backgroundColor: Colors.secondary, // Bright accent for FAB
//     width: Spacing.xxl + 40,
//     height: Spacing.xxl,
//     borderRadius: BorderRadius.xl,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.4,
//     shadowRadius: 10,
//     elevation: 15,
//     zIndex: 10,
//   },
//   fabText: {
//     color: Colors.cardBackground,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });










// ✅ Updated ProfileScreen with refresh feature and media display improvements

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const router = useRouter();

  const fetchOwnProfile = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return router.replace('/login');
    try {
      const decoded = decodeJWT(token);
      const userId = decoded.UserId;
      setLoggedUserId(userId);
      const res = await axios.get(`https://backend-k.vercel.app/user/profile/${userId}`, {
        headers: { 'x-auth-token': token },
      });
      setProfile(res.data.Profile);
    } catch (err) {
      setError(err);
      router.replace('/login');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOwnProfile();
  }, [fetchOwnProfile]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOwnProfile();
  }, [fetchOwnProfile]);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          router.replace('/login');
        },
      },
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  if (error || !profile) return <View style={styles.center}><Text>Error loading profile</Text></View>;

  const { user, posts } = profile;
  const isOwner = user?._id === loggedUserId;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <LinearGradient colors={Colors.gradient1} style={styles.header}>
          <Image
            source={{ uri: user.profilePicture || 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
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
              <Image
                key={i}
                source={{ uri: post.media }}
                style={styles.gridItem}
                resizeMode="cover"
              />
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
  header: {
    alignItems: 'center',
    padding: Spacing.xl,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: Spacing.m,
  },
  username: { fontSize: 22, fontWeight: '700', color: '#fff' },
  userHandle: { color: '#fff', marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: Spacing.l,
  },
  stat: { fontSize: 16, color: Colors.textPrimary },
  bold: { fontWeight: 'bold' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.l,
  },
  button: {
    padding: Spacing.s,
    paddingHorizontal: Spacing.l,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  logout: { backgroundColor: Colors.destructive },
  message: { backgroundColor: Colors.tertiary },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: Spacing.m,
    marginTop: Spacing.m,
    marginBottom: Spacing.s,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
  },
  gridItem: {
    width: (ScreenWidth - Spacing.m * 3) / 2,
    height: 220,
    marginBottom: Spacing.m,
    borderRadius: 10,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontStyle: 'italic',
    padding: Spacing.l,
  },
});
