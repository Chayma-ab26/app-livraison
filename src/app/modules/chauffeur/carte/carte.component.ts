import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css'],
  standalone:false
})
export class CarteComponent implements OnInit, OnDestroy {
  private map!: L.Map;
  private startMarker!: L.Marker;
  private endMarker!: L.Marker;
  private routeLayer!: L.Polyline;
  private destroy$ = new Subject<void>();

  // Configuration
  private readonly DEFAULT_ZOOM = 13;
  private readonly TUNISIA_CENTER: L.LatLngExpression = [34.0, 9.0];
  private readonly DEFAULT_POSITION: L.LatLngExpression = [36.8, 10.18]; // Tunis

  // État de l'application
  public destinationInput = '';
  public isLoading = false;
  public errorMessage: string | null = null;
  public routeInfo: {
    distance: string;
    duration: string;
    steps: string[];
  } | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initMap();
    this.locateDriver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView(this.TUNISIA_CENTER, 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  private clearMap(): void {
    if (this.routeLayer) this.map.removeLayer(this.routeLayer);
    if (this.startMarker) this.map.removeLayer(this.startMarker);
    if (this.endMarker) this.map.removeLayer(this.endMarker);
  }

  public locateDriver(): void {
    this.isLoading = true;
    this.errorMessage = null;

    if (!navigator.geolocation) {
      this.handlePositionError();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => this.handlePositionSuccess(position),
      error => this.handlePositionError(error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  private handlePositionSuccess(position: GeolocationPosition): void {
    const driverPosition: L.LatLngExpression = [
      position.coords.latitude,
      position.coords.longitude
    ];

    this.setStartMarker(driverPosition, 'Votre position');
    this.map.setView(driverPosition, this.DEFAULT_ZOOM);
    this.isLoading = false;
  }

  private handlePositionError(error?: GeolocationPositionError): void {
    console.error('Erreur GPS:', error);
    this.setStartMarker(this.DEFAULT_POSITION, 'Position par défaut (Tunis)');
    this.map.setView(this.DEFAULT_POSITION, this.DEFAULT_ZOOM);
    this.isLoading = false;
    this.errorMessage = error?.code === error?.PERMISSION_DENIED
      ? 'Vous devez autoriser la géolocalisation'
      : 'Impossible de déterminer votre position';
  }

  private setStartMarker(position: L.LatLngExpression, popupText: string): void {
    if (this.startMarker) this.map.removeLayer(this.startMarker);

    this.startMarker = L.marker(position, {
      icon: this.createIcon('blue')
    })
      .addTo(this.map)
      .bindPopup(popupText)
      .openPopup();
  }

  public async setDestination(): Promise<void> {
    if (!this.destinationInput.trim()) return;

    try {
      this.isLoading = true;
      const destination = await this.geocodeAddress(this.destinationInput);
      this.setEndMarker(destination, this.destinationInput);
      await this.calculateRoute();
    } catch (error) {
      this.errorMessage = 'Adresse introuvable';
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  private async geocodeAddress(address: string): Promise<L.LatLngExpression> {
    const headers = new HttpHeaders({
      'Authorization': '5b3ce3597851110001cf624859fc5e8cac3b41bf92c67ee3e26a10da'
    });

    const response: any = await firstValueFrom(
      this.http.get('https://api.openrouteservice.org/geocode/search', {
        headers,
        params: { text: `${address}, Tunisie`, size: '1' }
      }).pipe(takeUntil(this.destroy$))
    );

    if (!response?.features?.length) {
      throw new Error('Adresse non trouvée');
    }

    return [
      response.features[0].geometry.coordinates[1],
      response.features[0].geometry.coordinates[0]
    ];
  }

  private setEndMarker(position: L.LatLngExpression, popupText: string): void {
    if (this.endMarker) this.map.removeLayer(this.endMarker);

    this.endMarker = L.marker(position, {
      icon: this.createIcon('red')
    })
      .addTo(this.map)
      .bindPopup(`Destination: ${popupText}`)
      .openPopup();
  }

  private async calculateRoute(): Promise<void> {
    if (!this.startMarker || !this.endMarker) return;

    try {
      this.isLoading = true;
      const start = this.startMarker.getLatLng();
      const end = this.endMarker.getLatLng();

      const route = await this.getRouteData(
        [start.lng, start.lat],
        [end.lng, end.lat]
      );

      this.displayRoute(route.coordinates);
      this.displayRouteInfo(route);
    } catch (error) {
      this.errorMessage = 'Erreur de calcul d\'itinéraire';
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  private async getRouteData(start: [number, number], end: [number, number]): Promise<{
    coordinates: L.LatLngExpression[];
    distance: number;
    duration: number;
    steps: string[];
  }> {
    const headers = new HttpHeaders({
      'Authorization': '5b3ce3597851110001cf624859fc5e8cac3b41bf92c67ee3e26a10da',
      'Content-Type': 'application/json'
    });

    const response: any = await firstValueFrom(
      this.http.post('https://api.openrouteservice.org/v2/directions/driving-car', {
        coordinates: [start, end],
        instructions: true
      }, { headers }).pipe(takeUntil(this.destroy$))
    );

    return {
      coordinates: response.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]),
      distance: response.routes[0].summary.distance,
      duration: response.routes[0].summary.duration,
      steps: response.routes[0].segments[0].steps.map((step: any) => step.instruction)
    };
  }

  private displayRoute(coordinates: L.LatLngExpression[]): void {
    if (this.routeLayer) this.map.removeLayer(this.routeLayer);

    this.routeLayer = L.polyline(coordinates, {
      color: '#3388ff',
      weight: 5
    }).addTo(this.map);

    this.map.fitBounds(this.routeLayer.getBounds());
  }

  private displayRouteInfo(route: {
    distance: number;
    duration: number;
    steps: string[];
  }): void {
    this.routeInfo = {
      distance: `${(route.distance / 1000).toFixed(1)} km`,
      duration: `${Math.round(route.duration / 60)} minutes`,
      steps: route.steps
    };
  }

  private createIcon(color: 'blue' | 'red'): L.Icon {
    return L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
  }

  public clearRoute(): void {
    if (this.routeLayer) this.map.removeLayer(this.routeLayer);
    if (this.endMarker) this.map.removeLayer(this.endMarker);
    this.routeInfo = null;
    this.destinationInput = '';
  }
}
