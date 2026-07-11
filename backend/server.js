
const express = require("express")
const cors = require("cors")
const mysql = require("mysql")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")
const multer = require("multer")
const path = require("path")
const { json } = require("stream/consumers")
const { time, error } = require("console")

const app = express()
app.use(express.json())
app.use(cors())

const upload = path.join(__dirname, "upload")
app.use(express.static(upload))

require("dotenv").config()

const USER = process.env.USER;
const HOST = process.env.HOST;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;
const CHARSET = process.env.CHARSET;
const DATABASETASK = process.env.DATABASETASK

const db = mysql.createConnection({
   user: USER,
   host: HOST,
   password: PASSWORD,
   database: DATABASE,
   charset: CHARSET
})

db.connect((error) => {
   if (error) {
      console.log(error)
      return;
   }
   console.log("mysql connect...")
})





app.post("/register", (req, res) => {

   const { name, email, password } = req.body

   db.query("SELECT email FROM user WHERE email =?", [email], async (error, resultes) => {
      if (error) {
         console.log(error)
         res.json({ message: error })
         return;
      }
      if (resultes.length > 0) {
         console.log("email found")
         res.json({ message: "email found" })
         return;
      }

      const passwordHash = await bcrypt.hash(password, 8)

      db.query("INSERT INTO user SET?", {
         name: name,
         email: email,
         password: passwordHash
      }, (error, resultes) => {

         const insertId = resultes.insertId

         const token = jwt.sign(
            { id: insertId },
            process.env.JWT_SELECT || "select_kye_default",
            { expiresIn: "1D" }
         )

         const cookies = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1E3),
            httpOnly: true,
            secure: false
         }

         res.cookie("jwt", token, cookies)

         console.log(resultes)
         res.json({
            name: name,
            email: email,
            id: insertId,
            token: token
         })
      })
   })

})




app.post("/login", (req, res) => {
   const { email, password } = req.body
   db.query("SELECT * FROM user WHERE email=?", [email], async (error, resultes) => {
      if (error) {
         console.log(error)
         res.json({ message: error })
         return;
      }
      if (resultes.length == 0) {
         res.json({ message: "data is incorrect." })
         return;
      }

      console.log(resultes)

      const user = resultes[0]
      const passwordcompars = await bcrypt.compare(password, user.password)
      if (!passwordcompars) {
         res.status(403).json({ message: "data is incorrect." })
         return;
      }

      const token = jwt.sign(
         { id: user.id },
         process.env.JWT_SELECT || "select_kye_default",
         { expiresIn: "1D" }
      )

      const cookies = {
         expires: new Date(Date.now() + 24 * 60 * 60 * 1E3),
         httpOnly: true,
         secure: false
      }

      res.cookie("jwt", token, cookies)

      res.json({
         name: user.name,
         avatar: user.avatar,
         email: user.email,
         token: token,
         id: user.id
      })



   })
})



const auther = (req, res, next) => {
   const authHead = req.body['authHead']

   if (!authHead) {
      console.log('no token auth')
      res.status(402).json({ message: 'no token' })
      return;
   }
   const token = authHead.split(' ')[1]
   if (token == '') {
      console.log('no token')
      res.status(403).json({ message: 'no token' })
      return;
   }
   jwt.verify(
      token,
      process.env.JWT_SELECT || select_kye_default,
      (error, data) => {
         if (error) {
            console.log(error)
            res.status(403).json({ message: error })
            return;
         }
         req.userId = data.id
         next()
      })
}


app.post("/home_pto", auther, (req, res) => {

   const userId = req.userId

   db.query("SELECT * FROM user WHERE id=?", [userId], (error, results) => {

      if (error) {
         console.log(error)
         res.status(403).json({ message: error })
         return;
      }
      if (results.length == 0) {
         console.log("results length = 0")
         return;
      }
      const user = results[0]
      res.json({
         name: user.name,
         avatar: user.avatar,
         email: user.email
      })
   })

})




const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "upload/")
   },
   filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      const urlmu = Date.now() + "-" + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + "-" + urlmu + ext)
   }
})


const uploads = multer({ storage: storage })


