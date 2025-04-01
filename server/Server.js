const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const router = require("./src/routes/main");
const connectDB = require("./src/DB/db");
const logRequest = require("./Loger");

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const allowedOrigins = [
  "https://geocam.skoegle.in",
  "https://production-client-5ahd.onrender.com",
  "https://prod-vmarg.onrender.com",
  "https://vmarg.skoegle.com",
  "https://production-client-kodt.onrender.com",
  "https://dmarg.skoegle.com",
  "https://d-marg.onrender.com",
  "https://v-marg2-0.onrender.com",
  "https://vmarg2.0.skoegle.com",
  "https://ram-obliging-pup.ngrok-free.app",
  "https://v-marg2-0.onrender.com",
 "https://qa-vmarg.skoegle.com",
 "http://13.233.253.125"
];

// Dynamically allow all localhost origins
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(logRequest);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Explicitly handle preflight OPTIONS requests

app.use("/api", router);
app.get("/ping", (req, res) => {
  res.send({ message: "We Got your Request", Loading: false });
});

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
});


app.post('/post-route', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});





connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is Running on PORT ${process.env.PORT}`);
});
