const dotenv = require("dotenv");
dotenv.config();
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require("helmet");

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'https://text-to-image-yashpatel.netlify.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet({
    crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
  }));
const auth = require("./Routes/auth.js")
app.get("/",(req,res)=>{
    res.status(200).send({
        message : "Welcome to the Web Application"
    })
    
})
app.use("/api/v1/auth",auth)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
});
module.exports =app