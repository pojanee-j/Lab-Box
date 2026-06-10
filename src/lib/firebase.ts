import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, where, orderBy, limit, serverTimestamp, Timestamp, getDocFromServer } from 'firebase/firestore';
import firebaseConfigFile from '../../firebase-applet-config.json';
import { GameSession, LeaderboardUser, UserProfile } from '../types';

// Prefer Vite environment variables when set; fall back to the config file (which holds only placeholders in the repo)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigFile.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigFile.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigFile.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigFile.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigFile.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigFile.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfigFile.firestoreDatabaseId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfigFile.measurementId,
};

// Check if Config is real or placeholder
export const isMock = !firebaseConfig.projectId ||
  firebaseConfig.projectId.includes('PLACEHOLDER') ||
  firebaseConfig.apiKey.includes('PLACEHOLDER');

let firebaseApp: any = null;
let dbInstance: any = null;
let authInstance: any = null;

if (!isMock) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    dbInstance = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || undefined);
    authInstance = getAuth(firebaseApp);
    
    // Validate connection to Firestore at initial boot
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(dbInstance, 'test', 'connection'));
        console.log('Firebase connection validated successfully.');
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error('Please check your Firebase configuration.');
        }
      }
    };
    testConnection();
  } catch (err) {
    console.warn('Failed to initialize Firebase SDK, falling back to Sandbox Mode.', err);
  }
}

export const db = dbInstance;
export const auth = authInstance;

// --- FIRESTORE DIAGNOSTIC ERROR HANDLER (Mandatory) ---
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authInstance?.currentUser?.uid || 'anonymous',
      email: authInstance?.currentUser?.email || null,
      emailVerified: authInstance?.currentUser?.emailVerified || false,
      isAnonymous: authInstance?.currentUser?.isAnonymous || false,
      tenantId: authInstance?.currentUser?.tenantId || null,
      providerInfo: authInstance?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- DUAL-DRIVER SERVICE WRAPPER ---
export interface AuthState {
  user: {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
  } | null;
  loading: boolean;
}

// Local storage keys
const LS_SESSIONS = 'logic_game_sessions';
const LS_LEADERBOARD = 'logic_game_leaderboard';
const LS_USER = 'logic_game_curr_user';

export const authService = {
  subscribe(callback: (state: AuthState) => void): () => void {
    if (!isMock && authInstance) {
      return onAuthStateChanged(authInstance, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          callback({
            user: {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || undefined
            },
            loading: false
          });
          // Also sync to local storage just in case
          localStorage.setItem(LS_USER, JSON.stringify({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Student',
            email: firebaseUser.email || '',
          }));
        } else {
          callback({ user: null, loading: false });
          localStorage.removeItem(LS_USER);
        }
      });
    } else {
      // Mock Auth Provider triggers instantly
      const savedUser = localStorage.getItem(LS_USER);
      const initialUser = savedUser ? JSON.parse(savedUser) : null;
      callback({ user: initialUser, loading: false });

      // Return empty unsubscribe
      return () => {};
    }
  },

  async loginWithGoogle(mockName?: string): Promise<{ uid: string; displayName: string; email: string }> {
    if (!isMock && authInstance) {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(authInstance, provider);
        const u = result.user;
        const profile = {
          uid: u.uid,
          displayName: u.displayName || 'Student',
          email: u.email || '',
        };
        // Seed users doc
        try {
          await setDoc(doc(dbInstance, 'users', u.uid), {
            displayName: profile.displayName,
            email: profile.email,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          });
        } catch (err) {
          console.warn('Failed to seed user doc in Firestore:', err);
        }
        return profile;
      } catch (err) {
        console.error('Core Auth Google Sign-in error:', err);
        throw err;
      }
    } else {
      // Mock login logs
      const randomId = 'std_' + Math.floor(1000 + Math.random() * 9000);
      const studentName = mockName || `Developer Student #${Math.floor(10 + Math.random() * 89)}`;
      const profile = {
        uid: randomId,
        displayName: studentName,
        email: `${studentName.toLowerCase().replace(/\s+/g, '')}@student.university.edu`
      };
      localStorage.setItem(LS_USER, JSON.stringify(profile));
      return profile;
    }
  },

  async logout(): Promise<void> {
    if (!isMock && authInstance) {
      await signOut(authInstance);
    } else {
      localStorage.removeItem(LS_USER);
    }
  }
};

