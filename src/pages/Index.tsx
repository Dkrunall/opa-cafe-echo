
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { Instagram } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-opa-cream p-6">
      <div className="max-w-lg w-full rounded-2xl bg-white shadow-lg p-8 animate-scale-in">
        <div className="mb-8 text-center">
          <Logo size="large" />
          <div className="h-px bg-opa-gold w-24 mx-auto my-4" />
          <p className="text-lg text-opa-brown mt-6">
            We'd love to hear about your experience.
          </p>
          <p className="mt-3 text-muted-foreground">
            Your feedback helps us create a better experience for everyone.
          </p>
        </div>

        <Button 
          className="w-full bg-opa-green hover:bg-opa-green/90 text-lg py-6"
          onClick={() => navigate("/feedback")}
        >
          Share Your Feedback
        </Button>
        
        <div className="mt-8 text-center">
          <a 
            href="https://www.instagram.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-muted-foreground hover:text-opa-brown transition-colors"
          >
            <Instagram size={18} className="mr-1" />
            <span>Follow us on Instagram</span>
          </a>
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            variant="link" 
            className="text-muted-foreground hover:text-opa-brown"
            onClick={() => navigate("/admin")}
          >
            Admin Access
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
