import { Application, ApplicationEventData, Observable } from '@nativescript/core';
import { Logger } from './services/logging.service';

class DebugManager extends Observable {
    private _showDebug = false;

    get showDebug(): boolean {
        return this._showDebug;
    }

    toggleDebug() {
        this._showDebug = !this._showDebug;
        this.notifyPropertyChange('showDebug', this._showDebug);
    }
}

export const debugManager = new DebugManager();

Application.on(Application.launchEvent, (args: ApplicationEventData) => {
    Logger.log('Application launched');
    
    const page = args.root;
    if (page) {
        page.bindingContext = {
            debugManager,
            logger: Logger
        };
        
        page.on('tap', (args: any) => {
            if (args.ios?.touches?.count === 3 || args.android?.getPointerCount() === 3) {
                debugManager.toggleDebug();
                Logger.log('Debug overlay toggled');
            }
        });
    }
});

Application.on(Application.uncaughtErrorEvent, (args: ApplicationEventData) => {
    Logger.error('Uncaught error:', args.error);
});

Application.run({ moduleName: 'app-root' });