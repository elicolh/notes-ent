import puppeteer from 'puppeteer'
import {readFileSync} from 'fs'
require('dotenv').config()

async function init() {
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
    var bitmap=readFileSync("./out.png")
    console.log(Buffer.from(bitmap).toString('base64'))
    browser.close()
    // await page.waitForTimeout(5000)
    // await page.mouse.click(1030,20)
    // await page.waitForTimeout(3000)
    // await page.mouse.click(425, 216)
    // await page.keyboard.type(process.env.UTT_USERNAME as string)
    // await page.mouse.click(437,27)
    // await page.keyboard.type(process.env.UTT_PASSWORD as string)
    // await page.mouse.click(475,323)
    // await page.waitForTimeout(3000)
    // await page.mouse.click(280,100)
    // await page.mouse.click(280,120)
    // await page.waitForTimeout(10000)
    // await page.screenshot({clip:{x:265, y:670, width:692, height:60}, path:"./out.png"})
    // await page.screenshot({path:"./out.png"})
    // console.log("screen prit")
    // browser.close()
    // if (await page.evaluate(() => window.location.href) != 'https://www.instagram.com/accounts/edit/') {
    //     console.log("attempting to connect")
    //     console.log("potentially connected")
    //     await page.goto('https://www.instagram.com/accounts/edit/')
    // } else {
    //     console.log("already connected")
    // }
}
init()