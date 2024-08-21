
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

const userRoutes = require("./src/routes/users");

app.use("/users", userRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});