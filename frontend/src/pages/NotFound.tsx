import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  return (
    <div className="min-h-screen bg-white grid place-items-center p-6" data-testid="notfound-page">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-[#1A1A6B] to-[#0F0F4A] grid place-items-center mb-6 shadow-lg">
          <Compass className="h-7 w-7 text-white" />
        </div>
        <div className="font-display text-7xl font-extrabold tracking-tight text-gradient-brand mb-2">404</div>
        <h1 className="font-display text-2xl font-bold mb-2">We lost this page</h1>
        <p className="text-zinc-600 mb-6">The link may be old, or the page may have moved.</p>
        <Link to="/">
          <Button className="rounded-full px-6 bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] text-white hover:brightness-110" data-testid="notfound-home">
            Take me home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
