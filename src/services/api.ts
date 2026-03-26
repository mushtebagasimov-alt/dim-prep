import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL - will be updated after backend deployment
const API_BASE_URL = 'http://localhost:8000';

const TOKEN_KEY = '@dim_prep_token';

// Token management
async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// Base fetch with auth
async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return response;
}

// Auth API
export const authAPI = {
  async register(name: string, email: string, password: string, examGroup: string) {
    const response = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        exam_group: examGroup,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Qeydiyyat uğursuz oldu');
    }
    const data = await response.json();
    await setToken(data.access_token);
    return data;
  },

  async login(email: string, password: string) {
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Giriş uğursuz oldu');
    }
    const data = await response.json();
    await setToken(data.access_token);
    return data;
  },

  async getMe() {
    const response = await apiFetch('/api/auth/me');
    if (!response.ok) {
      throw new Error('İstifadəçi məlumatları alına bilmədi');
    }
    return response.json();
  },

  async updateMe(data: { name?: string; exam_group?: string; avatar_url?: string }) {
    const response = await apiFetch('/api/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Profil yenilənə bilmədi');
    }
    return response.json();
  },

  async logout() {
    await removeToken();
  },

  async hasToken() {
    const token = await getToken();
    return !!token;
  },
};

// Questions API
export const questionsAPI = {
  async getSubjects() {
    const response = await apiFetch('/api/questions/subjects');
    if (!response.ok) {
      throw new Error('Fənlər alına bilmədi');
    }
    return response.json();
  },

  async getBySubject(subjectId: string, topicId?: string, limit: number = 20) {
    let path = `/api/questions/by-subject/${subjectId}?limit=${limit}`;
    if (topicId) {
      path += `&topic_id=${topicId}`;
    }
    const response = await apiFetch(path);
    if (!response.ok) {
      throw new Error('Suallar alına bilmədi');
    }
    return response.json();
  },

  async getRandom(subjectId?: string, count: number = 10) {
    let path = `/api/questions/random?count=${count}`;
    if (subjectId) {
      path += `&subject_id=${subjectId}`;
    }
    const response = await apiFetch(path);
    if (!response.ok) {
      throw new Error('Suallar alına bilmədi');
    }
    return response.json();
  },
};

// Tests API
export const testsAPI = {
  async submitResult(data: {
    subject_id: string;
    topic_id?: string;
    answers: Array<{
      question_id: string;
      selected_option: number | null;
      is_correct: boolean;
      time_spent_seconds: number;
    }>;
    time_spent_seconds: number;
  }) {
    const response = await apiFetch('/api/tests/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Test nəticəsi göndərilə bilmədi');
    }
    return response.json();
  },

  async getHistory(limit: number = 20, subjectId?: string) {
    let path = `/api/tests/history?limit=${limit}`;
    if (subjectId) {
      path += `&subject_id=${subjectId}`;
    }
    const response = await apiFetch(path);
    if (!response.ok) {
      throw new Error('Test tarixçəsi alına bilmədi');
    }
    return response.json();
  },
};

// Leaderboard API
export const leaderboardAPI = {
  async get(period: string = 'weekly', limit: number = 50) {
    const response = await apiFetch(`/api/leaderboard?period=${period}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Liderlik tablosu alına bilmədi');
    }
    return response.json();
  },
};

// Stats API
export const statsAPI = {
  async get() {
    const response = await apiFetch('/api/stats');
    if (!response.ok) {
      throw new Error('Statistika alına bilmədi');
    }
    return response.json();
  },

  async getDailyActivity(days: number = 30) {
    const response = await apiFetch(`/api/stats/daily?days=${days}`);
    if (!response.ok) {
      throw new Error('Günlük aktivlik alına bilmədi');
    }
    return response.json();
  },
};

export default {
  auth: authAPI,
  questions: questionsAPI,
  tests: testsAPI,
  leaderboard: leaderboardAPI,
  stats: statsAPI,
};
