import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const checkPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 1) return { label: 'Weak', color: 'red' };
  else if (strength === 2) return { label: 'Medium', color: 'orange' };
  else if (strength >= 3) return { label: 'Strong', color: 'green' };
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const Signup = ({ navigation, setUserToken }) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailAvailable, setEmailAvailable] = useState(null); // null = not checked, true/false
  const [emailChecking, setEmailChecking] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ label: '', color: 'gray' });
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  // Check email availability on blur
  const checkEmailAvailability = async () => {
    if (!validateEmail(email)) return;
    setEmailChecking(true);
    try {
      const res = await axios.post('https://backendk-z915.onrender.com/user/check-email', { email });
      // Assuming backend returns { available: true } if email not used
      setEmailAvailable(res.data.available);
      if (!res.data.available) {
        setErrors((prev) => ({ ...prev, email: 'Email already in use' }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    } catch {
      // ignore or set generic error
      setEmailAvailable(null);
    }
    setEmailChecking(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = 'Username is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    else if (emailAvailable === false) newErrors.email = 'Email already in use';

    if (!password) newErrors.password = 'Password is required';
    else if (passwordStrength.label === 'Weak') newErrors.password = 'Password is too weak';

    if (!confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (!termsAccepted) newErrors.terms = 'You must accept the Terms & Conditions';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('https://backendk-z915.onrender.com/user/add', {
        username,
        email,
        password,
      });

      // Assume backend returns token on signup (or you can do login separately)
      const token = response.data.token;
      if (token) {
        await AsyncStorage.setItem('token', token);
        setUserToken(token); // update auth state in App.js
      }

      setLoading(false);
      Alert.alert('Success', 'Account created successfully!');

      // ✅ Redirect to tabs/home after login
      router.replace('/login');
      // Navigate to Profile handled by auth state in App.js
    } catch (error) {
      setLoading(false);
      Alert.alert('Signup failed', error.response?.data?.message || 'Please try again later.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Account</Text>

        {/* Username */}
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={[styles.input, errors.username && styles.inputError]}
          autoCapitalize="none"
        />
        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

        {/* Email */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailAvailable(null); // reset availability check
          }}
          onBlur={checkEmailAvailability}
          keyboardType="email-address"
          style={[styles.input, errors.email && styles.inputError]}
          autoCapitalize="none"
          editable={!loading}
        />
        {emailChecking && <Text style={{color: '#666', marginBottom: 6}}>Checking email availability...</Text>}
        {emailAvailable === true && <Text style={{ color: 'green', marginBottom: 6 }}>Email is available!</Text>}
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Password */}
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            style={[styles.input, { flex: 1 }, errors.password && styles.inputError]}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.showButton}>
            <Text style={{ color: '#007bff' }}>{showPass ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        {password.length > 0 && (
          <Text style={{ color: passwordStrength.color, marginBottom: 10 }}>
            Password Strength: {passwordStrength.label}
          </Text>
        )}
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {/* Confirm Password */}
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPass}
            style={[styles.input, { flex: 1 }, errors.confirmPassword && styles.inputError]}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)} style={styles.showButton}>
            <Text style={{ color: '#007bff' }}>{showConfirmPass ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        {/* Terms & Conditions */}
        <View style={styles.termsWrapper}>
          <TouchableOpacity
            onPress={() => setTermsAccepted(!termsAccepted)}
            style={styles.checkbox}
          >
            {termsAccepted && <View style={styles.checkboxTick} />}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I accept the{' '}
            <Text
              style={{ color: '#007bff', textDecorationLine: 'underline' }}
              onPress={() => {
                // You can link to your terms page here
                Alert.alert('Terms & Conditions', 'Link to your terms page');
              }}
            >
              Terms & Conditions
            </Text>
          </Text>
        </View>
        {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleSignup}
          style={[styles.button, loading && { backgroundColor: '#888' }]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Go to Login */}
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={{ fontWeight: 'bold' }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFA500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showButton: {
    paddingHorizontal: 12,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  linkText: {
    color: '#eee',
    textAlign: 'center',
    fontSize: 16,
  },
  termsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxTick: {
    width: 12,
    height: 12,
    backgroundColor: '#007bff',
  },
  termsText: {
    color: '#fff',
    fontSize: 14,
    flexShrink: 1,
  },
});
