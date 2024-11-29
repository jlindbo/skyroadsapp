import { EventData, Page } from '@nativescript/core';
import { CameraViewModel } from './camera-view-model';
import { Logger } from '../../services/logging.service';

export function navigatingTo(args: EventData) {
    Logger.log('Navigating to camera page');
    const page = <Page>args.object;
    if (!page.bindingContext) {
        page.bindingContext = new CameraViewModel(page);
    }
}