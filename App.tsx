import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from './src/store/useStore';
import { COLORS } from './src/constants/theme';
import { TestResult } from './src/types';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import SubjectScreen from './src/screens/SubjectScreen';
import TestScreen from './src/screens/TestScreen';
import TestResultScreen from './src/screens/TestResultScreen';
import StatsScreen from './src/screens/StatsScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';

type Screen =
  | 'welcome'
  | 'login'
  | 'register'
  | 'home'
  | 'subject'
  | 'test'
  | 'testResult'
  | 'stats'
  | 'leaderboard'
  | 'profile';

type TabName = 'home' | 'stats' | 'leaderboard' | 'profile';

// Bottom Tab Bar Component
function BottomTabBar({
  activeTab,
  onTabPress,
}: {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}) {
  const tabs: { key: TabName; icon: string; activeIcon: string; label: string }[] = [
    { key: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Ana Səhifə' },
    { key: 'stats', icon: 'stats-chart-outline', activeIcon: 'stats-chart', label: 'Statistika' },
    { key: 'leaderboard', icon: 'trophy-outline', activeIcon: 'trophy', label: 'Liderlik' },
    { key: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Profil' },
  ];

  return (
    <View style={tabStyles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={tabStyles.tab}
            onPress={() => onTabPress(tab.key)}
          >
            <Ionicons
              name={(isActive ? tab.activeIcon : tab.icon) as any}
              size={24}
              color={isActive ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                tabStyles.tabLabel,
                isActive && tabStyles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>();
  const [currentTestResult, setCurrentTestResult] = useState<TestResult | null>(null);

  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const isLoading = useStore((s) => s.isLoading);
  const loadUser = useStore((s) => s.loadUser);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setCurrentScreen('home');
      } else {
        setCurrentScreen('welcome');
      }
    }
  }, [isAuthenticated, isLoading]);

  // Loading
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <StatusBar style="auto" />
      </View>
    );
  }

  // Auth flow
  if (!isAuthenticated) {
    switch (currentScreen) {
      case 'login':
        return (
          <>
            <LoginScreen
              onBack={() => setCurrentScreen('welcome')}
              onSuccess={() => setCurrentScreen('home')}
              onRegister={() => setCurrentScreen('register')}
            />
            <StatusBar style="dark" />
          </>
        );
      case 'register':
        return (
          <>
            <RegisterScreen
              onBack={() => setCurrentScreen('welcome')}
              onSuccess={() => setCurrentScreen('home')}
              onLogin={() => setCurrentScreen('login')}
            />
            <StatusBar style="dark" />
          </>
        );
      default:
        return (
          <>
            <WelcomeScreen
              onLogin={() => setCurrentScreen('login')}
              onRegister={() => setCurrentScreen('register')}
            />
            <StatusBar style="light" />
          </>
        );
    }
  }

  // Subject detail screen
  if (currentScreen === 'subject') {
    return (
      <>
        <SubjectScreen
          subjectId={selectedSubjectId}
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
          onStartTest={(subjectId, topicId) => {
            setSelectedSubjectId(subjectId);
            setSelectedTopicId(topicId);
            setCurrentScreen('test');
          }}
        />
        <StatusBar style="light" />
      </>
    );
  }

  // Test screen
  if (currentScreen === 'test') {
    return (
      <>
        <TestScreen
          subjectId={selectedSubjectId}
          topicId={selectedTopicId}
          onBack={() => {
            setCurrentScreen('subject');
          }}
          onComplete={(result) => {
            setCurrentTestResult(result);
            setCurrentScreen('testResult');
          }}
        />
        <StatusBar style="dark" />
      </>
    );
  }

  // Test result screen
  if (currentScreen === 'testResult' && currentTestResult) {
    return (
      <>
        <TestResultScreen
          result={currentTestResult}
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
            setCurrentTestResult(null);
          }}
          onRetry={() => {
            setCurrentTestResult(null);
            setCurrentScreen('test');
          }}
        />
        <StatusBar style="light" />
      </>
    );
  }

  // Tab handling
  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
  };

  // Main app with bottom tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'stats':
        return <StatsScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return (
          <HomeScreen
            onSubjectPress={(subjectId) => {
              setSelectedSubjectId(subjectId);
              setCurrentScreen('subject');
            }}
            onStatsPress={() => {
              setActiveTab('stats');
            }}
            onProfilePress={() => {
              setActiveTab('profile');
            }}
          />
        );
    }
  };

  return (
    <View style={styles.mainContainer}>
      {renderTabContent()}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  mainContainer: {
    flex: 1,
  },
});