app.post("/change_avatar", uploads.single("avatar"), (req, res) => {


   const email = req.body['email']
   console.log(req.file)

   const file = req.file.filename ? `http://localhost:4000/${req.file.filename}` : null


   db.query('UPDATE user SET avatar=? WHERE email=?', [file, email], (error, dtata) => {

      if (error) {
         console.log(error)
         return;
      }
      res.json({ avatar: file })

   })

})




const dbi = mysql.createConnection({
   user: USER,
   host: HOST,
   password: PASSWORD,
   database: DATABASETASK,
   charset: CHARSET
})


dbi.connect((error) => {
   if (error) {
      return console.log(error)
   }
   console.log('mysql task connect...')
})



app.post("/add_item", (req, res) => {

   const { title, descripiton, priority, date, completed, userid } = req.body


   dbi.query("INSERT INTO item SET?", {
      title: title,
      descripiton: descripiton,
      priority: priority || 'low',
      date: date,
      completed: completed || 0,
      userid: userid
   }, (error, results) => {
      if (error) {
         return console.log(error)
      }

      console.log(req.body)
      res.json({ data: req.body })

   })

})


app.get("/show_item_all", (req, res) => {

   const userId = req.query['id']

   dbi.query("SELECT * FROM item WHERE userid=? ORDER BY id ASC", [userId], (error, results) => {
      if (error) {
         return console.log(error)
      }
      res.json({ tasks: results })

   })

})

app.get("/show_item_completed", (req, res) => {
   const userId = req.query['id']
   console.log(userId)
   dbi.query("SELECT * FROM item WHERE userid=? AND completed = 1 ORDER BY id ASC", [userId], (error, results) => {
      if (error) {
         console.log(error)
         res.json({ error: error })
         return;
      }

      console.log(results[0])
      res.json({ tasks: results })
   })
})




// pending

app.get("/show_item_pending", (req, res) => {
   const userId = req.query['id']
   console.log(userId)
   dbi.query("SELECT * FROM item WHERE userid=? AND completed = 0 ORDER BY id ASC", [userId], (error, results) => {
      if (error) {
         console.log(error)
         res.json({ error: error })
         return;
      }

      res.json({ tasks: results })
   })
})



app.get("/show_item_overdue", (req, res) => {
   const userId = req.query['id']
   console.log(userId)
   dbi.query("SELECT * FROM item WHERE userid=? AND completed = 0 AND date < CURDATE() ORDER BY id ASC", [userId], (error, results) => {
      if (error) {
         console.log(error)
         res.json({ error: error })
         return;
      }

      res.json({ tasks: results })
   })
})





app.get("/data/number", (req, res) => {
   const userId = req.query['id']
   let all;
   let completed;
   let pending;
   dbi.query("SELECT * FROM item WHERE userid=? ORDER BY id ASC", [userId], (error, results) => {
      if (error) {
         return console.log(error)
      }
      all = results.length

      dbi.query("SELECT * FROM item WHERE userid=? AND completed = 1 ORDER BY id ASC", [userId], (error, results) => {
         if (error) {
            return console.log(error)
         }
         completed = results.length
      })
      dbi.query("SELECT * FROM item WHERE userid=? AND completed = 0 ORDER BY id ASC", [userId], (error, results) => {
         if (error) {
            return console.log(error)
         }
         pending = results.length


         // console.log(all, completed, pending)

         res.json({
            all: all,
            completed: completed,
            pending: pending
         })
      })

   })




})










app.post("/delete_item", (req, res) => {
   const id = req.body['id']

   dbi.query("DELETE FROM item WHERE id=?", [id], (error, resultes) => {
      if (error) {
         return console.log(error)
      }
      res.json({ message: "delete item" })

   })
})

app.post("/update_item", (req, res) => {


   const { title, descripiton, priority, date, completed, userid, id } = req.body

   dbi.query("UPDATE item SET title=?, descripiton=?, priority=?, date=?, completed=? WHERE id=? ",
      [title,
         descripiton,
         priority || 'low',
         date,
         completed || 0,
         id
      ], (error, results) => {
         if (error) {
            return console.log(error)
         }
         res.json({ message: "true update" })

         console.log(results)

      })

})















app.listen(4000, () => {
   console.log("server on port 4000...")
})