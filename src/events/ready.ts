import { Client, Events, REST, Routes } from "discord.js";
import { SERVER_ID } from "../config";
import * as fs from "fs";
import * as path from "path";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client, token: string) {
        console.log(`Ready! Logged in as ${client.user?.tag}`);

        try {
            // 특정 서버 가져오기
            const guild = client.guilds.cache.get(SERVER_ID);
            if (!guild) {
                console.error(`Server with ID ${SERVER_ID} not found.`);
                return;
            }

            console.log(`Target server found: ${guild.name}`);

            // Load command files
            const commands = [];
            const commandsPath = path.join(__dirname, '../commands');
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

            console.log(`Found command files: ${commandFiles.join(', ')}`);

            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                    console.log(`Loaded command: ${command.data.name}`);
                } else {
                    console.log(`[WARNING] Command ${file} is missing data or execute property.`);
                }
            }

            // 현재 등록된 명령어 확인 (디버깅용)
            console.log("Fetching currently registered commands...");
            const currentCommands = await guild.commands.fetch();
            console.log(`Found ${currentCommands.size} existing commands`);
            
            console.log("Currently registered commands:");
            currentCommands.forEach(cmd => {
                console.log(`- ${cmd.name}: "${cmd.description}"`);
            });

            // 특정 명령어 찾아서 로깅 (한글 명령어 체크)
            const koreanCommands = currentCommands.filter(cmd => 
                cmd.description.includes('질문') || 
                cmd.description.includes('확인') || 
                cmd.description.includes('서버') || 
                cmd.description.includes('입력한') ||
                cmd.description.includes('봇의')
            );
            
            if(koreanCommands.size > 0) {
                console.log("\nDetected Korean commands that need to be removed:");
                koreanCommands.forEach(cmd => {
                    console.log(`- ${cmd.name}: "${cmd.description}"`);
                });
            }

            // 모든 기존 명령어 삭제 후 새 명령어 등록 (한 번에 처리)
            console.log("\nClearing all commands and registering new ones...");
            const updatedCommands = await guild.commands.set(commands);
            
            console.log(`Successfully registered ${updatedCommands.size} slash commands!`);
            console.log("New command list:");
            updatedCommands.forEach(cmd => {
                console.log(`- ${cmd.name}: "${cmd.description}"`);
            });
            
            // 잠시 대기 후 다시 확인 (캐시 업데이트 등을 위해)
            console.log("\nWaiting 5 seconds to verify changes...");
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // 변경 후 명령어 다시 확인
            console.log("Verifying commands after changes...");
            const verifyCommands = await guild.commands.fetch({ force: true });
            console.log(`Verified: Found ${verifyCommands.size} commands after cleanup`);
            
            // 남아있는 한글 명령어 확인
            const remainingKoreanCommands = verifyCommands.filter(cmd => 
                cmd.description.includes('질문') || 
                cmd.description.includes('확인') || 
                cmd.description.includes('서버') || 
                cmd.description.includes('입력한') ||
                cmd.description.includes('봇의')
            );
            
            if(remainingKoreanCommands.size > 0) {
                console.log("\n⚠️ WARNING: Korean commands still detected!");
                remainingKoreanCommands.forEach(cmd => {
                    console.log(`- ${cmd.name}: "${cmd.description}"`);
                });
                
                // 개별 삭제 시도
                console.log("\nAttempting to delete remaining Korean commands individually...");
                for(const [id, cmd] of remainingKoreanCommands) {
                    try {
                        await guild.commands.delete(id);
                        console.log(`Deleted command: ${cmd.name}`);
                    } catch (err) {
                        console.error(`Failed to delete command ${cmd.name}:`, err);
                    }
                }
                
                // 최종 확인
                console.log("\nFinal verification...");
                const finalCheck = await guild.commands.fetch({ force: true });
                console.log(`Final check: ${finalCheck.size} commands remaining`);
                finalCheck.forEach(cmd => {
                    console.log(`- ${cmd.name}: "${cmd.description}"`);
                });
            } else {
                console.log("\n✅ All commands successfully updated to English!");
            }
            
        } catch (error) {
            console.error("Error occurred while managing slash commands:", error);
        }
    },
}; 