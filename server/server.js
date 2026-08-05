require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

app.use(authRoutes);
app.use(expenseRoutes);

app.listen(process.env.PORT || 3000, function () {

    console.log("Server is running on port 3000");

});