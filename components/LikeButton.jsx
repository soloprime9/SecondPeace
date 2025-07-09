// // ----------------------------
// // 2. components/LikeButton.jsx
// // ----------------------------
// import { useState } from 'react';
// import { Text, TouchableOpacity } from 'react-native';

// const LikeButton = ({ postId, initialLikes = 0 }) => {
//   const [likes, setLikes] = useState(initialLikes);
//   const [liked, setLiked] = useState(false);

//   const handleLike = async () => {
//     try {
//       const res = await fetch(`https://backend-k.vercel.app/post/like/${postId}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: 'yourUserId' }),
//       });
//       setLiked(!liked);
//       setLikes(prev => liked ? prev - 1 : prev + 1);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <TouchableOpacity onPress={handleLike}>
//       <Text style={{ fontSize: 24, color: liked ? 'red' : 'white' }}>❤️</Text>
//       <Text style={{ color: 'white', fontSize: 12 }}>{likes}</Text>
//     </TouchableOpacity>
//   );
// };

// export default LikeButton;