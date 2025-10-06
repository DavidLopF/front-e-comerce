import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged,
  NextOrObserver
} from 'firebase/auth';
import { auth } from '@/shared/config/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  
  // Registrar usuario con email y contraseña
  static async register(data: RegisterData): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Actualizar el perfil con el nombre
      await updateProfile(userCredential.user, {
        displayName: data.name
      });

      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: data.name,
        photoURL: userCredential.user.photoURL
      };
    } catch (error) {
      console.error('Error en registro:', error);
      const firebaseError = error as { code?: string };
      throw new Error(this.getErrorMessage(firebaseError.code || 'auth/unknown'));
    }
  }

  // Iniciar sesión con email y contraseña
  static async login(data: LoginData): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      };
    } catch (error) {
      console.error('Error en login:', error);
      const firebaseError = error as { code?: string };
      throw new Error(this.getErrorMessage(firebaseError.code || 'auth/unknown'));
    }
  }

  // Iniciar sesión con Google
  static async loginWithGoogle(): Promise<AuthUser> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      const userCredential: UserCredential = await signInWithPopup(auth, provider);

      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      };
    } catch (error) {
      console.error('Error en login con Google:', error);
      const firebaseError = error as { code?: string };
      throw new Error(this.getErrorMessage(firebaseError.code || 'auth/unknown'));
    }
  }

  // Iniciar sesión con Facebook
  static async loginWithFacebook(): Promise<AuthUser> {
    try {
      const provider = new FacebookAuthProvider();
      provider.addScope('email');

      const userCredential: UserCredential = await signInWithPopup(auth, provider);

      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      };
    } catch (error) {
      console.error('Error en login con Facebook:', error);
      const firebaseError = error as { code?: string };
      throw new Error(this.getErrorMessage(firebaseError.code || 'auth/unknown'));
    }
  }

  // Cerrar sesión
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error en logout:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  // Enviar email de restablecimiento de contraseña
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error al enviar email de reset:', error);
      const firebaseError = error as { code?: string };
      throw new Error(this.getErrorMessage(firebaseError.code || 'auth/unknown'));
    }
  }

  // Observar cambios en el estado de autenticación
  static onAuthStateChanged(callback: NextOrObserver<User>): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Obtener usuario actual
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Convertir Firebase User a AuthUser
  static formatUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
  }

  // Mapear códigos de error a mensajes en español
  private static getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
      'auth/user-not-found': 'No existe una cuenta con este email.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/email-already-in-use': 'Ya existe una cuenta con este email.',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      'auth/invalid-email': 'El email no es válido.',
      'auth/operation-not-allowed': 'Operación no permitida.',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
      'auth/popup-closed-by-user': 'Ventana cerrada por el usuario.',
      'auth/popup-blocked': 'Ventana emergente bloqueada por el navegador.',
      'auth/cancelled-popup-request': 'Solicitud de ventana emergente cancelada.',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
      'auth/invalid-credential': 'Credenciales inválidas.',
      'auth/missing-password': 'La contraseña es requerida.',
      'auth/invalid-login-credentials': 'Credenciales de inicio de sesión inválidas.'
    };

    return errorMessages[errorCode] || 'Ha ocurrido un error inesperado. Intenta nuevamente.';
  }
}