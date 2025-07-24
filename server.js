const express = require ("express")
const motor = require("./app.js")
const app = express()
const PORT = 5000

app.use(express.json())

const users = [
    {
        email: "justine@gmail.com",
        pass: "*****",
        name: "JustineB"
    }
]

app.get("/api/motor", (req, res) => {
    res.json(motor)
})

app.get("/api/users", (req, res) => {
    res.json(users)
})

app.post("/api/user", (req, res) => {
    const { username, email, password } = req.body

    users.push({
        username, email, pass: password
    })

    res.json({ message: "User Created", user: { username, email, pass: password }})
})

app.listen(PORT, () => console.log("server running"))





