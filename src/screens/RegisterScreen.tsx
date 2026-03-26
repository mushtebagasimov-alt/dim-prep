import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { ExamGroup, SubGroup } from '../types';
import { GROUP_INFO } from '../constants/subjects';
import { useStore } from '../store/useStore';

interface RegisterScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  onLogin: () => void;
}

export default function RegisterScreen({ onBack, onSuccess, onLogin }: RegisterScreenProps) {
  const [step, setStep] = useState(1); // 1: info, 2: group selection
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<ExamGroup | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const register = useStore((s) => s.register);

  const handleNext = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Xəta', 'Bütün sahələri doldurun');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Xəta', 'Şifrə ən az 6 simvol olmalıdır');
      return;
    }
    setStep(2);
  };

  const handleRegister = async () => {
    if (!selectedGroup) {
      Alert.alert('Xəta', 'Qrup seçin');
      return;
    }
    setLoading(true);
    const success = await register(name.trim(), email.trim(), password, selectedGroup, null);
    setLoading(false);
    if (success) {
      onSuccess();
    } else {
      Alert.alert('Xəta', 'Qeydiyyat uğursuz oldu');
    }
  };

  if (step === 2) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Qrupunu seç</Text>
            <Text style={styles.subtitle}>Hansı ixtisas qrupuna hazırlanırsan?</Text>
          </View>

          <View style={styles.groupList}>
            {(Object.keys(GROUP_INFO) as ExamGroup[]).map((group) => (
              <TouchableOpacity
                key={group}
                style={[
                  styles.groupCard,
                  selectedGroup === group && styles.groupCardSelected,
                ]}
                onPress={() => setSelectedGroup(group)}
              >
                <View style={styles.groupHeader}>
                  <View
                    style={[
                      styles.groupBadge,
                      selectedGroup === group && styles.groupBadgeSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.groupBadgeText,
                        selectedGroup === group && styles.groupBadgeTextSelected,
                      ]}
                    >
                      {group}
                    </Text>
                  </View>
                  <View style={styles.groupInfo}>
                    <Text
                      style={[
                        styles.groupName,
                        selectedGroup === group && styles.groupNameSelected,
                      ]}
                    >
                      {GROUP_INFO[group].nameAz}
                    </Text>
                    <Text style={styles.groupDesc}>{GROUP_INFO[group].description}</Text>
                  </View>
                  {selectedGroup === group && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              (!selectedGroup || loading) && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={!selectedGroup || loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textWhite} />
            ) : (
              <Text style={styles.registerButtonText}>Başla</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Hesab yarat</Text>
          <Text style={styles.subtitle}>DIM hazırlığına başla!</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Ad və Soyad"
              placeholderTextColor={COLORS.textLight}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Şifrə (ən az 6 simvol)"
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Davam et</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Artıq hesabın var?</Text>
          <TouchableOpacity onPress={onLogin}>
            <Text style={styles.footerLink}> Daxil ol</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.xxl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    ...SHADOWS.sm,
  },
  header: {
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xxxl,
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
  },
  form: {
    gap: SPACING.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    height: 56,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  nextButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  groupList: {
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  groupCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  groupCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  groupBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupBadgeSelected: {
    backgroundColor: COLORS.primary,
  },
  groupBadgeText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  groupBadgeTextSelected: {
    color: COLORS.textWhite,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  groupNameSelected: {
    color: COLORS.primary,
  },
  groupDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonDisabled: {
    opacity: 0.5,
  },
  registerButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: SPACING.xxl,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
  },
  footerLink: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
});
