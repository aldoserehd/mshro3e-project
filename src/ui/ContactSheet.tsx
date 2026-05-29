import React from 'react';
import { Linking, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../locales/i18n';
import Text from './Text';
import Button from './Button';
import type { Service, Vendor } from '@shared/types';
import { palette, radius, semantic, spacing, formatPrice, pickLocale } from '../theme/ts';

interface Props {
  visible: boolean;
  onClose: () => void;
  product: Service;
  vendor: Vendor;
}

const buildMessage = (productTitle: string, priceStr: string) =>
  i18n.t('contact.prefilledMessage', { product: productTitle, price: priceStr });

const cleanPhone = (raw: string) => raw.replace(/[^\d]/g, '');

export const ContactSheet: React.FC<Props> = ({ visible, onClose, product, vendor }) => {
  const productTitle = pickLocale(product.title);
  const priceStr = formatPrice(product.price, product.currency);
  const message = buildMessage(productTitle, priceStr);

  const onWhatsapp = () => {
    const phone = cleanPhone(vendor.whatsapp ?? vendor.phone ?? '');
    if (!phone) return;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {});
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text variant="cardTitle">{i18n.t('contact.title')}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={palette.neutral500} />
            </Pressable>
          </View>

          <View style={styles.productRow}>
            <Image source={{ uri: product.images[0] }} style={styles.thumb} contentFit="cover" />
            <View style={{ flex: 1, marginStart: spacing.s3, gap: 4 }}>
              <Text variant="cardTitle" numberOfLines={1}>{productTitle}</Text>
              <Text variant="caption" color={palette.neutral500} numberOfLines={1}>
                {pickLocale(vendor.name)}
              </Text>
              <Text variant="cardTitle" color={palette.navy900}>{priceStr}</Text>
            </View>
          </View>

          <View style={styles.messageBubble}>
            <Text variant="body" color={palette.neutral900}>{message}</Text>
          </View>

          <Button
            title={i18n.t('contact.sendWhatsapp')}
            onPress={onWhatsapp}
            icon="logo-whatsapp"
          />
          <View style={{ height: spacing.s2 }} />
          <Button
            title={i18n.t('contact.sendInApp')}
            variant="ghost"
            onPress={onClose}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ContactSheet;

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(5,8,15,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: semantic.surface,
    borderTopStartRadius: radius.xl,
    borderTopEndRadius: radius.xl,
    paddingHorizontal: spacing.s5,
    paddingBottom: spacing.s7,
    paddingTop: spacing.s3,
  },
  handle: {
    alignSelf: 'center',
    width: 44, height: 4, borderRadius: 999,
    backgroundColor: palette.navy200,
    marginBottom: spacing.s3,
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.s4,
  },
  productRow: {
    flexDirection: 'row',
    backgroundColor: palette.navy50,
    borderRadius: radius.lg,
    padding: spacing.s3,
    marginBottom: spacing.s4,
  },
  thumb: { width: 64, height: 64, borderRadius: radius.md, backgroundColor: palette.navy100 },
  messageBubble: {
    backgroundColor: palette.navy50,
    borderRadius: radius.lg,
    padding: spacing.s4,
    borderWidth: 1,
    borderColor: palette.navy100,
    marginBottom: spacing.s4,
  },
});
