import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Mail, Clock } from "lucide-react";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

          <h1 className="text-3xl font-bold text-foreground mb-6">Contact Us</h1>

          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              We'd love to hear from you! Whether you have questions, feedback, or need support, 
              feel free to reach out.
            </p>

            <div className="card-elevated p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
                  <p className="text-muted-foreground mb-3">
                    For any inquiries, feature requests, or support needs:
                  </p>
                  <a 
                    href="mailto:creatorsAnalyticsAi@gmail.com"
                    className="text-lg font-medium text-primary hover:underline"
                  >
                    creatorsAnalyticsAi@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Response Time</h3>
                  <p className="text-muted-foreground">
                    We typically respond within 24-48 hours during business days. 
                    Please provide as much detail as possible to help us assist you better.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-soft p-6">
              <h3 className="font-semibold text-foreground mb-3">Before Contacting</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Check our Privacy Policy and Terms for common questions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Include your account email if reporting an issue
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Describe the problem with as much detail as possible
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
