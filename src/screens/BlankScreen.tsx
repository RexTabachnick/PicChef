import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import axios from 'axios';
import RNFS from 'react-native-fs';
import { writeToDatabase } from '../utils/firebase';

const BlankScreen = () => {
  const [cameraPermission, setCameraPermission] = useState<string | null>(null);
  const devices = useCameraDevices();
  const device = devices?.find((device) => device.position === 'back');
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    const requestPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setCameraPermission(status);
    };
    requestPermission();
  }, []);
  

  const analyzeImage = async (imagePath: string) => {
    const apiKey = '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'; // Replace with your GPT Vision API key
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    try {
      // Convert the image to Base64
      const base64Image = await RNFS.readFile(imagePath, 'base64');
      const base64ImageUrl = `data:image/jpeg;base64,${base64Image}`;
      console.log('Base64 image URL prepared:', base64ImageUrl);

      // Send request to GPT Vision API
      const response = await axios.post(
        endpoint,
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this image for food ingredients." },
                { type: "text", text: "Please return only the results in the format {item, weight(g)} for each detected ingredient." },
                { type: "image_url", image_url: { url: base64ImageUrl } },
              ],
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Parse the response
      const rawResponse = response.data.choices[0].message.content;
      console.log('Raw API Response:', rawResponse);

      const regex = /\{\s*([^,]+),\s*([\d]+)\s*\}/g;
      let match;
      const parsedIngredients: { item: string; weight: string }[] = [];

      while ((match = regex.exec(rawResponse)) !== null) {
        parsedIngredients.push({
          item: match[1].trim(),
          weight: `${match[2].trim()}g`,
        });
      }

      console.log('Parsed Ingredients:', parsedIngredients);

      if (parsedIngredients.length) { // if parsedIngredients has at least 1 element
        // Save each ingredient to Firebase
        parsedIngredients.forEach(async (ingredient) => {
          try {
            await writeToDatabase(`ingredients/${ingredient.item}`, {
              type: ingredient.item,
              weight: ingredient.weight,
            });
            console.log(`Saved ${ingredient.item} to Firebase.`);
          } catch (err) {
            console.error(`Error saving ${ingredient.item} to Firebase:`, err);
          }
        });
  
        Alert.alert(
          'Ingredients Detected',
          parsedIngredients.map((ingredient) => `${ingredient.item}: ${ingredient.weight}`).join('\n')
        );
      } else {
        Alert.alert('No ingredients detected', 'The AI could not find ingredients in the expected format.');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze the image. Please check the API.');
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera is not ready');
      return;
    }

    try {
      const photo = await cameraRef.current.takePhoto({
        flash: 'off',
      });

      console.log('Photo taken, original path:', photo.path);

      const stablePath = `${RNFS.DocumentDirectoryPath}/photo_${Date.now()}.jpg`;
      await RNFS.moveFile(photo.path, stablePath);
      console.log('Photo moved successfully to:', stablePath);

      await analyzeImage(stablePath); // Call analyzeImage with the saved photo
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  if (cameraPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (cameraPermission === 'denied') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission denied. Please enable it in settings.</Text>
      </View>
    );
  }

  if (cameraPermission === 'authorized' && !device) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {device && (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true} // Enable photo capture mode
        />
      )}
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  button: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'tomato',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BlankScreen;

