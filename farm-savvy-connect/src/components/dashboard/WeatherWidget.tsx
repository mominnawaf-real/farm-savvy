
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: 72,
    condition: "Partly Cloudy",
    humidity: 65,
    precipitation: 0
  });

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Weather</h3>
        <Badge variant="outline" className="text-xs">Live</Badge>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">{weather.temperature}°F</span>
          <span className="text-sm text-gray-600">{weather.condition}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Humidity: {weather.humidity}%</span>
          <span>Rain: {weather.precipitation}"</span>
        </div>
      </div>
    </Card>
  );
};
