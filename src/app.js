import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
//app.use() for middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({limit:"16kb"})) //configure for json
app.use(express.urlencoded({extended:true,limit:"16kb"})) //configure for form data
app.use(express.static("public")) //make public folder accesible
app.use(cookieParser()) //configure cookie access with server

app.on('error', (err) => {
    console.error(err);
    process.exit(1);
});


//routes import
import router  from './routes/user.routes.js'

//routes declaration
app.use("/users",router)
// app.post('/upload', upload.single('avatar'), (req, res) => {
//     console.log('Received file:', req.file);
//     res.send('File uploaded successfully');
//   })

export default app;