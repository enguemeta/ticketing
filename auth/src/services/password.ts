import {scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync: any = promisify(scrypt);

export class Password {
    public static async toHash(password: string): Promise<string> {
         const salt: any = randomBytes(8).toString("hex");
         const buf: any = (await scryptAsync(password, salt, 64)) as Buffer;
         return `${buf.toString("hex")}.${salt}`;
    }

    public static async compare(storedPassword: string, suppliedPassword: string): Promise<boolean> {
        const [hashedPassword, salt] = storedPassword.split(".");
        const buf: any = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
        return buf.toString("hex") === hashedPassword;
    }
}