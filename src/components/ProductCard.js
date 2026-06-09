import React, { useCallback } from 'react';
import {
  View, Text, Image, Pressable, StyleSheet, Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import StarRating from './StarRating';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SIZES.screenPadding * 2 - SIZES.sm) / 2;

export default function ProductCard({ product, onPress, style }) {
  const { isWishlisted, toggle } = useWishlist();
  const { addItem } = useCart();
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = useCallback(() => toggle(product), [product, toggle]);
  const handleQuickAdd = useCallback(() => addItem(product), [product, addItem]);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed, style]}
      accessibilityLabel={`${product.name}, £${product.price}`}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

        {/* Badges */}
        <View style={styles.badges}>
          {product.isNew && (
            <View style={[styles.badge, styles.badgeNew]}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
          {product.isBestseller && !product.isNew && (
            <View style={[styles.badge, styles.badgeBest]}>
              <Text style={styles.badgeText}>BESTSELLER</Text>
            </View>
          )}
          {discount && (
            <View style={[styles.badge, styles.badgeSale]}>
              <Text style={styles.badgeText}>−{discount}%</Text>
            </View>
          )}
        </View>

        {/* Wishlist */}
        <Pressable
          onPress={handleWishlist}
          style={styles.wishlistBtn}
          hitSlop={8}
          accessibilityLabel={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Feather
            name="heart"
            size={16}
            color={wishlisted ? COLORS.maroon : COLORS.warmGray}
            style={wishlisted && styles.heartFilled}
          />
        </Pressable>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

        <View style={styles.ratingRow}>
          <StarRating rating={product.rating} size={11} />
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>£{product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>£{product.originalPrice}</Text>
          )}
        </View>

        <Pressable
          onPress={handleQuickAdd}
          style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
          accessibilityLabel={`Quick add ${product.name} to bag`}
        >
          <Text style={styles.addBtnText}>ADD TO BAG</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  cardPressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  imageWrap: {
    width: '100%',
    height: CARD_WIDTH * 1.15,
    backgroundColor: COLORS.ivoryDeep,
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  badges: {
    position: 'absolute',
    top: 10,
    left: 10,
    gap: 4,
  },
  badge: {
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeNew: { backgroundColor: COLORS.cinnamon },
  badgeBest: { backgroundColor: COLORS.gold },
  badgeSale: { backgroundColor: COLORS.maroon },
  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontFamily: FONTS.heading,
    letterSpacing: 0.8,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartFilled: { color: COLORS.maroon },
  info: {
    padding: SIZES.cardPadding,
    gap: 6,
  },
  name: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.small,
    color: COLORS.text,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewCount: {
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontFamily: FONTS.subheading,
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  originalPrice: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    backgroundColor: COLORS.maroon,
    borderRadius: SIZES.radiusFull,
    paddingVertical: 9,
    alignItems: 'center',
    marginTop: 2,
  },
  addBtnPressed: { backgroundColor: COLORS.maroonDark },
  addBtnText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: FONTS.heading,
    letterSpacing: 1.2,
  },
});
