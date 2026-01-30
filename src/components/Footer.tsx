import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link 
              to="/about" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link 
              to="/privacy" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link 
              to="/contact" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Support Email */}
          <div className="text-sm text-muted-foreground">
            Support:{" "}
            <a 
              href="mailto:hooklixai@gmail.com" 
              className="hover:text-primary transition-colors"
            >
              hooklixai@gmail.com
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-4 border-t border-border/50 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Hooklix Ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
