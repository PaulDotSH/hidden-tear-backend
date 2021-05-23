const express = require("express")
const app = express()
const fs = require("fs")
//This should be rewritten to use MongoDB or smth but I don't know node atm
const port = 3001
const bodyParser = require("body-parser")
var LogsDB = new Array()
const logspath = "./logsdb.json"
const cors = require("cors")

app.use(bodyParser.json({ limit: "50mb" }))
app.use(
  bodyParser.urlencoded({
    limit: "2mb",
    extended: true
  })
)

app.listen(port, function () {
  console.log("Server started on port " + port)
  fs.readFile(logspath, "utf8", (err, data) => {
    if (err) {
      console.log(`reading file from disk: ${err}`)
    } else {
      try {
        LogsDB = JSON.parse(data)
      } catch {
        LogsDB = new Array(LogDetails)
      }
    }
  })
})
//app.use(fileUpload())

app.post("/", function (req, res) {
  console.log("posted")
  console.log(req.header("Content-Type"))
  var Exists = false
  //check
  if (WrongFormat(req.body)) {
    res.sendStatus(404)
    return
  }
  req.body.SenderIP = req.ip
  console.log(req.body)

  for (var i = 0; i < LogsDB.length; i++) {
    while (LogsDB[i] == null) i++
    if (LogsDB[i].ID === req.body.ID) Exists = true
  }
  if (Exists) {
    console.log(`User already exists!`)
    res.sendStatus(301)
  } else {
    LogsDB.push(req.body)
    save()
    res.sendStatus(302)
  }
})

function WrongFormat(body) {
  if (
    !body.ID ||
    !body.ComputerName ||
    !body.UserName ||
    !body.OS ||
    !body.SystemType
  )
    return true
  return false
}

function save() {
  fs.writeFile(logspath, JSON.stringify(LogsDB), "utf8", (err) => {
    if (err) {
      console.log(`writing log to file: ${err}`)
    } else {
      console.log(`Log was added to file successfully!`)
    }
  })
}
