import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as Progress from "react-native-progress";

const allowedImageTypes = ["jpg", "jpeg", "png", "webp"];
const allowedVideoTypes = ["mp4", "mov", "mkv"];

export default function UploadPost() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUserId = await AsyncStorage.getItem("UserId");

        if (!storedToken || !storedUserId) {
          Alert.alert("Auth Error", "Please login again.");
          return;
        }

        const decoded = jwtDecode(storedToken);
        if (!decoded?.exp || decoded.exp * 1000 < Date.now()) {
          Alert.alert("Session Expired", "Please login again.");
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("UserId");
          return;
        }

        setToken(storedToken);
        setUserId(storedUserId);
        setAuthReady(true);
      } catch (err) {
        console.error("Auth Load Error:", err);
        Alert.alert("Error", "Failed to load auth.");
      }
    };

    loadAuth();
  }, []);

  const getFileExtension = (uri) => uri?.split(".").pop().toLowerCase();

  const getMimeType = (ext) => {
    switch (ext) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "webp":
        return "image/webp";
      case "mp4":
        return "video/mp4";
      case "mov":
        return "video/quicktime";
      case "mkv":
        return "video/x-matroska";
      default:
        return "application/octet-stream";
    }
  };

  const pickMedia = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission denied", "You must grant media access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        const ext = getFileExtension(asset.uri);

        if (
          !allowedImageTypes.includes(ext) &&
          !allowedVideoTypes.includes(ext)
        ) {
          Alert.alert(
            "Unsupported File",
            `Only ${[...allowedImageTypes, ...allowedVideoTypes].join(", ")} allowed.`
          );
          return;
        }

        setFile(asset);
        setPreview(asset.uri);
      }
    } catch (error) {
      console.error("Pick media error:", error);
      Alert.alert("Error", "Failed to pick media.");
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      Alert.alert("Error", "Select a file and enter a title.");
      return;
    }

    const ext = getFileExtension(file.uri);
    const mime = getMimeType(ext);

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: `upload.${ext}`,
      type: mime,
    });
    formData.append("title", title);
    formData.append("userId", userId);

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post(
        "https://backend-k.vercel.app/post/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": token,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.min(
              Math.round((progressEvent.loaded * 100) / progressEvent.total),
              100
            );
            setUploadProgress(percent / 100);
          },
        }
      );

      Alert.alert("Success", "File uploaded successfully!");
      setFile(null);
      setPreview(null);
      setTitle("");
    } catch (err) {
      console.error("Upload error:", err?.response?.data || err.message);
      Alert.alert(
        "Upload Failed",
        err?.response?.data?.error || "Unknown error."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Image or Video</Text>

      <TouchableOpacity style={styles.uploadBox} onPress={pickMedia}>
        <Text style={styles.uploadText}>Select Image or Video</Text>
      </TouchableOpacity>

      {preview && (
        <View style={styles.preview}>
          {allowedVideoTypes.includes(getFileExtension(preview)) ? (
            <Video
              source={{ uri: preview }}
              style={styles.media}
              resizeMode="cover"
              shouldPlay
              isLooping
              isMuted
              useNativeControls={false}
            />
          ) : (
            <Image source={{ uri: preview }} style={styles.media} />
          )}
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter title"
        placeholderTextColor="#ccc"
        value={title}
        onChangeText={setTitle}
      />

      {uploading && (
        <View style={{ marginTop: 10 }}>
          <Progress.Bar progress={uploadProgress} width={null} />
          <Text style={styles.progressText}>
            {Math.round(uploadProgress * 100)}% uploaded
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, (!authReady || uploading) && { opacity: 0.6 }]}
        onPress={handleUpload}
        disabled={!authReady || uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    padding: 20,
    paddingTop: 80,
  },
  header: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  uploadBox: {
    height: 60,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  uploadText: {
    color: "#fff",
    fontSize: 16,
  },
  preview: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  media: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  input: {
    backgroundColor: "#3B82F6",
    color: "#fff",
    fontSize: 16,
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#F59E0B",
    padding: 14,
    borderRadius: 6,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  progressText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 4,
  },
});