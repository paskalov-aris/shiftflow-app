import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRightIcon, LogoIcon, LogoutIcon, SettingsIcon, UserIcon } from '../../assets';
import { useUserStore, UserProfile } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import { signOut } from '../../services/auth';
import { RootStackParamList } from '../../navigation/navigationTypes';

type ProfileNav = NativeStackNavigationProp<RootStackParamList>;

const ROLE_LABELS: Record<UserProfile['role'], string> = {
  manager: 'Менеджер',
  team_lead: 'Бригадир',
  worker: 'Працівник',
};

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileNav>();
  const profile = useUserStore(s => s.profile);

  const handleLogoutPress = () => {
    Alert.alert('Вийти з акаунту?', 'Ви впевнені, що хочете вийти?', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Вийти', style: 'destructive', onPress: handleLogout },
    ]);
  };

  const handleLogout = async () => {
    await signOut();
    useUserStore.getState().setProfile(null);
    useAuthStore.getState().setUser(null);
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#F5A623" />
      </View>
    );
  }

  return (
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
      <Text style={styles.heading}>Профіль</Text>

      {/* Info card */}
      <View style={styles.infoCard}>
        <Text style={styles.fullName}>
          {profile.name} {profile.surname}
        </Text>
        <Text style={styles.email}>{profile.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>{ROLE_LABELS[profile.role]}</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('PersonalData')} activeOpacity={0.7}>
          <UserIcon width={20} height={20} color="#6B7280" />
          <Text style={styles.rowLabel}>Особисті дані</Text>
          <ChevronRightIcon width={18} height={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Settings')} activeOpacity={0.7}>
          <SettingsIcon width={20} height={20} color="#6B7280" />
          <Text style={styles.rowLabel}>Налаштування</Text>
          <ChevronRightIcon width={18} height={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={handleLogoutPress} activeOpacity={0.7}>
          <LogoutIcon width={20} height={20} color="#EF4444" />
          <Text style={[styles.rowLabel, styles.rowLabelDestructive]}>Вийти</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F7F3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginTop: 24,
  },
  fullName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  email: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    marginTop: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FEF3C7',
    marginTop: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  menu: {
    gap: 10,
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  rowLabelDestructive: {
    color: '#EF4444',
    fontWeight: '600',
  },
});

export default ProfileScreen;
