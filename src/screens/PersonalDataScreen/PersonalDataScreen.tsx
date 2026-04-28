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
import { ArrowLeftIcon, UserIcon } from '../../assets';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import { updateUserProfile } from '../../services/users';
import { RootStackParamList } from '../../navigation/navigationTypes';

type PersonalDataNav = NativeStackNavigationProp<RootStackParamList, 'PersonalData'>;

const PersonalDataScreen = () => {
  const navigation = useNavigation<PersonalDataNav>();
  const profile = useUserStore(s => s.profile);
  const setProfile = useUserStore(s => s.setProfile);
  const uid = useAuthStore(s => s.user?.uid);

  const [name, setName] = useState(profile?.name ?? '');
  const [surname, setSurname] = useState(profile?.surname ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedSurname = surname.trim();
    if (!trimmedName || !trimmedSurname) {
      setError('Заповніть всі поля');
      return;
    }
    if (!uid || !profile) {
      setError('Сталася помилка. Спробуйте ще раз');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await updateUserProfile(uid, { name: trimmedName, surname: trimmedSurname });
      setProfile({ ...profile, name: trimmedName, surname: trimmedSurname });
      navigation.goBack();
      Toast.show({ type: 'success', text1: 'Дані оновлено' });
    } catch {
      setError('Не вдалося зберегти. Спробуйте ще раз');
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
          <Text style={styles.heading}>Особисті дані</Text>
          <Text style={styles.subtitle}>Оновіть ваше ім'я та прізвище.</Text>

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

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isSubmitting}
            activeOpacity={0.85}>
            {isSubmitting ? <ActivityIndicator color="#1C1917" /> : <Text style={styles.buttonText}>Зберегти →</Text>}
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
  iconSpacer: {
    width: 18,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
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

export default PersonalDataScreen;
