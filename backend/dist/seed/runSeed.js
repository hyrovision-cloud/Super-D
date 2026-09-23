"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const seedAuth_1 = require("./seedAuth");
const seedRealData_1 = require("./seedRealData");
const logger_1 = require("../utils/logger");
async function run() {
    try {
        await (0, database_1.connectDatabase)();
        await (0, seedAuth_1.seedAuthData)();
        const counts = process.argv.includes('--verify-only') ? await (0, seedRealData_1.verifyRealData)() : await (0, seedRealData_1.seedRealData)();
        logger_1.logger.info(`[Seed] Verified counts: ${JSON.stringify(counts)}`);
        logger_1.logger.info('[RunSeed] Seeding completed successfully.');
        await (0, database_1.disconnectDatabase)();
        process.exit(0);
    }
    catch (err) {
        logger_1.logger.error(`[RunSeed] Seeding failed: ${err.message}`, err);
        process.exit(1);
    }
}
run();
