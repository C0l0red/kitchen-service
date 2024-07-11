import {isNumberString} from "class-validator";
import ExpressApp from "./app";
import {getEnvironmentVariable} from "./common/helpers";
import {AppDataSource, DatabaseManager} from "./data-source";
import Logger from "./common/logger";

const PORT = parseInt(getEnvironmentVariable("SERVER_PORT", isNumberString));

const databaseManager = new DatabaseManager(AppDataSource);
const expressApp = new ExpressApp(databaseManager);
expressApp.initializeApp().then(() => {
    Logger.log("Express App Started");
    expressApp.startListening(PORT);
})