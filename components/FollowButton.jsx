// ----------------------------
// 4. components/FollowButton.jsx
// ----------------------------
import { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

const FollowButton = ({ userId }) => {
  const [following, setFollowing] = useState(false);

  const toggleFollow = async () => {
    try {
      const res = await fetch(`https://backend-k.vercel.app/user/follow/${userId}`, {
        method: 'POST',
        headers: { Authorization: 'Bearer YOUR_TOKEN' },
      });
      setFollowing(prev => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TouchableOpacity onPress={toggleFollow}>
      <Text style={{ color: 'white', fontSize: 14 }}>{following ? 'Unfollow' : 'Follow'}</Text>
    </TouchableOpacity>
  );
};

export default FollowButton;