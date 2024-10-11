const express = require("express");
const router = express.Router();
const db = require("../models");
const multer = require("multer");
const upload = multer({ dest: __dirname + "/../../uploads/plugins/" });

/* GET used plugins listing. */
router.get("/", async function (req, res, next) {
  const plugins = await db.plugins.findAll();
  res.render("plugins/plugins", { plugins });
});

/* GET create new plugin */
router.get("/new", async function (req, res, next) {
  res.render("plugins/new-plugin");
});

router.get("/attach/:id", async function (req, res, next) {
  let plugins = await db.plugins.findAll({ where: { id: req.params.id } });
  if (plugins.length === 1) {
    let plugin = plugins[0];
    const pluginPath = plugin.storageLocation;
    try {
      const plugin = require(pluginPath);
      await plugin["attach"]();
      plugin["attach"]().then(() => {
        console.log("Plugin " + plugin.name + " reattached");
      });
      res.redirect("/plugins");
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  } else {
    res.redirect("/plugins");
  }
});

/* POST create new plugin */
router.post("/", upload.single("plugins"), async function (req, res) {
  const filePath = req.file.path;
  if (req.file.originalname.endsWith(".js")) {
    // Try and load the plugin, if this fails we should return a 500.
    // When it succeeds we add it to the db
    try {
      const plugin = require(filePath);
      plugin["attach"]().then(() => {
        console.log("Plugin " + req.body.name + " attached");
      });
      db.plugins.create({
        name: req.body.name,
        version: req.body.version,
        isActive: true,
        storageLocation: filePath,
        description: req.body.description,
      });
      res.redirect("/plugins");
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  }
});

module.exports = router;
