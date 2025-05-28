import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from "@/components/Logo";
import StarRating from "@/components/StarRating";
import FeedbackStats from "@/components/FeedbackStats";
import { useFeedback } from "@/context/FeedbackContext";
import { Feedback } from "@/context/FeedbackContext";
import { FEEDBACK_CATEGORIES } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { feedback, isAdmin, logoutAdmin } = useFeedback();
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    rating: "",
    category: "",
    dateRange: "all"
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    let result = [...feedback];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(item => 
        (item.name?.toLowerCase().includes(searchLower) || false) ||
        (item.email?.toLowerCase().includes(searchLower) || false) ||
        (item.message?.toLowerCase().includes(searchLower) || false)
      );
    }
    
    // Apply rating filter
    if (filters.rating && filters.rating !== "all") {
      result = result.filter(item => item.rating === parseInt(filters.rating));
    }
    
    // Apply category filter
    if (filters.category && filters.category !== "all") {
      result = result.filter(item => item.category === filters.category);
    }
    
    // Apply date filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      let startDate = new Date();
      
      switch (filters.dateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      result = result.filter(item => new Date(item.createdAt) >= startDate);
    }
    
    setFilteredFeedback(result);
  }, [feedback, filters]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin');
  };

  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Your feedback data would be exported in a real application."
    });
  };

  const handleReply = (email?: string) => {
    if (email) {
      window.location.href = `mailto:${email}?subject=Thank you for your feedback to OPA Bar & Cafe`;
    } else {
      toast({
        description: "This feedback was submitted anonymously.",
        variant: "default",
      });
    }
  };

  return (
    <div className="min-h-screen bg-opa-cream">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
              Export Data
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-playfair font-semibold text-opa-brown mb-6">
          Admin Dashboard
        </h1>
        
        <div className="mb-8">
          <FeedbackStats feedback={feedback} />
        </div>
        
        <Card className="bg-white shadow-sm mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-playfair text-opa-brown">
              Filter Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by name, email, or content"
                  className="bg-white"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Select
                  value={filters.rating}
                  onValueChange={(value) => setFilters({...filters, rating: value})}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All ratings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters({...filters, category: value})}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {FEEDBACK_CATEGORIES.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Date Range</Label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) => setFilters({...filters, dateRange: value})}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 days</SelectItem>
                    <SelectItem value="month">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <h2 className="text-xl font-playfair text-opa-brown">
            Feedback Results ({filteredFeedback.length})
          </h2>
          
          {filteredFeedback.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-muted-foreground">
              No feedback found matching your filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((item) => (
                <Card key={item.id} className="bg-white shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <StarRating rating={item.rating} onChange={() => {}} readOnly />
                          <span className="text-muted-foreground text-sm">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {item.category && (
                          <div>
                            <span className="inline-block bg-opa-green bg-opacity-10 text-opa-green text-xs px-2 py-1 rounded-full capitalize">
                              {item.category}
                            </span>
                          </div>
                        )}
                        
                        {item.message && (
                          <p className="text-opa-brown">{item.message}</p>
                        )}
                      </div>
                      
                      <div className="shrink-0">
                        <div className="text-right">
                          {item.isAnonymous ? (
                            <p className="text-sm text-muted-foreground">Anonymous</p>
                          ) : (
                            <>
                              {item.name && <p className="font-medium">{item.name}</p>}
                              {item.email && <p className="text-sm text-muted-foreground">{item.email}</p>}
                            </>
                          )}
                        </div>
                        
                        <div className="mt-3 text-right">
                          <Button 
                            size="sm" 
                            variant={item.email ? "default" : "secondary"}
                            className={item.email ? "bg-opa-green hover:bg-opa-green/90" : ""}
                            onClick={() => handleReply(item.email)}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
