import { readFile } from "fs/promises";
import { parse } from "yaml";
import { join } from "path";
import { Config } from "../types";

// Server ID constant - Register commands only for specific server
export const SERVER_ID = '1280402790354649110';

// Load YAML configuration file
export async function loadConfig(): Promise<Config> {
    try {
        const configPath = join(process.cwd(), "config.yml");
        const configFile = await readFile(configPath, "utf8");
        return parse(configFile) as Config;
    } catch (error) {
        console.error("Failed to load configuration file:", error);
        process.exit(1);
    }
} 