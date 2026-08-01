import { Module } from '@nitrostack/core';
import { WeatherTools } from './weather.tools.js';
import { WeatherResources } from './weather.resources.js';
import { WeatherPrompts } from './weather.prompts.js';

@Module({
  name: 'weather',
  description: 'TODO: Add description',
  controllers: [WeatherTools, WeatherResources, WeatherPrompts],
})
export class WeatherModule {}
