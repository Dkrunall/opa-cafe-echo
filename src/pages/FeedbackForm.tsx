
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Logo from "@/components/Logo";
import StarRating from "@/components/StarRating";
import EmojiReaction from "@/components/EmojiReaction";
import CategorySelector from "@/components/CategorySelector";
import { useFeedback } from "@/context/FeedbackContext";

const FeedbackForm = () => {
  const navigate = useNavigate();
  const { currentFeedback, setCurrentFeedback, addFeedback } = useFeedback();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (rating: number) => {
    setCurrentFeedback({ ...currentFeedback, rating });
  };

  const handleEmojiChange = (emojiReaction: string) => {
    setCurrentFeedback({ ...currentFeedback, emojiReaction });
  };

  const handleCategoryChange = (category: string) => {
    setCurrentFeedback({ ...currentFeedback, category });
  };

  const handleIsAnonymousChange = (checked: boolean) => {
    setCurrentFeedback({ 
      ...currentFeedback, 
      isAnonymous: checked,
      name: checked ? undefined : currentFeedback.name,
      email: checked ? undefined : currentFeedback.email
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newFeedback = {
        id: Date.now().toString(),
        rating: currentFeedback.rating || 0,
        emojiReaction: currentFeedback.emojiReaction,
        category: currentFeedback.category,
        message: currentFeedback.message,
        name: currentFeedback.isAnonymous ? undefined : currentFeedback.name,
        email: currentFeedback.isAnonymous ? undefined : currentFeedback.email,
        isAnonymous: currentFeedback.isAnonymous || false,
        photoUrl: currentFeedback.photoUrl,
        createdAt: new Date().toISOString()
      };
      
      addFeedback(newFeedback);
      navigate('/thank-you');
      setIsSubmitting(false);
    }, 800);
  };

  const nextStep = () => {
    if (step === 1 && !currentFeedback.rating) {
      return; // Prevent proceeding without rating
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-opa-cream p-4 md:p-6">
      <Card className="w-full max-w-lg shadow-lg animate-scale-in">
        <CardHeader className="pb-2 text-center">
          <Logo />
          <div className="h-px bg-opa-gold w-16 mx-auto my-2" />
          <p className="text-sm text-muted-foreground">Step {step} of 3</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center">
                  <h2 className="text-2xl font-medium font-playfair text-opa-brown">How was your experience?</h2>
                  <p className="text-muted-foreground mt-1">Tap to rate your overall experience</p>
                </div>
                
                <div className="flex justify-center">
                  <StarRating 
                    rating={currentFeedback.rating || 0} 
                    onChange={handleRatingChange} 
                    size="large"
                  />
                </div>
                
                {currentFeedback.rating && currentFeedback.rating > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-center text-lg font-medium">How would you describe your visit?</h3>
                    <EmojiReaction 
                      selectedReaction={currentFeedback.emojiReaction} 
                      onChange={handleEmojiChange} 
                    />
                  </div>
                )}
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-medium font-playfair text-opa-brown">Tell us more</h2>
                  <p className="text-muted-foreground mt-1">Share your thoughts about your experience</p>
                </div>
                
                <div className="space-y-4">
                  <CategorySelector 
                    value={currentFeedback.category} 
                    onChange={handleCategoryChange} 
                  />
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Your feedback (optional)</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Share your experience..." 
                      className="resize-none min-h-[120px] bg-white"
                      value={currentFeedback.message || ''}
                      onChange={(e) => setCurrentFeedback({...currentFeedback, message: e.target.value})}
                    />
                  </div>
                  
                  {/* Photo upload placeholder - would be implemented with actual file upload in real app */}
                  <div className="space-y-2">
                    <Label htmlFor="photo">Add a photo (optional)</Label>
                    <Input 
                      id="photo" 
                      type="file" 
                      accept="image/*" 
                      className="bg-white"
                      onChange={() => setCurrentFeedback({...currentFeedback, photoUrl: '/placeholder.svg'})}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-medium font-playfair text-opa-brown">About you</h2>
                  <p className="text-muted-foreground mt-1">Your information will be kept private</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="anonymous" className="cursor-pointer">Submit anonymously</Label>
                  <Switch 
                    id="anonymous" 
                    checked={currentFeedback.isAnonymous || false} 
                    onCheckedChange={handleIsAnonymousChange}
                  />
                </div>
                
                {!currentFeedback.isAnonymous && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name (optional)</Label>
                      <Input 
                        id="name" 
                        placeholder="Enter your name" 
                        className="bg-white"
                        value={currentFeedback.name || ''}
                        onChange={(e) => setCurrentFeedback({...currentFeedback, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Your Email (optional)</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-white"
                        value={currentFeedback.email || ''}
                        onChange={(e) => setCurrentFeedback({...currentFeedback, email: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground">We'll only use this to follow up if needed.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
          )}
          
          {step < 3 ? (
            <Button 
              type="button" 
              onClick={nextStep} 
              disabled={step === 1 && !currentFeedback.rating}
              className="bg-opa-green hover:bg-opa-green/90"
            >
              Next
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-opa-green hover:bg-opa-green/90"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeedbackForm;
