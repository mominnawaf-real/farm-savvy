
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  QrCode, 
  Heart, 
  Calendar, 
  BarChart3,
  Smartphone,
  Shield
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: QrCode,
      title: "QR Code Scanning",
      description: "Instantly access animal records by scanning QR codes. Perfect for quick field updates and health checks.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Heart,
      title: "Health Management",
      description: "Track vaccinations, medications, and health records. Set reminders and never miss important treatments.",
      color: "bg-red-50 text-red-600"
    },
    {
      icon: Calendar,
      title: "Breeding Calendar",
      description: "Manage breeding programs with intelligent scheduling. Track pregnancies and optimize breeding cycles.",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Gain insights with detailed reports and analytics. Track growth, productivity, and financial performance.",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Designed for farmers in the field. Works perfectly on smartphones and tablets, even in harsh conditions.",
      color: "bg-gray-50 text-gray-600"
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Your farm data is secure with enterprise-grade encryption and regular backups. GDPR compliant.",
      color: "bg-orange-50 text-orange-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Your Farm
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive farm management system provides all the tools you need to streamline 
            operations and boost productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
