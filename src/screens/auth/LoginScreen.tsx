import React, { useState, useCallback, useEffect } from 'react';
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
import { colors, spacing, typography } from '../../theme';
import { validateEmail, validateLoginPassword } from '../../utils/validation';
import { useGoogleAuth, handleGoogleResponse, isGoogleAuthConfigured } from '../../services/googleAuth';
import { signInWithApple, isAppleAuthAvailable } from '../../services/appleAuth';
import type { AuthStackScreenProps } from '../../navigation/types';

type Props = AuthStackScreenProps<'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const validateFields = useCallback((): boolean => {
    const emailResult = validateEmail(email);
    const passwordResult = validateLoginPassword(password);

    setEmailError(emailResult.error);
    setPasswordError(passwordResult.error);

    return emailResult.isValid && passwordResult.isValid;
  }, [email, password]);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    if (emailError) {
      const result = validateEmail(text);
      setEmailError(result.error);
    }
  }, [emailError]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError(undefined);
    }
  }, [passwordError]);

  const handleLogin = async () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email.trim(), password);

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
    }
  };

  const isFormValid = email.trim().length > 0 && password.length > 0;

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
            <Text style={styles.headerTitle}>Login</Text>
            <View style={styles.headerRight} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>

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
              error={passwordError}
            />

            <Button
              title="Login"
              onPress={handleLogin}
              loading={loading}
              disabled={loading || !isFormValid}
            />

            <View style={styles.signUpLink}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpLinkText}>Sign Up</Text>
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
  headerRight: {
    width: 24,
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
  signUpLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  signUpText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  signUpLinkText: {
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
});

export default LoginScreen;
