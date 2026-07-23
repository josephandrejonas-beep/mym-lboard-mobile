import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const DocumentUploadComponent = ({ onDocumentSelected, loadId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.CAMERA 
        : PERMISSIONS.ANDROID.CAMERA;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Camera permission error:', error);
      Alert.alert('Permission Error', 'Failed to request camera permission');
      return false;
    }
  };

  // Request photo library permission
  const requestPhotoLibraryPermission = async () => {
    try {
      const permission = Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Photo library permission error:', error);
      Alert.alert('Permission Error', 'Failed to request photo library permission');
      return false;
    }
  };

  // Request file access permission
  const requestFilePermission = async () => {
    try {
      const permission = Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('File permission error:', error);
      Alert.alert('Permission Error', 'Failed to request file access permission');
      return false;
    }
  };

  // Take picture with camera
  const handleTakePicture = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Camera Access Required',
        'This app needs access to your camera to take pictures. Please enable camera access in Settings.',
        [
          { text: 'Cancel', onPress: () => {} },
          { text: 'Settings', onPress: () => openSettings() },
        ]
      );
      return;
    }

    setLoading(true);
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.8,
        saveToPhotos: true,
      },
      (response) => {
        setLoading(false);
        if (response.didCancel) {
          console.log('Camera cancelled');
        } else if (response.errorCode) {
          Alert.alert('Error', `Camera error: ${response.errorMessage}`);
        } else if (response.assets && response.assets.length > 0) {
          handleDocumentSelected(response.assets[0], 'image');
        }
      }
    );
    setModalVisible(false);
  };

  // Pick image from gallery
  const handleChooseGallery = async () => {
    const hasPermission = await requestPhotoLibraryPermission();
    if (!hasPermission) {
      Alert.alert(
        'Photo Library Access Required',
        'This app needs access to your photo library. Please enable photo library access in Settings.',
        [
          { text: 'Cancel', onPress: () => {} },
          { text: 'Settings', onPress: () => openSettings() },
        ]
      );
      return;
    }

    setLoading(true);
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        setLoading(false);
        if (response.didCancel) {
          console.log('Gallery cancelled');
        } else if (response.errorCode) {
          Alert.alert('Error', `Gallery error: ${response.errorMessage}`);
        } else if (response.assets && response.assets.length > 0) {
          handleDocumentSelected(response.assets[0], 'image');
        }
      }
    );
    setModalVisible(false);
  };

  // Pick file from device
  const handleSelectFile = async () => {
    const hasPermission = await requestFilePermission();
    if (!hasPermission) {
      Alert.alert(
        'File Access Required',
        'This app needs access to your files. Please enable file access in Settings.',
        [
          { text: 'Cancel', onPress: () => {} },
          { text: 'Settings', onPress: () => openSettings() },
        ]
      );
      return;
    }

    try {
      setLoading(true);
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.images,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
        ],
      });

      handleDocumentSelected(result, 'file');
      setModalVisible(false);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('File selection cancelled');
      } else {
        Alert.alert('Error', 'Failed to select file');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle document selection
  const handleDocumentSelected = async (document, type) => {
    try {
      const documentData = {
        uri: document.uri || document.fileCopyUri,
        name: document.fileName || document.name,
        type: document.type || 'application/octet-stream',
        size: document.fileSize || document.size,
        uploadType: type,
        loadId: loadId,
        uploadedAt: new Date().toISOString(),
      };

      // Call parent component callback
      if (onDocumentSelected) {
        onDocumentSelected(documentData);
      }

      Alert.alert('Success', 'Document selected successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to process document');
      console.error('Document processing error:', error);
    }
  };

  // Scan document using camera
  const handleScanDocument = async () => {
    Alert.alert(
      'Document Scanner',
      'This feature requires additional setup. For now, please use Take Picture option to capture documents.',
      [{ text: 'OK', onPress: () => handleTakePicture() }]
    );
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      import('react-native').then(({ Linking }) => {
        Linking.openSettings();
      });
    } else {
      import('react-native').then(({ Linking }) => {
        Linking.openSettings();
      });
    }
  };

  return (
    <>
      {/* Upload Button */}
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.uploadButtonText}>📄 Upload Document</Text>
      </TouchableOpacity>

      {/* Modal with Options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Upload Document</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
            ) : (
              <>
                {/* Scan Document Option */}
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={handleScanDocument}
                >
                  <Text style={styles.optionIcon}>📱</Text>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Scan Document</Text>
                    <Text style={styles.optionDescription}>
                      Use your camera to scan and digitize documents
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Take Picture Option */}
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={handleTakePicture}
                >
                  <Text style={styles.optionIcon}>📷</Text>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Take a Picture</Text>
                    <Text style={styles.optionDescription}>
                      Capture a photo with your camera
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Choose from Gallery Option */}
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={handleChooseGallery}
                >
                  <Text style={styles.optionIcon}>🖼️</Text>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Choose from Gallery</Text>
                    <Text style={styles.optionDescription}>
                      Select a photo from your library
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Select File Option */}
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={handleSelectFile}
                >
                  <Text style={styles.optionIcon}>📁</Text>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Select a File</Text>
                    <Text style={styles.optionDescription}>
                      Choose PDF, Word, Excel, or image files
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                  style={[styles.optionButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginBottom: 12,
  },
  optionIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  loader: {
    marginVertical: 40,
  },
});

export default DocumentUploadComponent;
