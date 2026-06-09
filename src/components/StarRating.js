import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function StarRating({ rating = 0, size = 14, max = 5 }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Feather
            key={i}
            name={filled ? 'star' : 'star'}
            size={size}
            color={filled || half ? COLORS.gold : COLORS.lightGray}
            style={styles.star}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  star: { marginRight: 2 },
});
