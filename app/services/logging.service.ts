import { Observable } from '@nativescript/core';

class LoggingService extends Observable {
    private static instance: LoggingService;
    private _logs: string[] = [];
    private maxLogs = 50;

    private constructor() {
        super();
    }

    static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    get logs(): string[] {
        return this._logs;
    }

    log(message: string): void {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `${timestamp}: ${message}`;
        console.log(logMessage);
        
        this._logs.unshift(logMessage);
        if (this._logs.length > this.maxLogs) {
            this._logs.pop();
        }
        
        this.notifyPropertyChange('logs', this._logs);
    }

    error(message: string, error?: any): void {
        const errorMessage = error ? `${message} - ${error.message || error}` : message;
        this.log(`ERROR: ${errorMessage}`);
    }

    clear(): void {
        this._logs = [];
        this.notifyPropertyChange('logs', this._logs);
    }
}

export const Logger = LoggingService.getInstance();