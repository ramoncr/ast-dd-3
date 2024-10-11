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
    res.render("invoice/invoice", { invoice: matchedInvoices[0] });
  } else {
    res.render("invoice/invoice", { invoice: null });
  }
});

router.get("/", async function (req, res, next) {
  const filter = {};

  if(req.userId){
    filter.userId = req.userId;
  }

  const invoices = await db.invoices.findAll(filter);
  res.render("invoice/invoices", { invoices });
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
        res.render("invoice/invoices", { invoices: data });
      } else {
        res.render("invoice/invoices", { invoices: [] });
      }
    })
    .catch((err) => {
      res.render("invoice/invoices", { invoices: [] });
    });
});

router.post("/search", async function (req, res, next) {
  try {
    const searchText = req.body.searchText;

    const [result, metadata] = await db.sequelize.query(
      `SELECT * FROM invoices WHERE title LIKE '%${searchText}%' OR description LIKE '%${searchText}%'`
    );
  
    console.log(result);
  
    if (result) {
      res.render("invoice/invoices", {invoices: result, searchText});
    } else {
      res.render("invoice/invoices", null);
    }
  } catch(error) {
    res.status(500).send(error);
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
