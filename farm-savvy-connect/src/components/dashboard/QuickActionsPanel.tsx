
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  QrCode, 
  AlertTriangle, 
  CheckCircle
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface QuickActionsPanelProps {
  onAddAnimal?: () => void;
}

export const QuickActionsPanel = ({ onAddAnimal }: QuickActionsPanelProps) => {
  const handleAddAnimal = () => {
    if (onAddAnimal) {
      onAddAnimal();
    } else {
      toast.success("Opening animal registration form...");
      console.log("Add Animal clicked");
    }
  };

  const handleScanQR = () => {
    toast.success("Camera activated for QR scanning");
    console.log("Scan QR clicked");
  };

  const handleEmergency = () => {
    toast.error("Emergency alert activated!");
    console.log("Emergency clicked");
  };

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          className="bg-green-600 hover:bg-green-700 h-16 flex flex-col"
          onClick={handleAddAnimal}
        >
          <Plus className="h-6 w-6 mb-1" />
          <span className="text-sm">Add Animal</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-16 flex flex-col"
          onClick={handleScanQR}
        >
          <QrCode className="h-6 w-6 mb-1" />
          <span className="text-sm">Scan QR</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-16 flex flex-col bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
          onClick={handleEmergency}
        >
          <AlertTriangle className="h-6 w-6 mb-1" />
          <span className="text-sm">Emergency</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-16 flex flex-col"
          onClick={() => toast.info("Weather alerts feature coming soon")}
        >
          <CheckCircle className="h-6 w-6 mb-1" />
          <span className="text-sm">Mark Task Done</span>
        </Button>
      </div>
    </Card>
  );
};
