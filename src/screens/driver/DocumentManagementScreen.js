import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import DocumentUploadComponent from '../components/DocumentUpload';

const DocumentManagementScreen = ({ route }) => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const { loadId } = route?.params || {};

  const handleDocumentSelected = async (documentData) => {
    try {
      // Add to local state
      setUploadedDocuments([...uploadedDocuments, documentData]);

      // TODO: Upload to backend API
      // const formData = new FormData();
      // formData.append('file', {
      //   uri: documentData.uri,
      //   type: documentData.type,
      //   name: documentData.name,
      // });
      // formData.append('loadId', loadId);
      // formData.append('documentType', 'BOL'); // or 'POD'

      // await apiService.post(`/api/loads/${loadId}/documents/upload`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      Alert.alert('Success', 'Document uploaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document');
      console.error('Upload error:', error);
    }
  };

  const renderDocument = ({ item }) => (
    <View style={styles.documentCard}>
      {item.uploadType === 'image' && (
        <Image
          source={{ uri: item.uri }}
          style={styles.documentThumbnail}
        />
      )}
      <View style={styles.documentInfo}>
        <Text style={styles.documentName}>{item.name}</Text>
        <Text style={styles.documentType}>
          Type: {item.uploadType === 'image' ? 'Photo' : 'File'}
        </Text>
        <Text style={styles.documentSize}>
          Size: {(item.size / 1024 / 1024).toFixed(2)} MB
        </Text>
        <Text style={styles.documentDate}>
          {new Date(item.uploadedAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setUploadedDocuments(
            uploadedDocuments.filter((doc) => doc.uri !== item.uri)
          );
        }}
      >
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Document Management</Text>
        <Text style={styles.headerSubtitle}>
          Load ID: {loadId || 'N/A'}
        </Text>
      </View>

      {/* Upload Component */}
      <DocumentUploadComponent
        onDocumentSelected={handleDocumentSelected}
        loadId={loadId}
      />

      {/* Uploaded Documents List */}
      {uploadedDocuments.length > 0 ? (
        <View style={styles.documentsSection}>
          <Text style={styles.sectionTitle}>
            Uploaded Documents ({uploadedDocuments.length})
          </Text>
          <FlatList
            data={uploadedDocuments}
            renderItem={renderDocument}
            keyExtractor={(item, index) => `${item.uri}_${index}`}
            scrollEnabled={false}
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📄</Text>
          <Text style={styles.emptyStateText}>
            No documents uploaded yet
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Upload BOL, POD, or other documents for this load
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 15,
  },
  header: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  documentsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  documentCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  documentThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  documentType: {
    fontSize: 12,
    color: '#666',
  },
  documentSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  documentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  deleteButton: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default DocumentManagementScreen;
