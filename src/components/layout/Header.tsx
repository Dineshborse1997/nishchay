import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary rounded-lg p-2">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient-primary">PrepWise</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/exams" className="text-foreground hover:text-primary transition-colors">
              Exams
            </Link>
            <Link to="/features" className="text-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/student/login">
              <Button variant="outline" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Student Login</span>
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="outline" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            </Link>
            <Link to="/student/signup">
              <Button className="btn-hero">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col space-y-4">
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/exams" className="text-foreground hover:text-primary transition-colors">
                Exams
              </Link>
              <Link to="/features" className="text-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Link to="/student/login">
                  <Button variant="outline" className="w-full">Student Login</Button>
                </Link>
                <Link to="/admin/login">
                  <Button variant="outline" className="w-full">Admin Portal</Button>
                </Link>
                <Link to="/student/signup">
                  <Button className="w-full btn-hero">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;