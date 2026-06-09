import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

function CartItem({ item, onRemove, onUpdateQty }) {
  const { product, shade, quantity, key } = item;
  const linePrice = (product.price * quantity).toFixed(2);

  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: product.image }} style={styles.itemImage} resizeMode="cover" />

      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{product.name}</Text>
        {shade && <Text style={styles.itemShade}>{shade.name}</Text>}
        <Text style={styles.itemSize}>{product.size}</Text>

        <View style={styles.itemFooter}>
          <View style={styles.qtyControls}>
            <Pressable
              onPress={() => onUpdateQty(key, quantity - 1)}
              style={styles.qtyBtn}
              accessibilityLabel="Decrease quantity"
            >
              <Feather name="minus" size={14} color={COLORS.text} />
            </Pressable>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <Pressable
              onPress={() => onUpdateQty(key, quantity + 1)}
              style={styles.qtyBtn}
              accessibilityLabel="Increase quantity"
            >
              <Feather name="plus" size={14} color={COLORS.text} />
            </Pressable>
          </View>
          <Text style={styles.itemPrice}>£{linePrice}</Text>
        </View>
      </View>

      <Pressable onPress={() => onRemove(key)} style={styles.removeBtn} hitSlop={8} accessibilityLabel="Remove item">
        <Feather name="x" size={16} color={COLORS.textMuted} />
      </Pressable>
    </View>
  );
}

function EmptyCart({ navigation }) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconWrap}>
        <Feather name="shopping-bag" size={48} color={COLORS.lightGray} />
      </View>
      <Text style={styles.emptyTitle}>Your bag is empty</Text>
      <Text style={styles.emptyBody}>
        Discover our premium beauty collection and fill your ritual.
      </Text>
      <Pressable style={styles.emptyBtn} onPress={() => navigation.navigate('Explore')}>
        <Text style={styles.emptyBtnText}>SHOP NOW</Text>
      </Pressable>
    </View>
  );
}

