import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function AttendanceScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      const response = await fetch('http://0.0.0.0:5000/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qr_code: data }),
      });

      if (response.ok) {
        Alert.alert('Succès', 'Présence enregistrée !', [
          { text: 'OK', onPress: () => setScanned(false) },
        ]);
      } else {
        Alert.alert('Erreur', 'Impossible d\'enregistrer la présence', [
          { text: 'Réessayer', onPress: () => setScanned(false) },
        ]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur de connexion au serveur', [
        { text: 'Réessayer', onPress: () => setScanned(false) },
      ]);
    }
  };

  if (hasPermission === null) {
    return <Text>Demande d'autorisation de la caméra...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Pas d'accès à la caméra</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <TouchableOpacity
          style={styles.scanAgainButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.scanAgainText}>Scanner à nouveau</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#2b86d9',
    padding: 15,
    borderRadius: 8,
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
