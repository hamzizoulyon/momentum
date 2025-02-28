import React from "react";
import Logo from "../assets/images/export_svg_logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="relative bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-8 py-5 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-4 group">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-300">
            <Logo />
          </div>
          <span className="text-2xl font-poppins flex items-center gap-1.5">
            <span className="text-blue-600 font-semibold">Habit</span>
            <span className="font-light text-gray-700">Stacker</span>
          </span>
        </Link>

        <div className="flex gap-5">
          <Link href="/login">
            <Button className="px-7 py-2.5 bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-300 font-poppins text-sm font-medium rounded-lg">
              Se connecter
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="secondary"
              className="px-7 py-2.5 bg-white hover:bg-gray-50 text-blue-600 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 font-poppins text-sm font-medium rounded-lg"
            >
              S'inscrire
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
