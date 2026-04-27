import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ManagementScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Керування</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
});

export default ManagementScreen;
