
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "Dairy Farmer, Wisconsin",
      content: "This system has revolutionized how I manage my 200 head dairy operation. The health tracking alone has saved me thousands in vet bills.",
      rating: 5,
      image: "photo-1544005313-94ddf0286df2"
    },
    {
      name: "Miguel Rodriguez",
      title: "Cattle Rancher, Texas",
      content: "The QR scanning feature is a game-changer. I can instantly access any animal's complete history right from the field using my phone.",
      rating: 5,
      image: "photo-1507003211169-0a1dd7228f2d"
    },
    {
      name: "Emma Thompson",
      title: "Sheep Farmer, Montana",
      content: "The breeding calendar has helped me optimize my breeding program. I've increased my lambing rate by 20% since using this system.",
      rating: 5,
      image: "photo-1494790108755-2616b68d9a99"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Farmers Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what farmers are saying about how our system has transformed their operations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/${testimonial.image}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80`}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
