const express = require("express");
const router = express.Router();
const db = require("../models");
const { Op } = require("sequelize");

/* GET users listing. */
router.get("/:invoiceNumber", async function (req, res, next) {
  const invoiceNumber = req.params.invoiceNumber;
  const matchedInvoices = await db.invoices.findAll({
    where: {
      id: invoiceNumber,
    },
  });

  if (matchedInvoices.length == 1) {
    res.render("invoice", { invoice: matchedInvoices[0] });
  } else {
    res.render("invoice", { invoice: null });
  }
});

router.get("/", async function (req, res, next) {
  const invoices = await db.invoices.findAll();
  res.render("invoices", { invoices });
});

/**
 * Example request body:
 * {
 *   condition: { title: 'Test*' }
 * }
 */

router.post("/filter", function (req, res, next) {
  const condition = req.body.condition;

  condition[Op.and] = { userId: req.userId }
  db.invoices
    .findAll({
      where: condition,
    })
    .then((data) => {
      if (data) {
        res.render("invoices", { invoices: data });
      } else {
        res.render("invoices", { invoices: [] });
      }
    })
    .catch((err) => {
      res.render("invoices", { invoices: [] });
    });
});

router.post("/search", async function (req, res, next) {
  const searchText = req.body.searchText;

  const [result, metadata] = await sequelize.query(
    `SELECT * FROM invoices WHERE content LIKE '${searchText}'`
  );

  if (result) {
    res.render("invoice", result);
  } else {
    res.render("invoice", null);
  }
});

router.post("/", async function (req, res, next) {
  const model = req.body;

  if (!model.name || !model.amount) {
    res.status(400);
    res.send({
      message: "Invalid model request",
    });
  }

  const combinedData = Object.assign(
    {
      ownerId: User.GetUserId(),
    },
    model
  );

  var instance = Invoice.Build(combinedData);
  await instance.save();
});


router.post("/import", async function (req, res, next) {
  const model = req.body;
  let invoices = JSON.parse(model.invoices);
  
  for (let index = 0; index < array.length; index++) {
    const invoice = invoices[index];
    let existing_invoice = await db.invoices.findAll({
      where: {
        id: invoice.id
      }
    })

    if (existing_invoice.length === 1) {
      merge(existing_invoice, invoice);
      await existing_invoice.save();
    }   
  }

});
module.exports = router;
