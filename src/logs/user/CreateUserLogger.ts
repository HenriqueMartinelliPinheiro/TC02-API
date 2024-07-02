import { isUtf8 } from 'buffer';
import fs from 'fs';

export class userLogger{
    private className: string;
    private fileṔath: string;

    constructor(className: string, filePath: string){
        this.className = className;
        this.fileṔath = "./UserLogs.log"
    }

     error = (error : any, userId : number)=>{
        fs.writeFileSync(this.fileṔath, `${Date.now()}: ${error} at ${this.className} by User: ${userId}`)
    }

    warn = (warn : any, userId : number)=>{
        fs.writeFileSync(this.fileṔath, `${Date.now()}: ${warn} at ${this.className} by User: ${userId}`)
    }

    info = (info : any, userId : number)=>{
        fs.writeFileSync(this.fileṔath, `${Date.now()}: ${error} at ${this.className} by User: ${userId}`)
    }

}