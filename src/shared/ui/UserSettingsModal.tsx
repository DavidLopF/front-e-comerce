"use client";

import { useState } from "react";
import { useStoreConfigContext } from "@/shared/providers/StoreConfigProvider";
import { useAuth } from "@/shared/providers/AuthProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSettingsModal({ isOpen, onClose }: Props) {
  const { config } = useStoreConfigContext();
  const { user, updateProfile, logout, loading } = useAuth();

  const [displayName, setDisplayName] = useState<string>(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState<string>(user?.photoURL || "");

  const primaryColor = config?.theme?.colors?.primary || '#3b82f6';
  const primaryHover = config?.theme?.colors?.primaryHover || primaryColor;
  const normalizedPrimary = primaryColor.startsWith('#') ? primaryColor : `#${primaryColor}`;

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ displayName, photoURL });
    onClose();
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

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={photoURL || "/vercel.svg"}
              alt={displayName || user?.email || "avatar"}
              className="w-14 h-14 rounded-full object-cover border text-gray-800"
            />
            <div>
              <p className="font-semibold text-gray-800">{user?.email}</p>
              <p className="text-sm text-gray-800">ID: {user?.uid}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Nombre para mostrar</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none text-gray-800 "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL de foto (opcional)</label>
            <input
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none"
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
                disabled={loading}
                className="px-4 py-2 rounded-lg text-white disabled:opacity-50"
                style={{ backgroundColor: normalizedPrimary }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = primaryHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = normalizedPrimary; }}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
