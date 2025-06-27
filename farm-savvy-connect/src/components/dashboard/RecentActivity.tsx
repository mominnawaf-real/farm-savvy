import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import { apiClient, Activity } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  farmId: string;
}

export const RecentActivity = ({ farmId }: RecentActivityProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, [farmId]);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getRecentActivities(farmId, 5);
      if (response.success) {
        setActivities(response.activities);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activities");
      console.error("Error fetching activities:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    const iconMap = {
      animal_added: { emoji: "🐄", color: "bg-green-500" },
      animal_updated: { emoji: "✏️", color: "bg-blue-500" },
      task_completed: { emoji: "✅", color: "bg-green-500" },
      health_check: { emoji: "🏥", color: "bg-red-500" },
      weight_recorded: { emoji: "⚖️", color: "bg-yellow-500" },
      farm_created: { emoji: "🌾", color: "bg-green-500" },
      user_joined: { emoji: "👤", color: "bg-purple-500" }
    };
    return iconMap[type] || { emoji: "📋", color: "bg-gray-500" };
  };

  const getActivityBadge = (type: Activity['type']) => {
    const badgeMap = {
      animal_added: { text: "New", variant: "default" as const },
      animal_updated: { text: "Update", variant: "secondary" as const },
      task_completed: { text: "Done", variant: "default" as const },
      health_check: { text: "Health", variant: "destructive" as const },
      weight_recorded: { text: "Weight", variant: "secondary" as const },
      farm_created: { text: "New", variant: "default" as const },
      user_joined: { text: "User", variant: "outline" as const }
    };
    return badgeMap[type] || { text: "Activity", variant: "secondary" as const };
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center py-8 text-gray-500">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No recent activity</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => {
          const icon = getActivityIcon(activity.type);
          const badge = getActivityBadge(activity.type);
          
          return (
            <div key={activity._id} className="flex items-start gap-3">
              <div className={`w-2 h-2 ${icon.color} rounded-full mt-2`}></div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </p>
                      {activity.user && (
                        <span className="text-xs text-gray-500">
                          by {activity.user.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={badge.variant} className="text-xs">
                    {badge.text}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};