import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, LockIcon } from '../../assets';
import { changePassword } from '../../services/auth';
import { RootStackParamList } from '../../navigation/navigationTypes';

type SettingsNav = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

const getErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Невірний поточний пароль';
    case 'auth/weak-password':
      return 'Пароль має містити мінімум 6 символів';
    case 'auth/too-many-requests':
      return 'Забагато спроб. Спробуйте пізніше';
    default:
      return 'Сталася помилка. Спробуйте ще раз';
  }
};

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsNav>();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Заповніть всі поля');
      return;
    }
    if (newPassword.length < 6) {
      setError('Новий пароль має містити мінімум 6 символів');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }
    if (newPassword === currentPassword) {
      setError('Новий пароль має відрізнятись від поточного');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      navigation.goBack();
      Toast.show({ type: 'success', text1: 'Пароль оновлено' });
    } catch (e: any) {
      setError(getErrorMessage(e.code ?? ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Custom header */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeftIcon width={24} height={24} color="#111827" />
          </TouchableOpacity>

          {/* Heading */}
          <Text style={styles.heading}>Зміна паролю</Text>
          <Text style={styles.subtitle}>Введіть поточний пароль та новий, щоб оновити доступ до акаунту.</Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputRow}>
              <LockIcon width={18} height={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Поточний пароль"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showCurrent}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowCurrent(v => !v)}
                style={styles.eyeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                {showCurrent ? (
                  <EyeOffIcon width={18} height={18} color="#9CA3AF" />
                ) : (
                  <EyeIcon width={18} height={18} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <LockIcon width={18} height={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Новий пароль"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showNew}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowNew(v => !v)}
                style={styles.eyeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                {showNew ? (
                  <EyeOffIcon width={18} height={18} color="#9CA3AF" />
                ) : (
                  <EyeIcon width={18} height={18} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <LockIcon width={18} height={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Підтвердити новий пароль"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(v => !v)}
                style={styles.eyeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                {showConfirm ? (
                  <EyeOffIcon width={18} height={18} color="#9CA3AF" />
                ) : (
                  <EyeIcon width={18} height={18} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.85}>
            {isSubmitting ? (
              <ActivityIndicator color="#1C1917" />
            ) : (
              <Text style={styles.buttonText}>Оновити пароль →</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#F7F3EE',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  backButton: {
    width: 24,
    height: 24,
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 32,
  },
  form: {
    gap: 12,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  eyeButton: {
    padding: 2,
  },
  error: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#F5A623',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
  },
});

export default SettingsScreen;
