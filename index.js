"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const express_1 = __importDefault(require("express"));
require('dotenv').config();
function takeScreenshot() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({
            headless: true,
            args: ['--no-sandbox', "--window-size=1080,720"],
            // userDataDir: './userData',
        });
        const page = yield browser.newPage();
        yield page.setViewport({
            width: 1080,
            height: 720,
            deviceScaleFactor: 1,
        });
        yield page.goto('https://cas.utt.fr/cas/login?service=https://ent2.utt.fr/uPortal/Login');
        let usr = yield page.waitForSelector("#username");
        yield (usr === null || usr === void 0 ? void 0 : usr.type(process.env.UTT_USERNAME));
        let mdp = yield page.waitForSelector("#password");
        yield (mdp === null || mdp === void 0 ? void 0 : mdp.type(process.env.UTT_PASSWORD));
        let valid = yield page.waitForSelector("input.btn-submit");
        yield (valid === null || valid === void 0 ? void 0 : valid.click());
        let forma = yield page.waitForXPath("//*/a[contains(@class,\"portal-navigation-link\") and contains(@title, \"Formation\")]");
        yield (forma === null || forma === void 0 ? void 0 : forma.hover());
        let dde = yield page.waitForXPath("//*/li[@id=\"uPfname_suivi-etudiants\"]/a");
        yield (dde === null || dde === void 0 ? void 0 : dde.click());
        yield page.waitForNetworkIdle();
        yield page.screenshot({ clip: { x: 265, y: 670, width: 692, height: 60 }, path: "./out.png" });
        // var bitmap=readFileSync("./out.png")
        // console.log(Buffer.from(bitmap).toString('base64'))
        browser.close();
    });
}
takeScreenshot();
setInterval(takeScreenshot, 60 * 1000);
let app = (0, express_1.default)();
app.get("/", (req, res) => {
    if (req.headers.authorization != process.env.AUTH_HEADER)
        return;
    res.sendFile(__dirname + "/out.png");
});
app.listen("7496", () => console.log("server started"));
