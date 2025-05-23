
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { Instagram, Mail } from "lucide-react";
import { useFeedback } from "@/context/FeedbackContext";
import StarRating from "@/components/StarRating";

const ThankYou = () => {
  const navigate = useNavigate();
  const { getRandomThankYouMessage, currentFeedback } = useFeedback();
  const [message] = useState(getRandomThankYouMessage());
  
  useEffect(() => {
    // If no feedback was submitted, redirect to home
    if (!currentFeedback || !currentFeedback.rating) {
      navigate('/');
    }
  }, [currentFeedback, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-opa-cream p-6">
      <Card className="max-w-lg w-full rounded-2xl shadow-lg animate-scale-in">
        <CardHeader className="text-center">
          <Logo />
          <div className="h-px bg-opa-gold w-16 mx-auto my-3" />
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="mb-4">
            <h2 className="text-3xl font-playfair text-opa-brown">{message}</h2>
            <p className="text-muted-foreground mt-3">
              Your feedback helps us improve our service at OPA Bar & Cafe.
            </p>
          </div>
          
          {currentFeedback.rating && (
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2">You rated us:</p>
              <StarRating 
                rating={currentFeedback.rating} 
                onChange={() => {}} 
                readOnly 
              />
            </div>
          )}
          
          <div className="pt-6 space-y-4">
            <h3 className="text-lg font-medium font-playfair">Stay connected with us</h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                className="flex items-center gap-2 min-w-[180px] bg-gradient-to-r from-purple-500 to-pink-500"
                onClick={() => window.open("https://instagram.com", "_blank")}
              >
                <Instagram size={18} />
                <span>Follow on Instagram</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 min-w-[180px]"
                onClick={() => window.location.href = "mailto:hello@opacafe.com"}
              >
                <Mail size={18} />
                <span>Contact Us</span>
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button 
            variant="link" 
            className="text-muted-foreground hover:text-opa-brown"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ThankYou;
