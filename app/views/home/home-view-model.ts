import { Observable, Frame } from '@nativescript/core';
import { Recording } from '../../models/recording.model';
import { Logger } from '../../services/logging.service';

export class HomeViewModel extends Observable {
    private _recordings: Recording[] = [];
    private _username: string = 'Road Explorer';

    constructor() {
        super();
        Logger.log('HomeViewModel initialized');
        this.loadRecordings();
    }

    get recordings(): Recording[] {
        return this._recordings;
    }

    get username(): string {
        return this._username;
    }

    onStartRecording() {
        Logger.log('Starting recording - navigating to camera page');
        try {
            const frame = Frame.topmost();
            frame.navigate({
                moduleName: 'views/camera/camera-page',
                clearHistory: false,
                transition: {
                    name: 'slideLeft'
                }
            });
        } catch (error) {
            Logger.error('Navigation error:', error);
        }
    }

    private loadRecordings() {
        Logger.log('Loading recordings');
        // Initialize with empty recordings array
        this._recordings = [];
        this.notifyPropertyChange('recordings', this._recordings);
    }
}