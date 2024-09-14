
const express = require("express");
const router = express.Router();
const controler = require("./controler/auth_controler");
const cors = require('cors');

const app = express();


app.use(express.json());
app.use(cors({
    origin: '*',        // Allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allows all methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Specify allowed headers
  }));


router.route("/home").post(controler.home);
router.route("/signup").post(controler.signup);
router.route("/login").post(controler.login);
router.route("/history").post(controler.history);
router.route("/ftrends").get(controler.financeTrends);


app.use("/api", router);


app.get('/', (req, res) => {
    res.status(200).send('Hello Web-a-Thon');
});

const PORT = 4000;

// app window

app.listen(PORT, () => {
    console.log(`Server is live at port: ${PORT}`)
});