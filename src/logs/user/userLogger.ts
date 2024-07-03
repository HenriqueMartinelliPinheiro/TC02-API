import fs from 'fs';

export class userLogger {
    private fileName: string;
    private logPath: string;

    constructor(fileName: string) {
        this.fileName = fileName;
        this.logPath = "./UserLogs.log";
    }

    error = (msg: any, userId: number, error?: any) => {
        const errorMessage = error ? `${msg} - Error: ${error.message} at ${this.fileName} by User: ${userId}\n` : `${msg} at ${this.fileName} by User: ${userId}\n`;
        fs.appendFileSync(this.logPath, `${Date.now()}: ERROR - ${errorMessage}`);
    }

    warn = (msg: any, userId: number) => {
        fs.appendFileSync(this.logPath, `${Date.now()}: WARN - ${msg} at ${this.fileName} by User: ${userId}\n`);
    }

    info = (info: any, userId: number) => {
        fs.appendFileSync(this.logPath, `${Date.now()}: INFO - ${info} by User: ${userId}\n`);
    }
}
