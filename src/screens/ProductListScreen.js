import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { PRODUCTS, CATEGORIES } from '../data/products';

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest First' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Best Rated' },
];

function FilterModal({ visible, onClose, filters, onApply }) {
  const [local, setLocal] = useState(filters);

  const categoryFilters = CATEGORIES.filter((c) => c.id !== 'all');

  const toggleCategory = (id) => {
    setLocal((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id],
    }));
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={filterStyles.modal} edges={['top', 'bottom']}>
        <View style={filterStyles.header}>
          <Pressable onPress={onClose} hitSlop={8}>
            <Feather name="x" size={22} color={COLORS.text} />
          </Pressable>
          <Text style={filterStyles.title}>FILTER</Text>
          <Pressable onPress={() => setLocal({ categories: [], priceMax: null })} hitSlop={8}>
            <Text style={filterStyles.clearText}>CLEAR ALL</Text>
          </Pressable>
        </View>

        <ScrollView style={filterStyles.body}>
          <Text style={filterStyles.groupTitle}>Category</Text>
          <View style={filterStyles.pillsRow}>
            {categoryFilters.map((c) => {
              const active = local.categories.includes(c.id);
              return (
                <Pressable
                  key={c.id}
                  onPress={() => toggleCategory(c.id)}
                  style={[filterStyles.pill, active && filterStyles.pillActive]}
                >
                  <Text style={[filterStyles.pillText, active && filterStyles.pillTextActive]}>
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={filterStyles.groupTitle}>Price Range</Text>
          {[50, 75, 100, 150].map((max) => {
            const active = local.priceMax === max;
            return (
              <Pressable
                key={max}
                onPress={() => setLocal((p) => ({ ...p, priceMax: active ? null : max }))}
                style={filterStyles.priceRow}
              >
                <Text style={filterStyles.priceLabel}>Under £{max}</Text>
                <View style={[filterStyles.radio, active && filterStyles.radioActive]}>
                  {active && <View style={filterStyles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={filterStyles.footer}>
          <Pressable
            style={filterStyles.applyBtn}
            onPress={() => { onApply(local); onClose(); }}
          >
            <Text style={filterStyles.applyText}>APPLY FILTERS</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function ProductListScreen({ route, navigation }) {
  const { category = 'all' } = route.params || {};
  const [sortBy, setSortBy] = useState('featured');
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ categories: [], priceMax: null });
  const [viewMode, setViewMode] = useState('grid');

  const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label || 'All Products';

  const products = useMemo(() => {
    let list = [...PRODUCTS];

    if (category === 'new') list = list.filter((p) => p.isNew);
    else if (category !== 'all') {
      list = list.filter((p) => p.category === category || p.range === category);
    }

    if (filters.categories.length > 0) {
      list = list.filter(
        (p) => filters.categories.includes(p.category) || filters.categories.includes(p.range)
      );
    }
    if (filters.priceMax) list = list.filter((p) => p.price <= filters.priceMax);

    switch (sortBy) {
      case 'newest': list = list.filter((p) => p.isNew).concat(list.filter((p) => !p.isNew)); break;
      case 'price_asc': list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [category, sortBy, filters]);

  const activeFilterCount = filters.categories.length + (filters.priceMax ? 1 : 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={COLORS.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{categoryLabel.toUpperCase()}</Text>
          <Text style={styles.headerCount}>{products.length} products</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable onPress={() => setViewMode((v) => (v === 'grid' ? 'list' : 'grid'))} hitSlop={8}>
            <Feather name={viewMode === 'grid' ? 'list' : 'grid'} size={20} color={COLORS.text} />
          </Pressable>
        </View>
      </View>

      {/* Filter & Sort bar */}
      <View style={styles.toolbar}>
        <Pressable onPress={() => setShowFilter(true)} style={styles.toolbarBtn}>
          <Feather name="sliders" size={16} color={COLORS.text} />
          <Text style={styles.toolbarBtnText}>FILTER</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>

        <View style={styles.toolbarDivider} />

        <Pressable onPress={() => setShowSort(true)} style={styles.toolbarBtn}>
          <Feather name="bar-chart-2" size={16} color={COLORS.text} />
          <Text style={styles.toolbarBtnText}>SORT</Text>
        </Pressable>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View style={styles.sortDropdown}>
          {SORT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              onPress={() => { setSortBy(opt.id); setShowSort(false); }}
              style={[styles.sortOption, sortBy === opt.id && styles.sortOptionActive]}
            >
              <Text style={[styles.sortOptionText, sortBy === opt.id && styles.sortOptionTextActive]}>
                {opt.label}
              </Text>
              {sortBy === opt.id && <Feather name="check" size={14} color={COLORS.maroon} />}
            </Pressable>
          ))}
        </View>
      )}

      {/* Product grid */}
      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={viewMode === 'grid' ? styles.columnWrapper : undefined}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={40} color={COLORS.lightGray} />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyBody}>Try adjusting your filters</Text>
            <Pressable
              onPress={() => setFilters({ categories: [], priceMax: null })}
              style={styles.emptyBtn}
            >
              <Text style={styles.emptyBtnText}>CLEAR FILTERS</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            style={viewMode === 'list' ? styles.listCard : undefined}
          />
        )}
      />

      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onApply={setFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  backBtn: { width: 40 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontFamily: FONTS.display,
    fontSize: 18,
    color: COLORS.text,
    letterSpacing: 3,
  },
  headerCount: {
    fontFamily: FONTS.body,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  headerRight: { width: 40, alignItems: 'flex-end' },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  toolbarBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SIZES.md,
    position: 'relative',
  },
  toolbarBtnText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.caption,
    color: COLORS.text,
    letterSpacing: 1.5,
  },
  toolbarDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  filterBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontFamily: FONTS.heading,
  },

  // Sort dropdown
  sortDropdown: {
    position: 'absolute',
    top: 120,
    left: SIZES.screenPadding,
    right: SIZES.screenPadding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    zIndex: 100,
    ...SHADOWS.medium,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  sortOptionActive: { backgroundColor: COLORS.maroonLight },
  sortOptionText: {
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  sortOptionTextActive: { fontFamily: FONTS.bodyMedium, color: COLORS.maroon },

  listContent: {
    padding: SIZES.screenPadding,
    gap: SIZES.sm,
  },
  columnWrapper: { gap: SIZES.sm },
  listCard: { width: '100%' },

  empty: {
    alignItems: 'center',
    paddingTop: SIZES.xxxl,
    gap: SIZES.md,
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
  },
  emptyBtn: {
    marginTop: SIZES.md,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.maroon,
  },
  emptyBtnText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.small,
    color: COLORS.maroon,
    letterSpacing: 1.5,
  },
});

const filterStyles = StyleSheet.create({
  modal: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 18,
    color: COLORS.text,
    letterSpacing: 3,
  },
  clearText: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.maroon,
    letterSpacing: 0.8,
  },
  body: { flex: 1, padding: SIZES.screenPadding },
  groupTitle: {
    fontFamily: FONTS.display,
    fontSize: SIZES.subheading,
    color: COLORS.text,
    marginBottom: SIZES.md,
    marginTop: SIZES.lg,
  },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SIZES.sm },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  pillActive: { backgroundColor: COLORS.maroon, borderColor: COLORS.maroon },
  pillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: SIZES.small,
    color: COLORS.text,
  },
  pillTextActive: { color: COLORS.white },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  priceLabel: {
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.maroon },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.maroon,
  },
  footer: {
    padding: SIZES.screenPadding,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  applyBtn: {
    backgroundColor: COLORS.maroon,
    borderRadius: SIZES.radiusFull,
    paddingVertical: 18,
    alignItems: 'center',
  },
  applyText: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.body,
    color: COLORS.white,
    letterSpacing: 2,
  },
});
