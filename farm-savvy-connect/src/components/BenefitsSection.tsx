
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Clock, DollarSign } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Increase Productivity",
      description: "Boost farm efficiency by up to 30% with streamlined workflows and automated reminders.",
      stat: "30% increase"
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Reduce manual record-keeping by 80%. Spend more time on farming, less on paperwork.",
      stat: "80% less paperwork"
    },
    {
      icon: DollarSign,
      title: "Reduce Costs",
      description: "Lower veterinary costs and feed waste with better health monitoring and feeding schedules.",
      stat: "25% cost reduction"
    },
    {
      icon: CheckCircle,
      title: "Improve Health",
      description: "Achieve 98% animal health rates with proactive health management and early intervention.",
      stat: "98% health rate"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Proven Results for Modern Farmers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of farmers who have transformed their operations with our farm management system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 mb-4">{benefit.description}</p>
                    <div className="text-2xl font-bold text-green-600">{benefit.stat}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Farmers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">2.5M</div>
              <div className="text-gray-600">Animals Tracked</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
