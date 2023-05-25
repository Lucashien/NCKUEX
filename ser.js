// 載入 `express`, 現在可以放心使用 `import` 了
import express from 'express'
// const express = require('express')

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 建立一個 express (也就是網頁伺服器)實體
const app = express()
const port = 8788
// 啟動伺服器
app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})

app.use(express.static(`${__dirname}/dist`))

import bodyParser from 'body-parser'
import fs from 'fs';
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

// jQuery.post(url,data,success(data, textStatus, jqXHR),dataType)
app.post("/file", (req, res) => {
  const icon = Buffer.from(req.body.FileContent, "base64");
  // 其他格式直接寫入檔案
  fs.writeFile(`./upload/${req.body.imageId}`, icon, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      console.log("The file has been saved!");
      res.sendStatus(200);
    }
  });

});

/* ////////////////////////////////////// */

app.get('/documentSelect', (req, res) => {
  fs.readFile('./document.json', 'utf8', function(err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (data[id].lec == req.query.lec && data[id].clas == req.query.clas) {
        HTML += htmlWriter(data[id]);
    }}
    if (HTML == '') {
      HTML = '<h1>太糟了！這裡沒有任何死人骨頭<h1>';
    }
    res.send(HTML);
  });
});

app.get('/documentSearch', (req, res) => {
  fs.readFile('./document.json', 'utf8', function(err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (data[id].name.includes(req.query.search)||
      data[id].dep.includes(req.query.search)||
      data[id].lec.includes(req.query.search)||
      data[id].teac.includes(req.query.search)||
      data[id].clas.includes(req.query.search)||
      data[id].up.includes(req.query.search)
        ) {
        HTML += htmlWriter(data[id]);
    }}
    if (HTML == '') {
      HTML = '<h1>太糟了！這裡沒有任何死人骨頭<h1>';
    }
    res.send(HTML);
  });
});

function htmlWriter(id){
    let HTML = '';
      HTML += '<div class="document" id=' +  id + '>' +
      '<div class="year container">' +
        '<h4>' + id.year + '</h4></div>' +
      '<div class="teacher container">' +
        '<h4>' + id.teac + '</h4></div>' +
      '<div class="name container">' +
        '<h4>' + id.clas + ' | ' + id.name + '</h4></div>' +
      '<div class="like container"><img src="./img/like.png">' +
        '<h4>' + id.like + '</h4></div>' +
      '<div class="uploader container"><img src="./img/userpic/' + id.pic + '">' +
        '<p>' + id.up + '</p>' +
        '<img class="award" src="./img/check.png" style="opacity: ' + id.award + ';"></div>' +
      '<div class="tag container"><div>' +
          '<div class="tagA" style="display: ' + (id.tagA === "1" ? "flex" : "none") + '; padding: .1vw;">' +
            '<img src="./img/check.png"><p>內容完整</p></div>' +
          '<div class="tagB" style="display: ' + (id.tagB === "1" ? "flex" : "none") + '; padding: .1vw;">' +
            '<img src="./img/check.png"><p>解題過程</p></div></div></div></div>';
    return HTML
  }

/* ////////////////////////////////////// */

app.get('/updateDepartment', (req, res) => {
  fs.readFile('./department.json', 'utf8', function(err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (data[id].col == req.query.col) {
        HTML += '<li>' + data[id].name + '</li>';
    }}
    res.send(HTML);
  });
});

app.get('/updateLecture', (req, res) => {
  fs.readFile('./lecture.json', 'utf8', function(err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (data[id].dep == req.query.dep && (req.query.grade == null || data[id].grade == req.query.grade)) {
        HTML += '<li>' + data[id].name + '</li>';
    }}
    res.send(HTML);
  });
});

app.get('/update', (req, res) => {
  fs.readFile('./' + req.query.json + '.json', 'utf8', function(err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (req.query.col != null){
        if (data[id].col == req.query.col) {
          HTML += '<li>' + data[id].name + '</li>';
      }}
      if (req.query.dep != null){
        if (data[id].dep == req.query.dep && (req.query.grade == null || data[id].grade == req.query.grade)) {
          HTML += '<li>' + data[id].name + '</li>';
      }}
    }
    res.send(HTML);
  });
});

/* ////////////////////////////////////// */

app.get('/data', (req, res) => {
  res.send('hello idiot');
});

app.get('/page', (req, res) => {
  fs.readFile('./dist/' + req.query.page + '.html', 'utf8', function(err, data) {
    if (err) throw err;
    res.send(data);
  })
});

app.get('/downloadLink', (req, res) => {
  fs.readFile('./document.json', 'utf8', function(err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let url;
    for (let id in data) {
      if (data[id].name == req.query.name){
        url = data[id].url;
        break;
    }}
    res.send(url);
  });
});

/* ////////////////////////////////////// */



