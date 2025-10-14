"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/shared/ui/Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // No mostrar navbar en rutas de administrador
  const isAdminRoute = pathname?.startsWith('/admin');
  
  if (isAdminRoute) {
    return null;
  }
  
  return <Navbar />;
}