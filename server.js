
const express = require("express");
const router = express.Router();
const controler = require("./controler/auth_controler");

const app = express();


app.use(express.json());


router.route("/home").get(controler.home);
router.route("/signup").post(controler.signup);
router.route("/login").post(controler.login);


app.use("/api", router);


app.get('/', (req, res) => {
    res.status(200).send('Hello Web-a-Thon');
});

const PORT = 4000;

// app window

app.listen(PORT, () => {
    console.log(`Server is live at port: ${PORT}`)
});