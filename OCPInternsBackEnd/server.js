const express = require("express");
const userManager = require("./Routes/UserManager/UserManager.js"); 
const applicationManager = require("./Routes/ApplicationManager/ApplicationManager.js")
const locationManager = require("./Routes/LocationManager.js")
const dashboardManager = require("./Routes/Dashboard/DashboardManager.js")
const errorHandler = require("./GlobalMiddleware/ErrorHandler.js")
const cookieParser = require("cookie-parser");
const cors = require("cors")
const DataBase = require("./DatabasesHandlers/DatabaseConnectionHandler.js")

const PORT = process.env.API_PORT;

const allowedOrigin = process.env.WEB_APP_URL ;

const corsOptions = {
  origin: allowedOrigin,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed methods
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200 // For legacy browser support
};

// Use the configured CORS options

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/user", userManager);
app.use("/application" , applicationManager)
app.use("/location" , locationManager)
app.use("/dashboard" , dashboardManager)



app.use(errorHandler)
app.listen(PORT , async () => {
    await DataBase.establishConnection();
    console.log(`the server is now listening from port 8080`)
} );