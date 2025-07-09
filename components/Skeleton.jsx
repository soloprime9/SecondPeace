// import { Dimensions, StyleSheet, View } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

// const ShimmerSkeleton = () => {
//   const width = Dimensions.get('window').width;

//   return (
//     <View style={styles.container}>
//       {/* Banner */}
//       <ShimmerPlaceholder
//         style={styles.banner}
//         shimmerColors={['#e0e0e0', '#c6c6c6', '#e0e0e0']}
//         LinearGradient={LinearGradient}
//       />

//       {/* Profile row */}
//       <View style={styles.profileRow}>
//         <ShimmerPlaceholder
//           style={styles.avatar}
//           shimmerColors={['#e0e0e0', '#c6c6c6', '#e0e0e0']}
//           LinearGradient={LinearGradient}
//         />
//         <ShimmerPlaceholder
//           style={styles.name}
//           shimmerColors={['#e0e0e0', '#c6c6c6', '#e0e0e0']}
//           LinearGradient={LinearGradient}
//         />
//       </View>

//       {/* Bio */}
//       <ShimmerPlaceholder
//         style={styles.bio}
//         shimmerColors={['#e0e0e0', '#c6c6c6', '#e0e0e0']}
//         LinearGradient={LinearGradient}
//       />

//       {/* Grid of post placeholders */}
//       <View style={styles.grid}>
//         {[...Array(6)].map((_, idx) => (
//           <ShimmerPlaceholder
//             key={idx}
//             style={styles.postBox}
//             shimmerColors={['#e0e0e0', '#c6c6c6', '#e0e0e0']}
//             LinearGradient={LinearGradient}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 16 },
//   banner: {
//     width: '100%',
//     height: 80,
//     marginBottom: 16,
//     borderRadius: 6,
//   },
//   profileRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   name: {
//     width: 120,
//     height: 20,
//     marginLeft: 12,
//     borderRadius: 6,
//   },
//   bio: {
//     width: '80%',
//     height: 16,
//     marginBottom: 20,
//     borderRadius: 6,
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     gap: 6,
//   },
//   postBox: {
//     width: (Dimensions.get('window').width - 48) / 3,
//     height: 100,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
// });

// export default ShimmerSkeleton;