
const express = require('express');
const router = express.Router();
const path = require('path')

const multer = require('multer')

const File = require('../models/file')
const { v4: uuid4 } = require('uuid')

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})
let upload = multer({
    storage,
    limits: { fileSize: 10000000 * 100 }

}).single('myfile')

router.get('/', (req, res) => {
    console.log(req.body)
    // store files
    upload(req, res, async (err) => {
        // Validate request
        // console.log('....................................', req)
        if (!req.file) {
            return res.json({ error: ' Fields are required.' })
        }
        if (err) {
            return res.status(500).send({ error: err.message })
        }
        const file = new File({
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            uuid: uuid4(),
            // sender: { type: String, required: false },
            // reciver: { type: String, required: false },
        });

        const response = await file.save();
        return res.json({ file: `${process.env.APP_BASE_URL}/file/${response.uuid}` })
    });
    //store into databae

});

router.post('/send', async (req, res) => {
    console.log(req.body)

    const { uuid, emailTo, emailFrom } = req.body;
    

    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All filed  required' })
    }

    const file = await File.findOne({ uuid: uuid })

    if (file.sender) {
        return res.status(422).send({ error: "Mail already sent" })
    }

    file.sender = emailFrom;
    file.reciver = emailTo;

    const response = await file.save();

    const sendMail = require('../services/emailServices')

    sendMail({
        from: emailFrom,
        to: emailTo,
        text: `${emailFrom} Share a file with you`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            fileSize: parseInt(file.size / 1000) + 'KB',
            expires: '24 Hours'
        })
    });
    return res.send({ success: true })
})

module.exports = router