import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { apiClient, Animal } from "@/lib/api";
import { 
  Search, 
  ArrowLeft, 
  Loader2, 
  Download,
  Plus,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { AddAnimalSidebar } from "@/components/dashboard/AddAnimalSidebar";

const AnimalsListPage = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState(false);
  const farmId = "685ec0974bb3eb74e28f4a0b"; // TODO: Get from user context

  useEffect(() => {
    fetchAnimals();
  }, [type]);

  useEffect(() => {
    filterAnimals();
  }, [animals, searchTerm, statusFilter]);

  const fetchAnimals = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getAnimals(farmId);
      if (response.success && response.data) {
        const typeAnimals = type === 'all' 
          ? response.data 
          : response.data.filter(animal => animal.type === type);
        setAnimals(typeAnimals);
      }
    } catch (error) {
      console.error('Failed to fetch animals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAnimals = () => {
    let filtered = [...animals];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(animal => 
        animal.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(animal => animal.status === statusFilter);
    }

    setFilteredAnimals(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      healthy: "bg-green-100 text-green-700",
      sick: "bg-red-100 text-red-700",
      quarantine: "bg-yellow-100 text-yellow-700",
      sold: "bg-gray-100 text-gray-700",
      deceased: "bg-gray-100 text-gray-700"
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-700"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getAnimalEmoji = (animalType: string) => {
    const emojis: Record<string, string> = {
      cattle: "🐄",
      sheep: "🐑",
      goat: "🐐",
      pig: "🐖",
      chicken: "🐔",
      other: "🐑"
    };
    return emojis[animalType] || "🐑";
  };

  const getTypeTitle = () => {
    if (type === 'all') return 'All Animals';
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Animals';
  };

  const exportToCSV = () => {
    const headers = ['Tag Number', 'Name', 'Type', 'Breed', 'Gender', 'Weight', 'Status', 'Date of Birth'];
    const rows = filteredAnimals.map(animal => [
      animal.tagNumber,
      animal.name,
      animal.type,
      animal.breed,
      animal.gender,
      animal.weight.toString(),
      animal.status,
      animal.dateOfBirth ? format(new Date(animal.dateOfBirth), 'yyyy-MM-dd') : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_animals_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getAnimalEmoji(type || 'sheep')}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{getTypeTitle()}</h1>
                <p className="text-gray-600 mt-1">
                  {isLoading ? '...' : `${filteredAnimals.length} animals`}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsAddAnimalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Animal
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by tag, name, or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select 
                className="px-4 py-2 border rounded-lg text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="healthy">Healthy</option>
                <option value="sick">Sick</option>
                <option value="quarantine">Quarantine</option>
                <option value="sold">Sold</option>
                <option value="deceased">Deceased</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredAnimals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No animals found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Weight (lbs)</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnimals.map((animal) => {
                    const age = animal.dateOfBirth 
                      ? Math.floor((new Date().getTime() - new Date(animal.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                      : null;
                    
                    return (
                      <TableRow key={animal._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{animal.tagNumber}</TableCell>
                        <TableCell>{animal.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{getAnimalEmoji(animal.type)}</span>
                            <span className="capitalize">{animal.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{animal.breed}</TableCell>
                        <TableCell className="capitalize">{animal.gender}</TableCell>
                        <TableCell>{animal.weight}</TableCell>
                        <TableCell>
                          {age !== null ? `${age} ${age === 1 ? 'year' : 'years'}` : '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(animal.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/animal/${animal._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>

      {/* Add Animal Sidebar */}
      <AddAnimalSidebar 
        open={isAddAnimalOpen}
        onOpenChange={setIsAddAnimalOpen}
        onSuccess={() => {
          fetchAnimals(); // Refresh the list
          setIsAddAnimalOpen(false);
        }}
      />
    </div>
  );
};

export default AnimalsListPage;