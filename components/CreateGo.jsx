import axios from "axios";
import * as Clipboard from 'expo-clipboard';
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
export default function CreateGo() {
  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState([]);

  const GetContent = async (e) => {
    e.preventDefault?.(); // Only works in web — ignore for native

    try {
      const response = await axios.get(
        `https://backendk-z915.onrender.com/content/search?q=${prompt}`
      );
      setData(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch data.");
    }
  };

  const CopyContent = async (text) => {
  try {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", "Text Successfully Copied!");
  } catch (error) {
    Alert.alert("Error", "Failed to copy text.");
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Enter your prompt..."
          value={prompt}
          onChangeText={setPrompt}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={GetContent}>
          <Text style={styles.buttonText}>Click Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {data.length > 0 ? (
          data.map((post, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>{post.content}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => CopyContent(post.content)}
              >
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No data yet</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  formContainer: {
    marginVertical: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: "#1E90FF",
    borderRadius: 8,
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderColor: "#87CEFA",
    borderWidth: 2,
    borderRadius: 6,
    marginBottom: 10,
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#D3D3D3",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#00008B",
  },
  buttonText: {
    color: "#00008B",
    fontWeight: "bold",
    fontSize: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#00008B",
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#FFA500",
  },
  cardText: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: "black",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  copyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});