export const databaseService = {
  async saveGameSession(session: GameSession): Promise<void> {
    const cleanSession = {
      ...session,
      startedAt: isMock ? session.startedAt : Timestamp.fromDate(new Date(session.startedAt)),
      completedAt: isMock ? session.completedAt : serverTimestamp(),
    };

    if (!isMock && dbInstance) {
      const pathStr = 'gameSessions';
      try {
        const newSessionRef = doc(collection(dbInstance, pathStr));
        await setDoc(newSessionRef, cleanSession);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `${pathStr}/[auto-id]`);
      }
    } else {
      // Save local storage
      const existing = localStorage.getItem(LS_SESSIONS);
      const list: any[] = existing ? JSON.parse(existing) : [];
      list.push({ ...session, id: 'session_' + Date.now() });
      localStorage.setItem(LS_SESSIONS, JSON.stringify(list));
    }

    // Also update leaderboard status
    await this.updateLeaderboard(session.uid, session.displayName, session.totalScore);
  },

  async updateLeaderboard(uid: string, displayName: string, score: number): Promise<void> {
    if (!isMock && dbInstance) {
      const pathStr = `leaderboard/${uid}`;
      try {
        const userRef = doc(dbInstance, 'leaderboard', uid);
        const snap = await getDoc(userRef);
        let maxScore = score;
        let total = 1;

        if (snap.exists()) {
          const data = snap.data();
          maxScore = Math.max(data.highestScore || 0, score);
          total = (data.totalGames || 0) + 1;
        }

        await setDoc(userRef, {
          uid,
          displayName,
          highestScore: maxScore,
          totalGames: total,
          lastPlayedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, pathStr);
      }
    } else {
      // Mock Leaderboard sync
      const existing = localStorage.getItem(LS_LEADERBOARD);
      let list: LeaderboardUser[] = existing ? JSON.parse(existing) : getMockLeaderboardData();
      
      const idx = list.findIndex(item => item.uid === uid);
      if (idx !== -1) {
        list[idx].highestScore = Math.max(list[idx].highestScore, score);
        list[idx].totalGames += 1;
        list[idx].lastPlayedAt = new Date().toISOString();
      } else {
        list.push({
          uid,
          displayName,
          highestScore: score,
          totalGames: 1,
          lastPlayedAt: new Date().toISOString()
        });
      }
      localStorage.setItem(LS_LEADERBOARD, JSON.stringify(list));
    }
  },

  async fetchMyHistory(uid: string): Promise<GameSession[]> {
    if (!isMock && dbInstance) {
      const pathStr = 'gameSessions';
      try {
        const q = query(
          collection(dbInstance, pathStr),
          where('uid', '==', uid),
          orderBy('completedAt', 'desc'),
          limit(30)
        );
        const snap = await getDocs(q);
        const results: GameSession[] = [];
        snap.forEach((docSnap) => {
          const item = docSnap.data();
          results.push({
            id: docSnap.id,
            uid: item.uid,
            displayName: item.displayName,
            difficulty: item.difficulty,
            totalScore: item.totalScore,
            maxScore: item.maxScore,
            percentage: item.percentage,
            topicStats: item.topicStats,
            startedAt: item.startedAt instanceof Timestamp ? item.startedAt.toDate().toISOString() : item.startedAt,
            completedAt: item.completedAt instanceof Timestamp ? item.completedAt.toDate().toISOString() : item.completedAt,
            answers: item.answers || [],
          });
        });
        return results;
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, pathStr);
        return [];
      }
    } else {
      // Read local storage
      const sessionsStr = localStorage.getItem(LS_SESSIONS);
      const list: GameSession[] = sessionsStr ? JSON.parse(sessionsStr) : [];
      return list
        .filter(s => s.uid === uid)
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    }
  },

  async fetchLeaderboard(): Promise<LeaderboardUser[]> {
    if (!isMock && dbInstance) {
      const pathStr = 'leaderboard';
      try {
        const q = query(
          collection(dbInstance, pathStr),
          orderBy('highestScore', 'desc'),
          limit(50)
        );
        const snap = await getDocs(q);
        const results: LeaderboardUser[] = [];
        snap.forEach((docSnap) => {
          const item = docSnap.data();
          results.push({
            uid: item.uid,
            displayName: item.displayName,
            highestScore: item.highestScore,
            totalGames: item.totalGames,
            lastPlayedAt: item.lastPlayedAt instanceof Timestamp ? item.lastPlayedAt.toDate().toISOString() : item.lastPlayedAt,
          });
        });
        return results;
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, pathStr);
        return [];
      }
    } else {
      const existing = localStorage.getItem(LS_LEADERBOARD);
      let list: LeaderboardUser[] = existing ? JSON.parse(existing) : getMockLeaderboardData();
      // Ensure current user is in mock ranking if present in local
      const savedUser = localStorage.getItem(LS_USER);
      if (savedUser) {
        const active = JSON.parse(savedUser);
        if (!list.some(item => item.uid === active.uid)) {
          list.push({
            uid: active.uid,
            displayName: active.displayName,
            highestScore: 0,
            totalGames: 0,
            lastPlayedAt: new Date().toISOString()
          });
        }
      }
      return list.sort((a, b) => b.highestScore - a.highestScore);
    }
  }
};

// Seed outstanding leaderboard mock ranks for standard user visual engagement
function getMockLeaderboardData(): LeaderboardUser[] {
  return [
    { uid: 'seed_1', displayName: 'Somchai.S (TA)', highestScore: 1100, totalGames: 12, lastPlayedAt: new Date(Date.now() - 3600000 * 2).toISOString() },
    { uid: 'seed_2', displayName: 'Wipawan_K', highestScore: 980, totalGames: 8, lastPlayedAt: new Date(Date.now() - 3600000 * 5).toISOString() },
    { uid: 'seed_3', displayName: 'Nat_InfiniteLoop', highestScore: 850, totalGames: 15, lastPlayedAt: new Date(Date.now() - 3600000 * 12).toISOString() },
    { uid: 'seed_4', displayName: 'Piyabut_C_plus', highestScore: 780, totalGames: 4, lastPlayedAt: new Date(Date.now() - 3600000 * 20).toISOString() },
    { uid: 'seed_5', displayName: 'Korn_Recursion', highestScore: 680, totalGames: 6, lastPlayedAt: new Date(Date.now() - 3600000 * 26).toISOString() },
    { uid: 'seed_6', displayName: 'Nutcha_DebugExpert', highestScore: 540, totalGames: 3, lastPlayedAt: new Date(Date.now() - 3600000 * 48).toISOString() }
  ];
}
