import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ProductCard from '../components/ProductCard';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { PRODUCTS } from '../data/products';

const { width } = Dimensions.get('window');

const CATEGORY_TILES = [
  {
    id: 'skincare',
    label: 'Skincare',
    subtitle: '24 products',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=400&q=80',
    color: COLORS.cinnamon,
  },
  {
    id: 'makeup',
    label: 'Makeup',
    subtitle: '18 products',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    color: COLORS.maroon,
  },
  {
    id: 'moroccan',
    label: 'Moroccan',
    subtitle: '12 products',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80',
    color: '#5C3420',
  },
  {
    id: 'kbeauty',
    label: 'K-Beauty',
    subtitle: '10 products',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80',
    color: '#4A5568',
  },
  {
    id: 'sets',
    label: 'Gift Sets',
    subtitle: '6 products',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
    color: '#7D463C',
  },
  {
    id: 'new',
    label: 'New In',
    subtitle: '8 products',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
    color: COLORS.gold,
  },
];

function CategoryTile({ item, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && { opacity: 0.88 }]}
      accessibilityLabel={item.label}
    >
      <Image source={{ uri: item.image }} style={styles.tileImage} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', `${item.color}E0`]}
        style={styles.tileGradient}
      />
      <View style={styles.tileContent}>
        <Text style={styles.tileLabel}>{item.label}</Text>
        <Text style={styles.tileSub}>{item.subtitle}</Text>
      </View>
    </Pressable>
  );
}

export default function ExploreScreen({ navigation }) {
  const featuredProducts = PRODUCTS.slice(0, 6);

  const goToProduct = (product) => navigation.navigate('ProductDetail', { product });
  const goToList = (category) => navigation.navigate('ProductList', { category });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>EXPLORE</Text>
        <Pressable onPress={() => navigation.navigate('Search')} hitSlop={8}>
          <Feather name="search" size={22} color={COLORS.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero strip */}
        <Pressable style={styles.heroStrip} onPress={() => goToList('new')}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80' }}
            style={styles.heroStripImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.0)', 'rgba(118,20,21,0.82)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroStripContent}>
            <Text style={styles.heroStripEyebrow}>NEW SEASON</Text>
            <Text style={styles.heroStripTitle}>Discover What's New</Text>
            <View style={styles.heroStripCta}>
              <Text style={styles.heroStripCtaText}>SHOP NEW IN</Text>
              <Feather name="arrow-right" size={14} color={COLORS.gold} />
            </View>
          </View>
        </Pressable>

        {/* Shop by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.tilesGrid}>
            {CATEGORY_TILES.map((item) => (
              <CategoryTile
                key={item.id}
                item={item}
                onPress={() => goToList(item.id)}
              />
            ))}
          </View>
        </View>

        {/* Featured */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <View style={styles.productGrid}>
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onPress={() => goToProduct(p)} />
            ))}
          </View>
        </View>

        {/* Beauty Values */}
        <View style={styles.valuesSection}>
          <Text style={styles.valuesSectionTitle}>Our Commitments</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.valuesRow}>
            {[
              { icon: 'droplet', label: 'Clean Formula', desc: 'Free from harmful ingredients' },
              { icon: 'globe', label: 'Globally Sourced', desc: 'Noble ingredients worldwide' },
              { icon: 'heart', label: 'Skin Positive', desc: 'Kind to every skin type' },
              { icon: 'award', label: 'Award Winning', desc: 'Recognised for excellence' },
            ].map((v) => (
              <View key={v.label} style={styles.valueCard}>
                <View style={styles.valueIconWrap}>
                  <Feather name={v.icon} size={20} color={COLORS.gold} />
                </View>
                <Text style={styles.valueLabel}>{v.label}</Text>
                <Text style={styles.valueDesc}>{v.desc}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  headerTitle: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.text,
    letterSpacing: 4,
  },

  // Hero strip
  heroStrip: {
    height: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  heroStripImage: { ...StyleSheet.absoluteFillObject },
  heroStripContent: {
    position: 'absolute',
    bottom: SIZES.xl,
    left: SIZES.screenPadding,
    right: SIZES.screenPadding,
  },
  heroStripEyebrow: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.caption,
    color: COLORS.gold,
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  heroStripTitle: {
    fontFamily: FONTS.display,
    fontSize: 26,
    color: COLORS.white,
    marginBottom: 12,
  },
  heroStripCta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroStripCtaText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.caption,
    color: COLORS.gold,
    letterSpacing: 1.5,
  },

  // Sections
  section: { paddingTop: SIZES.xl },
  sectionTitle: {
    fontFamily: FONTS.display,
    fontSize: SIZES.heading,
    color: COLORS.text,
    paddingHorizontal: SIZES.screenPadding,
    marginBottom: SIZES.md,
  },

  // Category tiles
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.screenPadding,
    gap: SIZES.sm,
  },
  tile: {
    width: (width - SIZES.screenPadding * 2 - SIZES.sm) / 2,
    height: 150,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.soft,
  },
  tileImage: { ...StyleSheet.absoluteFillObject },
  tileGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
  },
  tileContent: {
    position: 'absolute',
    bottom: SIZES.md,
    left: SIZES.md,
  },
  tileLabel: {
    fontFamily: FONTS.display,
    fontSize: 18,
    color: COLORS.white,
    lineHeight: 22,
  },
  tileSub: {
    fontFamily: FONTS.body,
    fontSize: SIZES.caption,
    color: 'rgba(255,255,255,0.8)',
  },

  // Product grid
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.screenPadding,
    gap: SIZES.sm,
  },

  // Values
  valuesSection: {
    marginTop: SIZES.xl,
    paddingTop: SIZES.lg,
    borderTopWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  valuesSectionTitle: {
    fontFamily: FONTS.display,
    fontSize: SIZES.heading,
    color: COLORS.text,
    paddingHorizontal: SIZES.screenPadding,
    marginBottom: SIZES.md,
  },
  valuesRow: {
    paddingHorizontal: SIZES.screenPadding,
    gap: SIZES.sm,
  },
  valueCard: {
    width: 140,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    alignItems: 'center',
    gap: 6,
    ...SHADOWS.soft,
  },
  valueIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueLabel: {
    fontFamily: FONTS.subheading,
    fontSize: SIZES.small,
    color: COLORS.text,
    textAlign: 'center',
  },
  valueDesc: {
    fontFamily: FONTS.body,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
