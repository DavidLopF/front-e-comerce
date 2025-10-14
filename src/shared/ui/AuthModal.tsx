"use client";

import { useState } from "react";
import { useStoreConfigContext } from "@/shared/providers/StoreConfigProvider";
import { useAuth } from "@/shared/providers/AuthProvider";
import { AuthService } from "@/shared/services/AuthService";
import CompleteProfileModal from "./CompleteProfileModal";
import RoleBasedRedirect from "@/shared/components/RoleBasedRedirect";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { config } = useStoreConfigContext();
  const { login, register, loginWithGoogle, loginWithFacebook, authError, clearAuthError, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Form state for login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Form state for register
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  // Estado para controlar el modal de completar perfil
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  // Estado para controlar la redirección basada en roles
  const [showRoleRedirect, setShowRoleRedirect] = useState(false);

  // Función para completar el perfil y cerrar todos los modales
  const handleCompleteProfile = () => {
    setShowCompleteProfile(false);
    setShowRoleRedirect(true); // Activar redirección por roles después de completar perfil
  };

  // Función para manejar la redirección completada
  const handleRedirectComplete = () => {
    setShowRoleRedirect(false);
    onAuthSuccess();
  };

  // Colores dinámicos del tema
  const primaryColor = config?.theme?.colors?.primary || '#3b82f6';
  const primaryHover = config?.theme?.colors?.primaryHover || primaryColor;

  const normalizeColor = (color: string | undefined, fallback: string) => {
    if (!color) return fallback;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const normalizedPrimary = normalizeColor(primaryColor, '#3b82f6');

  // Limpiar errores cuando se cambia de tab
  const handleTabChange = (isLoginTab: boolean) => {
    setIsLogin(isLoginTab);
    clearAuthError();
  };

  // Handle login submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    try {
      console.log('🔐 AuthModal: Iniciando login...');
      await login({
        email: loginEmail,
        password: loginPassword
      });
      console.log('✅ AuthModal: Login exitoso, activando redirección por roles');
      // Activar redirección por roles después del login
      setShowRoleRedirect(true);
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('❌ AuthModal: Error en login:', error);
    }
  };

  // Handle register submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    // Basic validation
    if (registerPassword !== registerConfirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await register({
        name: registerName,
        email: registerEmail,
        password: registerPassword
      });
      // Después del registro exitoso, mostrar modal de completar perfil
      setShowCompleteProfile(true);
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('Error en registro:', error);
    }
  };

  // Verificar si el usuario necesita completar su perfil
    const checkIfNeedsProfileCompletion = async (userEmail: string) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/users/validate-profile-complete?email=${encodeURIComponent(userEmail)}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Verificación de perfil completo, respuesta:', data);
          
          // Si el perfil está completo, no necesita completar perfil
          if (data.isComplete === true) {
            return false;
          }
          // Si isComplete es false, necesita completar perfil
          return true;
        }
        
        // Si el status es 404 u otro error, necesita completar perfil
        return true;
      } catch (error) {
        console.error('Error verificando usuario:', error);
        // En caso de error, asumimos que necesita completar perfil
        return true;
      }
    };

  // Handle Google login
  const handleGoogleLogin = async () => {
    clearAuthError();
    try {
      await loginWithGoogle();
      // El usuario se actualiza automáticamente por el AuthProvider
      // Necesitamos esperar un poco para que se actualice el estado
      setTimeout(async () => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser?.email) {
          const needsCompletion = await checkIfNeedsProfileCompletion(currentUser.email);
          if (needsCompletion) {
            setShowCompleteProfile(true);
          } else {
            setShowRoleRedirect(true);
          }
        } else {
          setShowRoleRedirect(true);
        }
      }, 100);
    } catch (error) {
      console.error('Error en login con Google:', error);
    }
  };

  // Handle Facebook login
  const handleFacebookLogin = async () => {
    clearAuthError();
    try {
      await loginWithFacebook();
      // Similar al login con Google
      setTimeout(async () => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser?.email) {
          const needsCompletion = await checkIfNeedsProfileCompletion(currentUser.email);
          if (needsCompletion) {
            setShowCompleteProfile(true);
          } else {
            setShowRoleRedirect(true);
          }
        } else {
          setShowRoleRedirect(true);
        }
      }, 100);
    } catch (error) {
      console.error('Error en login con Facebook:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            {isLogin 
              ? "Ingresa tus credenciales para continuar con tu compra" 
              : "Crea una cuenta para gestionar tus pedidos"}
          </p>

          {/* Toggle between Login and Register */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => handleTabChange(true)}
              className={`flex-1 py-3 text-center font-semibold transition-colors ${
                isLogin ? "border-b-2 text-gray-900" : "text-gray-500"
              }`}
              style={isLogin ? { borderColor: normalizedPrimary, color: normalizedPrimary } : {}}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => handleTabChange(false)}
              className={`flex-1 py-3 text-center font-semibold transition-colors ${
                !isLogin ? "border-b-2 text-gray-900" : "text-gray-500"
              }`}
              style={!isLogin ? { borderColor: normalizedPrimary, color: normalizedPrimary } : {}}
            >
              Registrarse
            </button>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{authError}</p>
            </div>
          )}

          {/* Login Form */}
          {isLogin && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all"
                  onFocus={(e) => {
                    e.target.style.borderColor = normalizedPrimary;
                    e.target.style.boxShadow = `0 0 0 3px ${normalizedPrimary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all"
                  onFocus={(e) => {
                    e.target.style.borderColor = normalizedPrimary;
                    e.target.style.boxShadow = `0 0 0 3px ${normalizedPrimary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    style={{ accentColor: normalizedPrimary }}
                  />
                  <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                </label>
                <a
                  href="#"
                  className="text-sm font-medium transition-colors"
                  style={{ color: normalizedPrimary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = normalizedPrimary;
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: normalizedPrimary }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = primaryHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = normalizedPrimary;
                  }
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>
          )}

          {/* Register Form */}
          {!isLogin && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  id="register-name"
                  type="text"
                  required
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all"
                  onFocus={(e) => {
                    e.target.style.borderColor = normalizedPrimary;
                    e.target.style.boxShadow = `0 0 0 3px ${normalizedPrimary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all"
                  onFocus={(e) => {
                    e.target.style.borderColor = normalizedPrimary;
                    e.target.style.boxShadow = `0 0 0 3px ${normalizedPrimary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all"
                  onFocus={(e) => {
                    e.target.style.borderColor = normalizedPrimary;
                    e.target.style.boxShadow = `0 0 0 3px ${normalizedPrimary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña *
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  required
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all"
                  onFocus={(e) => {
                    e.target.style.borderColor = normalizedPrimary;
                    e.target.style.boxShadow = `0 0 0 3px ${normalizedPrimary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded mt-1"
                  style={{ accentColor: normalizedPrimary }}
                />
                <label className="ml-2 text-sm text-gray-600">
                  Acepto los{" "}
                  <a
                    href="#"
                    className="font-medium transition-colors"
                    style={{ color: normalizedPrimary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = primaryHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = normalizedPrimary;
                    }}
                  >
                    términos y condiciones
                  </a>{" "}
                  y la{" "}
                  <a
                    href="#"
                    className="font-medium transition-colors"
                    style={{ color: normalizedPrimary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = primaryHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = normalizedPrimary;
                    }}
                  >
                    política de privacidad
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: normalizedPrimary }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = primaryHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = normalizedPrimary;
                  }
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creando cuenta...</span>
                  </div>
                ) : (
                  "Crear Cuenta"
                )}
              </button>
            </form>
          )}

          {/* Social Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continúa con</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
    
                className="flex items-center w-100 justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">Google</span>
              </button>

              {/* <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={loading}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">Facebook</span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t text-center rounded-b-2xl">
          <p className="text-sm text-gray-600">
            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium transition-colors"
              style={{ color: normalizedPrimary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = normalizedPrimary;
              }}
            >
              {isLogin ? "Regístrate aquí" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>

      {/* Modal de completar perfil - se muestra después del registro */}
      <CompleteProfileModal
        isOpen={showCompleteProfile}
        onClose={() => setShowCompleteProfile(false)}
        onComplete={handleCompleteProfile}
      />

      {/* Redirección basada en roles - se muestra después del login exitoso */}
      {showRoleRedirect && (
        <RoleBasedRedirect onRedirectComplete={handleRedirectComplete} />
      )}
    </div>
  );
}
