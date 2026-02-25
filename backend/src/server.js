const express = require("express");
const cors = require("cors");

const deityRoutes = require("./routes/deity.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🕉 Dharma API Running");
});

app.use("/api/deities", deityRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
