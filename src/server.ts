import {isNumberString} from "class-validator";
import ExpressApp from "./app";
import {getEnvironmentVariable} from "./common/helpers";
import {AppDataSource} from "./data-source";
import Logger from "./common/logger";

const PORT = parseInt(getEnvironmentVariable("SERVER_PORT", isNumberString));

const expressApp = new ExpressApp(AppDataSource);
expressApp.initializeApp().then(() => {
    Logger.log("Express App Started");
    expressApp.startListening(PORT);
})