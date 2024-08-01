const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/:invoiceNumber/pdf', async function(req, res, next) {
    const invoiceNumber = req.params.invoiceNumber;

    let url = req.query.url ? req.query.url : "http://localhost:3000/invoice/"
    url = url + invoiceNumber;

    const inst = await puppeteer.launch();
    const page = await inst.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('screen');
    const pdf = await page.pdf({
        path: 'invoice.pdf',
        margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
        printBackground: true,
        format: 'A4',
      });

    await inst.close();
    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachment;filename=invoice.pdf',
        'Content-Length': pdf.length
    });
    res.end(pdf);
});

module.exports = router;
