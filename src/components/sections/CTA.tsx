import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-primary via-primary-glow to-secondary overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Start Your Success
              <br />
              Journey Today!
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of successful candidates who achieved their dream government jobs with PrepWise
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Users className="h-8 w-8 mx-auto mb-3" />
              <div className="font-semibold mb-1">50,000+ Students</div>
              <div className="text-white/80 text-sm">Active learners</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Trophy className="h-8 w-8 mx-auto mb-3" />
              <div className="font-semibold mb-1">5,000+ Selected</div>
              <div className="text-white/80 text-sm">Success stories</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Star className="h-8 w-8 mx-auto mb-3" />
              <div className="font-semibold mb-1">95% Success Rate</div>
              <div className="text-white/80 text-sm">Proven results</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/student/signup">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/student/login">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                Already Registered? Login
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-white/70 text-sm mb-4">Trusted by students across Maharashtra</p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <span className="bg-white/10 px-3 py-1 rounded-full">✓ No Hidden Fees</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">✓ 24/7 Support</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">✓ Money Back Guarantee</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">✓ Expert Faculty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;