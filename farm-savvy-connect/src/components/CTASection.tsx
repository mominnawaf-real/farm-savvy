
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export const CTASection = () => {
  const features = [
    "30-day free trial",
    "No credit card required",
    "Full access to all features",
    "24/7 customer support"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Farm?
          </h2>
          
          <p className="text-xl mb-8 text-green-100">
            Join thousands of farmers who have already revolutionized their operations. 
            Start your free trial today and see the difference in just 30 days.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-green-100">
                <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-white text-green-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-green-700 px-8 py-4 text-lg"
            >
              Schedule a Demo
            </Button>
          </div>
          
          <p className="text-sm text-green-200">
            Already have an account? <a href="#" className="text-white hover:underline font-medium">Sign in here</a>
          </p>
        </div>
      </div>
    </section>
  );
};
