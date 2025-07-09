"use client";

import Slider from "@react-native-community/slider";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useState } from "react";
import { Alert, Button, Image, ScrollView, StyleSheet, Text, View } from "react-native";

const ImageResizerComponent = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [quality, setQuality] = useState(80);
  const [resizePercent, setResizePercent] = useState(100);

  // Pick image from gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission denied", "Permission to access gallery is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      base64: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!pickerResult.canceled) {
      const asset = pickerResult.assets[0];
      setOriginalImage(asset);
      setResizedImage(null);
    }
  };

  // Resize using expo-image-manipulator
  const resizeImage = async () => {
    if (!originalImage) {
      Alert.alert("No image selected", "Please select an image first.");
      return;
    }

    const newWidth = Math.round(originalImage.width * (resizePercent / 100));
    const newHeight = Math.round(originalImage.height * (resizePercent / 100));

    try {
      const result = await ImageManipulator.manipulateAsync(
        originalImage.uri,
        [{ resize: { width: newWidth, height: newHeight } }],
        { compress: quality / 100, format: ImageManipulator.SaveFormat.JPEG }
      );

      setResizedImage({
        uri: result.uri,
        width: newWidth,
        height: newHeight,
      });
    } catch (error) {
      console.error("Resize error:", error);
      Alert.alert("Error", "Failed to resize image.");
    }
  };

  // Save resized image
  const saveImage = async () => {
    if (!resizedImage) {
      Alert.alert("No resized image", "Resize the image first before saving.");
      return;
    }

    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied", "Permission to save images is required!");
      return;
    }

    try {
      await MediaLibrary.createAssetAsync(resizedImage.uri);
      Alert.alert("Saved", "Image saved to gallery");
    } catch (error) {
      Alert.alert("Error", "Failed to save image");
      console.error("Saving error:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📉 Image Resizer & Compressor</Text>
      <Button title="Select Image" onPress={pickImage} />

      {originalImage && (
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Original Image</Text>
          <Image source={{ uri: originalImage.uri }} style={styles.image} />
          <Text>Size: {originalImage.width} x {originalImage.height}</Text>
        </View>
      )}

      <View style={styles.sliderContainer}>
        <Text>Quality: {quality}%</Text>
        <Slider
          minimumValue={10}
          maximumValue={100}
          step={1}
          value={quality}
          onValueChange={(v) => setQuality(v)}
        />
      </View>

      <View style={styles.sliderContainer}>
        <Text>Resize: {resizePercent}%</Text>
        <Slider
          minimumValue={10}
          maximumValue={200}
          step={1}
          value={resizePercent}
          onValueChange={(v) => setResizePercent(v)}
        />
      </View>

      <Button title="Resize & Compress" onPress={resizeImage} />

      {resizedImage && (
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Resized Image</Text>
          <Image source={{ uri: resizedImage.uri }} style={styles.image} />
          <Text>Size: {resizedImage.width} x {resizedImage.height}</Text>
          <Button title="Save Image to Gallery" onPress={saveImage} />
        </View>
      )}
    </ScrollView>
  );
};

export default ImageResizerComponent;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  imageSection: {
    marginTop: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 10,
  },
  sliderContainer: {
    marginVertical: 12,
  },
});