const port = 3999;
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const xmlparser = require('express-xml-bodyparser');

app.use(bodyParser.json({limit: '2000mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "2000mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.text({ limit: '2000mb' }));
app.use(xmlparser());
app.use(express.json());
app.use(cors());



app.get('/', (req, res) => {
    res.send('Succesful response')
});

const login = require('./routes/login');
app.use('/login', login)

const users = require('./routes/users');
app.use('/users', users)

const general = require('./routes/general');
app.use('/general', general)




app.listen(port, () => console.log(`Your vinyls online Backend is running on port: ${port}`));
