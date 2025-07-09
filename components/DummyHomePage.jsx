// import * as Clipboard from 'expo-clipboard';

// import axios from 'axios';
// import { Link } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// // Dummy formatPostTime helper (replace with your own)
// const formatPostTime = (timestamp) => {
//   const diff = Math.floor((Date.now() - new Date(timestamp)) / 60000); // minutes ago
//   if (diff < 1) return 'Just now';
//   if (diff < 60) return `${diff} minutes ago`;
//   const hours = Math.floor(diff / 60);
//   if (hours < 24) return `${hours} hours ago`;
//   const days = Math.floor(hours / 24);
//   return `${days} days ago`;
// };

// export default function Posts() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchContent = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('https://backendk-z915.onrender.com/content/get');
//       setData(response.data);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch posts.');
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchContent();
//   }, []);

//   const handleShare = async(post) => {
//     const postURL = `https://your-app-domain.com/post/${post._id}`;
//     const shareText = `${post.content}\nFond Peace\n${postURL}`;

//     try {
//     await Clipboard.setStringAsync(shareText);
//     Alert.alert("Copied", "Text Successfully Copied!");
//   } catch (error) {
//     Alert.alert("Error", "Failed to copy text.");
//   }
//     ;
//   };

//   // Render post item for FlatList
//   const renderPostItem = ({ item }) => (

//     <View style={styles.postContainer}>
//       <TouchableOpacity
//         onPress={() => Alert.alert('Navigate', `Open post ${item._id}`)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.postHeader}>
//           <Image
//             source={{
//               uri:
//                 'https://images.macrumors.com/t/5K1xePYg0aiVFhfzTAd8181ROw8=/800x0/article-new/2024/07/Apple-TV-Plus-Feature-2-Magenta-and-Blue.jpg?lossy',
//             }}
//             style={styles.avatar}
//           />
//           <View>
//             <Link href="/reducer"><Text style={styles.username}>Human Cant</Text></Link>

//             <Text style={styles.postTime}>{formatPostTime(item.timestamp)}</Text>
//           </View>
//           <Text style={styles.moreDots}>...</Text>
//         </View>

//         <Text style={styles.postContent}>{item.content}</Text>

//         {item.imageURL ? (
//           <Image source={{ uri: item.imageURL }} style={styles.postImage} resizeMode="contain" />
//         ) : null}
//       </TouchableOpacity>

//       <View style={styles.postActions}>
//         <TouchableOpacity activeOpacity={0.7}>
//           <Text style={styles.actionText}>Like</Text>
//         </TouchableOpacity>
//         <TouchableOpacity activeOpacity={0.7}>
//           <Text style={styles.actionText}>Comment</Text>
//         </TouchableOpacity>
//         <TouchableOpacity activeOpacity={0.7} onPress={() => handleShare(item)}>
//           <Text style={[styles.actionText, styles.shareText]}>Share</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   // Left sidebar links
//   const leftSidebarItems = ['Worlds', 'Search', 'Account', 'Setting', 'Privacy'];

//   // Right sidebar profiles (dummy repeat)
//   const rightSidebarProfiles = new Array(5).fill({
//     avatar:
//       'https://images.news18.com/ibnlive/uploads/2024/10/apple-iphone-16-pro-review-2024-10-b233e14934d84136a958a7037a4011aa-16x9.jpg?impolicy=website&width=640&height=360',
//     name: 'Human Cant',
//   });

//   const windowWidth = Dimensions.get('window').width;
//   const isLargeScreen = windowWidth >= 768; // For tablet or larger, show sidebars

//   return (
//     <View style={styles.container}>
//       {loading && (
//         <View style={styles.loadingOverlay}>
//           <ActivityIndicator size="large" color="#555" />
//           <Text>Loading posts...</Text>
//         </View>
//       )}

//       <View style={styles.innerContainer}>
//         {/* Left Sidebar */}
//         {isLargeScreen && (
//           <ScrollView style={styles.leftSidebar} showsVerticalScrollIndicator={false}>
//             {leftSidebarItems.map((item, i) => (
//               <Text key={i} style={styles.leftSidebarItem}>
//                 {item}
//               </Text>
//             ))}
//           </ScrollView>
//         )}

//         {/* Main Content */}
//         <View style={styles.mainContent}>
//           {data.length === 0 && !loading ? (
//             <Text style={styles.noPostsText}>No posts found.</Text>
//           ) : (
//             <FlatList
//               data={[...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))}
//               keyExtractor={(item) => item._id}
//               renderItem={renderPostItem}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={{ paddingBottom: 50 }}
//             />
//           )}
//         </View>

