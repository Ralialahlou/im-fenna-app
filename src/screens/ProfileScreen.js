import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

const ORDERS = [
  {
    id: 'ORD-20250601',
    date: '1 Jun 2025',
    status: 'Delivered',
    statusColor: COLORS.success,
    total: '£126.00',
    itemCount: 3,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=80&q=60',
  },
  {
    id: 'ORD-20250512',
    date: '12 May 2025',
    status: 'Delivered',
    statusColor: COLORS.success,
    total: '£68.00',
    itemCount: 1,
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=80&q=60',
  },
];

const BEAUTY_QUIZ = [
  { question: 'Skin type', answer: 'Combination' },
  { question: 'Skin concern', answer: 'Hydration & Glow' },
  { question: 'Routine', answer: 'Skincare + Makeup' },
];

function SettingRow({ icon, label, value, onPress, toggle, toggleValue, onToggle }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.settingRow, pressed && !toggle && { opacity: 0.7 }]}
      accessibilityLabel={label}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIconWrap}>
          <Feather name={icon} size={16} color={COLORS.gold} />
        </View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: COLORS.lightGray, true: COLORS.maroon }}
          thumbColor={COLORS.white}
        />
      ) : (
        <View style={styles.settingRight}>
          {value && <Text style={styles.settingValue}>{value}</Text>}
          <Feather name="chevron-right" size={16} color={COLORS.textMuted} />
        </View>
      )}
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }) {
  const { items: wishlistItems } = useWishlist();
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  const isSignedIn = false;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>ACCOUNT</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <LinearGradient
          colors={[COLORS.cinnamon, COLORS.maroon]}
          style={styles.profileCard}
        >
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Feather name="user" size={32} color={COLORS.rose} />
            </View>
            <View style={styles.goldRing} />
          </View>
          <Text style={styles.profileName}>My Account</Text>
          <Text style={styles.profileSubtitle}>beauty is art, be the muse.</Text>

          {!isSignedIn && (
            <View style={styles.authButtons}>
              <Pressable style={styles.signInBtn}>
                <Text style={styles.signInBtnText}>SIGN IN</Text>
              </Pressable>
              <Pressable style={styles.registerBtn}>
                <Text style={styles.registerBtnText}>CREATE ACCOUNT</Text>
              </Pressable>
            </View>
          )}
        </LinearGradient>

        {/* Beauty Profile */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Beauty Profile</Text>
            <Pressable hitSlop={8}>
              <Text style={styles.editText}>EDIT</Text>
            </Pressable>
          </View>
          <View style={styles.beautyProfile}>
            {BEAUTY_QUIZ.map((q) => (
              <View key={q.question} style={styles.beautyItem}>
                <Text style={styles.beautyQuestion}>{q.question}</Text>
                <Text style={styles.beautyAnswer}>{q.answer}</Text>
              </View>
            ))}
            <Pressable style={styles.quizCta}>
              <Feather name="help-circle" size={14} color={COLORS.gold} />
              <Text style={styles.quizCtaText}>Retake Beauty Quiz</Text>
            </Pressable>
          </View>
        </View>

        {/* Tab switcher */}
        <View style={styles.section}>
          <View style={styles.tabBar}>
            {['orders', 'wishlist'].map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                accessibilityState={{ selected: activeTab === tab }}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab === 'orders' ? `Orders (${ORDERS.length})` : `Wishlist (${wishlistItems.length})`}
                </Text>
              </Pressable>
            ))}
          </View>

          {activeTab === 'orders' ? (
            <View style={styles.ordersList}>
              {ORDERS.map((order) => (
                <Pressable key={order.id} style={styles.orderCard}>
                  <Image source={{ uri: order.image }} style={styles.orderImage} resizeMode="cover" />
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderDate}>{order.date} · {order.itemCount} item{order.itemCount > 1 ? 's' : ''}</Text>
                    <View style={[styles.orderStatus, { backgroundColor: `${order.statusColor}18` }]}>
                      <Text style={[styles.orderStatusText, { color: order.statusColor }]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderTotal}>{order.total}</Text>
                    <Feather name="chevron-right" size={16} color={COLORS.textMuted} />
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.wishlistGrid}>
              {wishlistItems.length === 0 ? (
                <View style={styles.emptyWishlist}>
                  <Feather name="heart" size={36} color={COLORS.lightGray} />
                  <Text style={styles.emptyWishlistTitle}>Your wishlist is empty</Text>
                  <Text style={styles.emptyWishlistBody}>
                    Tap the heart icon on any product to save it here.
                  </Text>
                  <Pressable style={styles.shopBtn} onPress={() => navigation.navigate('Explore')}>
                    <Text style={styles.shopBtnText}>DISCOVER PRODUCTS</Text>
                  </Pressable>
                </View>
              ) : (
                wishlistItems.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onPress={() => navigation.navigate('ProductDetail', { product: p })}
                  />
                ))
              )}
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingsGroup}>
            <SettingRow icon="bell" label="Push Notifications" toggle toggleValue={notifications} onToggle={setNotifications} />
            <SettingRow icon="mail" label="Newsletter" toggle toggleValue={newsletter} onToggle={setNewsletter} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsGroup}>
            <SettingRow icon="map-pin" label="Delivery Addresses" onPress={() => {}} />
            <SettingRow icon="credit-card" label="Payment Methods" onPress={() => {}} />
            <SettingRow icon="gift" label="Loyalty Rewards" value="248 pts" onPress={() => {}} />
            <SettingRow icon="help-circle" label="Help & Support" onPress={() => {}} />
            <SettingRow icon="file-text" label="Returns & Exchanges" onPress={() => {}} />
          </View>
        </View>

        {/* Brand quote */}
        <View style={styles.quoteSection}>
          <Text style={styles.quoteText}>"beauty is art, be the muse."</Text>
          <Text style={styles.quoteBrand}>— I'm Fenna</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },

  header: {
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

  // Profile card
  profileCard: {
    padding: SIZES.xl,
    alignItems: 'center',
    gap: SIZES.sm,
  },
  avatarWrap: { position: 'relative', marginBottom: SIZES.sm },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(226,196,186,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
  },
  profileName: {
    fontFamily: FONTS.display,
    fontSize: SIZES.heading,
    color: COLORS.white,
  },
  profileSubtitle: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
  },
  authButtons: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginTop: SIZES.md,
  },
  signInBtn: {
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.white,
  },
  signInBtnText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.small,
    color: COLORS.maroon,
    letterSpacing: 1.5,
  },
  registerBtn: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  registerBtnText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.small,
    color: COLORS.white,
    letterSpacing: 1,
  },

  // Sections
  section: {
    marginTop: SIZES.md,
    paddingHorizontal: SIZES.screenPadding,
    paddingTop: SIZES.md,
  },
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
    marginBottom: SIZES.md,
  },
  editText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.caption,
    color: COLORS.maroon,
    letterSpacing: 1,
  },

  // Beauty profile
  beautyProfile: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    ...SHADOWS.soft,
    gap: SIZES.sm,
  },
  beautyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  beautyQuestion: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
  },
  beautyAnswer: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.small,
    color: COLORS.cinnamon,
  },
  quizCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: SIZES.sm,
  },
  quizCtaText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.small,
    color: COLORS.gold,
  },

  // Orders / Wishlist tabs
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: COLORS.borderSubtle,
    marginBottom: SIZES.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -2,
  },
  tabActive: { borderBottomColor: COLORS.maroon },
  tabText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
  },
  tabTextActive: { color: COLORS.maroon, fontFamily: FONTS.subheading },

  ordersList: { gap: SIZES.sm },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    ...SHADOWS.soft,
  },
  orderImage: {
    width: 50,
    height: 60,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.ivoryDeep,
  },
  orderInfo: { flex: 1, gap: 4 },
  orderId: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.small,
    color: COLORS.text,
  },
  orderDate: {
    fontFamily: FONTS.body,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
  },
  orderStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusFull,
    marginTop: 2,
  },
  orderStatusText: {
    fontFamily: FONTS.heading,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  orderRight: { alignItems: 'flex-end', gap: 6 },
  orderTotal: {
    fontFamily: FONTS.subheading,
    fontSize: SIZES.body,
    color: COLORS.text,
  },

  wishlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },

  emptyWishlist: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: SIZES.xxxl,
    gap: SIZES.md,
  },
  emptyWishlistTitle: {
    fontFamily: FONTS.display,
    fontSize: SIZES.subheading,
    color: COLORS.text,
  },
  emptyWishlistBody: {
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 240,
  },
  shopBtn: {
    marginTop: SIZES.sm,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.maroon,
  },
  shopBtnText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.small,
    color: COLORS.white,
    letterSpacing: 1.5,
  },

  // Settings
  settingsGroup: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
    minHeight: 56,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: SIZES.md, flex: 1 },
  settingIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.small,
    color: COLORS.gold,
  },

  // Quote
  quoteSection: {
    marginTop: SIZES.xl,
    paddingVertical: SIZES.xl,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginHorizontal: SIZES.screenPadding,
  },
  quoteText: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
  },
  quoteBrand: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.gold,
    marginTop: SIZES.sm,
    letterSpacing: 1,
  },
});
