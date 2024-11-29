import { Observable, Frame } from '@nativescript/core';
import { CameraService } from '../../services/camera.service';
import { LocationService } from '../../services/location.service';
import { StorageService } from '../../services/storage.service';

export class RecordingViewModel extends Observable {
    private cameraService: CameraService;
    private locationService: LocationService;
    private storageService: StorageService;
    
    private _isRecording: boolean = false;
    private _captureCount: number = 0;
    private recordingInterval: any;
    private lastLocation: any;
    private distanceThreshold: number = 10; // meters

    constructor() {
        super();
        this.cameraService = new CameraService();
        this.locationService = new LocationService();
        this.storageService = new StorageService();
        this.initialize();
    }

    get isRecording(): boolean {
        return this._isRecording;
    }

    get captureCount(): number {
        return this._captureCount;
    }

    async initialize() {
        await this.cameraService.requestPermissions();
        await this.locationService.requestPermissions();
        this.startLocationTracking();
    }

    onRecordToggle() {
        this._isRecording = !this._isRecording;
        this.notifyPropertyChange('isRecording', this._isRecording);
        
        if (this._isRecording) {
            this.startRecording();
        } else {
            this.stopRecording();
        }
    }

    onClose() {
        this.stopRecording();
        this.locationService.stopLocationWatch();
        Frame.topmost().goBack();
    }

    private startLocationTracking() {
        this.locationService.startLocationWatch((location) => {
            this.lastLocation = location;
        });
    }

    private startRecording() {
        this.recordingInterval = setInterval(async () => {
            if (this.lastLocation && this.lastLocation.speed > 0) {
                const imagePath = await this.cameraService.takePicture();
                await this.storageService.saveRecording({
                    path: imagePath,
                    location: {
                        latitude: this.lastLocation.latitude,
                        longitude: this.lastLocation.longitude
                    },
                    timestamp: new Date()
                });
                this._captureCount++;
                this.notifyPropertyChange('captureCount', this._captureCount);
            }
        }, this.calculateInterval());
    }

    private stopRecording() {
        if (this.recordingInterval) {
            clearInterval(this.recordingInterval);
        }
    }

    private calculateInterval(): number {
        // Calculate interval based on speed to maintain consistent distance between photos
        const speed = this.lastLocation?.speed || 1; // meters per second
        return (this.distanceThreshold / speed) * 1000; // convert to milliseconds
    }
}