const express = require('express');
const cors = require('cors'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: 'http://localhost:3000' 
}));

app.use(express.json());

const userRoutes = require("./routes/users");
const announcementsRoutes = require("./routes/announcements");
const discussionsRoutes = require("./routes/discussions");

app.use("/users", userRoutes);
app.use("/announcements", announcementsRoutes)
app.use("/discussions", discussionsRoutes)



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});