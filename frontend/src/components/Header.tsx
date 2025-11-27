import logout_icon from "../assets/logout_icon.png";
import user from "../assets/user.png";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const personalInformationClick = () => {
    window.location.href = "/personal-information";
  };

  return (
    <header className="bg-[#4DA8E4] text-white pt-4 pb-4 pl-4 pr-1 flex rounded-lg">
      <a href="/tasks" className="col-span-4">
        <h1
          className="text-3xl text-white font-sans bg-[rgba(0,0,0,0.5)] p-6 rounded-full transform 
                    transition-transform duration-200 hover:scale-105"
        >
          Task AI Management
        </h1>
      </a>
      <div className="flex ml-auto gap-6">
        <div
          className="relative inline-flex text-left w-20 h-20 aspect-square items-center justify-center bg-white rounded-full
                    cursor-pointer transform transition-transform duration-200 hover:scale-105"
          onClick={() => setOpen(!open)}
        >
          {/* Imagen del usuario que abre/cierra el menú */}
          <img
            src={user}
            alt="user"
            className="w-[40px]"
            // toggle del estado
          />

          {/* Menú desplegable */}
          {open && (
            <ul className="absolute right-[0] mt-50 w-48 bg-[#2B6CDD] rounded-lg shadow-lg">
              <li
                onClick={personalInformationClick}
                className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer border-b border-white"
              >
                <p>Personal Information</p>
              </li>
              <li
                onClick={logout}
                className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer flex justify-between items-center"
              >
                <button>Sign out</button>
                <img src={logout_icon} alt="logout" className="w-4 h-4 ml-2" />
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
