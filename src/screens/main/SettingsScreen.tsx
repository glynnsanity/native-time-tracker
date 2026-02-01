import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Card, Input } from '../../components/ui';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { validatePassword } from '../../utils/validation';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'Settings'>;

const SettingsScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const { signOut, user, hasSkipped } = useAuth();
  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const displayName = user?.email || (hasSkipped ? 'Guest User' : 'User');

  const handleEditName = () => {
    if (hasSkipped) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to change your display name.',
        [{ text: 'OK' }]
      );
      return;
    }
    setIsEditNameModalVisible(true);
  };

  const handleChangePassword = () => {
    if (hasSkipped) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to change your password.',
        [{ text: 'OK' }]
      );
      return;
    }
    if (!isSupabaseConfigured) {
      Alert.alert(
        'Not Available',
        'Password change requires Supabase to be configured.',
        [{ text: 'OK' }]
      );
      return;
    }
    setIsChangePasswordModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <Card padding="none" shadow={false}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.row} onPress={handleEditName}>
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.rowLabel}>User name</Text>
                <Text style={styles.rowValue}>{displayName}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.row} onPress={handleChangePassword}>
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.rowLabel}>Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.footer}>
        <Button title="Log out" onPress={handleLogout} />
      </View>

      <EditNameModal
        visible={isEditNameModalVisible}
        currentName={user?.user_metadata?.display_name || ''}
        onClose={() => setIsEditNameModalVisible(false)}
        onSave={async (newName) => {
          if (isSupabaseConfigured && user) {
            try {
              const { error } = await supabase.auth.updateUser({
                data: { display_name: newName },
              });
              if (error) throw error;
              Alert.alert('Success', 'Display name updated successfully.');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to update name.');
            }
          }
          setIsEditNameModalVisible(false);
        }}
      />

      <ChangePasswordModal
        visible={isChangePasswordModalVisible}
        onClose={() => setIsChangePasswordModalVisible(false)}
        onSave={async (currentPassword, newPassword) => {
          if (isSupabaseConfigured) {
            try {
              const { error } = await supabase.auth.updateUser({
                password: newPassword,
              });
              if (error) throw error;
              Alert.alert('Success', 'Password changed successfully.');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to change password.');
            }
          }
          setIsChangePasswordModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

// Edit Name Modal
interface EditNameModalProps {
  visible: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

const EditNameModal: React.FC<EditNameModalProps> = ({
  visible,
  currentName,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(currentName);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.title}>Edit Display Name</Text>

          <TextInput
            style={modalStyles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.textTertiary}
            autoFocus
          />

          <View style={modalStyles.buttons}>
            <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose}>
              <Text style={modalStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.saveButton, !name.trim() && modalStyles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={modalStyles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Change Password Modal
interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const passwordValidation = validatePassword(newPassword);

  const handleSave = () => {
    setError('');

    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    if (!passwordValidation.isValid) {
      setError(passwordValidation.error || 'Password does not meet requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    onSave(currentPassword, newPassword);
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  const isValid =
    currentPassword.length > 0 &&
    passwordValidation.isValid &&
    newPassword === confirmPassword;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.title}>Change Password</Text>

          {error ? <Text style={modalStyles.error}>{error}</Text> : null}

          <TextInput
            style={modalStyles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current password"
            placeholderTextColor={colors.textTertiary}
            secureTextEntry
          />

          <TextInput
            style={modalStyles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            placeholderTextColor={colors.textTertiary}
            secureTextEntry
          />

          <TextInput
            style={modalStyles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor={colors.textTertiary}
            secureTextEntry
          />

          {newPassword.length > 0 && (
            <View style={modalStyles.requirements}>
              <RequirementItem met={passwordValidation.hasMinLength} text="8+ characters" />
              <RequirementItem met={passwordValidation.hasUppercase} text="Uppercase" />
              <RequirementItem met={passwordValidation.hasLowercase} text="Lowercase" />
              <RequirementItem met={passwordValidation.hasNumber} text="Number" />
            </View>
          )}

          <View style={modalStyles.buttons}>
            <TouchableOpacity style={modalStyles.cancelButton} onPress={handleClose}>
              <Text style={modalStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.saveButton, !isValid && modalStyles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!isValid}
            >
              <Text style={modalStyles.saveButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const RequirementItem: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <View style={modalStyles.requirementItem}>
    <Ionicons
      name={met ? 'checkmark-circle' : 'ellipse-outline'}
      size={14}
      color={met ? colors.success : colors.textTertiary}
    />
    <Text style={[modalStyles.requirementText, met && modalStyles.requirementTextMet]}>
      {text}
    </Text>
  </View>
);

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '90%',
    maxWidth: 340,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  error: {
    ...typography.bodySmall,
    color: colors.danger,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  requirements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  requirementTextMet: {
    color: colors.success,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    ...typography.body,
    color: colors.textInverse,
    fontWeight: '600',
  },
});

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
  headerRight: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accentBackgroundTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  rowValue: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 60,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
});

export default SettingsScreen;