export default function CartScreen({ navigation }) {
  const { items, subtotal, shippingAmount, total, freeShippingThreshold, removeItem, updateQty, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'FENNA10') {
      setDiscount(subtotal * 0.1);
      setPromoApplied(true);
    } else {
      Alert.alert('Invalid Code', 'Please check your promo code and try again.');
    }
  };

  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFree = freeShippingThreshold - subtotal;

  const handleCheckout = () => {
    Alert.alert(
      'Order Placed',
      'Thank you for your order! You will receive a confirmation email shortly.',
      [{ text: 'Continue Shopping', onPress: clearCart }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>MY BAG</Text>
        {items.length > 0 && (
          <Pressable onPress={clearCart} hitSlop={8}>
            <Text style={styles.clearText}>CLEAR ALL</Text>
          </Pressable>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyCart navigation={navigation} />
      ) : (
        <>
          {/* Free shipping progress */}
          {subtotal < freeShippingThreshold && (
            <View style={styles.shippingProgress}>
              <Text style={styles.shippingProgressText}>
                Add <Text style={styles.shippingProgressBold}>£{remainingForFree.toFixed(2)}</Text> more for free delivery
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${shippingProgress}%` }]} />
              </View>
            </View>
          )}
          {subtotal >= freeShippingThreshold && (
            <View style={[styles.shippingProgress, styles.freeShippingBanner]}>
              <Feather name="package" size={14} color={COLORS.success} />
              <Text style={styles.freeShippingText}>You've unlocked free delivery!</Text>
            </View>
          )}

          <FlatList
            data={items}
            keyExtractor={(i) => i.key}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <CartItem item={item} onRemove={removeItem} onUpdateQty={updateQty} />
            )}
            ListFooterComponent={
              <View style={styles.orderSummary}>
                {/* Promo code */}
                <Text style={styles.summaryTitle}>ORDER SUMMARY</Text>

                <View style={styles.promoRow}>
                  <TextInput
                    style={styles.promoInput}
                    placeholder="Promo code"
                    placeholderTextColor={COLORS.textMuted}
                    value={promoCode}
                    onChangeText={setPromoCode}
                    autoCapitalize="characters"
                    returnKeyType="done"
                    onSubmitEditing={applyPromo}
                    accessibilityLabel="Promo code input"
                  />
                  <Pressable
                    onPress={applyPromo}
                    style={[styles.promoBtn, promoApplied && styles.promoBtnApplied]}
                    disabled={promoApplied}
                  >
                    <Text style={styles.promoBtnText}>{promoApplied ? 'APPLIED' : 'APPLY'}</Text>
                  </Pressable>
                </View>

                {/* Line items */}
                <View style={styles.summaryLines}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>£{subtotal.toFixed(2)}</Text>
                  </View>
                  {promoApplied && (
                    <View style={styles.summaryRow}>
                      <Text style={[styles.summaryLabel, { color: COLORS.success }]}>Promo (FENNA10)</Text>
                      <Text style={[styles.summaryValue, { color: COLORS.success }]}>−£{discount.toFixed(2)}</Text>
                    </View>
                  )}
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery</Text>
                    <Text style={styles.summaryValue}>
                      {shippingAmount === 0 ? 'FREE' : `£${shippingAmount.toFixed(2)}`}
                    </Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                    <Text style={styles.summaryTotalLabel}>Total</Text>
                    <Text style={styles.summaryTotalValue}>
                      £{(total - discount).toFixed(2)}
                    </Text>
                  </View>
                </View>

                <Pressable onPress={handleCheckout} style={({ pressed }) => [styles.checkoutBtn, pressed && { opacity: 0.9 }]}>
                  <Text style={styles.checkoutBtnText}>PROCEED TO CHECKOUT</Text>
                  <Feather name="arrow-right" size={18} color={COLORS.white} />
                </Pressable>

                {/* Payment icons */}
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>We accept</Text>
                  <View style={styles.paymentIcons}>
                    {['credit-card', 'smartphone', 'shield'].map((icon) => (
                      <View key={icon} style={styles.paymentIcon}>
                        <Feather name={icon} size={14} color={COLORS.textMuted} />
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            }
          />
        </>
      )}
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
  clearText: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.maroon,
    letterSpacing: 0.8,
  },

  // Shipping progress
  shippingProgress: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.ivoryDeep,
    gap: SIZES.sm,
  },
  shippingProgressText: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  shippingProgressBold: { fontFamily: FONTS.subheading, color: COLORS.maroon },
  progressBar: {
    height: 3,
    backgroundColor: COLORS.rose,
    borderRadius: 2,
  },
  progressFill: {
    height: 3,
    backgroundColor: COLORS.maroon,
    borderRadius: 2,
  },
  freeShippingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sm,
    backgroundColor: COLORS.successLight,
  },
  freeShippingText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.small,
    color: COLORS.success,
  },

  listContent: { padding: SIZES.screenPadding },
  separator: { height: 1, backgroundColor: COLORS.borderSubtle, marginVertical: SIZES.md },

  // Cart item
  cartItem: {
    flexDirection: 'row',
    gap: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  itemImage: {
    width: 90,
    height: 110,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.ivoryDeep,
  },
  itemInfo: { flex: 1, gap: 4 },
  itemName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.body,
    color: COLORS.text,
    lineHeight: 22,
  },
  itemShade: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.gold,
  },
  itemSize: {
    fontFamily: FONTS.body,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES.sm,
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
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontFamily: FONTS.subheading,
    fontSize: SIZES.small,
    color: COLORS.text,
    minWidth: 28,
    textAlign: 'center',
  },
  itemPrice: {
    fontFamily: FONTS.display,
    fontSize: SIZES.bodyLarge,
    color: COLORS.text,
  },
  removeBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Order summary
  orderSummary: {
    marginTop: SIZES.xl,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.screenPadding,
    gap: SIZES.md,
    ...SHADOWS.soft,
  },
  summaryTitle: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.small,
    color: COLORS.text,
    letterSpacing: 2,
    marginBottom: SIZES.sm,
  },
  promoRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  promoInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: SIZES.md,
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  promoBtn: {
    paddingHorizontal: SIZES.md,
    height: 48,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.cinnamon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoBtnApplied: { backgroundColor: COLORS.success },
  promoBtnText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.caption,
    color: COLORS.white,
    letterSpacing: 1,
  },
  summaryLines: { gap: SIZES.sm },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  summaryValue: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: SIZES.md,
    marginTop: SIZES.sm,
  },
  summaryTotalLabel: {
    fontFamily: FONTS.display,
    fontSize: SIZES.subheading,
    color: COLORS.text,
  },
  summaryTotalValue: {
    fontFamily: FONTS.display,
    fontSize: SIZES.subheading,
    color: COLORS.text,
  },
  checkoutBtn: {
    backgroundColor: COLORS.maroon,
    borderRadius: SIZES.radiusFull,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sm,
    ...SHADOWS.gold,
  },
  checkoutBtnText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.body,
    color: COLORS.white,
    letterSpacing: 2,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sm,
  },
  paymentLabel: {
    fontFamily: FONTS.body,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
  },
  paymentIcons: { flexDirection: 'row', gap: 6 },
  paymentIcon: {
    width: 32,
    height: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.screenPadding,
    gap: SIZES.md,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.ivoryDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.sm,
  },
  emptyTitle: {
    fontFamily: FONTS.display,
    fontSize: SIZES.heading,
    color: COLORS.text,
  },
  emptyBody: {
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  emptyBtn: {
    marginTop: SIZES.sm,
    paddingHorizontal: SIZES.xxl,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.maroon,
    ...SHADOWS.gold,
  },
  emptyBtnText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.small,
    color: COLORS.white,
    letterSpacing: 2,
  },
});
