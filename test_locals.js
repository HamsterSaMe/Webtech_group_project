const express = require('express');
const path = require('path');
const app = express();
app.set('views', __dirname);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use((req, res, next) => {
    res.locals.testVar = 'hello';
    next();
});

app.get('/', (req, res) => {
    res.render('test_view');
});

const fs = require('fs');
fs.writeFileSync(path.join(__dirname, 'test_view.html'), '<%= testVar %>');

const server = app.listen(3001, async () => {
    try {
        const resp = await fetch('http://localhost:3001/');
        const text = await resp.text();
        console.log("RESPONSE:", text);
    } catch (e) {
        console.error("ERROR:", e);
    }
    server.close();
    fs.unlinkSync(path.join(__dirname, 'test_view.html'));
});
