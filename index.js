const express = require('express');
const cors = require('cors'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

// Use the CORS middleware
app.use(cors({
  origin: 'http://localhost:3000' 
}));

app.use(express.json());

// Define your routes here
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});