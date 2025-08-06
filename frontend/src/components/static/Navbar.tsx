import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { NavLink, useNavigate } from "react-router";
//import Logo from "../../../public/Images/Logo.png";
import { ModeToggle } from "./ToggleTheme";

type NavbarProps = {};

export const Navbar = ({}: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className=" text-orange-400 fixed top-0 w-full z-50 backdrop-blur-2xl flex items-center justify-between h-12 px-10 border-1 ">
      <div>
        <NavLink to="/">{/* <img className="w-15 h-15 " src={Logo} alt="logo" /> */}</NavLink>
      </div>

      <div className="flex gap-6">
        <NavLink className="font-semibold hover:underline hover:text-orange-300" to="/">
          Home
        </NavLink>
        <span>|</span>
        <NavLink className="font-semibold hover:underline hover:text-orange-300" to="/events/map">
          Map
        </NavLink>
        <span>|</span>
        <NavLink className="font-semibold hover:underline hover:text-orange-300" to="recipes/create-recipe">
          Add Recipe
        </NavLink>
      </div>

      {/* Avatar with dropdown */}
      <div className="flex gap-5">
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full overflow-hidden w-10 h-10">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name}`}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full border-2 border-orange-400"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="cursor-pointer font-semibold text-red-600 bg-white border-1 hover:bg-gray-100 border-orange-400 rounded-sm p-1 text-center"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
