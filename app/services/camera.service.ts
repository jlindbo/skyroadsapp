import { Camera, requestPermissions } from '@nativescript/camera';
import { Logger } from './logging.service';

export class CameraService {
    async requestPermissions(): Promise<boolean> {
        try {
            Logger.log('Requesting camera permissions');
            const granted = await requestPermissions();
            Logger.log(`Camera permissions ${granted ? 'granted' : 'denied'}`);
            return granted;
        } catch (error) {
            Logger.error('Camera permissions error:', error);
            return false;
        }
    }

    async takePicture(): Promise<string> {
        const options = {
            width: 1920,
            height: 1080,
            keepAspectRatio: true,
            saveToGallery: false
        };

        try {
            Logger.log('Taking picture');
            const imageAsset = await Camera.takePicture(options);
            const imagePath = imageAsset.android || imageAsset.ios;
            Logger.log(`Picture taken: ${imagePath}`);
            return imagePath;
        } catch (error) {
            Logger.error('Camera error:', error);
            throw error;
        }
    }
}