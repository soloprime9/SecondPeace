import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const ListId = [
  "6822f740837865db851a8fd9", "6822f65b837865db851a8fd6", "6822f5e2837865db851a8fd3",
  "6822e769a506ae6cbbc9bf52", "6822e715a506ae6cbbc9bf4f", "6822e672a506ae6cbbc9bf4c",
  "6822e645a506ae6cbbc9bf49", "6810749cb98938fd31f6d35b", "68107476b98938fd31f6d358",
  "68107451b98938fd31f6d355", "6810742ab98938fd31f6d351", "67b28584f090c59509bdaf10",
  "67b1875a94bde7d066dfcd05", "67b1849f6a9b31f132629d81", "67b184166a9b31f132629d7e",
  "67aeddfb00c49d67169a054f", "67ab201887be7041220810d4"
];

const MobileBottomNavBar = () => {
  const navigation = useNavigation();

  const handleVideoId = () => {
    const randomId = ListId[Math.floor(Math.random() * ListId.length)];
    navigation.navigate('ShortScreen', { id: randomId });
  };

  return (
    <>
      {/* Top Nav (Optional) */}
      <View style={styles.topNav}>
        <Text style={styles.topTitle}>My App</Text>
      </View>

      {/* Bottom Nav */}
      <View style={styles.wrapper}>
        <Svg
          width={Dimensions.get('window').width}
          height={70}
          viewBox="0 0 144 70"
          style={styles.svgCurve}
        >
          <Path
            fill="#ffffff"
            d="M0,0 L144,0 L144,70 C100,50 44,50 0,70 Z"
          />
        </Svg>


        <View style={styles.navbar}>

        <Link href="/home" asChild>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="home-outline" size={26} color="#4B5563" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>
      </Link>


  <Link href="/create" asChild>
    <TouchableOpacity style={styles.iconButton}>
      <Ionicons name="search-outline" size={26} color="#4B5563" />
      <Text style={styles.label}>Search</Text>
    </TouchableOpacity>
  </Link>

  <Link href="/tools" asChild>
    <TouchableOpacity style={styles.iconButton}>
      <Ionicons name="folder-outline" size={26} color="#4B5563" />
      <Text style={styles.label}>Library</Text>
    </TouchableOpacity>
  </Link>

  <Link href="/profile" asChild>
    <TouchableOpacity style={styles.iconButton}>
      <MaterialIcons name="person-outline" size={26} color="#4B5563" />
      <Text style={styles.label}>Profile</Text>
    </TouchableOpacity>
  </Link>
</View>

      </View>
    </>
  );
};

export default MobileBottomNavBar;

const styles = StyleSheet.create({
  topNav: {
    backgroundColor: 'blue',
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  topTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 1000,
  },
  svgCurve: {
    position: 'absolute',
    bottom: 0,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'blue',
    height: 70,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    paddingBottom: 8,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  label: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  centerButton: {
    backgroundColor: '#2563EB',
    borderRadius: 50,
    padding: 16,
    marginBottom: 30,
    elevation: 6,
  },
});