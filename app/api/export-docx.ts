import { htmlDocx } from "html-docx-js";

const express = require('express');
const app = express();

app.get('/', (res) => {
    // const { name, id } = req.params;
    // const pages = await getCoursePages(id);
    let html = `<p> Hello world</p>`;
    const docx = htmlDocx.asBlob(html);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${ 'hello.docx' }.docx`);
    res.setHeader('Content-Length', docx.length);
    res.send(docx);
})