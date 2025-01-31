import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const menuItems = [
    {
      title: 'Présences',
      icon: '📋',
      screen: 'Attendance',
    },
    {
      title: 'Activités',
      icon: '🎯',
      screen: 'Activities',
    },
    {
      title: 'Messages',
      icon: '💬',
      screen: 'Messages',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>Bienvenue!</Text>
      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  menuItem: {
    width: '45%',
    aspectRatio: 1,
    margin: '2.5%',
    backgroundColor: '#f0f2f6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
});
