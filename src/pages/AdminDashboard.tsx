
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
import * as XLSX from 'xlsx';

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
    if (feedback.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no feedback data available to export.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Prepare data for Excel export
      const exportData = feedback.map((item, index) => ({
        'ID': item.id,
        'Date': new Date(item.createdAt).toLocaleDateString(),
        'Rating': item.rating,
        'Category': item.category || 'N/A',
        'Emoji Reaction': item.emojiReaction || 'N/A',
        'Message': item.message || 'N/A',
        'Customer Name': item.isAnonymous ? 'Anonymous' : (item.name || 'N/A'),
        'Email': item.isAnonymous ? 'Anonymous' : (item.email || 'N/A'),
        'Submission Type': item.isAnonymous ? 'Anonymous' : 'Named'
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Add some styling to the headers
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "EEEEEE" } }
        };
      }

      // Auto-size columns
      const colWidths = exportData.reduce((acc: any[], row) => {
        Object.keys(row).forEach((key, index) => {
          const value = String(row[key as keyof typeof row] || '');
          const width = Math.max(value.length, key.length) + 2;
          acc[index] = Math.max(acc[index] || 0, width);
        });
        return acc;
      }, []);
      
      ws['!cols'] = colWidths.map(width => ({ width }));

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Feedback Data');

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const filename = `OPA_Cafe_Feedback_${date}.xlsx`;

      // Export file
      XLSX.writeFile(wb, filename);

      toast({
        title: "Export successful",
        description: `Feedback data exported as ${filename}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive"
      });
    }
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
    <div className="min-h-screen bg-red-cream font-albura">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="font-albura"
            >
              Export to Excel
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="font-albura"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-albura font-semibold text-red-brown mb-6">
          Admin Dashboard
        </h1>
        
        <div className="mb-8">
          <FeedbackStats feedback={feedback} />
        </div>
        
        <Card className="bg-white shadow-sm mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-albura text-red-brown">
              Filter Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search" className="font-albura">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by name, email, or content"
                  className="bg-white font-albura"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="rating" className="font-albura">Rating</Label>
                <Select
                  value={filters.rating}
                  onValueChange={(value) => setFilters({...filters, rating: value})}
                >
                  <SelectTrigger className="bg-white font-albura">
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
                <Label htmlFor="category" className="font-albura">Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters({...filters, category: value})}
                >
                  <SelectTrigger className="bg-white font-albura">
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
                <Label htmlFor="date" className="font-albura">Date Range</Label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) => setFilters({...filters, dateRange: value})}
                >
                  <SelectTrigger className="bg-white font-albura">
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
          <h2 className="text-xl font-albura text-red-brown">
            Feedback Results ({filteredFeedback.length})
          </h2>
          
          {filteredFeedback.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-muted-foreground font-albura">
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
                          <span className="text-muted-foreground text-sm font-albura">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {item.category && (
                          <div>
                            <span className="inline-block text-xs px-2 py-1 rounded-full capitalize font-albura" style={{ backgroundColor: '#510909', color: 'white' }}>
                              {item.category}
                            </span>
                          </div>
                        )}
                        
                        {item.message && (
                          <p className="text-red-brown font-albura">{item.message}</p>
                        )}
                      </div>
                      
                      <div className="shrink-0">
                        <div className="text-right">
                          {item.isAnonymous ? (
                            <p className="text-sm text-muted-foreground font-albura">Anonymous</p>
                          ) : (
                            <>
                              {item.name && <p className="font-medium font-albura">{item.name}</p>}
                              {item.email && <p className="text-sm text-muted-foreground font-albura">{item.email}</p>}
                            </>
                          )}
                        </div>
                        
                        <div className="mt-3 text-right">
                          <Button 
                            size="sm" 
                            variant={item.email ? "default" : "secondary"}
                            className="font-albura"
                            style={item.email ? { backgroundColor: '#510909' } : {}}
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
