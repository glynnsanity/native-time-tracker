import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';
import type { AuthStackScreenProps } from '../../navigation/types';

type Props = AuthStackScreenProps<'Onboarding'>;

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { skipAuth } = useAuth();

  const handleSkip = async () => {
    await skipAuth();
  };

  const handleGetStarted = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backPlaceholder} />
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationPlaceholder}>
            <View style={styles.clockIcon}>
              <View style={styles.clockFace}>
                <View style={styles.clockHand} />
                <View style={[styles.clockHand, styles.clockHandMinute]} />
              </View>
            </View>
            <View style={styles.personIcon} />
          </View>
        </View>

        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>

        <Text style={styles.title}>Take control of{'\n'}your productivity</Text>
        <Text style={styles.subtitle}>
          Stay on top of your tasks with a simple, intuitive interface. Easily track your time and view your progress. All in one place to boost your productivity.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button title="Get Started" onPress={handleGetStarted} />
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
  backPlaceholder: {
    width: 24,
  },
  skipText: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  illustrationContainer: {
    marginBottom: spacing['3xl'],
  },
  illustrationPlaceholder: {
    width: 280,
    height: 200,
    backgroundColor: '#E8F4F5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  clockIcon: {
    position: 'absolute',
    top: 20,
    left: 40,
  },
  clockFace: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.card,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockHand: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: colors.textPrimary,
    top: 10,
  },
  clockHandMinute: {
    height: 15,
    transform: [{ rotate: '90deg' }],
    left: 22,
    top: 15,
  },
  personIcon: {
    width: 80,
    height: 100,
    backgroundColor: colors.primaryLight,
    borderRadius: 40,
    marginTop: 20,
    opacity: 0.6,
  },
  dots: {
    flexDirection: 'row',
    marginBottom: spacing['3xl'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing['3xl'],
    paddingBottom: spacing['3xl'],
  },
});

export default OnboardingScreen;
