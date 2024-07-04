import { userLogPath } from "../../config/logPaths";
import { Logger } from "../../loggers/Logger";
import bcrypt from 'bcrypt';

const logger = new Logger("generatePasswordHash", userLogPath);

export const generatePasswordHash = async (password: string): Promise<string | undefined> => {
    try {
        const salt = await bcrypt.genSalt(11);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        logger.error('Error when generating hash', err); 
        return undefined;
    }
}