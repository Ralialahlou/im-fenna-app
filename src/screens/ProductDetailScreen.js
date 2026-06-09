import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { PRODUCTS, REVIEWS } from '../data/products';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 1.1;

const TABS = ['Description', 'Ingredients', 'How to Use'];

function ImageCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef(null);

  const onViewChange = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
  }, []);
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View style={styles.carouselWrap}>
      <FlatList
        ref={flatRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onViewableItemsChanged={onViewChange}
        viewabilityConfig={viewConfig.current}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.carouselImage} resizeMode="cover" />
        )}
      />
      <View style={styles.carouselDots}>
        {images.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

function ShadeSelector({ shades, selected, onSelect }) {
  return (
    <View style={styles.shadesWrap}>
      <Text style={styles.shadesLabel}>
        Shade: <Text style={styles.shadeName}>{selected?.name || 'Select shade'}</Text>
      </Text>
      <View style={styles.shadesRow}>
        {shades.map((shade) => {
          const active = selected?.id === shade.id;
          return (
            <Pressable
              key={shade.id}
              onPress={() => onSelect(shade)}
              style={[styles.shadeBtn, active && styles.shadeBtnActive]}
              accessibilityLabel={shade.name}
              accessibilityState={{ selected: active }}
            >
              <View style={[styles.shadeCircle, { backgroundColor: shade.hex }]} />
              {active && <View style={styles.shadeRing} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function QuantitySelector({ quantity, onChange }) {
  return (
    <View style={styles.qtyRow}>
      <Text style={styles.qtyLabel}>Qty</Text>
      <View style={styles.qtyControls}>
        <Pressable
          onPress={() => onChange(Math.max(1, quantity - 1))}
          style={styles.qtyBtn}
          accessibilityLabel="Decrease quantity"
        >
          <Feather name="minus" size={16} color={COLORS.text} />
        </Pressable>
        <Text style={styles.qtyValue}>{quantity}</Text>
        <Pressable
          onPress={() => onChange(quantity + 1)}
          style={styles.qtyBtn}
          accessibilityLabel="Increase quantity"
        >
          <Feather name="plus" size={16} color={COLORS.text} />
        </Pressable>
      </View>
    </View>
  );
}

function ReviewCard({ review }) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
        <View style={styles.reviewMeta}>
          <Text style={styles.reviewAuthor}>{review.author}</Text>
          <View style={styles.reviewStarRow}>
            <StarRating rating={review.rating} size={12} />
            {review.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>VERIFIED</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.reviewDate}>{review.date}</Text>
      </View>
      <Text style={styles.reviewTitle}>{review.title}</Text>
      <Text style={styles.reviewBody}>{review.body}</Text>
      <View style={styles.reviewFooter}>
        <Feather name="thumbs-up" size={12} color={COLORS.textMuted} />
        <Text style={styles.helpfulText}>Helpful ({review.helpful})</Text>
      </View>
    </View>
  );
}

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const [selectedShade, setSelectedShade] = useState(
    product.shades ? product.shades[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [addedToBag, setAddedToBag] = useState(false);

  const productReviews = REVIEWS.filter((r) => r.productId === product.id);
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToBag = useCallback(() => {
    addItem(product, selectedShade, quantity);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2000);
  }, [product, selectedShade, quantity, addItem]);

  const tabContent = [
    product.description,
    product.keyIngredients.length > 0
      ? product.keyIngredients.map((k) => `• ${k.name}: ${k.benefit}`).join('\n')
      : 'Full ingredient list available on packaging.',
    product.howToUse,
  ];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Images */}
        <View style={{ position: 'relative' }}>
          <ImageCarousel images={product.images} />
          {/* Back button */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            accessibilityLabel="Go back"
          >
            <Feather name="arrow-left" size={20} color={COLORS.white} />
          </Pressable>
          {/* Wishlist */}
          <Pressable
            onPress={() => toggle(product)}
            style={styles.wishlistBtn}
            accessibilityLabel={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Feather name="heart" size={20} color={wishlisted ? COLORS.maroon : COLORS.white} />
          </Pressable>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          {/* Badges */}
          <View style={styles.badgesRow}>
            {product.isNew && (
              <View style={[styles.badge, { backgroundColor: COLORS.cinnamon }]}>
                <Text style={styles.badgeText}>NEW IN</Text>
              </View>
            )}
            {product.isBestseller && (
              <View style={[styles.badge, { backgroundColor: COLORS.gold }]}>
                <Text style={styles.badgeText}>BESTSELLER</Text>
              </View>
            )}
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>{product.brand}</Text>

          {/* Rating */}
          <Pressable style={styles.ratingRow}>
            <StarRating rating={product.rating} size={14} />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewCountText}>({product.reviewCount} reviews)</Text>
          </Pressable>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>£{product.price}</Text>
            {product.originalPrice && (
              <>
                <Text style={styles.originalPrice}>£{product.originalPrice}</Text>
                <View style={styles.saveBadge}>
                  <Text style={styles.saveText}>SAVE {discount}%</Text>
                </View>
              </>
            )}
          </View>
          {product.size && <Text style={styles.size}>{product.size}</Text>}

          {/* Shade selector */}
          {product.shades && (
            <ShadeSelector
              shades={product.shades}
              selected={selectedShade}
              onSelect={setSelectedShade}
            />
          )}

          {/* Quantity */}
          <QuantitySelector quantity={quantity} onChange={setQuantity} />

          {/* CTA Buttons */}
          <View style={styles.ctaRow}>
            <Pressable
              onPress={handleAddToBag}
              style={({ pressed }) => [
                styles.addToBagBtn,
                pressed && styles.addToBagBtnPressed,
                addedToBag && styles.addToBagBtnSuccess,
              ]}
              accessibilityLabel="Add to bag"
            >
              <Feather
                name={addedToBag ? 'check' : 'shopping-bag'}
                size={18}
                color={COLORS.white}
              />
              <Text style={styles.addToBagText}>
                {addedToBag ? 'ADDED TO BAG' : 'ADD TO BAG'}
              </Text>
            </Pressable>
          </View>

          {/* Trust badges */}
          <View style={styles.trustRow}>
            {[
              { icon: 'refresh-cw', label: 'Free Returns' },
              { icon: 'shield', label: 'Clean Certified' },
              { icon: 'award', label: 'Award Winning' },
            ].map((t) => (
              <View key={t.label} style={styles.trustItem}>
                <Feather name={t.icon} size={14} color={COLORS.gold} />
                <Text style={styles.trustLabel}>{t.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsWrap}>
          <View style={styles.tabsRow}>
            {TABS.map((tab, i) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(i)}
                style={[styles.tab, activeTab === i && styles.tabActive]}
                accessibilityState={{ selected: activeTab === i }}
              >
                <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.tabContent}>
            {activeTab === 1 && product.keyIngredients.length > 0 ? (
              product.keyIngredients.map((k) => (
                <View key={k.name} style={styles.ingredientRow}>
                  <View style={styles.ingredientDot} />
                  <View>
                    <Text style={styles.ingredientName}>{k.name}</Text>
                    <Text style={styles.ingredientBenefit}>{k.benefit}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.tabBody}>{tabContent[activeTab]}</Text>
            )}
          </View>
        </View>

        {/* Reviews */}
        {productReviews.length > 0 && (
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsSummary}>
              <View style={styles.reviewsScore}>
                <Text style={styles.reviewsScoreNum}>{product.rating}</Text>
                <StarRating rating={product.rating} size={18} />
                <Text style={styles.reviewsTotal}>{product.reviewCount} reviews</Text>
              </View>
            </View>
            {productReviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </View>
        )}

        {/* Related */}
        {related.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>You May Also Love</Text>
            <FlatList
              data={related}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(p) => p.id}
              contentContainerStyle={{ paddingHorizontal: SIZES.screenPadding, gap: SIZES.sm }}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => navigation.push('ProductDetail', { product: item })}
                  style={{ width: 170 }}
                />
              )}
            />
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky bottom bar */}
      <SafeAreaView edges={['bottom']} style={styles.stickyBar}>
        <View style={styles.stickyBarInner}>
          <View style={styles.stickyPrice}>
            <Text style={styles.stickyPriceLabel}>Total</Text>
            <Text style={styles.stickyPriceValue}>£{(product.price * quantity).toFixed(2)}</Text>
          </View>
          <Pressable
            onPress={handleAddToBag}
            style={({ pressed }) => [
              styles.stickyAddBtn,
              pressed && { opacity: 0.9 },
              addedToBag && styles.stickyAddBtnSuccess,
            ]}
            accessibilityLabel="Add to bag"
          >
            <Text style={styles.stickyAddBtnText}>
              {addedToBag ? '✓ ADDED' : 'ADD TO BAG'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Carousel
  carouselWrap: { width, height: IMAGE_HEIGHT, backgroundColor: COLORS.ivoryDeep },
  carouselImage: { width, height: IMAGE_HEIGHT },
  carouselDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: { width: 16, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.45)' },
  dotActive: { backgroundColor: COLORS.gold, width: 28 },

  backBtn: {
    position: 'absolute',
    top: 52,
    left: SIZES.screenPadding,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 52,
    right: SIZES.screenPadding,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Info
  infoSection: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.screenPadding,
    paddingTop: SIZES.xl,
    paddingBottom: SIZES.lg,
  },
  badgesRow: { flexDirection: 'row', gap: SIZES.sm, marginBottom: SIZES.md },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontFamily: FONTS.heading,
    letterSpacing: 1,
  },
  productName: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.text,
    lineHeight: 34,
    marginBottom: 4,
  },
  productBrand: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.gold,
    letterSpacing: 1.5,
    marginBottom: SIZES.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SIZES.md,
  },
  ratingText: {
    fontFamily: FONTS.subheading,
    fontSize: SIZES.small,
    color: COLORS.text,
  },
  reviewCountText: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    textDecorationLine: 'underline',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    marginBottom: 4,
  },
  price: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: COLORS.text,
  },
  originalPrice: {
    fontFamily: FONTS.body,
    fontSize: SIZES.bodyLarge,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  saveBadge: {
    backgroundColor: COLORS.maroon,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusFull,
  },
  saveText: {
    fontFamily: FONTS.heading,
    fontSize: 9,
    color: COLORS.white,
    letterSpacing: 0.8,
  },
  size: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    marginBottom: SIZES.lg,
  },

  // Shades
  shadesWrap: { marginBottom: SIZES.lg },
  shadesLabel: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  shadeName: { fontFamily: FONTS.subheading, color: COLORS.cinnamon },
  shadesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  shadeBtn: { position: 'relative', padding: 3 },
  shadeBtnActive: {},
  shadeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  shadeRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.cinnamon,
  },

  // Quantity
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  qtyLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontFamily: FONTS.subheading,
    fontSize: SIZES.body,
    color: COLORS.text,
    minWidth: 36,
    textAlign: 'center',
  },

  // CTA
  ctaRow: { marginBottom: SIZES.md },
  addToBagBtn: {
    backgroundColor: COLORS.maroon,
    borderRadius: SIZES.radiusFull,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sm,
    ...SHADOWS.gold,
  },
  addToBagBtnPressed: { backgroundColor: COLORS.maroonDark },
  addToBagBtnSuccess: { backgroundColor: COLORS.success },
  addToBagText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.body,
    color: COLORS.white,
    letterSpacing: 2,
  },

  // Trust
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SIZES.md,
    borderTopWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginTop: SIZES.md,
  },
  trustItem: { alignItems: 'center', gap: 6 },
  trustLabel: {
    fontFamily: FONTS.body,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  // Tabs
  tabsWrap: {
    backgroundColor: COLORS.surface,
    marginTop: SIZES.sm,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: COLORS.maroon },
  tabText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  tabTextActive: { color: COLORS.maroon, fontFamily: FONTS.subheading },
  tabContent: { padding: SIZES.screenPadding },
  tabBody: {
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.text,
    lineHeight: 26,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.md,
    marginBottom: SIZES.md,
  },
  ingredientDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
    marginTop: 6,
  },
  ingredientName: {
    fontFamily: FONTS.subheading,
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  ingredientBenefit: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Reviews
  reviewsSection: {
    backgroundColor: COLORS.surface,
    marginTop: SIZES.sm,
    padding: SIZES.screenPadding,
  },
  reviewsSummary: {
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingBottom: SIZES.md,
    marginBottom: SIZES.md,
  },
  reviewsScore: { alignItems: 'center', gap: 6 },
  reviewsScoreNum: {
    fontFamily: FONTS.display,
    fontSize: 48,
    color: COLORS.text,
  },
  reviewsTotal: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
  },
  reviewCard: {
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingVertical: SIZES.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18 },
  reviewMeta: { flex: 1 },
  reviewAuthor: {
    fontFamily: FONTS.subheading,
    fontSize: SIZES.small,
    color: COLORS.text,
  },
  reviewStarRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  verifiedBadge: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: SIZES.radiusFull,
  },
  verifiedText: {
    fontSize: 8,
    fontFamily: FONTS.heading,
    color: COLORS.success,
    letterSpacing: 0.5,
  },
  reviewDate: {
    fontFamily: FONTS.body,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
  },
  reviewTitle: {
    fontFamily: FONTS.subheading,
    fontSize: SIZES.body,
    color: COLORS.text,
    marginBottom: 6,
  },
  reviewBody: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SIZES.sm,
  },
  reviewFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  helpfulText: {
    fontFamily: FONTS.body,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
  },

  // Related
  relatedSection: {
    marginTop: SIZES.sm,
    paddingTop: SIZES.lg,
    backgroundColor: COLORS.background,
  },
  relatedTitle: {
    fontFamily: FONTS.display,
    fontSize: SIZES.heading,
    color: COLORS.text,
    paddingHorizontal: SIZES.screenPadding,
    marginBottom: SIZES.md,
  },

  // Sticky bar
  stickyBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  stickyBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.md,
    gap: SIZES.md,
  },
  stickyPrice: { flex: 1 },
  stickyPriceLabel: {
    fontFamily: FONTS.body,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
  },
  stickyPriceValue: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.text,
  },
  stickyAddBtn: {
    flex: 2,
    backgroundColor: COLORS.maroon,
    borderRadius: SIZES.radiusFull,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyAddBtnSuccess: { backgroundColor: COLORS.success },
  stickyAddBtnText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.small,
    color: COLORS.white,
    letterSpacing: 2,
  },
});
