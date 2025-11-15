import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { tasksApi } from "../api/client"; // Importas tu instancia de Axios

// 1. Definición de la Forma del Contexto (para TypeScript)
interface AuthContextType {
  isLoggedIn: boolean;
  user: { id: number; username: string } | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

interface LoginCredentials {
  username: string;
  password: string;
}

// Valores por defecto (se usarán solo si el componente no está envuelto)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. El Componente Provider (el Transmisor)
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Lógica para intentar iniciar sesión
  const login = async (credentials: LoginCredentials) => {
    try {
      // Llamada al endpoint de login de Django JWT
      // (Asumimos que está configurado para usar cookies)
      await tasksApi.post("/backend/api/login/", credentials);

      // Si el login es exitoso, obtenemos los datos del usuario logueado.
      await checkAuthStatus();
      return;
    } catch (error) {
      console.error("Login fallido:", error);
      throw error;
    }
  };

  // ⭐️ Función CLAVE: Verifica si la sesión es válida (usando la cookie)
  const checkAuthStatus = async () => {
    try {
      // Llamada al endpoint protegido. Si hay una cookie de access token válida, Django devuelve el usuario.
      const response = await tasksApi.get("/backend/api/tasks/");
      setUser(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      // Si falla (401), significa que no hay token o que ha expirado.
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      // Llama al endpoint de Django para borrar la cookie de sesión
      await tasksApi.post("backend/api/logout/");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // Carga inicial: verifica la sesión al cargar la app
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 3. Los valores que se exponen a toda la aplicación
  const value = { isLoggedIn, user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. El Hook para que los componentes puedan "sintonizar"
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
