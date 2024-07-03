import { userLogger } from "../../logs/user/userLogger";
import bcrypt from 'bcrypt';

const logger = new userLogger("generatePasswordHash")

export const generatePasswordHash = async (password: string): Promise<string | undefined> => {
    try {
        const salt = await bcrypt.genSalt(11);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        logger.error('Error when generating hash', 0, err); // Passando o erro capturado para o logger
        return undefined;
    }
}