import axios from 'axios';
import { useState } from 'react';
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SearchGo = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://backend-k.vercel.app/autoai/result?q=${query}`);
      const SearchResults = response.data.ScrapedData[0];
      setResults(SearchResults.results || []);
      setImages(SearchResults.images || []);
    } catch (err) {
      setError('Error fetching results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Search Engine</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#4F46E5" />}
      {error && <Text style={styles.error}>{error}</Text>}

      {images.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Top Images</Text>
          <View style={styles.imageGrid}>
            {images.map((img, idx) => (
              <Image key={idx} source={{ uri: img }} style={styles.gridImage} />
            ))}
          </View>
        </View>
      )}

      {results.length > 0 ? (
        results.map((result, index) => (
          <View key={index} style={styles.resultContainer}>
            <Text
              style={styles.resultTitle}
              onPress={() => Linking.openURL(result.link)}>
              {result.title}
            </Text>
            <View style={styles.resultContent}>
              <Text style={styles.snippet}>{result.snippet}</Text>
              {result.thumbnail && (
                <Image source={{ uri: result.thumbnail }} style={styles.thumbnail} />
              )}
            </View>
            {result.images && result.images.length > 0 && (
              <View style={styles.imageGrid}>
                {result.images.map((img, idx) => (
                  <Image key={idx} source={{ uri: img }} style={styles.gridImage} />
                ))}
              </View>
            )}
          </View>
        ))
      ) : (
        !loading && <Text style={styles.noResults}>No results found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  section: {
    marginVertical: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4338CA',
    marginBottom: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridImage: {
    width: '48%',
    height: 100,
    marginBottom: 8,
    borderRadius: 8,
  },
  resultContainer: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 4,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  snippet: {
    flex: 1,
    color: '#374151',
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginLeft: 8,
    borderRadius: 6,
  },
  noResults: {
    textAlign: 'center',
    color: '#6B7280',
  },
});

export default SearchGo;