import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input } from '../../components/ui';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { validateEmail, validatePassword, PasswordValidation } from '../../utils/validation';
import { useGoogleAuth, handleGoogleResponse, isGoogleAuthConfigured } from '../../services/googleAuth';
import { signInWithApple, isAppleAuthAvailable } from '../../services/appleAuth';
import type { AuthStackScreenProps } from '../../navigation/types';

type Props = AuthStackScreenProps<'SignUp'>;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp, skipAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordTouched, setPasswordTouched] = useState(false);

  const passwordValidation = useMemo((): PasswordValidation => {
    return validatePassword(password);
  }, [password]);

  const validateFields = useCallback((): boolean => {
    const emailResult = validateEmail(email);
    setEmailError(emailResult.error);

    return emailResult.isValid && passwordValidation.isValid;
  }, [email, passwordValidation.isValid]);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    if (emailError) {
      const result = validateEmail(text);
      setEmailError(result.error);
    }
  }, [emailError]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    if (!passwordTouched) {
      setPasswordTouched(true);
    }
  }, [passwordTouched]);

  const handleSignUp = async () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUp(email.trim(), password);

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    }
  };

  const isFormValid = validateEmail(email).isValid && passwordValidation.isValid;

  const handleSkip = async () => {
    await skipAuth();
  };

  // Social auth state
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  // Google auth
  const { request: googleRequest, response: googleResponse, promptAsync: googlePromptAsync } = useGoogleAuth();

  // Check Apple auth availability
  useEffect(() => {
    isAppleAuthAvailable().then(setAppleAvailable);
  }, []);

  // Handle Google auth response
  useEffect(() => {
    if (googleResponse) {
      setGoogleLoading(true);
      handleGoogleResponse(googleResponse).then((result) => {
        setGoogleLoading(false);
        if (!result.success && result.error) {
          setError(result.error);
        }
      });
    }
  }, [googleResponse]);

  const handleGoogleSignIn = async () => {
    if (!isGoogleAuthConfigured()) {
      Alert.alert(
        'Configuration Required',
        'Google Sign-In requires configuration. Please add your Google OAuth client IDs to enable this feature.',
        [{ text: 'OK' }]
      );
      return;
    }

    setError(null);
    setGoogleLoading(true);
    try {
      await googlePromptAsync();
    } catch (err: any) {
      setError(err.message || 'Failed to start Google Sign-In');
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (!appleAvailable) {
      Alert.alert(
        'Not Available',
        'Apple Sign-In is only available on iOS 13 and later.',
        [{ text: 'OK' }]
      );
      return;
    }

    setError(null);
    setAppleLoading(true);

    const result = await signInWithApple();
    setAppleLoading(false);

    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sign Up</Text>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>New Account</Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={emailError}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
            />

            {passwordTouched && (
              <View style={styles.passwordRequirements}>
                <PasswordRequirement
                  met={passwordValidation.hasMinLength}
                  text="At least 8 characters"
                />
                <PasswordRequirement
                  met={passwordValidation.hasUppercase}
                  text="One uppercase letter"
                />
                <PasswordRequirement
                  met={passwordValidation.hasLowercase}
                  text="One lowercase letter"
                />
                <PasswordRequirement
                  met={passwordValidation.hasNumber}
                  text="One number"
                />
              </View>
            )}

            <Button
              title="Sign Up"
              onPress={handleSignUp}
              loading={loading}
              disabled={loading || !isFormValid}
            />

            <View style={styles.loginLink}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLinkText}>Login</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <Button
              title={googleLoading ? 'Signing in...' : 'Continue with Google'}
              onPress={handleGoogleSignIn}
              variant="outline"
              disabled={googleLoading || appleLoading}
              icon={
                googleLoading ? (
                  <ActivityIndicator size="small" color={colors.googleBlue} />
                ) : (
                  <Text style={styles.googleIcon}>G</Text>
                )
              }
            />

            <View style={styles.buttonSpacer} />

            <Button
              title={appleLoading ? 'Signing in...' : 'Continue with Apple'}
              onPress={handleAppleSignIn}
              variant="dark"
              disabled={googleLoading || appleLoading}
              icon={
                appleLoading ? (
                  <ActivityIndicator size="small" color={colors.textInverse} />
                ) : (
                  <Ionicons name="logo-apple" size={20} color={colors.textInverse} />
                )
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  skipText: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['3xl'],
    paddingTop: spacing['2xl'],
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing['3xl'],
  },
  errorContainer: {
    backgroundColor: colors.dangerLight,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    ...typography.bodySmall,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  loginLinkText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing['3xl'],
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.googleBlue,
  },
  buttonSpacer: {
    height: spacing.md,
  },
  passwordRequirements: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  requirementText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
  requirementTextMet: {
    color: colors.success,
  },
});

// Password requirement indicator component
const PasswordRequirement: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <View style={styles.requirementRow}>
    <Ionicons
      name={met ? 'checkmark-circle' : 'ellipse-outline'}
      size={16}
      color={met ? colors.success : colors.textTertiary}
    />
    <Text style={[styles.requirementText, met && styles.requirementTextMet]}>
      {text}
    </Text>
  </View>
);

export default SignUpScreen;
