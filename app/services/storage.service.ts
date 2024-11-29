import { ImageData } from '../models/recording.model';
import { File, Folder, knownFolders } from '@nativescript/core';

export class StorageService {
    private readonly RECORDINGS_FOLDER = 'recordings';
    
    constructor() {
        this.ensureRecordingsFolder();
    }

    async saveRecording(imageData: ImageData): Promise<void> {
        const folder = this.getRecordingsFolder();
        const fileName = `${Date.now()}.jpg`;
        const filePath = `${folder.path}/${fileName}`;
        
        try {
            await File.fromPath(imageData.path).copy(filePath);
            // Save metadata
            const metadataPath = `${filePath}.json`;
            const metadata = {
                location: imageData.location,
                timestamp: imageData.timestamp
            };
            await File.fromPath(metadataPath).writeText(JSON.stringify(metadata));
        } catch (error) {
            console.error('Failed to save recording:', error);
            throw error;
        }
    }

    private ensureRecordingsFolder(): void {
        const folder = this.getRecordingsFolder();
        if (!Folder.exists(folder.path)) {
            folder.create();
        }
    }

    private getRecordingsFolder(): Folder {
        return knownFolders.documents().getFolder(this.RECORDINGS_FOLDER);
    }
}