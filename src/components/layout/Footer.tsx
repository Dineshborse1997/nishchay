import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-primary rounded-lg p-2">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-gradient-primary">PrepWise</span>
            </Link>
            <p className="text-muted-foreground">
              Maharashtra's leading platform for competitive exam preparation. 
              Empowering students to achieve their government job dreams.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/exams" className="text-muted-foreground hover:text-primary transition-colors">Exam Types</Link></li>
              <li><Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/success-stories" className="text-muted-foreground hover:text-primary transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          {/* Exams */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Exams</h3>
            <ul className="space-y-2">
              <li><Link to="/exams/police" className="text-muted-foreground hover:text-primary transition-colors">Police Bharti</Link></li>
              <li><Link to="/exams/talathi" className="text-muted-foreground hover:text-primary transition-colors">Talathi Bharti</Link></li>
              <li><Link to="/practice" className="text-muted-foreground hover:text-primary transition-colors">Mock Tests</Link></li>
              <li><Link to="/previous-papers" className="text-muted-foreground hover:text-primary transition-colors">Previous Papers</Link></li>
              <li><Link to="/model-questions" className="text-muted-foreground hover:text-primary transition-colors">Model Questions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>support@prepwise.in</span>
              </li>
              <li className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start space-x-3 text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
                <span>123 Education Hub,<br />Pune, Maharashtra 411001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              © 2024 PrepWise. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/refund" className="text-muted-foreground hover:text-primary transition-colors">
                Refund Policy
              </Link>
              <Link to="/support" className="text-muted-foreground hover:text-primary transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;