var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const express = require('express');
const xpath = require('xpath');
const { DOMParser} = require('xmldom');
const axios = require('axios');
const cors = require('cors');

var indexRouter = require('./index.router');

var app = express();

// view engine setup
app.set('view engine', 'jade');

// NEW SECTION

app.use(express.json());
app.use(cors());

app.post('/scrapper', (req,res) => {
    const { body} = req;
    const { url } = url;

    return prUrl(url) 
        .then((result) => res.json(result));
});



const xps = {
    title: 'string(//meta[@property="og:title"]/@content)',
    description: 'string(//meta[@property="og:description"]/@content)',
    image: 'string(//meta[@property="og:image"]/@content)',    
};

const covertBToDOc = body => new DOMParser().parseFromString(body);
const retPage = url => axios.request({ url });
const nodFDoc = (document, xpathselector) => xpath.select(xpathselector, document);
const mapP = (paths, document) => 
Object.keys(paths).reduce((acc, key) => 
    ({ ...acc, [key]: nodFDoc(document, paths[key])
    })
)


const prUrl = url => 
    retrievePage(url)
        .then((res) => {
                const document = covertBToDOc(res.data);
                const mappedProperties = mapP(xps, document);
                return mappedProperties;
        });


        // end section

        
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

if(process.env.NODE_ENV === 'test') {
    module.exports = (port) => {
        return app.listen(port || process.env.PORT || 8000);
    };
} else {
    app.listen(process.env.PORT || 8000);
    module.exports = app;
}
