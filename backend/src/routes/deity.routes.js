const express = require("express");
const router = express.Router();
const deities = require("../data/deities.json");

// GET all deities
router.get("/", (req, res) => {
  res.json(deities);
});

// GET deity by slug
router.get("/:slug", (req, res) => {
  const { slug } = req.params;

  const deity = deities.find((d) => d.slug === slug);

  if (!deity) {
    return res.status(404).json({
      success: false,
      message: "Deity not found",
    });
  }

  res.json({
    success: true,
    data: deity,
  });
});

module.exports = router;
