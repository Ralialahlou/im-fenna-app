import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HeroBanner from '../components/HeroBanner';
import SectionHeader from '../components/SectionHeader';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { PRODUCTS, PRODUCT_RANGES, CATEGORIES } from '../data/products';

const { width } = Dimensions.get('window');

const NEW_ARRIVALS = PRODUCTS.filter((p) => p.isNew);
const BESTSELLERS = PRODUCTS.filter((p) => p.isBestseller);

function Header({ navigation }) {
  const { totalItems } = useCart();
  return (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.navigate('Search')} hitSlop={8}>
        <Feather name="search" size={22} color={COLORS.text} />
      </Pressable>

      <Text style={styles.logo}>I'M FENNA</Text>

      <View style={styles.headerRight}>
        <Pressable onPress={() => navigation.navigate('Bag')} hitSlop={8} style={styles.bagBtn}>
          <Feather name="shopping-bag" size={22} color={COLORS.text} />
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems > 9 ? '9+' : totalItems}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function CategoryPills({ selected, onSelect }) {
  return (
    <FlatList
      data={CATEGORIES}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(i) => i.id}
      contentContainerStyle={styles.pillsContainer}
      renderItem={({ item }) => {
        const active = selected === item.id;
        return (
          <Pressable
            onPress={() => onSelect(item.id)}
            style={[styles.pill, active && styles.pillActive]}
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.pillText, active && styles.pillTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

function RangeCard({ range, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.rangeCard, pressed && { opacity: 0.9 }]}
      accessibilityLabel={range.label}
    >
      <Image source={{ uri: range.image }} style={styles.rangeImage} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', `${range.color}CC`]}
        style={styles.rangeGradient}
      />
      <View style={styles.rangeContent}>
        <Text style={styles.rangeLabel}>{range.label}</Text>
        <Text style={styles.rangeSub}>{range.subtitle}</Text>
      </View>
    </Pressable>
  );
}

function BrandStoryBanner() {
  return (
    <View style={styles.storyBanner}>
      <View style={styles.storyGoldLine} />
      <Text style={styles.storyEyebrow}>BEAUTY IS ART</Text>
      <Text style={styles.storyHeadline}>
        {"Rooted in Confidence,\nCrafted with Care."}
      </Text>
      <Text style={styles.storyBody}>
        I'm Fenna is a premium beauty brand uniting skincare and make-up through clean formulation, unique ingredients and refined design.
      </Text>
      <View style={styles.storyGoldLine} />
    </View>
  );
}

function RoutineSection({ navigation }) {
  return (
    <Pressable
      style={styles.routineCard}
      onPress={() => navigation.navigate('Explore')}
      accessibilityLabel="Build your beauty routine"
    >
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80' }}
        style={styles.routineImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(118,20,21,0.88)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.routineContent}>
        <Text style={styles.routineLabel}>BUILD YOUR RITUAL</Text>
        <Text style={styles.routineTitle}>{"If Beauty Were\nYour Power..."}</Text>
        <View style={styles.routineCta}>
          <Text style={styles.routineCtaText}>EXPLORE ROUTINES</Text>
          <Feather name="arrow-right" size={14} color={COLORS.gold} />
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = activeCategory === 'all'
    ? BESTSELLERS
    : BESTSELLERS.filter((p) => p.category === activeCategory || p.range === activeCategory);

  const goToProduct = useCallback(
    (product) => navigation.navigate('ProductDetail', { product }),
    [navigation]
  );

  const goToList = useCallback(
    (category) => navigation.navigate('ProductList', { category }),
    [navigation]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Header navigation={navigation} />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <HeroBanner onSlidePress={(cat) => goToList(cat)} />

        {/* New Arrivals */}
        <View style={styles.section}>
          <SectionHeader
            title="New Arrivals"
            subtitle="Fresh from the lab"
            onSeeAll={() => goToList('new')}
          />
          <FlatList
            data={NEW_ARRIVALS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(p) => p.id}
            contentContainerStyle={styles.hListContent}
            ItemSeparatorComponent={() => <View style={{ width: SIZES.sm }} />}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => goToProduct(item)}
                style={styles.hCard}
              />
            )}
          />
        </View>

        {/* Ranges */}
        <View style={styles.section}>
          <SectionHeader title="Our Ranges" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rangesContainer}>
            {PRODUCT_RANGES.map((r) => (
              <RangeCard key={r.id} range={r} onPress={() => goToList(r.id)} />
            ))}
          </ScrollView>
        </View>

        {/* Brand Story */}
        <BrandStoryBanner />

        {/* Bestsellers */}
        <View style={styles.section}>
          <SectionHeader
            title="Bestsellers"
            onSeeAll={() => goToList('all')}
          />
          <CategoryPills selected={activeCategory} onSelect={setActiveCategory} />

          <View style={styles.grid}>
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onPress={() => goToProduct(p)} />
            ))}
          </View>
        </View>

        {/* Build Routine */}
        <View style={styles.section}>
          <RoutineSection navigation={navigation} />
        </View>

        {/* Free Shipping Banner */}
        <View style={styles.shippingBanner}>
          <Feather name="package" size={16} color={COLORS.gold} />
          <Text style={styles.shippingText}>Free delivery on orders over £80</Text>
        </View>

        <View style={{ height: SIZES.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  logo: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.text,
    letterSpacing: 4,
  },
  headerRight: { flexDirection: 'row', gap: SIZES.md },
  bagBtn: { position: 'relative' },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: COLORS.maroon,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontFamily: FONTS.heading,
  },

  // Category Pills
  pillsContainer: {
    paddingHorizontal: SIZES.screenPadding,
    paddingBottom: SIZES.md,
    gap: SIZES.sm,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  pillActive: {
    backgroundColor: COLORS.maroon,
    borderColor: COLORS.maroon,
  },
  pillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.small,
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  pillTextActive: { color: COLORS.white },

  // Sections
  section: { marginTop: SIZES.xl },

  hListContent: { paddingHorizontal: SIZES.screenPadding },
  hCard: { width: 170 },

  // Ranges
  rangesContainer: {
    paddingHorizontal: SIZES.screenPadding,
    gap: SIZES.sm,
  },
  rangeCard: {
    width: width * 0.72,
    height: 200,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.medium,
  },
  rangeImage: { width: '100%', height: '100%', position: 'absolute' },
  rangeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  rangeContent: {
    position: 'absolute',
    bottom: SIZES.md,
    left: SIZES.md,
    right: SIZES.md,
  },
  rangeLabel: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.white,
    lineHeight: 26,
  },
  rangeSub: {
    fontFamily: FONTS.body,
    fontSize: SIZES.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  // Brand Story
  storyBanner: {
    marginTop: SIZES.xl,
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.xl,
    backgroundColor: COLORS.ivoryDeep,
    alignItems: 'center',
  },
  storyGoldLine: {
    width: 48,
    height: 1,
    backgroundColor: COLORS.gold,
    marginVertical: SIZES.md,
  },
  storyEyebrow: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.caption,
    color: COLORS.gold,
    letterSpacing: 3,
    marginBottom: SIZES.sm,
  },
  storyHeadline: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: SIZES.md,
  },
  storyBody: {
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.screenPadding,
    gap: SIZES.sm,
    marginTop: SIZES.sm,
  },

  // Routine
  routineCard: {
    marginHorizontal: SIZES.screenPadding,
    height: 220,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  routineImage: { width: '100%', height: '100%', position: 'absolute' },
  routineContent: {
    position: 'absolute',
    bottom: SIZES.xl,
    left: SIZES.xl,
    right: SIZES.xl,
  },
  routineLabel: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.caption,
    color: COLORS.gold,
    letterSpacing: 2.5,
    marginBottom: 8,
  },
  routineTitle: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.white,
    lineHeight: 34,
    marginBottom: SIZES.md,
  },
  routineCta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routineCtaText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.caption,
    color: COLORS.gold,
    letterSpacing: 1.5,
  },

  // Shipping
  shippingBanner: {
    marginTop: SIZES.xl,
    marginHorizontal: SIZES.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sm,
    paddingVertical: SIZES.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  shippingText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
});
