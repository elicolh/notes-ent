import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
dotenv.config()
import { readFileSync } from 'fs'
import express from 'express'
// import { getTokenSourceMapRange } from 'typescript'

async function takeScreenshot() {
    console.log("starting screen")
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', "--window-size=1080,720"],
        // userDataDir: './userData',
    })
    const page = await browser.newPage();
    await page.setViewport({
        width: 1580,
        height: 720,
        deviceScaleFactor: 1,
    });
    await page.goto('https://cas.utt.fr/cas/login?service=https://ent2.utt.fr/uPortal/Login');
    let usr = await page.waitForSelector("#username")
    await usr.type(process.env.UTT_USERNAME)
    let mdp = await page.waitForSelector("#password")
    await mdp.type(process.env.UTT_PASSWORD)
    let valid = await page.waitForSelector("input.btn-submit")
    await valid.click()
    console.log("connected")
    let forma = await page.waitForXPath("//*/a[contains(@class,\"portal-navigation-link\") and contains(@title, \"Formation\")]")
    await forma.hover()
    let dde = await page.waitForXPath("//*/li[@id=\"uPfname_suivi-etudiants\"]/a")
    await dde.click()
    let elementHandle = await page.waitForSelector("iframe")
    let frame = await elementHandle.contentFrame()
    await page.waitForNetworkIdle()
    let ligne = (await frame.$x("//*/td[contains(@class,\"sem\") and contains(span, \"TC 3\")]/parent::tr"))[0]
    // console.log(ligne)
    // let rect = await ligne.evaluate(e=>e.getBoundingClientRect())
    let rect = await frame.evaluate((e) => {
        let { x, y, width, height } = e.getBoundingClientRect()
        return { x, y, width, height }
    }, ligne)
    let frameRect = await page.evaluate((e) => {
        let { x, y } = e.getBoundingClientRect()
        return { x, y }
    }, elementHandle)
    rect.x+=frameRect.x
    rect.y+=frameRect.y
    // let rect = await ligne?.evaluate(e=>e.getBoundingClientRect())
    console.log(rect)

    console.log("taking screen")
    await page.screenshot({ clip: rect, path: "./out.png" })
    await page.screenshot({ path: "./tout.png" })
    // var bitmap=readFileSync("./out.png")
    // console.log(Buffer.from(bitmap).toString('base64'))
    browser.close()
}
takeScreenshot()
setInterval(takeScreenshot, 60 * 1000)

let app = express()
app.get("/", (req, res) => {
    if (req.headers.authorization != process.env.AUTH_HEADER) return
    res.sendFile("/root/notes-ent/out.png")
})
app.listen("7496", () => console.log("server started"))