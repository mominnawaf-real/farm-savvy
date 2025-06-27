import { Router } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(protect);

// Get current weather and forecast
router.get('/', (_req, res) => {
  // Mock weather data - in production, this would call a weather API
  const mockWeatherData = {
    success: true,
    current: {
      temperature: 72,
      condition: 'partly-cloudy',
      description: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 8,
      feelsLike: 70,
      precipitation: 0,
      icon: '☁️'
    },
    forecast: [
      {
        date: new Date().toISOString(),
        high: 75,
        low: 60,
        condition: 'partly-cloudy',
        description: 'Partly Cloudy',
        precipitationChance: 10,
        icon: '☁️'
      },
      {
        date: new Date(Date.now() + 86400000).toISOString(),
        high: 78,
        low: 62,
        condition: 'sunny',
        description: 'Sunny',
        precipitationChance: 0,
        icon: '☀️'
      },
      {
        date: new Date(Date.now() + 172800000).toISOString(),
        high: 73,
        low: 58,
        condition: 'rainy',
        description: 'Light Rain',
        precipitationChance: 60,
        icon: '🌧️'
      },
      {
        date: new Date(Date.now() + 259200000).toISOString(),
        high: 70,
        low: 55,
        condition: 'cloudy',
        description: 'Cloudy',
        precipitationChance: 20,
        icon: '☁️'
      },
      {
        date: new Date(Date.now() + 345600000).toISOString(),
        high: 74,
        low: 59,
        condition: 'partly-cloudy',
        description: 'Partly Cloudy',
        precipitationChance: 15,
        icon: '⛅'
      }
    ],
    location: 'Green Valley Farm',
    lastUpdated: new Date().toISOString()
  };

  res.json(mockWeatherData);
});

export default router;