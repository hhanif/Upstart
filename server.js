// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (err) =>
  console.error("MongoDB connection error:", err)
);

const Poll = mongoose.model("Poll", 
{ name: String,
  description: String,
  options: [String]
});
//Create poll
app.post("/api/polls", async (req, res) => {
  const { name, description, options } = req.body;
  try {
    const poll = new Poll({ name, description, options });
    await poll.save();
    console.log("Poll added:", poll);
    res.json(poll);
  } catch (error) {
    console.error("Error saving poll to the database:", error);
    res.status(500).json({ error: "Error saving poll to the database" });
  }
});

//Update poll
app.put("/api/polls/:id", async(req, res) => {
  const { name, description, options } = req.body;
  const { id } = req.params;
  try {
    const poll = await Poll.findById(id);
    if(!poll) {
      return res.status(404).json({ error: "Poll not found"});
    }
    poll.name = name;
    poll.description = description;
    poll.options = options;
    await poll.save;
    res.json(poll);
  } catch (error) {
    console.error("Error saving poll to the database:", error);
    res.status(500).json({ error: "Error saving poll to the database" });
  }
})


//Link to send to friends
app.get("/api/polls/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const poll = await Poll.findById(id);
    if(!poll) {
      return res.status(404).json({ error: "Poll not found"});
    }
    res.json(poll);
  } catch (error) {
    console.error("Error fetching items from poll:", error);
    res.status(500).json({ error: "Error fetching poll" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});