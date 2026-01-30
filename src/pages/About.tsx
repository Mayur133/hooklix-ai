import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Target, Zap, Shield, Users } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Logo />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-fade-in">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-3xl font-bold text-foreground mb-6">About Hooklix Ai</h1>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Hooklix Ai is a professional AI-powered tool designed to help content creators 
              understand and improve their YouTube and Instagram content performance using data-driven insights.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="card-elevated p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Our Mission</h3>
                <p className="text-sm text-muted-foreground">
                  To provide creators with actionable, AI-based guidance to help them grow their channels 
                  using best practices and pattern analysis.
                </p>
              </div>

              <div className="card-elevated p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">How It Works</h3>
                <p className="text-sm text-muted-foreground">
                  We analyze public data from your channel using AI to identify patterns, 
                  consistency gaps, and optimization opportunities.
                </p>
              </div>

              <div className="card-elevated p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  We only access publicly available data. We never require access to your 
                  private analytics or account credentials.
                </p>
              </div>

              <div className="card-elevated p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">For All Creators</h3>
                <p className="text-sm text-muted-foreground">
                  Whether you're just starting out or have an established channel, 
                  our tools are designed to help you improve.
                </p>
              </div>
            </div>

            <div className="card-soft p-6">
              <h3 className="font-semibold text-foreground mb-2">Contact Us</h3>
              <p className="text-sm text-muted-foreground">
                Have questions or feedback? Reach out to us at{" "}
                <a 
                  href="mailto:hooklixai@gmail.com" 
                  className="text-primary hover:underline"
                >
                  hooklixai@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
