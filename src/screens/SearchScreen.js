import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import StarRating from '../components/StarRating';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { PRODUCTS } from '../data/products';

const TRENDING = [
  'Glow Serum', 'Foundation', 'Moroccan Oil', 'Vitamin C', 'Lip Colour', 'Gift Set',
];

const RECENT_SEARCHES = ['argan oil', 'velvet palette', 'glass skin'];

function SearchResultItem({ product, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.resultItem, pressed && { opacity: 0.85 }]}
      accessibilityLabel={`${product.name}, £${product.price}`}
    >
      <Image source={{ uri: product.image }} style={styles.resultImage} resizeMode="cover" />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName} numberOfLines={2}>{product.name}</Text>
        <StarRating rating={product.rating} size={11} />
        <View style={styles.resultPriceRow}>
          <Text style={styles.resultPrice}>£{product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.resultOriginalPrice}>£{product.originalPrice}</Text>
          )}
        </View>
      </View>
      <Feather name="chevron-right" size={16} color={COLORS.textMuted} />
    </Pressable>
  );
}

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.range?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.includes(q))
    );
  }, [query]);

  const hasQuery = query.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Search bar */}
      <View style={styles.searchBar}>
        <View style={styles.inputWrap}>
          <Feather name="search" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search I'm Fenna..."
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="Search products"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityLabel="Clear search">
              <Feather name="x-circle" size={16} color={COLORS.textMuted} />
            </Pressable>
          )}
        </View>

        {isFocused && (
          <Pressable onPress={() => { Keyboard.dismiss(); setIsFocused(false); }} hitSlop={8}>
            <Text style={styles.cancelText}>CANCEL</Text>
          </Pressable>
        )}
      </View>

      {!hasQuery ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.emptyState}>
          {/* Recent */}
          {RECENT_SEARCHES.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <Pressable hitSlop={8}>
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              </View>
              {RECENT_SEARCHES.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setQuery(s)}
                  style={styles.recentItem}
                >
                  <Feather name="clock" size={14} color={COLORS.textMuted} />
                  <Text style={styles.recentText}>{s}</Text>
                  <Feather name="arrow-up-left" size={14} color={COLORS.textMuted} style={styles.recentArrow} />
                </Pressable>
              ))}
            </View>
          )}

          {/* Trending */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <View style={styles.trendingPills}>
              {TRENDING.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setQuery(t)}
                  style={styles.trendingPill}
                >
                  <Feather name="trending-up" size={12} color={COLORS.gold} />
                  <Text style={styles.trendingText}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Popular categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shop by Collection</Text>
            <View style={styles.collectionsGrid}>
              {[
                { label: 'Moroccan Heritage', query: 'moroccan', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300&q=80' },
                { label: 'K-Beauty', query: 'kbeauty', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=300&q=80' },
                { label: 'Makeup', query: 'makeup', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80' },
                { label: 'Gift Sets', query: 'set', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&q=80' },
              ].map((c) => (
                <Pressable
                  key={c.label}
                  onPress={() => setQuery(c.query)}
                  style={styles.collectionTile}
                >
                  <Image source={{ uri: c.image }} style={styles.collectionImage} resizeMode="cover" />
                  <View style={styles.collectionOverlay} />
                  <Text style={styles.collectionLabel}>{c.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <>
          {/* Results header */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
            </Text>
          </View>

          <FlatList
            data={results}
            keyExtractor={(p) => p.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.noResults}>
                <Feather name="search" size={36} color={COLORS.lightGray} />
                <Text style={styles.noResultsTitle}>No results found</Text>
                <Text style={styles.noResultsBody}>
                  Try searching for a product name, category, or ingredient
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <SearchResultItem
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              />
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.sm,
    gap: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SIZES.md,
    height: 48,
    gap: SIZES.sm,
  },
  searchIcon: { flexShrink: 0 },
  input: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  cancelText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.caption,
    color: COLORS.maroon,
    letterSpacing: 1,
  },

  emptyState: { padding: SIZES.screenPadding },

  section: { marginBottom: SIZES.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontFamily: FONTS.display,
    fontSize: SIZES.subheading,
    color: COLORS.text,
  },
  clearText: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.maroon,
  },

  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  recentText: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  recentArrow: { marginLeft: 'auto' },

  trendingPills: { flexDirection: 'row', flexWrap: 'wrap', gap: SIZES.sm },
  trendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  trendingText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.small,
    color: COLORS.text,
  },

  collectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  collectionTile: {
    width: '48%',
    height: 110,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.soft,
  },
  collectionImage: { ...StyleSheet.absoluteFillObject },
  collectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  collectionLabel: {
    position: 'absolute',
    bottom: SIZES.sm,
    left: SIZES.sm,
    right: SIZES.sm,
    fontFamily: FONTS.display,
    fontSize: 15,
    color: COLORS.white,
  },

  // Results
  resultsHeader: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  resultsCount: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
  },
  resultsList: { padding: SIZES.screenPadding },
  separator: { height: 1, backgroundColor: COLORS.borderSubtle },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
    paddingVertical: SIZES.md,
  },
  resultImage: {
    width: 70,
    height: 80,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.ivoryDeep,
  },
  resultInfo: { flex: 1, gap: 4 },
  resultName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.small,
    color: COLORS.text,
    lineHeight: 18,
  },
  resultPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  resultPrice: {
    fontFamily: FONTS.subheading,
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  resultOriginalPrice: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },

  noResults: {
    alignItems: 'center',
    paddingTop: SIZES.xxxl,
    gap: SIZES.md,
  },
  noResultsTitle: {
    fontFamily: FONTS.display,
    fontSize: SIZES.heading,
    color: COLORS.text,
  },
  noResultsBody: {
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
});
