import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { X, Menu } from "lucide-react";
import { useLocation } from "@remix-run/react";
import { useTheme } from "remix-themes";

const Navbar = () => {
  const [company, setCompany] = useState<string>("Alpha Wing");
  const [nav, setNav] = useState<boolean>(false);
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
  };

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <>
      <div
        className="text-white flex items-center h-24 mx-auto px-4
                justify-between fixed top-0 w-full bg-tmLightBlack z-50 shadow-sm"
      >
        <h1 className="flex flex-row items-center  w-full text-3xl font-bold text-blue-600">
          <img src="aw-logo.svg" alt="Alpha Wing" className="w-20 rounded mx-1" />
          <span>{company} </span>
        </h1>
        <ul className="hidden md:flex md:items-center">
          <li
            className="p-4 cursor-pointer"
            onClick={() => {
              navigate("/");
              scrollTo("#home");
            }}
          >
            Home
          </li>
          <li
            className="p-4 cursor-pointer"
            onClick={() => {
              scrollTo("#features");
            }}
          >
            Features
          </li>
          <li
            className="p-4 cursor-pointer"
            onClick={() => {
              scrollTo("#pricing");
            }}
          >
            Pricing
          </li>
          <li
            className="p-4 cursor-pointer"
            onClick={() => {
              scrollTo("#reviews");
            }}
          >
            Reviews
          </li>
          <li
            className="p-4"
            onClick={() => {
              navigate("/login");
            }}
          >
            <button className="bg-tmYellow w-[100px] rounded-md font-medium mx-auto px-6 py-3 text-black">
              Login
            </button>
          </li>
        </ul>
        <div className="block md:hidden cursor-pointer" onClick={handleNav}>
          {!nav ? (
            <Menu className="text-white" />
          ) : (
            <X className="text-white cursor-pointer" />
          )}
        </div>

        <div
          className={
            nav
              ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-tmDarkBlack ease-in-out duration-500"
              : "fixed left-[-100%]"
          }
        >
          <h1 className="w-full text-3xl font-bold text-[#2176ff] m-4">
            {company}
          </h1>

          <ul className="uppercase p-4">
            <li
              className="p-4 border-b border-gray-600 cursor-pointer"
              onClick={() => {
                scrollTo("#home");
              }}
            >
              Home
            </li>
            <li
              className="p-4 border-b border-gray-600 cursor-pointer"
              onClick={() => {
                scrollTo("#features");
              }}
            >
              Features
            </li>
            <li
              className="p-4 border-b border-gray-600 cursor-pointer"
              onClick={() => {
                scrollTo("#pricing");
              }}
            >
              Pricing
            </li>
            <li
              className="p-4 border-b border-gray-600 cursor-pointer"
              onClick={() => {
                scrollTo("#reviews");
              }}
            >
              Reviews
            </li>
            <li
              className="p-4 cursor-pointer"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
