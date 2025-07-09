import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const CommentButton = ({ count }) => (
  <View style={{ alignItems: 'center' }}>
    <TouchableOpacity>
      <Text style={{ fontSize: 24, color: 'white' }}>💬</Text>
    </TouchableOpacity>
    <Text style={{ color: 'white', fontSize: 12 }}>{count}</Text>
  </View>
);

export default CommentButton;
