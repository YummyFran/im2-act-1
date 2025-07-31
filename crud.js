const express = require ("express")
const app = express()
const PORT = 5000
const players = require ("./player.json")

app.use(express.json())

const validatePlayerDetails = (res, body) => {
    const { name, age, jerseyNumber, position } = body

    const errors = []

    if(!name) {
        errors.push("name")
    }

    if(!age) {
        errors.push("age")
    }

    if(!jerseyNumber) {
        errors.push("jerseyNumber'")
    }

    if(!position) {
        errors.push("position")
    }

    if(errors.length > 0) {
        res.status(422).json({ error: `Missing parameters: ${[...errors]}`})
    }
}

app.get("/api/players", (req, res) => {
    res.json(players)
})

app.post("/api/players", (req, res) => {
    const { name, age, jerseyNumber, position } = req.body

    validatePlayerDetails(res, req.body)

    const id = Math.max(...players.map(player => player.id)) + 1

    players.push({
        id, name, age, jerseyNumber, position
    })

    res.json ({message: "players added", player: { id, name, age, jerseyNumber, position}, id})
})


app.put("/api/players/:id", (req, res) => {
    const {name, age, jerseyNumber, position} = req.body
    const { id } = req.params

    validatePlayerDetails(res, req.body)

    const player = players.find(player => player.id == id)

    if(Object.keys(player).length == 0) {
        res.status(404).json({ error: "Player not found"})
    }

    Object.keys(player).forEach(key => {
        if(key == "id") player["id"] = player.id
        else player[key] = req.body[key]
    })
    
    res.json({ message: "Player updated", player })
})

app.delete("/api/players/:id", (req, res) => {
    const { id } = req.params

    const player = players.findIndex(player => player.id == id)

    if(player == -1) {
        res.status(404).json({ error: "Player not found"})
    }

    players.splice(player, 1)

    res.json({ message: "Player deleted" })
})

app.listen(PORT, () => console.log("run"))