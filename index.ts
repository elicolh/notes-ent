import puppeteer from 'puppeteer'
import {readFileSync} from 'fs'
import express from 'express'
require('dotenv').config()

async function takeScreenshot() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', "--window-size=1080,720"],
        // userDataDir: './userData',
    })
    const page = await browser.newPage();
    await page.setViewport({
        width: 1080,
        height: 720,
        deviceScaleFactor: 1,
    });
    await page.goto('https://cas.utt.fr/cas/login?service=https://ent2.utt.fr/uPortal/Login');
    let usr = await page.waitForSelector("#username")
    await usr?.type(process.env.UTT_USERNAME as string)
    let mdp = await page.waitForSelector("#password")
    await mdp?.type(process.env.UTT_PASSWORD as string)
    let valid = await page.waitForSelector("input.btn-submit")
    await valid?.click()
    let forma = await page.waitForXPath("//*/a[contains(@class,\"portal-navigation-link\") and contains(@title, \"Formation\")]")
    await forma?.hover()
    let dde = await page.waitForXPath("//*/li[@id=\"uPfname_suivi-etudiants\"]/a")
    await dde?.click()
    await page.waitForNetworkIdle()
    await page.screenshot({clip:{x:265, y:670, width:692, height:60}, path:"./out.png"})
    // var bitmap=readFileSync("./out.png")
    // console.log(Buffer.from(bitmap).toString('base64'))
    browser.close()
}
takeScreenshot()
setInterval(takeScreenshot, 60 * 1000)

let app = express()
app.get("/", (req,res)=>{
    if(req.headers.authorization != process.env.AUTH_HEADER) return
    res.sendFile(__dirname + "/out.png")
})
app.listen("7496", ()=>console.log("server started"))