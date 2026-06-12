import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Text from './Text';
import Logo from './Logo';
import PressableScale from './PressableScale';
import { useFavoritesStore } from '../stores/favorites';
import { useColors } from '../theme/colors';
import { radius, shadowStyle, spacing, formatPrice, pickLocale } from '../theme/ts';
import type { Service, Vendor } from '@shared/types';

/**
 * THE product card — one component for every grid in the app
 * (Home search/collection, Category, anywhere products render in a grid).
 * 1:1 image, glass heart toggle, bold price chip, vendor strip + verified tick.
 */
export const ProductCard: React.FC<{
  product: Service;
  vendor?: Vendor;
  width: number;
  onPress: () => void;
}> = ({ product, vendor, width, onPress }) => {
  const c = useColors();
  const isFav = useFavoritesStore((s) => s.productIds.has(product.id));
  const toggleProduct = useFavoritesStore((s) => s.toggleProduct);

  return (
    <PressableScale onPress={onPress}>
      <View style={[styles.card, { width, backgroundColor: c.surface, borderColor: c.border }]}>
        <View style={styles.imgWrap}>
          <Image
            source={{ uri: product.images?.[0] }}
            style={[styles.img, { backgroundColor: c.surfaceSunken }]}
            contentFit="cover"
            transition={150}
          />
          <Pressable
            onPress={() => { Haptics.selectionAsync().catch(() => {}); toggleProduct(product.id); }}
            hitSlop={8}
            style={[styles.heart, { backgroundColor: c.glass }]}
          >
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={15} color={isFav ? c.danger : c.text} />
          </Pressable>
          <View style={[styles.priceChip, { backgroundColor: c.brandFill }]}>
            <Text variant="label" weight="700" color={c.brandText} forceLtr>
              {formatPrice(product.price, product.currency)}
            </Text>
          </View>
        </View>
        <View style={styles.body}>
          <Text variant="label" weight="600" numberOfLines={1}>{pickLocale(product.title)}</Text>
          {vendor && (
            <View style={styles.vendorRow}>
              <Logo name={vendor.name.en} size={18} uri={vendor.logoImage} zoom={vendor.logoZoom ?? 1} />
              <Text variant="caption" color={c.textMuted} numberOfLines={1} style={{ flex: 1, marginStart: 4 }}>
                {pickLocale(vendor.name)}
              </Text>
              {vendor.verifiedAt ? <Ionicons name="checkmark-circle" size={12} color={c.brandText} /> : null}
            </View>
          )}
        </View>
      </View>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.s3,
    ...shadowStyle(1),
  },
  imgWrap: { position: 'relative' },
  img: { width: '100%', aspectRatio: 1 },
  heart: {
    position: 'absolute', top: spacing.s2, end: spacing.s2,
    width: 30, height: 30, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center',
    ...shadowStyle(1),
  },
  priceChip: {
    position: 'absolute', bottom: spacing.s2, start: spacing.s2,
    paddingHorizontal: spacing.s2, paddingVertical: 3, borderRadius: radius.lg,
  },
  body: { padding: spacing.s3, gap: 4 },
  vendorRow: { flexDirection: 'row', alignItems: 'center' },
});

export default ProductCard;
