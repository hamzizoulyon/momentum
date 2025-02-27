import React from "react";
import Logo from "../assets/images/export_svg_logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py flex justify-between items-center">
        <div className="flex items-center">
          <div className="p-2 rounded-md">
            <Logo />
          </div>
          <span className="text-2xl font-semibold flex items-center gap-1">
            <span>Habit</span>
            <span className="font-light">Stacker</span>
          </span>
        </div>

        <div className="flex gap-3">
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
