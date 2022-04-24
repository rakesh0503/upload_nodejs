const express = require('express');
// const connectDB = require('./config/db');
const app = express()
const path = require('path')

const PORT = process.env.PORT || 4000
app.use(express.static('public'))
app.use(express.json());

const connectDb = require('./config/db');
connectDb();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

const fileApi = require('./routes/file');
// app.use('/api/file', require('./routes/file'));
app.use('/api/file',fileApi);


app.use('/files', require('./routes/show'));
// app.use('/send',require('./routes/file'));
app.use('/files/download',require('./routes/download'))



app.listen(PORT, () => {
    console.log(`Listing on port ${PORT}`)
}) 