//         {/* Right Sidebar */}
//         {isLargeScreen && (
//           <ScrollView style={styles.rightSidebar} showsVerticalScrollIndicator={false}>
//             {rightSidebarProfiles.map((profile, i) => (
//               <View key={i} style={styles.profileItem}>
//                 <View style={styles.profileInfo}>
//                   <Image source={{ uri: profile.avatar }} style={styles.avatarSmall} />
//                   <Text style={styles.profileName} numberOfLines={1}>
//                     {profile.name}
//                   </Text>
//                 </View>
//                 <TouchableOpacity style={styles.profileButton} activeOpacity={0.7}>
//                   <Text style={styles.profileButtonText}>Profile</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         )}
//       </View>

      
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   innerContainer: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: '#fffccccc',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   leftSidebar: {
//     width: 150,
//     padding: 10,
//     borderRightWidth: 1,
//     borderRightColor: '#ccc',
//   },
//   leftSidebarItem: {
//     fontWeight: 'bold',
//     fontSize: 18,
//     marginVertical: 12,
//   },
//   mainContent: {
//     flex: 1,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   noPostsText: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#777',
//   },
//   postContainer: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 16,
//     backgroundColor: '#fafafa',
//   },
//   postHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 2,
//     borderColor: '#999',
//     marginRight: 12,
//   },
//   username: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   postTime: {
//     fontSize: 12,
//     color: '#888',
//   },
//   moreDots: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginLeft: 'auto',
//   },
//   postContent: {
//     fontSize: 15,
//     marginBottom: 10,
//   },
//   postImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 10,
//   },
//   postActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   actionText: {
//     fontSize: 14,
//     color: '#555',
//   },
//   shareText: {
//     color: '#007bff',
//   },
//   rightSidebar: {
//     width: 300,
//     padding: 10,
//     borderLeftWidth: 1,
//     borderLeftColor: '#ccc',
//   },
//   profileItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     justifyContent: 'space-between',
//   },
//   profileInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     marginRight: 10,
//   },
//   avatarSmall: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 2,
//     borderColor: '#999',
//     marginRight: 10,
//   },
//   profileName: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     flexShrink: 1,
//   },
//   profileButton: {
//     borderWidth: 2,
//     borderColor: '#333',
//     borderRadius: 15,
//     paddingVertical: 4,
//     paddingHorizontal: 12,
//   },
//   profileButtonText: {
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
// });














// // import { Image } from 'expo-image';
// // import { Platform, StyleSheet } from 'react-native';

// // import { HelloWave } from '@/components/HelloWave';
// // import ParallaxScrollView from '@/components/ParallaxScrollView';
// // import { ThemedText } from '@/components/ThemedText';
// // import { ThemedView } from '@/components/ThemedView';

// // export default function HomeScreen() {
// //   return (
// //     <ParallaxScrollView
// //       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
// //       headerImage={
// //         <Image
// //           source={require('@/assets/images/partial-react-logo.png')}
// //           style={styles.reactLogo}
// //         />
// //       }>
// //       <ThemedView style={styles.titleContainer}>
// //         <ThemedText type="title">Welcome!</ThemedText>
// //         <HelloWave />
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
// //         <ThemedText>
// //           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
// //           Press{' '}
// //           <ThemedText type="defaultSemiBold">
// //             {Platform.select({
// //               ios: 'cmd + d',
// //               android: 'cmd + m',
// //               web: 'F12',
// //             })}
// //           </ThemedText>{' '}
// //           to open developer tools.
// //         </ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
// //         <ThemedText>
// //           {`Tap the Explore tab to learn more about what's included in this starter app.`}
// //         </ThemedText>
// //       </ThemedView>

// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 0: Mental</ThemedText>
// //         <ThemedText>{'Tap the Explore Tab to see the mental People In Your Area'}</ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
// //         <ThemedText>
// //           {`When you're ready, run `}
// //           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
// //           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
// //         </ThemedText>
// //       </ThemedView>
// //     </ParallaxScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   titleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   stepContainer: {
// //     gap: 8,
// //     marginBottom: 8,
// //   },
// //   reactLogo: {
// //     height: 178,
// //     width: 290,
// //     bottom: 0,
// //     left: 0,
// //     position: 'absolute',
// //   },
// // });

