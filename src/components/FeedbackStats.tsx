
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Feedback } from "@/context/FeedbackContext";
import StarRating from "./StarRating";

interface FeedbackStatsProps {
  feedback: Feedback[];
}

const FeedbackStats = ({ feedback }: FeedbackStatsProps) => {
  // Calculate average rating
  const averageRating = feedback.length
    ? feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length
    : 0;
  
  // Count by category
  const categoryCount: Record<string, number> = {};
  feedback.forEach(item => {
    if (item.category) {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    }
  });
  
  // Get top category
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];

  // Count by rating
  const ratingCount = [0, 0, 0, 0, 0]; // Index 0 for 1 star, index 4 for 5 stars
  feedback.forEach(item => {
    if (item.rating >= 1 && item.rating <= 5) {
      ratingCount[item.rating - 1]++;
    }
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-white border-opa-cream shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-opa-brown text-lg">Average Rating</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center">
            <p className="text-4xl font-bold text-opa-gold mb-2">
              {averageRating.toFixed(1)}
            </p>
            <StarRating rating={Math.round(averageRating)} onChange={() => {}} readOnly size="small" />
            <p className="text-sm text-muted-foreground mt-2">
              Based on {feedback.length} reviews
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white border-opa-cream shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-opa-brown text-lg">Most Discussed</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center">
            {topCategory ? (
              <>
                <p className="text-2xl font-bold text-opa-green capitalize">
                  {topCategory[0]}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {topCategory[1]} {topCategory[1] === 1 ? 'mention' : 'mentions'}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white border-opa-cream shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-opa-brown text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold text-opa-brown">
              {feedback.length > 0 ? (
                new Date(feedback[0].createdAt).toLocaleDateString()
              ) : (
                "No recent activity"
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last feedback received
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackStats;
