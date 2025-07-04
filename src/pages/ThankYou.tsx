
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

  const handleEmailSupport = () => {
    const subject = encodeURIComponent("Thank you for your feedback!");
    const body = encodeURIComponent(`Dear Valued Customer,

Thank you so much for taking the time to share your feedback with us! 

We have received your review and want you to know that your thoughts and experiences are incredibly valuable to us. Your input helps us understand what we're doing well and where we can improve.

We carefully review every piece of feedback we receive and will surely apply your suggestions to enhance our service and create an even better experience for all our customers.

If you have any additional comments or questions, please don't hesitate to reach out to us directly.

Thank you again for choosing us and for helping us grow!

Best regards,
The Feedback Team

---
This email was sent in response to your recent feedback submission.`);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-opa-cream p-6 font-albura">
      <Card className="max-w-lg w-full rounded-2xl shadow-lg animate-scale-in">
        <CardHeader className="text-center">
          <Logo size="large" />
          <div className="h-px bg-opa-gold w-16 mx-auto my-3" />
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="mb-4">
            <h2 className="text-3xl font-albura text-opa-brown">{message}</h2>
            <p className="text-muted-foreground mt-3 font-albura">
              Your feedback helps us improve our service.
            </p>
          </div>
          
          {currentFeedback.rating && (
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2 font-albura">You rated us:</p>
              <StarRating 
                rating={currentFeedback.rating} 
                onChange={() => {}} 
                readOnly 
              />
            </div>
          )}
          
          <div className="pt-6 space-y-4">
            <h3 className="text-lg font-medium font-albura">Stay connected with us</h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                className="flex items-center gap-2 min-w-[180px] bg-gradient-to-r from-purple-500 to-pink-500 font-albura"
                onClick={() => window.open("https://instagram.com", "_blank")}
              >
                <Instagram size={18} />
                <span>Follow on Instagram</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 min-w-[180px] font-albura"
                onClick={handleEmailSupport}
              >
                <Mail size={18} />
                <span>Get Email Response</span>
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button 
            variant="link" 
            className="text-muted-foreground hover:text-opa-brown font-albura"
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
