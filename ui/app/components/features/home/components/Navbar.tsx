import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import { X, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "remix-themes";

const navItems = [
  { label: "Home", id: "#home" },
  { label: "Features", id: "#features" },
  { label: "Pricing", id: "#pricing" },
  { label: "Reviews", id: "#reviews" },
];

const Navbar = () => {
  const [company] = useState("Alpha Wing");
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useTheme();

  const scrollTo = (elementId: string | null) => {
    if (elementId) {
      const element = document.querySelector(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setNavOpen(false);
  };

  const toggleNav = () => setNavOpen((prev) => !prev);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-tmLightBlack shadow-sm text-white">
      <div className="flex items-center justify-between h-24 px-4 mx-auto max-w-7xl">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            navigate("/");
            scrollTo("#home");
          }}
        >
          <img
            src="/aw-logo.svg"
            alt="Alpha Wing"
            className="w-12 rounded mr-2"
          />
          <span className="text-3xl font-bold text-blue-600">{company}</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navItems.map(({ label, id }) => (
            <button
              key={label}
              onClick={() => scrollTo(id)}
              className="text-white hover:text-tmYellow transition"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => navigate("/login")}
            className="bg-tmYellow px-6 py-2 rounded-md font-medium text-black hover:opacity-90 transition"
          >
            Login
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-2 p-2 hover:bg-tmDarkBlack rounded"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={toggleNav}
          aria-label="Toggle navigation menu"
        >
          {navOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-[70%] bg-tmDarkBlack text-white transform transition-transform duration-300 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <span className="text-2xl font-bold text-blue-500">{company}</span>
          <button onClick={toggleNav} aria-label="Close mobile menu">
            <X />
          </button>
        </div>
        <ul className="flex flex-col gap-2 p-4">
          {navItems.map(({ label, id }) => (
            <li
              key={label}
              className="py-3 border-b border-gray-700 cursor-pointer"
              onClick={() => scrollTo(id)}
            >
              {label}
            </li>
          ))}
          <li className="py-3" onClick={() => navigate("/login")}>
            Login
          </li>
          <li className="py-3">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm hover:text-tmYellow"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              Toggle Theme
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
