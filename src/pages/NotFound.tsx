
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-cream p-6 font-albura">
      <div className="max-w-lg w-full rounded-2xl bg-white shadow-lg p-8 animate-scale-in text-center">
        <Logo size="large" />
        <div className="h-px bg-red-gold w-24 mx-auto my-4" />
        <h1 className="text-4xl font-bold mb-4 text-red-brown font-albura">404</h1>
        <p className="text-xl text-red-brown mb-4 font-albura">Oops! Page not found</p>
        <p className="text-muted-foreground mb-6 font-albura">
          The page you're looking for doesn't exist.
        </p>
        <Button 
          className="font-albura"
          style={{ backgroundColor: '#510909' }}
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
