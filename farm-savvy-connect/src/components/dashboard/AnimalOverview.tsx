
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Clock, 
  Filter,
  AlertTriangle,
  Eye,
  MapPin,
  Loader2,
  Plus,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api";

interface AnimalSummary {
  category: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

interface RecentAnimal {
  id: string;
  tagId: string;
  name: string;
  species: string;
  status: string;
  location: string;
  lastViewed?: string;
  favorite?: boolean;
  needsAttention?: boolean;
}

interface AnimalOverviewProps {
  onRefresh?: () => void;
  onAddAnimal?: () => void;
}

export const AnimalOverview: React.FC<AnimalOverviewProps> = ({ onRefresh, onAddAnimal }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [animalStats, setAnimalStats] = useState<{
    total: number;
    byType: Record<string, number>;
    healthy: number;
    sick: number;
    quarantine: number;
    healthRate: number;
  } | null>(null);
  const [animals, setAnimals] = useState<any[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<any[]>([]);
  const farmId = "685ec0974bb3eb74e28f4a0b"; // TODO: Get from user context

  useEffect(() => {
    fetchAnimalStats();
    fetchAnimals();
  }, []);

  useEffect(() => {
    if (onRefresh) {
      fetchAnimalStats();
      fetchAnimals();
    }
  }, [onRefresh]);

  useEffect(() => {
    filterAnimals();
  }, [animals, searchTerm]);

  const fetchAnimalStats = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getAnimalStats(farmId);
      if (response.success && response.stats) {
        setAnimalStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to fetch animal stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnimals = async () => {
    try {
      const response = await apiClient.getAnimals(farmId);
      if (response.success && response.data) {
        setAnimals(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch animals:', error);
    }
  };

  const filterAnimals = () => {
    if (!searchTerm.trim()) {
      setFilteredAnimals(animals.slice(0, 4)); // Show latest 4 when no search
      return;
    }

    const filtered = animals.filter(animal => 
      animal.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredAnimals(filtered.slice(0, 4)); // Show max 4 results
  };


  const animalSummary: AnimalSummary[] = [
    {
      category: "Cattle",
      count: animalStats?.byType?.cattle || 0,
      icon: <span className="text-2xl">🐄</span>,
      color: "bg-blue-100 text-blue-700"
    },
    {
      category: "Sheep",
      count: animalStats?.byType?.sheep || 0,
      icon: <span className="text-2xl">🐑</span>,
      color: "bg-green-100 text-green-700"
    },
    {
      category: "Goat",
      count: animalStats?.byType?.goat || 0,
      icon: <span className="text-2xl">🐐</span>,
      color: "bg-purple-100 text-purple-700"
    },
    {
      category: "Pig",
      count: animalStats?.byType?.pig || 0,
      icon: <span className="text-2xl">🐖</span>,
      color: "bg-pink-100 text-pink-700"
    },
    {
      category: "Chicken",
      count: animalStats?.byType?.chicken || 0,
      icon: <span className="text-2xl">🐔</span>,
      color: "bg-yellow-100 text-yellow-700"
    }
  ];

  const statusSummary = [
    { status: "Healthy", count: animalStats?.healthy || 0, color: "text-green-600" },
    { status: "Sick", count: animalStats?.sick || 0, color: "text-red-600" },
    { status: "Quarantine", count: animalStats?.quarantine || 0, color: "text-yellow-600" },
    { status: "Total", count: animalStats?.total || 0, color: "text-gray-700" }
  ];

  const recentAnimals: RecentAnimal[] = filteredAnimals.map(animal => ({
    id: animal._id,
    tagId: animal.tagNumber,
    name: animal.name,
    species: animal.type.charAt(0).toUpperCase() + animal.type.slice(1),
    status: animal.status.charAt(0).toUpperCase() + animal.status.slice(1),
    location: animal.location || "Farm",
    needsAttention: animal.status === 'sick' || animal.status === 'quarantine'
  }));


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy": return "text-green-600";
      case "sick": return "text-red-600";
      case "recovering": return "text-yellow-600";
      case "critical": return "text-red-700";
      case "needs attention": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Animal Status Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Animal Overview</h3>
          {onAddAnimal && (
            <Button 
              onClick={onAddAnimal}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Animal
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {/* Species Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {animalSummary.map((item) => (
                <div 
                  key={item.category} 
                  className="text-center p-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/animals/${item.category.toLowerCase()}`)}
                >
                  <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center mx-auto mb-2`}>
                    {item.icon}
                  </div>
                  <div className="text-lg font-bold text-gray-900">{item.count}</div>
                  <div className="text-sm text-gray-600">{item.category}</div>
                </div>
              ))}
            </div>

            {/* Health Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              {statusSummary.map((item) => (
                <div key={item.status} className="text-center">
                  <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
                  <div className="text-sm text-gray-600">{item.status}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Quick Animal Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Animal Access</h3>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by tag, name, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Recent Animals */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {searchTerm ? 'Search Results' : 'Recent Animals'}
            </h4>
            {recentAnimals.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                {searchTerm ? 'No animals found' : 'No animals added yet'}
              </p>
            ) : (
              recentAnimals.map((animal) => (
              <div key={animal.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">
                      {animal.species === "Cattle" ? "🐄" : 
                       animal.species === "Sheep" ? "🐑" :
                       animal.species === "Goat" ? "🐐" :
                       animal.species === "Pig" ? "🐖" : 
                       animal.species === "Chicken" ? "🐔" : "🐑"}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {animal.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{animal.tagId}
                      </span>
                      {animal.favorite && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                      {animal.needsAttention && (
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className={getStatusColor(animal.status)}>
                        {animal.status}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {animal.location}
                      </span>
                      {animal.lastViewed && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {animal.lastViewed}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/animal/${animal.id}`)}
                  title="View details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Analytics 📊</h3>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Growth Rate</p>
                  <p className="text-lg font-bold text-gray-900">+12.5%</p>
                  <p className="text-xs text-green-600">vs last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Health Score</p>
                  <p className="text-lg font-bold text-gray-900">{animalStats?.healthRate || 0}%</p>
                  <p className="text-xs text-blue-600">Excellent</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Monthly Trends</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New Animals</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">+8</span>
                  <span className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3" />
                    23%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Health Incidents</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">3</span>
                  <span className="text-xs text-red-600 flex items-center">
                    <TrendingDown className="h-3 w-3" />
                    -40%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Feed Efficiency</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">2.1:1</span>
                  <span className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3" />
                    5%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance by Type */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Performance by Type</h4>
            <div className="space-y-2">
              {Object.entries(animalStats?.byType || {}).slice(0, 3).map(([type, count]) => {
                const total = animalStats?.total || 1;
                const percentage = Math.round((count / total) * 100);
                
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize text-gray-600">{type}</span>
                      <span className="font-medium">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Cost Analysis</h4>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Avg. Cost/Animal</p>
                <p className="font-semibold text-gray-900">$125.50</p>
              </div>
              <div>
                <p className="text-gray-500">Monthly Feed Cost</p>
                <p className="font-semibold text-gray-900">$3,240</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
