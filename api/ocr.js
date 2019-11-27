const app = require('express')()
const Tesseract = require('tesseract.js');

module.exports = { path: '/api', handler: app }
app.get('/ocr', (req, res) => {
    Tesseract.recognize(
        'https://tesseract.projectnaptha.com/img/eng_bw.png',
        'eng', { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        console.log(text);
        res.send(text);
    })
})
app.get('/ocr/:stdId', function(req, res) {
    res.send(req.params)
})