import { Observable, Frame, Page } from '@nativescript/core';
import { CameraService } from '../../services/camera.service';
import { LocationService } from '../../services/location.service';
import { StorageService } from '../../services/storage.service';
import { Logger } from '../../services/logging.service';

export class CameraViewModel extends Observable {
    private cameraService: CameraService;
    private locationService: LocationService;
    private storageService: StorageService;
    private page: Page;
    
    private _isRecording: boolean = false;
    private _captureCount: number = 0;
    private recordingInterval: any;
    private lastLocation: any;

    constructor(page: Page) {
        super();
        Logger.log('CameraViewModel initialized');
        this.page = page;
        this.cameraService = new CameraService();
        this.locationService = new LocationService();
        this.storageService = new StorageService();
        this.initialize();
    }

    async initialize() {
        Logger.log('Initializing camera view');
        try {
            const cameraPermission = await this.cameraService.requestPermissions();
            const locationPermission = await this.locationService.requestPermissions();
            
            if (!cameraPermission || !locationPermission) {
                Logger.error('Permission denied');
                this.onClose();
                return;
            }
            
            this.startLocationTracking();
        } catch (error) {
            Logger.error('Initialization error:', error);
            this.onClose();
        }
    }

    get isRecording(): boolean {
        return this._isRecording;
    }

    get captureCount(): number {
        return this._captureCount;
    }

    onRecordToggle() {
        Logger.log('Record button tapped');
        this._isRecording = !this._isRecording;
        this.notifyPropertyChange('isRecording', this._isRecording);
        
        if (this._isRecording) {
            this.startRecording();
        } else {
            this.stopRecording();
        }
    }

    onClose() {
        Logger.log('Closing camera view');
        this.stopRecording();
        this.locationService.stopLocationWatch();
        Frame.topmost().goBack();
    }

    private startLocationTracking() {
        Logger.log('Starting location tracking');
        this.locationService.startLocationWatch((location) => {
            Logger.log(`Location update: ${JSON.stringify(location)}`);
            this.lastLocation = location;
        });
    }

    private startRecording() {
        Logger.log('Starting recording');
        this.recordingInterval = setInterval(async () => {
            try {
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
            } catch (error) {
                Logger.error('Recording error:', error);
            }
        }, 1000);
    }

    private stopRecording() {
        Logger.log('Stopping recording');
        if (this.recordingInterval) {
            clearInterval(this.recordingInterval);
        }
    }
}