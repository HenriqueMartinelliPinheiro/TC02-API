import fs from 'fs';

export class Logger {
    private fileName: string;
    private logPath: string;

    constructor(fileName: string, logPath: string) {
        this.fileName = fileName;
        this.logPath = logPath;
    }

    error = (msg: any, userId?: number, error?: any) => {
        const errorMessage = error ? `${msg} - Error: ${error.message} at ${this.fileName} by User: ${userId}\n` : `${msg} at ${this.fileName} by User: ${userId}\n`;
        fs.appendFileSync(this.logPath, `${new Date(Date.now())}: ERROR - ${errorMessage}`, 'utf8');
    }   

    warn = (msg: any, userId?: number) => {
        const warnMessage = `${Date.now()}: WARN - ${msg} at ${this.fileName} by User: ${userId}\n`;
        fs.appendFileSync(this.logPath, warnMessage);
    }

    info = (info: any, userId?: number) => {
        const infoMessage = `${Date.now()}: INFO - ${info} by User: ${userId}\n`;
        fs.appendFileSync(this.logPath, infoMessage);
    }
}
