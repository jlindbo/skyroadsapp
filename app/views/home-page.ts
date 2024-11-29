import { EventData, Page, Observable } from '@nativescript/core';
import { Recording } from '../models/recording.model';

export class HomeViewModel extends Observable {
  private recordings: Recording[] = [];
  private username: string = 'User';

  constructor() {
    super();
    this.loadRecordings();
  }

  private loadRecordings() {
    // Load recordings from storage
    this.notifyPropertyChange('recordings', this.recordings);
  }

  onStartRecording() {
    // Navigate to camera page
    const frame = require('@nativescript/core').Frame;
    frame.topmost().navigate({
      moduleName: 'views/camera-page',
      clearHistory: false
    });
  }
}

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new HomeViewModel();
}