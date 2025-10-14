"use client";

import { useState } from "react";
import { useStoreConfigContext } from "@/shared/providers/StoreConfigProvider";
import { useAuth } from "@/shared/providers/AuthProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function CompleteProfileModal({ isOpen, onClose: _onClose, onComplete }: Props) {
  const { config } = useStoreConfigContext();
  const { user } = useAuth();
  
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const primaryColor = config?.theme?.colors?.primary || '#3b82f6';
  const primaryHover = config?.theme?.colors?.primaryHover || primaryColor;
  const normalizedPrimary = primaryColor.startsWith('#') ? primaryColor : `#${primaryColor}`;

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        email: user.email,
        name: user.displayName || user.email?.split('@')[0] || 'Usuario',
        address: deliveryAddress,
        phone,
        firebaseUid: user.uid,
        storeId: process.env.NEXT_STORE_NAME || 'techstore-pro'
      };

      console.log('📤 Enviando datos del usuario:', payload);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el usuario');
      }

      const result = await response.json();
      console.log('✅ Usuario creado exitosamente en el backend:', result);
      onComplete();
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      setError(error instanceof Error ? error.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-black">Completa tu perfil</h2>
            <p className="text-sm text-black mt-1">
            Para finalizar tu registro, necesitamos algunos datos adicionales
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="relative w-12 h-12">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "avatar"}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    // Si la imagen falla al cargar, ocultarla y mostrar las iniciales
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              <div 
                className={`absolute inset-0 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold ${user.photoURL ? 'hidden' : 'flex'}`}
                style={{ display: user.photoURL ? 'none' : 'flex' }}
              >
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <p className="font-medium text-black">{user.displayName || 'Usuario'}</p>
              <p className="text-sm text-black">{user.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+57 300 123 4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Dirección de entrega *
            </label>
            <textarea
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Calle 123 #45-67, Bogotá, Colombia"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none resize-none text-black"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: normalizedPrimary }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.target as HTMLButtonElement).style.backgroundColor = primaryHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  (e.target as HTMLButtonElement).style.backgroundColor = normalizedPrimary;
                }
              }}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </div>
              ) : (
                "Completar registro"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}