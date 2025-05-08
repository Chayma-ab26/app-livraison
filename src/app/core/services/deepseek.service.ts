import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({ providedIn: 'root' })
export class DeepseekService {
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly apiKey = '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';
  private readonly weatherApiKey = '8326ff3ae9810d407f1b2d3147999189';
  private readonly routeApiKey = '5b3ce3597851110001cf62485394a7df23dd47d6911c10db19e46212';

  // 🔁 Chatbot IA
  async askBot(message: string): Promise<string> {
    // 🔍 Analyse manuelle de la question (météo)
    const weatherMatch = message.match(/m[ée]t[ée]o.*\b(?:à|a|au|en)\b\s*([\w\s]+)/i);
    if (weatherMatch) {
      const city = weatherMatch[1].trim();
      try {
        const weather = await this.getWeather(city);
        return `🌤️ À ${city}, il fait ${weather.main.temp}°C avec ${weather.weather[0].description}.`;
      } catch (error) {
        return '❌ Erreur lors de la récupération des données météo.';
      }
    }

    // 🔍 Analyse manuelle de la question (trajet)
    const distanceMatch = message.match(/distance.*entre\s+(.+?)\s+et\s+(.+?)$/i);
    if (distanceMatch) {
      const from = distanceMatch[1].trim();
      const to = distanceMatch[2].trim();
      try {
        const route = await this.getRoute(from, to);
        const distance = (route.features[0].properties.summary.distance / 1000).toFixed(1);
        const duration = (route.features[0].properties.summary.duration / 60).toFixed(0);
        return `🛣️ La distance entre ${from} et ${to} est d’environ ${distance} km et le trajet dure ${duration} minutes.`;
      } catch (error) {
        return '❌ Erreur lors de la récupération des données de trajet.';
      }
    }

    // Sinon, envoyer à l'IA
    const payload = {
      model: 'deepseek/deepseek-chat:free',
      messages: [
        {
          role: 'system',
          content: `
Tu es un assistant routier intelligent conçu pour aider les chauffeurs-livreurs professionnels.

Ton rôle est de :
1. 🧭 Fournir des itinéraires optimaux entre deux villes ou adresses précises.
2. ⏱️ Estimer le temps de trajet en heures et minutes.
3. 📏 Donner la distance en kilomètres entre deux lieux.
4. 🌤️ Répondre à des questions sur la météo actuelle ou prévue dans une ville.
5. 🚦 Informer sur le trafic à une heure donnée ou proposer des itinéraires alternatifs.
6. 🅿️ Suggérer des zones de stationnement, restrictions de circulation ou heures d'accès.
7. ❌ Refuser poliment les questions qui ne sont pas liées à la route ou à la logistique.

Exemples :
- "Quel est le trajet le plus court entre Gafsa et Tozeur ?"
- "Combien de kilomètres entre Hammamet et Bizerte ?"
- "Y a-t-il du trafic vers Tunis à 18h ?"
- "Météo à Sousse aujourd’hui ?"
- "Je livre à Tunis centre, où me garer ?"
`
        },
        {
          role: 'user',
          content: message
        }
      ]
    };

    try {
      const response = await axios.post(this.apiUrl, payload, {
        headers: this.getOpenRouterHeaders()
      });
      return response.data?.choices?.[0]?.message?.content || 'Aucune réponse.';
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  // ✅ MÉTÉO (OpenWeatherMap)
  async getWeather(city: string): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${this.weatherApiKey}&units=metric&lang=fr`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des données météo.');
    }
  }

  // ✅ TRAJET (OpenRouteService)
  async getRoute(from: string, to: string): Promise<any> {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
    try {
      const geocode = async (place: string) => {
        const geo = await axios.get(`https://api.openrouteservice.org/geocode/search?api_key=${this.routeApiKey}&text=${encodeURIComponent(place)}`);
        if (!geo.data.features.length) {
          throw new Error(`Lieu non trouvé : ${place}`);
        }
        return geo.data.features[0].geometry.coordinates;
      };

      const [fromCoords, toCoords] = await Promise.all([geocode(from), geocode(to)]);

      const response = await axios.post(url, {
        coordinates: [fromCoords, toCoords]
      }, {
        headers: {
          Authorization: this.routeApiKey,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des données de trajet.');
    }
  }

  // 🔐 En-têtes IA
  private getOpenRouterHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'HTTP-Referer': 'http://localhost:4200',
      'X-Title': 'Assistant Routier',
      'Content-Type': 'application/json'
    };
  }

  // 🔴 Erreurs
  private handleApiError(error: unknown): string {
    const axiosError = error as AxiosError;
    console.error('Erreur API:', {
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      message: axiosError.message
    });
    return '❌ Erreur lors de la récupération des données.';
  }
}
