/**
 * Service API centralisé pour communiquer avec le backend
 * Gère les requêtes, erreurs et logs
 */

const API_BASE = '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    nom: string;
    email: string;
    role: 'admin' | 'user';
  };
}

export interface RegisterRequest {
  nom: string;
  email: string;
  password: string;
  role?: string;
}

/**
 * Effectue une requête API avec gestion d'erreurs automatique
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  
  // Logs pour debug
  console.log(`📤 API Request: ${options.method || 'GET'} ${url}`);
  if (options.body) {
    console.log('   Payload:', JSON.parse(options.body as string));
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    // Logs pour debug
    console.log(`📥 API Response: ${response.status}`, data);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `Erreur ${response.status}`,
        message: data.message,
      };
    }

    return {
      success: true,
      data,
      message: data.message,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('❌ API Error:', errorMessage);

    // Vérifier si c'est un problème de connexion
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return {
        success: false,
        error: 'Impossible de se connecter au serveur. Vérifiez que le backend est lancé sur le port 5000.',
      };
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Connexion utilisateur
 */
export async function login(email: string, password: string) {
  console.log('🔐 Tentative de connexion:', email);
  
  return apiRequest<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Inscription utilisateur
 */
export async function register(nom: string, email: string, password: string) {
  console.log('📝 Tentative d\'inscription:', email);
  
  return apiRequest<{ message: string; user: any }>('/register', {
    method: 'POST',
    body: JSON.stringify({ nom, email, password, role: 'user' }),
  });
}

/**
 * Test de connexion au backend
 */
export async function testConnection() {
  console.log('🧪 Test de connexion au backend...');
  
  return apiRequest<any>('/test', {
    method: 'GET',
  });
}

/**
 * Vérifier l'état du serveur
 */
export async function checkHealth() {
  console.log('❤️ Vérification de la santé du serveur...');
  
  return apiRequest<any>('/health', {
    method: 'GET',
  });
}
