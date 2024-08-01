const express = require('express');
const router = express.Router();
const db = require("../../models");
const multer  = require('multer')
const upload = multer({ dest: __dirname + '/../../uploads/plugins/' })


/* GET used plugins listing. */
router.get('/', async function(req, res, next) {
    const plugins = await db.plugins;
    res.json(plugins);
});

/* POST create new plugin */
router.post('/', upload.single('plugins'), async function(req, res) {
    const filePath = req.file.path;
    if(filePath.endsWith('.js')) {

        // Try and load the plugin, if this fails we should return a 500.
        // When it succeeds we add it to the db
        try {
            const plugin = require(filePath);
            plugin['attach']();

            db.plugins
                .create({
                    name: req.body.name,
                    version: req.body.version,
                    isActive: true,
                    storageLocation: filePath,
                });
        } catch(error) {
            console.error(error);
            res.status(500).send();
        }
    }
});

module.exports = router;