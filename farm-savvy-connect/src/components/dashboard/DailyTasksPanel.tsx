import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Clock, Loader2, AlertCircle, Plus } from "lucide-react";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { apiClient, Task } from "@/lib/api";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface DailyTasksPanelProps {
  farmId: string;
  onAddTask?: () => void;
}

export interface DailyTasksPanelRef {
  refresh: () => Promise<void>;
}

export const DailyTasksPanel = forwardRef<DailyTasksPanelRef, DailyTasksPanelProps>(({ farmId, onAddTask }, ref) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodayTasks();
  }, [farmId]);

  useImperativeHandle(ref, () => ({
    refresh: fetchTodayTasks
  }));

  const fetchTodayTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getTodayTasks(farmId);
      if (response.success) {
        setTasks(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    setCompletingTaskId(taskId);
    try {
      if (task.status === 'completed') {
        // Uncomplete the task
        const response = await apiClient.uncompleteTask(taskId);
        if (response.success) {
          // Update the task in the list
          setTasks(tasks.map(t => 
            t._id === taskId 
              ? { ...response.data }
              : t
          ));
          toast({
            title: "Task reopened",
            description: `"${task.title}" has been marked as pending`,
          });
        }
      } else {
        // Complete the task
        const response = await apiClient.completeTask(taskId);
        if (response.success) {
          // Update the task in the list
          setTasks(tasks.map(t => 
            t._id === taskId 
              ? { ...response.data }
              : t
          ));
          toast({
            title: "Task completed",
            description: `"${task.title}" has been marked as complete`,
          });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setCompletingTaskId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-600 border-red-200 bg-red-50";
      case "high": return "text-orange-600 border-orange-200 bg-orange-50";
      case "medium": return "text-yellow-600 border-yellow-200 bg-yellow-50";
      case "low": return "text-green-600 border-green-200 bg-green-50";
      default: return "text-gray-600 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      feeding: "🍽️",
      cleaning: "🧹",
      health: "🏥",
      maintenance: "🔧",
      harvest: "🌾",
      other: "📝"
    };
    return icons[category] || "📋";
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Tasks</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Tasks</h3>
        <div className="flex items-center justify-center py-8 text-gray-500">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      </Card>
    );
  }

  const completedCount = tasks.filter(task => task.status === 'completed').length;
  const totalCount = tasks.length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {completedCount}/{totalCount} Complete
          </Badge>
          {onAddTask && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAddTask}
              className="h-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No tasks scheduled for today</p>
          {onAddTask && (
            <Button 
              variant="outline" 
              onClick={onAddTask}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task._id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                task.status === 'completed'
                  ? "bg-green-50 border-green-200" 
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto hover:opacity-80"
                onClick={() => task._id && toggleTask(task._id)}
                disabled={completingTaskId === task._id}
                title={task.status === 'completed' ? 'Click to mark as pending' : 'Click to mark as complete'}
              >
                {completingTaskId === task._id ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                ) : task.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 cursor-pointer" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                )}
              </Button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="mr-1">{getCategoryIcon(task.category)}</span>
                  <span className={`text-sm font-medium ${
                    task.status === 'completed' ? "line-through text-gray-500" : "text-gray-900"
                  }`}>
                    {task.title}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </Badge>
                </div>
                
                <p className={`text-sm ${
                  task.status === 'completed' ? "line-through text-gray-400" : "text-gray-600"
                }`}>
                  {task.description}
                </p>
                
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Due: {format(new Date(task.dueDate), "h:mm a")}
                    </span>
                  </div>
                  {task.assignedTo.length > 0 && (
                    <span className="text-xs text-gray-500">
                      Assigned to: {task.assignedTo.map(u => u.name).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
});