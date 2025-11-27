import React, { useState, useCallback, useMemo } from "react";
import type { UserProfileData, PersonalInformationProps } from "./types/Task";
import Header from "./Header";

const PersonalInformation: React.FC<PersonalInformationProps> = ({
  initialData,
  onSave,
  onDeleteAccount,
  isSaving,
}) => {
  // State from API with the editable fields.
  const [formData, setFormData] = useState<UserProfileData>({
    first_name: initialData.first_name,
    last_name: initialData.last_name,
    phone_number: initialData.phone_number,
  });

  // Non editable Fields from API to show the information to the user.
  const nonEditableFields = useMemo(
    () => ({
      email: initialData.email,
      birth_date: initialData.birth_date,
      id: initialData.id,
    }),
    [initialData.email, initialData.birth_date, initialData.id]
  );

  // Handle to manage inputs change when the user modify the fields.
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      // Convertir a número si el tipo es 'number', sino usar el valor directo
      [name]: type === "number" ? (value ? Number(value) : undefined) : value,
    }));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Llamar a la función onSave con los datos actuales
    onSave(formData, nonEditableFields.id);
  };

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    onDeleteAccount(nonEditableFields.id);
  };

  // Determinamos si el botón de guardar debe estar habilitado
  const isDataChanged =
    formData.first_name !== initialData.first_name ||
    formData.last_name !== initialData.last_name ||
    formData.phone_number !== initialData.phone_number;

  return (
    <div>
      <Header />
      <div className="bg-[#000C19] min-h-screen p-4 flex flex-col items-center">
        <h1 className="text-5xl text-center text-[#00FDA4] mt-5 font-bold mb-8">
          Personal Information
        </h1>

        {/* Contenedor principal de la información */}
        <div className="w-full max-w-lg bg-[#CAEAFF] p-6 rounded-lg shadow-2xl">
          {/* === FORMULARIO DE INFORMACIÓN EDITABLE === */}
          <form onSubmit={handleSave} className="space-y-4">
            {/* Campos No Editables (Email y Fecha de Nacimiento) */}
            <h2 className="text-xl font-bold text-[#000C19] mb-4 border-b pb-2">
              Account Details
            </h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                Email (Non Editable)
              </label>
              <input
                type="email"
                value={nonEditableFields.email}
                disabled
                className="w-full p-2 border-2 border-gray-400 rounded-md bg-gray-200 cursor-not-allowed text-black"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                Birth Date (Non Editable)
              </label>
              <input
                type="text"
                value={nonEditableFields.birth_date}
                disabled
                className="w-full p-2 border-2 border-gray-400 rounded-md bg-gray-200 cursor-not-allowed text-black"
              />
            </div>

            {/* === CAMPOS EDITABLES === */}
            <h2 className="text-xl font-bold text-[#000C19] mb-4 pt-4 border-b pb-2">
              Personal Details
            </h2>

            {/* Nombre */}
            <div className="space-y-2">
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00FDA4] focus:border-[#00FDA4] transition duration-150 text-black"
              />
            </div>

            {/* Apellido */}
            <div className="space-y-2">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00FDA4] focus:border-[#00FDA4] transition duration-150 text-black"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="number"
                value={formData.phone_number ?? ""} // Usamos '' si es undefined para que el input no muestre 0
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00FDA4] focus:border-[#00FDA4] transition duration-150 text-black"
              />
            </div>

            {/* Botón de Guardar */}
            <button
              type="submit"
              disabled={!isDataChanged || isSaving}
              className={`w-full py-3 mt-6 rounded-md font-semibold transition duration-300 
              ${
                isDataChanged && !isSaving
                  ? "bg-[#000C19] text-[#00FDA4] hover:bg-[#1a2e45]"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              {isSaving ? "Saving..." : "Save Information"}
            </button>
          </form>

          <hr className="my-6 border-gray-300" />

          {/* === BOTÓN ELIMINAR CUENTA === */}
          <button
            onClick={handleDelete}
            className="w-full py-3 rounded-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition duration-300"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
