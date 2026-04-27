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
import { EyeIcon, EyeOffIcon, LockIcon, LogoIcon, MailIcon, UserIcon } from '../../assets';
import { signUp, signOut } from '../../services/auth';
import { createUserProfile } from '../../services/users';
import { RootStackParamList } from '../../navigation/navigationTypes';

type SignUpNav = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

type Role = 'team_lead' | 'worker';

const getErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Акаунт з таким email вже існує';
    case 'auth/invalid-email':
      return 'Невірний формат email';
    case 'auth/weak-password':
      return 'Пароль має містити мінімум 6 символів';
    default:
      return 'Сталася помилка. Спробуйте ще раз';
  }
};

const SignUpScreen = () => {
  const navigation = useNavigation<SignUpNav>();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('worker');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!name || !surname || !email || !password) {
      setError('Заповніть всі поля');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const { user } = await signUp(email.trim(), password);
      try {
        await createUserProfile(user.uid, {
          name: name.trim(),
          surname: surname.trim(),
          email: email.trim(),
          role,
          teamId: null,
        });
        // onAuthStateChanged in useAuthListener handles navigation to the app
      } catch (firestoreError) {
        console.error('Failed to create user profile:', firestoreError);
        setError('Не вдалося зберегти профіль. Спробуйте ще раз');
        await signOut();
      }
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
          {/* Logo */}
          <View style={styles.logoRow}>
            <LogoIcon width={40} height={40} />
            <Text style={styles.logoText}>
              {'Shift'}
              <Text style={styles.logoOrange}>{'Flow'}</Text>
            </Text>
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Створіть акаунт.</Text>
          <Text style={styles.subtitle}>{'Зареєструйтесь, щоб приєднатись\nдо своєї бригади в ShiftFlow.'}</Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputRow}>
              <UserIcon width={18} height={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ім'я"
                placeholderTextColor="#9CA3AF"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.iconSpacer} />
              <TextInput
                style={styles.input}
                value={surname}
                onChangeText={setSurname}
                placeholder="Прізвище"
                placeholderTextColor="#9CA3AF"
                autoCorrect={false}
              />
            </View>

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
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(v => !v)}
                style={styles.eyeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                {showPassword ? (
                  <EyeOffIcon width={18} height={18} color="#9CA3AF" />
                ) : (
                  <EyeIcon width={18} height={18} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>

            {/* Role toggle */}
            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[styles.rolePill, role === 'team_lead' && styles.rolePillActive]}
                onPress={() => setRole('team_lead')}
                activeOpacity={0.8}>
                <Text style={[styles.rolePillText, role === 'team_lead' && styles.rolePillTextActive]}>Бригадир</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rolePill, role === 'worker' && styles.rolePillActive]}
                onPress={() => setRole('worker')}
                activeOpacity={0.8}>
                <Text style={[styles.rolePillText, role === 'worker' && styles.rolePillTextActive]}>Працівник</Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isSubmitting}
            activeOpacity={0.85}>
            {isSubmitting ? (
              <ActivityIndicator color="#1C1917" />
            ) : (
              <Text style={styles.buttonText}>Зареєструватись →</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerGray}>Вже є акаунт? </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
              <Text style={styles.footerOrange}>Увійти</Text>
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
  iconSpacer: {
    width: 18,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  eyeButton: {
    padding: 2,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rolePill: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rolePillActive: {
    backgroundColor: '#F5A623',
    borderColor: '#F5A623',
  },
  rolePillText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  rolePillTextActive: {
    color: '#1C1917',
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

export default SignUpScreen;
