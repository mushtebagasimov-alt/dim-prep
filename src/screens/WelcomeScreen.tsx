import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

const { width } = Dimensions.get('window');

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function WelcomeScreen({ onLogin, onRegister }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="school" size={80} color={COLORS.textWhite} />
        </View>
        <Text style={styles.title}>DIM Hazırlıq</Text>
        <Text style={styles.subtitle}>Universitetə hazırlığın ən asan yolu</Text>
      </View>

      <View style={styles.features}>
        <FeatureItem icon="checkmark-circle" text="DIM formatında testlər" />
        <FeatureItem icon="trending-up" text="İrəliləyişini izlə" />
        <FeatureItem icon="trophy" text="Liderlik tablosu" />
        <FeatureItem icon="flame" text="Gündəlik streak sistemi" />
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.registerButton} onPress={onRegister}>
          <Text style={styles.registerButtonText}>Qeydiyyatdan keç</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
          <Text style={styles.loginButtonText}>Daxil ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon as any} size={20} color={COLORS.primary} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topSection: {
    backgroundColor: COLORS.primary,
    paddingTop: 80,
    paddingBottom: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  iconContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: '800',
    color: COLORS.textWhite,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.lg,
    color: 'rgba(255,255,255,0.8)',
  },
  features: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxxl,
    gap: SPACING.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    fontWeight: '500',
  },
  bottomSection: {
    padding: SPACING.xxl,
    gap: SPACING.md,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  loginButton: {
    backgroundColor: 'transparent',
    height: 54,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  loginButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
});
