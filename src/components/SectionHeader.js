import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../theme';

export default function SectionHeader({ title, subtitle, onSeeAll, style }) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} hitSlop={8}>
          <Text style={styles.seeAll}>SEE ALL</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.screenPadding,
    marginBottom: SIZES.md,
  },
  left: { flex: 1 },
  title: {
    fontFamily: FONTS.display,
    fontSize: SIZES.heading,
    color: COLORS.text,
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  seeAll: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.caption,
    color: COLORS.cinnamon,
    letterSpacing: 1.2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.rose,
  },
});
