// 載入 `express`, 現在可以放心使用 `import` 了
import express from 'express'
// const express = require('express')

import { dirname } from 'path'
import { fileURLToPath } from 'url'

// google 登入用
import querystring from 'querystring'
import axios from 'axios'
import session from 'express-session'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 建立一個 express (也就是網頁伺服器)實體
const app = express()
const port = 8888
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
  fs.readFile('./document.json', 'utf8', function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (data[id].lec == req.query.lec && data[id].clas == req.query.clas) {
        HTML += htmlWriter(data[id]);
      }
    }
    if (HTML == '') {
      HTML = '<h1>太糟了！這裡沒有任何死人骨頭<h1>';
    }
    res.send(HTML);
  });
});

app.get('/documentSearch', (req, res) => {
  fs.readFile('./document.json', 'utf8', function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (data[id].name.includes(req.query.search) ||
        data[id].dep.includes(req.query.search) ||
        data[id].lec.includes(req.query.search) ||
        data[id].teac.includes(req.query.search) ||
        data[id].clas.includes(req.query.search) ||
        data[id].up.includes(req.query.search)
      ) {
        HTML += htmlWriter(data[id]);
      }
    }
    if (HTML == '') {
      HTML = '<h1>太糟了！這裡沒有任何死人骨頭<h1>';
    }
    res.send(HTML);
  });
});

function htmlWriter(id) {
  let HTML = '';
  HTML += '<div class="document" id=' + id + '>' +
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
  fs.readFile('./department.json', 'utf8', function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (data[id].col == req.query.col) {
        HTML += '<li>' + data[id].name + '</li>';
      }
    }
    res.send(HTML);
  });
});

app.get('/updateLecture', (req, res) => {
  fs.readFile('./lecture.json', 'utf8', function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (data[id].dep == req.query.dep && (req.query.grade == null || data[id].grade == req.query.grade)) {
        HTML += '<li>' + data[id].name + '</li>';
      }
    }
    res.send(HTML);
  });
});

app.get('/update', (req, res) => {
  fs.readFile('./' + req.query.json + '.json', 'utf8', function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (req.query.col != null) {
        if (data[id].col == req.query.col) {
          HTML += '<li>' + data[id].name + '</li>';
        }
      }
      if (req.query.dep != null) {
        if (data[id].dep == req.query.dep && (req.query.grade == null || data[id].grade == req.query.grade)) {
          HTML += '<li>' + data[id].name + '</li>';
        }
      }
    }
    res.send(HTML);
  });
});

/* ////////////////////////////////////// */

app.get('/data', (req, res) => {
  res.send('hello idiot');
});

app.get('/page', (req, res) => {
  fs.readFile('./dist/' + req.query.page + '.html', 'utf8', function (err, data) {
    if (err) throw err;
    res.send(data);
  })
});

app.get('/downloadLink', (req, res) => {
  fs.readFile('./document.json', 'utf8', function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let url;
    for (let id in data) {
      if (data[id].name == req.query.name) {
        url = data[id].url;
        break;
      }
    }
    res.send(url);
  });
});

/* ////////////////////////////////////// */


/*Google login*/

//parameter
const client_id = '770897758084-pmf9c33inv3pt39eo65fvapl6971v0lu.apps.googleusercontent.com'
const client_secret = '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'
const root = 'http://localhost:8888'
const redirect_url = root + '/auth/google/callback'

//google登入連結
app.get('/auth/google', (req, res) => {
  const query = {
    redirect_uri: redirect_url,
    client_id: client_id,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' ')
  }
  const auth_url = 'https://accounts.google.com/o/oauth2/v2/auth'

  // console.log("query", query);
  console.log(`${auth_url}?${querystring.stringify(query)}`)
  res.redirect(`${auth_url}?${querystring.stringify(query)}`) // 將Grant傳到uri
})

//授權過後回傳到callback內
app.get('/auth/google/callback', async (req, res) => {
  // 取得token
  const code = req.query.code
  const options = {
    code,
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_url,
    grant_type: 'authorization_code'
  }
  const url = 'https://oauth2.googleapis.com/token'
  const response = await axios.post(url, querystring.stringify(options))

  //利用token取得需要的資料
  const { id_token, access_token } = response.data
  const getData = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
    {
      headers: { Authorization: `Bearer ${id_token}` }
    }
  )

  console.log(getData.data)
  //轉址指定頁面
  res.redirect('/sort.html')

  console.log("Login success");

  // 更新資料庫
  const insertQuery = `INSERT INTO user_info (id, email, verified_email, username, given_name, family_name, picture, locale, hd) VALUES ('${getData.data.id}', '${getData.data.email}', ${getData.data.verified_email}, '${getData.data.name}', '${getData.data.given_name}', '${getData.data.family_name}', '${getData.data.picture}', '${getData.data.locale}', '${getData.data.hd}')`;

  connection.query(insertQuery, [getData.data.id, getData.data.email, getData.data.verified_email, getData.data.name, getData.data.given_name, getData.data.family_name, getData.data.picture, getData.data.locale, getData.data.hd], (error, results) => {
    if (error) {
      if (error.code == "ER_DUP_ENTRY") {
        console.log("歡迎！", getData.data.name);
      }
      else console.error('哭阿出錯啦！', error);
    }
    else {
      console.log(`新用戶${getData.data.name}資料已加入資料庫`);
    }
  });

  setUserInfo(getData.data);
})




app.get('/success', (req, res) => {
  res.send('get data from google successfully')
})

/*------------------<Database part>-----------------*/
// 連接Database
import mysql from "mysql";
import { get } from 'http'

const connection = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  port: 3306,
  password: '',
  database: `NCKUEX`
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed!\n' + err.stack);
    return;
  }
  console.log('Database connection successful!');
});


let UserInfo_global;
function setUserInfo(UserInfo) {
  connection.query(`select * from user_info where email = '${UserInfo.email}'`, (error, results, fields) => {
    if (error) throw error;
    UserInfo_global = results;
    // console.log("UserInfo = ", UserInfo);
  });
}

// 把UserInfo送到前端
app.get('/UserInfo', (req, res) => {
  res.send(UserInfo_global[0]);
});