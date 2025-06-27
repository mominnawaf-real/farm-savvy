
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Heart, 
  Pill, 
  Shield, 
  Baby, 
  Zap,
  Wheat,
  Wrench,
  CloudRain,
  DollarSign,
  TrendingUp,
  Bell
} from "lucide-react";
import { useState } from "react";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: "health" | "operational" | "financial";
  priority: "low" | "medium" | "high" | "critical";
  timestamp: string;
  read: boolean;
}

export const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      title: "Vaccination Overdue",
      description: "Cow #A234 is 5 days overdue for annual vaccination",
      type: "health",
      priority: "high",
      timestamp: "2 hours ago",
      read: false
    },
    {
      id: "2",
      title: "Feed Inventory Low",
      description: "Cattle feed supply below 20% threshold",
      type: "operational",
      priority: "medium",
      timestamp: "4 hours ago",
      read: false
    },
    {
      id: "3",
      title: "Payment Due Reminder",
      description: "Feed supplier invoice due in 3 days",
      type: "financial",
      priority: "medium",
      timestamp: "1 day ago",
      read: true
    },
    {
      id: "4",
      title: "Health Deterioration",
      description: "Sheep #S567 showing 15% weight loss over 2 weeks",
      type: "health",
      priority: "critical",
      timestamp: "30 minutes ago",
      read: false
    },
    {
      id: "5",
      title: "Weather Warning",
      description: "Severe storm expected tomorrow, secure livestock",
      type: "operational",
      priority: "high",
      timestamp: "1 hour ago",
      read: false
    }
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "health": return <Heart className="h-4 w-4" />;
      case "operational": return <Wrench className="h-4 w-4" />;
      case "financial": return <DollarSign className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 border-red-300 text-red-800";
      case "high": return "bg-orange-100 border-orange-300 text-orange-800";
      case "medium": return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "low": return "bg-blue-100 border-blue-300 text-blue-800";
      default: return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
        <Badge variant="destructive" className="text-sm">
          {unreadCount} Unread
        </Badge>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`p-3 rounded-lg border transition-colors ${
              alert.read 
                ? "bg-gray-50 border-gray-200" 
                : getPriorityColor(alert.priority)
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    alert.read ? "text-gray-600" : "text-gray-900"
                  }`}>
                    {alert.title}
                  </span>
                  <Badge variant="outline" className="text-xs ml-2">
                    {alert.type}
                  </Badge>
                </div>
                
                <p className={`text-sm ${
                  alert.read ? "text-gray-500" : "text-gray-700"
                }`}>
                  {alert.description}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{alert.timestamp}</span>
                  {!alert.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-6"
                      onClick={() => markAsRead(alert.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
