const express = require('express');
const bodyParser = require('body-parser');
const ejsMate = require('ejs-mate');
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios').default;


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    let array = {}
    let Image = ""
    res.render('index', { array, Image })
})

app.post('/', async (req, res) => {

    try {
        let www = req.body.url
        console.log(typeof (www))
        let response, html, $, description, ogType;
        let array = {};
        response = await axios.get(www)
        html = response.data;
        array = [];
        $ = cheerio.load(html);
        function getMeta(name) {
            let ans = $(`meta[property=og:${name}]`).attr('content')
            return ans
        }
        let Image = getMeta("image") || $(`meta[name=image]`).attr('content') || "unfound.png"
        array = {
            URL: www,
            Title: getMeta("title") || $(`meta[name=title]`).attr('content') || "NOT FOUND",
            Type: getMeta("type") || $(`meta[name=type]`).attr('content') || "NOT FOUND",
            Description: $(`meta[name=description]`).attr('content') || getMeta("description") || "NOT FOUND"
        }
        res.render('index', { array, Image })
    }
    catch (e) {
        res.send(e)
    }
})

const port = process.env.PORT || 3000

app.listen(port, (err) => {
    if (err) console.log("Error in server setup")
    console.log('Serving on port 3000')
});