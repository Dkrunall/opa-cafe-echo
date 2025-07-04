
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";
import { useFeedback } from "@/context/FeedbackContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loginAdmin } = useFeedback();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const success = loginAdmin(email, password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-cream p-6 font-albura">
      <Card className="w-full max-w-md shadow-lg animate-scale-in">
        <CardHeader className="text-center">
          <Logo size="large" />
          <div className="h-px bg-red-gold w-16 mx-auto my-3" />
          <CardTitle className="mt-2 text-2xl font-albura text-red-brown">Admin Login</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-albura">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@feedback.com"
                className="bg-white font-albura"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="font-albura">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                className="bg-white font-albura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full font-albura"
              style={{ backgroundColor: '#510909' }}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            className="text-muted-foreground hover:text-red-brown font-albura"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-4 text-center text-sm text-muted-foreground font-albura">
        <p>Demo login: admin@feedback.com / admin123</p>
      </div>
    </div>
  );
};

export default AdminLogin;
