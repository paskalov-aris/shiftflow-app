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
import { EyeIcon, EyeOffIcon, LockIcon, LogoIcon, MailIcon } from '../../assets';
import { signIn } from '../../services/auth';

const getErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Невірний email або пароль';
    case 'auth/invalid-email':
      return 'Невірний формат email';
    case 'auth/too-many-requests':
      return 'Забагато спроб. Спробуйте пізніше';
    default:
      return 'Сталася помилка. Спробуйте ще раз';
  }
};

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Введіть email та пароль');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await signIn(email.trim(), password);
      // onAuthStateChanged in App.tsx handles navigation after successful login
    } catch (e: any) {
      setError(getErrorMessage(e.code ?? ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <LogoIcon width={40} height={40} />
            <Text style={styles.logoText}>
              {'Shift'}
              <Text style={styles.logoOrange}>{'Flow'}</Text>
            </Text>
          </View>

          {/* Heading */}
          <Text style={styles.heading}>З поверненням.</Text>
          <Text style={styles.subtitle}>
            {'Увійдіть, щоб побачити сьогоднішні зміни\nта задачі вашої бригади.'}
          </Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputRow}>
              <MailIcon width={18} height={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="m.koval@shiftflow.ua"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputRow}>
              <LockIcon width={18} height={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(v => !v)}
                style={styles.eyeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {showPassword ? (
                  <EyeOffIcon width={18} height={18} color="#9CA3AF" />
                ) : (
                  <EyeIcon width={18} height={18} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          {/* Login button */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#1C1917" />
            ) : (
              <Text style={styles.buttonText}>Увійти →</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerGray}>Немає акаунту? </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.footerOrange}>Створити акаунт</Text>
            </TouchableOpacity>
          </View>
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  logoOrange: {
    color: '#F5A623',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  footerGray: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerOrange: {
    fontSize: 14,
    color: '#F5A623',
    fontWeight: '600',
  },
});

export default LoginScreen;
