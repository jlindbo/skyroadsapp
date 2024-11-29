import { Geolocation } from '@nativescript/geolocation';
import { CoreTypes } from '@nativescript/core';

export class LocationService {
  private watchId: number;

  async requestPermissions(): Promise<boolean> {
    const hasPermission = await Geolocation.hasPermissions();
    if (!hasPermission) {
      return await Geolocation.requestPermissions();
    }
    return true;
  }

  startLocationWatch(callback: (location: any) => void): void {
    this.watchId = Geolocation.watchLocation(
      (location) => {
        callback({
          latitude: location.latitude,
          longitude: location.longitude,
          speed: location.speed
        });
      },
      (error) => {
        console.error('Location error:', error);
      },
      {
        desiredAccuracy: CoreTypes.Accuracy.high,
        updateDistance: 1,
        minimumUpdateTime: 100
      }
    );
  }

  stopLocationWatch(): void {
    if (this.watchId) {
      Geolocation.clearWatch(this.watchId);
    }
  }
}