import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { NavLink, useNavigate } from "react-router";
import Logo from "@/img/logo.png";
import { ModeToggle } from "./ToggleTheme";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Map", to: "/events/map" },
    { label: "All Events", to: "/events/", end: true },
    { label: "Calendar", to: "/events/calendar" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/70 dark:bg-black/50 border-b border-orange-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="logo" className="h-10 w-auto" />
          <span className="text-lg font-bold text-orange-500 hidden sm:inline">MatchUp</span>
        </NavLink>

        <div className="hidden md:flex gap-6 items-center text-orange-500">
          {navLinks.map(({ label, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative font-medium hover:text-orange-600 transition ${
                  isActive ? "text-orange-600 underline underline-offset-4" : ""
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 rounded-full overflow-hidden w-10 h-10 hover:scale-105 transition">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}`}
                  alt="User Avatar"
                  className="w-full h-full object-cover border-2 border-orange-400 rounded-full"
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-36 mt-2 bg-white dark:bg-black border border-orange-300 rounded-md shadow-md"
            >
              <div className="px-3 py-2 font-medium text-sm text-orange-500">{user?.name}</div>
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="cursor-pointer font-semibold text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
