import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button, Card } from '../components/ui';
import { colors, spacing, typography, borderRadius } from '../theme';

const PREMIUM_FEATURES = [
  'Activity & Timer customization',
  'Advanced Reports & Analytics',
  'Multiple Device Sync',
  'Unlimited Time Goals',
  'Goal Achievement Badges',
  'Shared Activity Lists',
];

const SubscriptionScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleSubscribe = () => {
    Alert.alert(
      'Coming Soon',
      'In-app purchases will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose a plan for after your</Text>
          <Text style={styles.titleHighlight}>1-week free trial</Text>
        </View>

        <Card style={styles.pricingCard}>
          <View style={styles.pricingHeader}>
            <Text style={styles.popularBadge}>Most popular</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>$49/</Text>
              <Text style={styles.pricePeriod}>Year</Text>
            </View>
            <Text style={styles.billingNote}>Billed annually after trial</Text>
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>PREMIUM includes:</Text>

            {PREMIUM_FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={colors.primary}
                  style={styles.checkIcon}
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.cancelNote}>Cancel in the App Store any time</Text>
        <Button title="Subscribe & Start Trial" onPress={handleSubscribe} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
    paddingVertical: spacing['2xl'],
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  titleHighlight: {
    ...typography.h3,
    color: colors.accentBlue,
    textAlign: 'center',
  },
  pricingCard: {
    marginHorizontal: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  pricingHeader: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    margin: spacing.lg,
  },
  popularBadge: {
    ...typography.bodySmall,
    color: colors.accentBlue,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pricePeriod: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  billingNote: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  featuresSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  featuresTitle: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkIcon: {
    marginRight: spacing.md,
  },
  featureText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
    paddingTop: spacing.lg,
  },
  cancelNote: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});

export default SubscriptionScreen;
