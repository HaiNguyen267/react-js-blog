import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import cookieParser from 'cookie-parser'
import multer from 'multer'

const app = express()

app.use(express.json())
app.use(cors())


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({ storage });

app.post("/api/uploads", upload.single("file"), function (req, res) {
    const file = req.file;
    res.status(200).json(file?.filename);
});
// app.use(cookieParser)

app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/users", userRoutes)

app.get("/test", (req, res) => {
    res.json("It's working now")
})


app.listen(8080, () => {
    console.log('Server is running on port 8080')
})