const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb://himanshumishra1699_db_user:hitman123@ac-6nhs4no-shard-00-00.m6rtcb1.mongodb.net:27017,ac-6nhs4no-shard-00-01.m6rtcb1.mongodb.net:27017,ac-6nhs4no-shard-00-02.m6rtcb1.mongodb.net:27017/crm?ssl=true&replicaSet=atlas-76tfro-shard-0&authSource=admin&retryWrites=true&w=majority")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));
// Schema
const LeadSchema = new mongoose.Schema({
  name: String,
  status: String
});

const Lead = mongoose.model("Lead", LeadSchema);

// Routes
app.get("/", (req,res)=>{
  res.send("Server Running 🚀");
});

app.get("/leads", async (req,res)=>{
  const leads = await Lead.find();
  res.json(leads);
});

app.post("/leads", async (req,res)=>{
  const lead = new Lead(req.body);
  await lead.save();
  res.json(lead);
});
   app.put("/leads/:id", async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/leads/:id", async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, ()=>{
  console.log("Server running on port 5000");
});