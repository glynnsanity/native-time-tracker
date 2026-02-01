import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button, Card } from '../components/ui';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  subscriptionService,
  SubscriptionPlan,
  SubscriptionStatus,
} from '../services/subscriptionService';

const SubscriptionScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedPlans, fetchedStatus] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getStatus(),
      ]);
      setPlans(fetchedPlans);
      setStatus(fetchedStatus);
      // Select yearly plan by default
      const yearlyPlan = fetchedPlans.find((p) => p.period === 'yearly');
      setSelectedPlan(yearlyPlan || fetchedPlans[0] || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    setSubscribing(true);
    setError(null);

    try {
      const result = await subscriptionService.subscribe(selectedPlan);

      if (result.success) {
        Alert.alert('Success', 'You are now subscribed to Premium!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Subscription', result.error || 'Unable to complete subscription.', [
          { text: 'OK' },
        ]);
      }
    } catch (err: any) {
      setError(err.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    setError(null);

    try {
      const result = await subscriptionService.restore();

      if (result.success) {
        Alert.alert('Restored', 'Your subscription has been restored!', [
          { text: 'OK', onPress: () => loadData() },
        ]);
      } else {
        Alert.alert('Restore', result.error || 'No purchases to restore.', [{ text: 'OK' }]);
      }
    } catch (err: any) {
      setError(err.message || 'Restore failed');
    } finally {
      setRestoring(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose a plan for after your</Text>
          <Text style={styles.titleHighlight}>1-week free trial</Text>
        </View>

        {/* Plan Selection */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planOption,
                selectedPlan?.id === plan.id && styles.planOptionSelected,
              ]}
              onPress={() => setSelectedPlan(plan)}
            >
              <View style={styles.planOptionHeader}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedPlan?.id === plan.id && styles.radioOuterSelected,
                  ]}
                >
                  {selectedPlan?.id === plan.id && <View style={styles.radioInner} />}
                </View>
                <View>
                  <Text style={styles.planName}>
                    {plan.period === 'yearly' ? 'Annual' : 'Monthly'}
                    {plan.period === 'yearly' && (
                      <Text style={styles.planBadge}> (Best Value)</Text>
                    )}
                  </Text>
                  <Text style={styles.planPrice}>
                    {plan.priceString}/{plan.period === 'yearly' ? 'year' : 'month'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>PREMIUM includes:</Text>

          {selectedPlan?.features.map((feature, index) => (
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
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={restoring}
        >
          {restoring ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.cancelNote}>Cancel in the App Store any time</Text>

        <Button
          title={subscribing ? 'Processing...' : 'Subscribe & Start Trial'}
          onPress={handleSubscribe}
          disabled={subscribing || !selectedPlan}
          loading={subscribing}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
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
  errorContainer: {
    backgroundColor: colors.dangerLight,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.danger,
    textAlign: 'center',
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
  plansContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  planOption: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  planOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.accentBackgroundTeal,
  },
  planOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  planName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  planBadge: {
    color: colors.accentBlue,
    fontWeight: '600',
  },
  planPrice: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  featuresCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
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
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  restoreButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  cancelNote: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});

export default SubscriptionScreen;
