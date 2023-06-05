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

// File upload
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
        HTML += htmlWriter(data[id], id)
      }
    }
    if (HTML == '') {
      HTML = '<h1>太糟了！這裡沒有任何死人骨頭<h1>';
    }
    res.send(HTML);
  });
});

function htmlWriter(data, id) {
  const html = fs.readFileSync('./dist/html/document.html', 'utf8');
  const $ = cheerio.load(html);
  $('.document').attr('id', id);
  $('.year h4').text(data.year);
  $('.teacher h4').text(data.teac);
  $('.like h4').text(data.like.count);
  $('.name h4:eq(0)').text(data.clas);
  $('.name h4:eq(1)').text(data.name);
  $('.tag img:eq(0)').attr('style', 'display: ' + (data.tagA.score > 3.5 ? 'block' : 'none'));
  $('.tag img:eq(1)').attr('style', 'display: ' + (data.tagB.score > 3.5 ? 'block' : 'none'));
  $('.uploader img:eq(0)').attr('src', './img/userpic/' + data.pic);
  $('.uploader h4').text(data.up);
  $('.uploader img:eq(1)').attr('style', 'opacity:' + (data.award == 1 ? 1 : 0));
  return $.html()
}

/* ////////////////////////////////////// */
app.get('/updatelecture', (req, res) => {
  fs.readFile('./' + req.query.json + '.json', 'utf8', function (err, data) {
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

app.get('/updatedepartment', (req, res) => {
  fs.readFile('./' + req.query.json + '.json', 'utf8', function (err, data) {
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

app.get('/updateteacher', (req, res) => {
  fs.readFile('./lecture.json', 'utf8', function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (data[id].name == req.query.lec) {
        // HTML += '<li>' + data[id].teac + '</li>';
      }
    }
    res.send(HTML);
  });
});
/* ////////////////////////////////////// */

import cheerio from 'cheerio';

app.get('/view', (req, res) => {
  console.log("get view");
  fs.readFile('./dist/view.html', 'utf8', function (err, html) {
    if (err) throw err;
    fs.readFile('./document.json', 'utf8', function (err, data) {
      if (err) throw err;
      data = JSON.parse(data);
      const $ = cheerio.load(html);
      $('#title h1').text(data[req.query.doc].lec);
      $('#teac').text('教師 | ' + data[req.query.doc].teac);
      $('#year').text('年份 | ' + data[req.query.doc].year);
      $('#clas').text('類別 | ' + data[req.query.doc].clas);
      $('#userpic img').attr('src', './img/userpic/' + data[req.query.doc].pic);
      $('#up').text(data[req.query.doc].up);
      $('#download a').attr('href', './upload/' + data[req.query.doc].url);
      console.log(data[req.query.doc].like.user);
      let like = data[req.query.doc].like.user.includes(req.query.userID);
      res.send([$.html(), like]);
    });
  })
});

app.get('/preview_personal', (req, res) => {
  fs.readFile('./dist/preview_personal.html', 'utf8', function (err, html) {
    if (err) throw err;
    res.send(html);
  })
});

app.get('/personal_page', (req, res) => {
  fs.readFile('./dist/personal_page.html', 'utf8', function (err, html) {
    if (err) throw err;
    res.send(html);
  })
});

/* ////////////////////////////////////// */

app.get('/like', (req, res) => {
  fs.readFile('document.json', 'utf8', (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    if (data[req.query.doc].like.user.includes(req.query.userID)) {
      res.send('已讚')
    }
    else {
      data[req.query.doc].like.user.push(req.query.userID);
      data[req.query.doc].like.count = data[req.query.doc].like.user.length;
      fs.writeFile('./document.json', JSON.stringify(data), 'utf8', function (err) {
        if (err) throw err;
      });
      res.send('按讚成功')
    }
  });
});

app.get('/tagA', (req, res) => {
  fs.readFile('document.json', 'utf8', (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    // if (req.query.userID in data[req.query.doc].tagA.user) {
    //   res.send('已評分')
    //  }
    // else{
    data[req.query.doc].tagA.user[req.query.userID] = req.query.score;
    let score = 0;
    for (let id in data[req.query.doc].tagA.user) {
      score += parseInt(data[req.query.doc].tagA.user[id]);
    }
    data[req.query.doc].tagA.score = score / Object.keys(data[req.query.doc].tagA.user).length;
    fs.writeFile('./document.json', JSON.stringify(data), 'utf8', function (err) {
      if (err) throw err;
      res.send('評分成功');
    });
    //}
  });
});

app.get('/tagB', (req, res) => {
  fs.readFile('document.json', 'utf8', (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    // if (req.query.userID in data[req.query.doc].tagB.user) {
    //   res.send('已評分')
    //  }
    // else{
    data[req.query.doc].tagB.user[req.query.userID] = req.query.score;
    let score = 0;
    for (let id in data[req.query.doc].tagB.user) {
      score += parseInt(data[req.query.doc].tagB.user[id]);
    }
    data[req.query.doc].tagB.score = score / Object.keys(data[req.query.doc].tagB.user).length;
    fs.writeFile('./document.json', JSON.stringify(data), 'utf8', function (err) {
      if (err) throw err;
      res.send('評分成功');
    });
    //}
  });
});

/* ////////////////////////////////////// */


/*------------------Google login------------------*/
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

  // console.log(getData.data)
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

/*------------------<Database part>------------------*/
// 連接Database
import mysql from "mysql";
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


/*------------------File Upload Test Block------------------*/
import multer from "multer";
import path from "path";
// 設定上傳檔案的儲存位置和檔名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'dist/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// 建立multer上傳物件
const upload = multer({ storage: storage });

// 處理檔案上傳和資訊輸入的請求
app.post('/upload', upload.single('file'), (req, res) => {
  // 取得使用者輸入的檔案資訊
  const { filename, courseName, category, teacher } = req.body;
  const file = req.file;
  const extname = path.extname(file.originalname);
  fs.rename(file.path, file.destination + courseName + "_" + teacher + "_" + category + "_" + filename + Date.now() + extname, function (err) {
    if (err) {
      res.send("重命名錯誤");
    } else {
      res.send("檔案上傳成功");
    }
  });
});
/**/