import { ToolDecorator as Tool, Widget, z, ExecutionContext, Injectable } from '@nitrostack/core';

/**
 * Weather Tools
 * 
 * Provides weather lookup functionality
 */
@Injectable()
export class WeatherTools {
  @Tool({
    name: 'weather.lookup',
    description: 'Look up current weather conditions for a location',
    inputSchema: z.object({
      location: z.string().describe('City name or location to look up weather for'),
    }),
    examples: {
      request: {
        location: 'San Francisco'
      },
      response: {
        location: 'San Francisco, CA',
        temperature: 72,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        feelsLike: 70,
        lastUpdated: '2024-01-15T14:30:00Z'
      }
    }
  })
  @Widget('weather-result')
  async lookup(input: { location: string }, context: ExecutionContext) {
    context.logger.info('Looking up weather', { location: input.location });

    // Mock weather data - in a real app, this would call a weather API
    const weatherData: Record<string, any> = {
      'san francisco': {
        location: 'San Francisco, CA',
        temperature: 72,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        feelsLike: 70,
        icon: '⛅'
      },
      'new york': {
        location: 'New York, NY',
        temperature: 45,
        condition: 'Rainy',
        humidity: 80,
        windSpeed: 18,
        feelsLike: 38,
        icon: '🌧️'
      },
      'london': {
        location: 'London, UK',
        temperature: 48,
        condition: 'Overcast',
        humidity: 75,
        windSpeed: 15,
        feelsLike: 44,
        icon: '☁️'
      },
      'tokyo': {
        location: 'Tokyo, Japan',
        temperature: 68,
        condition: 'Sunny',
        humidity: 55,
        windSpeed: 8,
        feelsLike: 68,
        icon: '☀️'
      },
      'sydney': {
        location: 'Sydney, Australia',
        temperature: 82,
        condition: 'Sunny',
        humidity: 45,
        windSpeed: 10,
        feelsLike: 84,
        icon: '☀️'
      }
    };

    const normalizedLocation = input.location.toLowerCase();
    const weather = weatherData[normalizedLocation] || {
      location: input.location,
      temperature: 70,
      condition: 'Clear',
      humidity: 60,
      windSpeed: 10,
      feelsLike: 70,
      icon: '🌤️'
    };

    return {
      ...weather,
      lastUpdated: new Date().toISOString()
    };
  }
}
