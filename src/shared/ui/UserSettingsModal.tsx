"use client";

import { useState, useEffect, useCallback } from "react";
import { useStoreConfigContext } from "@/shared/providers/StoreConfigProvider";
import { useAuth } from "@/shared/providers/AuthProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  name: string;
  photoURL: string;
  phone: string;
  deliveryAddress: string;
}

export default function UserSettingsModal({ isOpen, onClose }: Props) {
  const { config } = useStoreConfigContext();
  const { user, updateProfile, logout, loading } = useAuth();

  const [displayName, setDisplayName] = useState<string>(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState<string>(user?.photoURL || "");
  const [phone, setPhone] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const primaryColor = config?.theme?.colors?.primary || '#3b82f6';
  const primaryHover = config?.theme?.colors?.primaryHover || primaryColor;
  const normalizedPrimary = primaryColor.startsWith('#') ? primaryColor : `#${primaryColor}`;

  // Cargar datos del usuario desde el backend cuando se abre el modal
  const loadUserData = useCallback(async () => {
    if (!user?.email) {
      console.warn('Usuario no tiene email, no se pueden cargar datos.');
      return;
    }

    setUserLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/users?email=${encodeURIComponent(user.email)}`);

      if (response.ok) {
        const userData = await response.json();
        setDisplayName(userData.name || user.displayName || '');
        setPhotoURL(userData.photoURL || user.photoURL || '');
        setPhone(userData.phone || '');
        setDeliveryAddress(userData.deliveryAddress || '');
      } else {
        console.error('Error al cargar datos del usuario:', response.statusText);
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    } finally {
      setUserLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (isOpen) {
      loadUserData();
    }
  }, [isOpen, loadUserData]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Actualizar perfil de Firebase (nombre y foto)
      await updateProfile({ displayName, photoURL });
      
      // Actualizar datos adicionales en el backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
          name: displayName,
          phone,
          address: deliveryAddress,
          firebaseUid: user?.uid,
          storeId: process.env.NEXT_STORE_NAME || 'techstore-pro'
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar los datos');
      }

      console.log('✅ Datos actualizados exitosamente');
      onClose();
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      setError(error instanceof Error ? error.message : 'Error inesperado');
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slideUp">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-black" >Configuración de cuenta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <div className="relative w-14 h-14">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName || user?.email || "avatar"}
                  className="w-14 h-14 rounded-full object-cover border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              <div 
                className={`absolute inset-0 w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold ${photoURL ? 'hidden' : 'flex'}`}
                style={{ display: photoURL ? 'none' : 'flex' }}
              >
                {(displayName || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <p className="font-semibold text-black">{user?.email}</p>
              <p className="text-sm text-gray-600">ID: {user?.uid}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Nombre para mostrar</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none text-black"
            />
          </div>

      

          <div>
            <label className="block text-sm font-medium text-black mb-2">Teléfono</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+57 300 123 4567"
              disabled={userLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none text-black disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Dirección de entrega</label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Calle 123 #45-67, Bogotá, Colombia"
              rows={3}
              disabled={userLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none resize-none text-black disabled:bg-gray-100"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border text-red-600 border-red-200 hover:bg-red-50"
            >
              Cerrar sesión
            </button>
            <div className="space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancelar</button>
              <button
                type="submit"
                disabled={loading || userLoading}
                className="px-4 py-2 rounded-lg text-white disabled:opacity-50"
                style={{ backgroundColor: normalizedPrimary }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = primaryHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = normalizedPrimary; }}
              >
                {loading || userLoading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
