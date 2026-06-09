import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES } from '../theme';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = width * 1.15;

const SLIDES = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    eyebrow: 'BEAUTY IS ART',
    headline: 'Be the\nMuse.',
    sub: 'New arrivals in Moroccan Skincare',
    cta: 'SHOP NOW',
    category: 'moroccan',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
    eyebrow: 'K-BEAUTY PRECISION',
    headline: 'Glass Skin\nAwakened.',
    sub: 'Advanced Korean skincare formulas',
    cta: 'EXPLORE',
    category: 'kbeauty',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
    eyebrow: 'CONFIDENT COLOUR',
    headline: 'Makeup\nThat Speaks.',
    sub: 'The new Velvet Eye Palette — Dusk Edition',
    cta: 'DISCOVER',
    category: 'makeup',
  },
];

export default function HeroBanner({ onSlidePress }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef(null);

  const onViewChange = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
  }, []);

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderSlide = ({ item }) => (
    <Pressable
      style={styles.slide}
      onPress={() => onSlidePress && onSlidePress(item.category)}
      accessibilityLabel={item.headline.replace('\n', ' ')}
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(15,10,10,0.75)']}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>{item.eyebrow}</Text>
        <Text style={styles.headline}>{item.headline}</Text>
        <Text style={styles.sub}>{item.sub}</Text>
        <View style={styles.ctaWrap}>
          <Text style={styles.ctaText}>{item.cta}</Text>
          <View style={styles.ctaLine} />
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(i) => i.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewChange}
        viewabilityConfig={viewConfig.current}
      />

      {/* Dot indicators */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  slide: { width, height: BANNER_HEIGHT },
  image: { width: '100%', height: '100%', position: 'absolute' },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
  },
  content: {
    position: 'absolute',
    bottom: 60,
    left: SIZES.screenPadding,
    right: SIZES.screenPadding,
  },
  eyebrow: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.caption,
    color: COLORS.gold,
    letterSpacing: 3,
    marginBottom: 8,
  },
  headline: {
    fontFamily: FONTS.display,
    fontSize: 48,
    color: COLORS.white,
    lineHeight: 52,
    marginBottom: 10,
  },
  sub: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
    lineHeight: 20,
  },
  ctaWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ctaText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.caption,
    color: COLORS.white,
    letterSpacing: 2,
  },
  ctaLine: {
    flex: 1,
    maxWidth: 40,
    height: 1,
    backgroundColor: COLORS.gold,
  },
  dots: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    backgroundColor: COLORS.gold,
    width: 28,
  },
});
