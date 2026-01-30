import { useState } from "react";
import { Star, X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageName: string;
}

export const RatingModal = ({ isOpen, onClose, pageName }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Click on the stars to rate us",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to rate us",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Insert rating into database
      const { error: dbError } = await supabase.from("ratings").insert({
        user_id: session.user.id,
        rating,
        feedback: feedback.trim() || null,
        page_name: pageName,
      });

      if (dbError) throw dbError;

      // Send email notification via edge function
      try {
        await supabase.functions.invoke("send-rating-notification", {
          body: {
            rating,
            feedback: feedback.trim() || null,
            pageName,
            userEmail: session.user.email,
          },
        });
      } catch (emailError) {
        console.log("Email notification failed, but rating was saved:", emailError);
      }

      setIsSubmitted(true);
      toast({
        title: "Thank you for your feedback!",
        description: "Your rating helps us improve Hooklix AI.",
      });

      // Close after animation
      setTimeout(() => {
        onClose();
        // Reset state
        setRating(0);
        setFeedback("");
        setIsSubmitted(false);
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit rating",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <Star className="w-8 h-8 text-green-500 fill-green-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Thank you! 💜</h2>
            <p className="text-muted-foreground mt-2">Your feedback means a lot to us.</p>
          </div>
        ) : (
          <>
            {/* Content */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Rate Hooklix AI
              </h2>
              <p className="text-sm text-muted-foreground">
                How has your experience been so far?
              </p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={cn(
                      "w-10 h-10 transition-colors",
                      (hoveredRating || rating) >= star
                        ? "text-amber-400 fill-amber-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>

            {/* Feedback Textarea */}
            <div className="mb-6">
              <Textarea
                placeholder="Share your feedback (optional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="resize-none"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {feedback.length}/500
              </p>
            </div>

            {/* Submit Button */}
            <Button
              variant="trust"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full gap-2"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Rating
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
