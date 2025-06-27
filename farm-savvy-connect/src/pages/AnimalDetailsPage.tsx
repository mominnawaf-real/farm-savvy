import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient, Animal } from "@/lib/api";
import { 
  ArrowLeft, 
  Loader2, 
  Edit, 
  Trash2,
  Calendar,
  Weight,
  Heart,
  AlertCircle,
  Activity,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { EditAnimalSidebar } from "@/components/dashboard/EditAnimalSidebar";

const AnimalDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAnimalDetails();
    }
  }, [id]);

  const fetchAnimalDetails = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getAnimalById(id!);
      if (response.success && response.data) {
        setAnimal(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch animal details:', error);
      toast({
        title: "Error",
        description: "Failed to load animal details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!animal || !window.confirm('Are you sure you want to delete this animal?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiClient.deleteAnimal(animal._id!);
      toast({
        title: "Success",
        description: "Animal deleted successfully",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete animal:', error);
      toast({
        title: "Error",
        description: "Failed to delete animal",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
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

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'Unknown';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                       (today.getMonth() - birthDate.getMonth());
    
    if (ageInMonths < 12) {
      return `${ageInMonths} ${ageInMonths === 1 ? 'month' : 'months'}`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return `${years} ${years === 1 ? 'year' : 'years'}${months > 0 ? ` ${months} months` : ''}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card className="p-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Animal not found</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl">
                {getAnimalEmoji(animal.type)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{animal.name}</h1>
                <p className="text-gray-600 mt-1">Tag #{animal.tagNumber}</p>
                <div className="flex items-center gap-3 mt-2">
                  {getStatusBadge(animal.status)}
                  <span className="text-sm text-gray-500">
                    {animal.type.charAt(0).toUpperCase() + animal.type.slice(1)} • {animal.breed}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                className="text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health Records</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Basic Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-gray-900 font-medium capitalize">{animal.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="text-gray-900 font-medium flex items-center gap-1">
                    <Weight className="h-4 w-4" />
                    {animal.weight} lbs
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-gray-900 font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {calculateAge(animal.dateOfBirth)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="text-gray-900 font-medium">
                    {animal.dateOfBirth ? format(new Date(animal.dateOfBirth), 'MMM dd, yyyy') : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(animal.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900 font-medium">{animal.location || 'Farm'}</p>
                </div>
              </div>
            </Card>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Health Status</p>
                    <p className="text-2xl font-bold text-gray-900 capitalize">{animal.status}</p>
                  </div>
                  <Heart className={`h-8 w-8 ${
                    animal.status === 'healthy' ? 'text-green-500' : 
                    animal.status === 'sick' ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Weight Trend</p>
                    <p className="text-2xl font-bold text-gray-900">{animal.weight} lbs</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Last Checkup</p>
                    <p className="text-2xl font-bold text-gray-900">N/A</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-500" />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Records</h3>
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No health records found</p>
                <Button variant="outline">
                  Add Health Record
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              {animal.notes ? (
                <p className="text-gray-700 whitespace-pre-wrap">{animal.notes}</p>
              ) : (
                <p className="text-gray-500 italic">No notes available</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Animal Sidebar */}
      <EditAnimalSidebar 
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        animal={animal}
        onSuccess={() => {
          fetchAnimalDetails();
          setIsEditOpen(false);
        }}
      />
    </div>
  );
};

export default AnimalDetailsPage;