import { signup, login } from "../api/client";
import { useState, type FormEventHandler } from "react";

interface FormField {
  name: string; // El nombre clave (ej: "firstName", "email")
  label: string; // El texto visible (ej: "Nombre")
  type: "text" | "email" | "password" | "number"; // El tipo de input
  placeholder?: string; // Opcional
}

interface DynamicFormProps {
  fields: FormField[]; // ¡Aquí está tu array de props!
  onSubmit: (data: Record<string, string>) => void; // Una función para manejar el envío
}

const handlePasswordInput = () => {
  const passwordInput = document.querySelector(
    '[name="password"]'
  ) as HTMLInputElement;

  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      const v = passwordInput.value;
      const valid =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(v);

      if (!valid) {
        passwordInput.setCustomValidity(
          "Debe tener mayúsculas, minúsculas, número, símbolo y mínimo 8 caracteres."
        );
      } else {
        passwordInput.setCustomValidity("");
      }
    });
  }
};
const signUpFields: FormField[] = [
  { name: "email", label: "Email", type: "email" },
  { name: "first_name", label: "Name", type: "text" },
  { name: "last_name", label: "Last name", type: "text" },
  { name: "phone_number", label: "Phone", type: "number" },
  {
    name: "birth_date",
    label: "Birth Date",
    type: "text",
    placeholder: "YYYY-MM-DD",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "******",
  },
];

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if (!isValidElement(formData)) {
    //   return;
    // }

    // ✅ La CLAVE: Llama a la función del padre (SignUpPage)
    // y le pasa los datos limpios y validados.
    onSubmit(formData);
  };
  const [formData, setFormData] = useState<Record<string, string>>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#000C19]">
      <div className="bg-[#CAEAFF] p-10 rounded-xl shadow-2xl w-full max-w-md transform transition-transform duration-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ¡Iteras sobre el array de props para renderizar! */}
          <h1 className="text-4xl text-center text-[#2B6CDD] font-bold font-sans p-2 mb-6 border-b border-gray-300">
            Create an account
          </h1>
          {fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onInput={handlePasswordInput}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DA8E4] focus:border-[#4DA8E4] transition duration-150 text-[#000C19]"
                // ... otros atributos (value, onChange)
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-[#4DA8E4] text-white py-3 mt-4 rounded-full font-semibold text-lg transform transition-all duration-200 hover:bg-[#2B6CDD] hover:scale-[1.02] shadow-lg"
          >
            Sign Up
          </button>
          <p className="text-center text-sm pt-4 text-[#2B6CDD] font-medium">
            <a href="/login">You have account already?</a>
          </p>
        </form>
      </div>
    </div>
  );
};

const SignUpPage = () => {
  const handleSignUp = async (data: Record<string, string>) => {
    console.log("Datos enviados:", data);
    try {
      const response = await signup(data);
      console.log("Signup successful:", response);
      if (response.status === 201) {
        await login(data.email, data.password);
        window.location.href = "/tasks";
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return <DynamicForm fields={signUpFields} onSubmit={handleSignUp} />;
};

export default SignUpPage;
