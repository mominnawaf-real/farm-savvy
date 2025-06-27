import { useState, useEffect, useRef } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DailyTasksPanel, DailyTasksPanelRef } from "@/components/dashboard/DailyTasksPanel";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { AnimalOverview } from "@/components/dashboard/AnimalOverview";
import { AddAnimalSidebar } from "@/components/dashboard/AddAnimalSidebar";
import { AddTaskSidebar } from "@/components/dashboard/AddTaskSidebar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { 
  Users, 
  Heart, 
  TrendingUp, 
  Calendar,
  Loader2} from "lucide-react";

const Dashboard = () => {
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [animalStats, setAnimalStats] = useState({
    total: 0,
    healthRate: 0,
    isLoading: true
  });
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    isLoading: true
  });
  const [animalRefreshTrigger, setAnimalRefreshTrigger] = useState(0);
  const farmId = "685ec0974bb3eb74e28f4a0b"; // TODO: Get from user context
  const dailyTasksRef = useRef<DailyTasksPanelRef>(null);

  useEffect(() => {
    fetchAnimalStats();
    fetchTaskStats();
  }, []);

  const fetchAnimalStats = async () => {
    try {
      const response = await apiClient.getAnimalStats(farmId);
      if (response.success && response.stats) {
        setAnimalStats({
          total: response.stats.total,
          healthRate: response.stats.healthRate,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Failed to fetch animal stats:', error);
      setAnimalStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  const fetchTaskStats = async () => {
    try {
      const response = await apiClient.getTaskStats(farmId);
      if (response.success && response.stats) {
        setTaskStats({
          total: response.stats.today.total,
          completed: response.stats.today.completed,
          pending: response.stats.today.pending,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Failed to fetch task stats:', error);
      setTaskStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleAddAnimalSuccess = () => {
    fetchAnimalStats(); // Refresh stats
    setAnimalRefreshTrigger(prev => prev + 1); // Trigger AnimalOverview refresh
    console.log("Animal added successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Animals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {animalStats.isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    animalStats.total
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {!animalStats.isLoading && (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">
                    {animalStats.total === 0 ? 'No animals yet' : `${animalStats.total} animals registered`}
                  </span>
                </>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {animalStats.isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    `${animalStats.healthRate}%`
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`${
                animalStats.healthRate >= 90 ? 'text-green-600' : 
                animalStats.healthRate >= 70 ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {animalStats.healthRate >= 90 ? 'Excellent' : 
                 animalStats.healthRate >= 70 ? 'Good' : 
                 'Needs attention'} health status
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {taskStats.isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    taskStats.total
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {!taskStats.isLoading && (
                <span className="text-gray-600">
                  {taskStats.completed} completed, {taskStats.pending} pending
                </span>
              )}
            </div>
          </Card>
        </div>

        {/* Animal Overview */}
        <div className="mb-8">
          <AnimalOverview 
            onRefresh={() => animalRefreshTrigger} 
            onAddAnimal={() => setIsAddAnimalOpen(true)}
          />
        </div>

        {/* Tasks and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DailyTasksPanel
            ref={dailyTasksRef}
            farmId={farmId}
            onAddTask={() => setIsAddTaskOpen(true)}
          />
          <RecentActivity farmId={farmId} />
        </div>

        {/* Alerts Panel */}
        <div className="mt-8">
          <AlertsPanel />
        </div>

      </main>

      {/* Add Animal Sidebar */}
      <AddAnimalSidebar 
        open={isAddAnimalOpen}
        onOpenChange={setIsAddAnimalOpen}
        onSuccess={() => {
          handleAddAnimalSuccess();
          fetchAnimalStats(); // Refetch stats after adding animal
        }}
      />

      {/* Add Task Sidebar */}
      <AddTaskSidebar
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onSuccess={async () => {
          console.log("Task added successfully");
          // Refresh the tasks panel and stats
          if (dailyTasksRef.current) {
            await dailyTasksRef.current.refresh();
          }
          fetchTaskStats();
        }}
      />
    </div>
  );
};

export default Dashboard;
