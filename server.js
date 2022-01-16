import express from 'express'
let app = express()
app.get("/", (req, res) => {
    if (req.headers.authorization != process.env.AUTH_HEADER) return
    res.sendFile("/root/notes-ent/out.png")
    s.close()    
})

let s = app.listen("7496", () => console.log("server started"))