
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  ResponsiveContainer
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart, 
  DollarSign, 
  Scale,
  Activity
} from "lucide-react";

const weightData = [
  { month: 'Jan', weight: 450 },
  { month: 'Feb', weight: 465 },
  { month: 'Mar', weight: 480 },
  { month: 'Apr', weight: 495 },
  { month: 'May', weight: 510 },
  { month: 'Jun', weight: 525 }
];

const healthStatusData = [
  { name: 'Healthy', value: 85, color: '#10b981' },
  { name: 'Sick', value: 8, color: '#ef4444' },
  { name: 'Recovering', value: 5, color: '#f59e0b' },
  { name: 'Critical', value: 2, color: '#dc2626' }
];

const revenueData = [
  { month: 'Jan', revenue: 15000, expenses: 12000 },
  { month: 'Feb', revenue: 18000, expenses: 13500 },
  { month: 'Mar', revenue: 22000, expenses: 14000 },
  { month: 'Apr', revenue: 19000, expenses: 13800 },
  { month: 'May', revenue: 25000, expenses: 15000 },
  { month: 'Jun', revenue: 28000, expenses: 16000 }
];

const chartConfig = {
  weight: {
    label: "Average Weight (lbs)",
    color: "#3b82f6",
  },
  revenue: {
    label: "Revenue ($)",
    color: "#10b981",
  },
  expenses: {
    label: "Expenses ($)",
    color: "#ef4444",
  }
};

export const AnalyticsWidgets = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Farm Performance Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Performance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Total Animals</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">247</div>
              <div className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.2%
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Health Rate</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">98%</div>
              <div className="text-xs text-green-600">Excellent</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-600">Avg Weight</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">525 lbs</div>
              <div className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.1%
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-gray-600">Mortality Rate</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">0.8%</div>
              <div className="text-xs text-green-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -0.3%
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Weight Progress Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress Trends</h3>
        <ChartContainer config={chartConfig} className="h-48">
          <LineChart data={weightData}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="var(--color-weight)" 
              strokeWidth={2}
              dot={{ fill: "var(--color-weight)" }}
            />
          </LineChart>
        </ChartContainer>
      </Card>

      {/* Health Status Pie Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Status Breakdown</h3>
        <ChartContainer config={chartConfig} className="h-48">
          <PieChart>
            <Pie
              data={healthStatusData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              dataKey="value"
            >
              {healthStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {healthStatusData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-600">{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Financial Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Performance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly Revenue</span>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">$28,000</div>
              <div className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly Expenses</span>
            <div className="text-right">
              <div className="text-lg font-bold text-red-600">$16,000</div>
              <div className="text-xs text-red-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +6.7%
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm font-medium text-gray-900">Net Profit</span>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">$12,000</div>
              <div className="text-xs text-green-600">42.9% margin</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Cost Per Animal</span>
            <div className="text-lg font-bold text-gray-900">$65</div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Revenue Per Animal</span>
            <div className="text-lg font-bold text-gray-900">$113</div>
          </div>
        </div>
      </Card>

      {/* Revenue vs Expenses Chart */}
      <Card className="p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
        <ChartContainer config={chartConfig} className="h-64">
          <BarChart data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" />
            <Bar dataKey="expenses" fill="var(--color-expenses)" />
          </BarChart>
        </ChartContainer>
      </Card>

      {/* Breeding & Health Analytics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Breeding & Health</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Vaccination Rate</span>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">94%</div>
              <Badge variant="outline" className="text-xs">Good</Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Breeding Success</span>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">87%</div>
              <Badge variant="outline" className="text-xs text-green-600">Excellent</Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Treatment Success</span>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">96%</div>
              <Badge variant="outline" className="text-xs text-green-600">Excellent</Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Birth Rate (YTD)</span>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">23%</div>
              <div className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.1%
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
