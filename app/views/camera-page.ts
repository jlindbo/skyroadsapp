import { EventData, Page, Observable } from '@nativescript/core';
import { LocationService } from '../services/location.service';
import { CameraService } from '../services/camera.service';
import { GoogleMaps } from '@nativescript/google-maps';

export class CameraViewModel extends Observable {
  private locationService: LocationService;
  private cameraService: CameraService;
  private map: GoogleMaps;
  private isRecording = false;
  private recordingInterval: any;
  private lastLocation: any;

  constructor() {
    super();
    this.locationService = new LocationService();
    this.cameraService = new CameraService();
    this.initializeServices();
  }

  async initializeServices() {
    await this.locationService.requestPermissions();
    await this.cameraService.requestPermissions();
    this.initializeMap();
    this.startLocationTracking();
  }

  initializeMap() {
    // Initialize mini map
    const mapView = this.page.getViewById('mapView');
    this.map = new GoogleMaps(mapView);
  }

  startLocationTracking() {
    this.locationService.startLocationWatch((location) => {
      this.lastLocation = location;
      this.updateMap(location);
    });
  }

  updateMap(location: any) {
    if (this.map) {
      this.map.setCenter({
        lat: location.latitude,
        lng: location.longitude,
        animated: true
      });
    }
  }

  onRecordToggle() {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  startRecording() {
    this.recordingInterval = setInterval(async () => {
      if (this.lastLocation && this.lastLocation.speed > 0) {
        const imagePath = await this.cameraService.takePicture();
        // Save image with location data
      }
    }, 1000); // Adjust interval based on speed and distance requirements
  }

  stopRecording() {
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
    }
  }

  onClose() {
    this.stopRecording();
    this.locationService.stopLocationWatch();
    // Navigate back to home page
  }
}

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new CameraViewModel();
}