import React, { useState, useEffect } from "react";
import PersonalInformation from "./Personalnfo";
import type { UserProfileData } from "./types/Task";
import { getUser, updateUser, deleteUser } from "../api/client";
import { useCallback } from "react";

export interface FullUserData extends UserProfileData {
  id: number;
  email: string;
  birth_date: string;
}

const UserSettings: React.FC = () => {
  const [userData, setUserData] = useState<FullUserData>();
  const [isLoading, setIsLoading] = useState(true);
  {
    /* Get user from the backend */
  }
  const loadUser = useCallback(async () => {
    try {
      const response = await getUser();
      if (response.status === 200) {
        const userInformation: FullUserData = response.data;
        setUserData(userInformation);
      } else {
        console.log("No user found");
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const [isSaving, setIsSaving] = useState(false);

  {
    /* Save user modifications to the account */
  }
  const handleSavePersonalInfo = async (
    updatedData: UserProfileData,
    id: number
  ) => {
    setIsSaving(true);
    try {
      console.log("Saving data to API:", updatedData, id);
      await updateUser(updatedData, id);

      setUserData((prev) => {
        if (!prev) {
          return null;
        }

        return {
          ...prev,
          ...updatedData,
        };
      });

      alert("Información guardada con éxito!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error al guardar la información. Intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  {
    /* Delete Account */
  }
  const handleDeleteAccountAPI = async (id: number) => {
    if (
      window.confirm(
        "Are you sure to delete this account? This actions has no comeback."
      )
    ) {
      try {
        await deleteUser(id);
        console.log("Succesfully deleted user:", id);
        window.location.href = "/login";
      } catch (error) {
        console.error("Error deleting user", error);
        alert("Failed to delete user");
      }
    }
  };

  if (isLoading) {
    // 1. Mostrar estado de Carga
    return (
      <div className="bg-[#000C19] min-h-screen pt-20 text-center">
        <h1 className="text-3xl text-[#00FDA4] font-bold">
          Cargando Información del Usuario...
        </h1>
        {/* Podrías poner un spinner aquí */}
      </div>
    );
  }
  if (!userData) {
    return (
      <div className="bg-[#000C19] min-h-screen pt-20 text-center">
        <h1 className="text-3xl text-red-500 font-bold">
          Error: No se pudieron cargar los datos del usuario.
        </h1>
      </div>
    );
  }
  return (
    <PersonalInformation
      initialData={userData}
      onSave={handleSavePersonalInfo}
      onDeleteAccount={handleDeleteAccountAPI}
      isSaving={isSaving}
    />
  );
};

export default UserSettings;

//falta el cambio de contrasena y las valdiaciones de contrasena y fromulario en singup
