// 載入 `express`, 現在可以放心使用 `import` 了
import express from 'express'
// const express = require('express')

import { dirname, extname } from 'path'
import { fileURLToPath } from 'url'

// google 登入用
import querystring from 'querystring'
import axios from 'axios'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 建立一個 express (也就是網頁伺服器)實體
const app = express()
const port = 6412
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
    let promises = [];
    for (let id in data) {
      if (data[id].lec == req.query.lec && data[id].clas == req.query.clas) {
        promises.push(htmlWriter(data[id], id));
      }
    }
    Promise.all(promises)
      .then(htmls => {
        let HTML = htmls.join('');

        if (HTML == '') {
          HTML = '<h1>太糟了！這裡沒有任何死人骨頭<h1>';
        }

        res.send(HTML);
      })
      .catch(error => {
        console.error(error);
        res.send('出错了');
      });
  });
});

app.get('/documentSearch', (req, res) => {
  fs.readFile('./document.json', 'utf8', function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let promises = []; // 保存所有异步操作的 Promise

    for (let id in data) {
      if (data[id].name.includes(req.query.search) ||
        data[id].dep.includes(req.query.search) ||
        data[id].lec.includes(req.query.search) ||
        data[id].teac.includes(req.query.search) ||
        data[id].clas.includes(req.query.search) ||
        data[id].upid.includes(req.query.search)
      ) {
        promises.push(htmlWriter(data[id], id));
      }
    }

    Promise.all(promises)
      .then(htmls => {
        let HTML = htmls.join('');

        if (HTML == '') {
          HTML = '<h1>太糟了！這裡沒有任何死人骨頭<h1>';
        }

        res.send(HTML);
      })
      .catch(error => {
        console.error(error);
        res.send('出错了');
      });
  });
});


async function htmlWriter(data, id) {
  const html = fs.readFileSync('./dist/html/document.html', 'utf8');
  const $ = cheerio.load(html);
  $('.document').attr('id', id);
  $('.year h4').text(data.year);
  $('.teacher h4').text(data.teac);
  $('.like h4').text(data.like.count);
  $('.name img').attr('src', './img/個人頁面_' + data.clas + '標籤.png');
  $('.name h4').text(data.name);
  $('.tag img:eq(0)').attr('style', 'display: ' + (data.tagA.score > 3.5 ? 'block' : 'none'));
  $('.tag img:eq(1)').attr('style', 'display: ' + (data.tagB.score > 3.5 ? 'block' : 'none'));
  let user = await htmlUser(data.upid);
  $('.uploader h4').text(user[0]).attr('id', data.upid);
  $('.uploader img:eq(0)').attr('src', user[1]);
  $('.uploader img:eq(1)').attr('style', 'opacity:' + user[2]);
  return $.html()
}

async function htmlUser(id) {
  return new Promise((resolve, reject) => {
    fs.readFile('./user.json', 'utf8', function (err, user) {
      if (err) reject(err);
      user = JSON.parse(user);
      resolve([user[id].name, user[id].picture, user[id].award]);
    });
  })
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
        for (let i in data[id].teacher) {
          HTML += '<li>' + data[id].teacher[i] + '</li>';
        }
      }
    }
    res.send(HTML);
  });
});
/* ////////////////////////////////////// */

import cheerio from 'cheerio';

app.get('/view', (req, res) => {
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
      $('#download a').attr('href', './uploads/' + data[req.query.doc].url);
      let like = data[req.query.doc].like.user.includes(req.query.userID);
      let rate = false;
      if (data[req.query.doc].tagA.user[req.query.userID]) { rate = true };
      if (like) { $('#like img:eq(0)').attr('src', './img/like2.png') }
      if (rate) { $('#rate img:eq(0)').attr('src', './img/rate2.png') }
      res.send([$.html(), like, rate]);
    });
  })
});

app.get('/viewUploader', (req, res) => {
  fs.readFile('./user.json', 'utf8', function (err, user) {
    if (err) throw err;
    user = JSON.parse(user);
    res.send([user[req.query.upid].name, user[req.query.upid].picture, user[req.query.upid].award]);
  });
});


app.get('/personal', (req, res) => {
  fs.readFile('./dist/personal.html', 'utf8', function (err, html) {
    if (err) throw err;
    res.send(html);
  })
});

app.get('/loading', (req, res) => {
  fs.readFile('./dist/html/loading.html', 'utf8', function (err, html) {
    if (err) throw err;
    res.send(html);
  })
});

/* ////////////////////////////////////// */

app.get('/person', (req, res) => {
  fs.readFile('./dist/' + req.query.tar + '.html', 'utf8', function (err, html) {
    if (err) throw err;
    fs.readFile('./user.json', 'utf8', function (err, user) {
      if (err) throw err;
      user = JSON.parse(user);
      const $ = cheerio.load(html);
      $('.pic img').attr('src', user[req.query.userID].picture);
      $('.nickname p').text(user[req.query.userID].name)
      var chineseName = user[req.query.userID].given_name.replace(/[^\u4E00-\u9FA5]/g, '');
      $('.name p').text(chineseName);
      $('.dep p').text(user[req.query.userID].dep_year);
      $('.fire').css('display', (user[req.query.userID].award === 1 ? 'block' : 'none'))
      res.send($.html());
    });
  })
});

app.get('/personaldoc', (req, res) => {
  fs.readFile('./document.json', 'utf8', function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    let doccount = 0;
    let doclikecount = 0;
    for (let id in data) {
      if (data[id].upid == req.query.userID) {
        HTML += psdochtmlwrite(data[id]);
        doccount += 1;
        doclikecount += 1;
      }
    }
    res.send([HTML, doccount, doclikecount]);
  });
});

function psdochtmlwrite(data, id) {
  const html = fs.readFileSync('./dist/html/persondoc.html', 'utf8');
  const $ = cheerio.load(html);
  $('.file_1').attr('id', id);
  $('.file_clas img').attr('src', './img/個人頁面_' + data.clas + '標籤.png');
  $('.file_detail p').eq(0).text(data.lec);
  $('.file_detail p').eq(1).text(data.year);
  return $.html()
}

/* ////////////////////////////////////// */

app.get('/like', (req, res) => {
  fs.readFile('document.json', 'utf8', (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    if (data[req.query.doc].like.user.includes(req.query.userID)) {
      const index = data[req.query.doc].like.user.indexOf(req.query.userID);
      if (index > -1) {
        data[req.query.doc].like.user.splice(index, 1);
      }
      data[req.query.doc].like.count = data[req.query.doc].like.user.length;
      fs.writeFile('./document.json', JSON.stringify(data), 'utf8', function (err) {
        if (err) throw err;
      });
      res.send('倒讚幫')
    }
    else {
      data[req.query.doc].like.user.push(req.query.userID);
      data[req.query.doc].like.count = data[req.query.doc].like.user.length;
      fs.writeFile('./document.json', JSON.stringify(data), 'utf8', function (err) {
        if (err) throw err;
        res.send('按讚成功')
      });
    }
  });
});

/* ////////////////////////////////////// */

app.get('/rate', (req, res) => {
  fs.readFile('document.json', 'utf8', (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    data[req.query.doc].tagA.user[req.query.userID] = req.query.score[0];
    let scoreA = 0;
    for (let id in data[req.query.doc].tagA.user) {
      scoreA += parseInt(data[req.query.doc].tagA.user[id]);
    }
    data[req.query.doc].tagA.score = scoreA / Object.keys(data[req.query.doc].tagA.user).length;
    data[req.query.doc].tagB.user[req.query.userID] = req.query.score[1];
    let scoreB = 0;
    for (let id in data[req.query.doc].tagB.user) {
      scoreB += parseInt(data[req.query.doc].tagB.user[id]);
    }
    data[req.query.doc].tagB.score = scoreB / Object.keys(data[req.query.doc].tagB.user).length;
    fs.writeFile('./document.json', JSON.stringify(data), 'utf8', function (err) {
      if (err) throw err;
      res.send('評分成功');
    });
  });
});

/* ////////////////////////////////////// */

/*------------------維持登入------------------*/
import cookieParser from 'cookie-parser';
import session from 'express-session';
app.use(cookieParser());
app.use(session({
  secret: 'mySecret',
  name: 'user',      // optional
  saveUninitialized: false,
  resave: true,
}));

/*MiddleWare*/
function auth(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    return res.redirect('/')
  }
}


/*------------------Google login------------------*/
//parameter
const client_id = '770897758084-pmf9c33inv3pt39eo65fvapl6971v0lu.apps.googleusercontent.com'
const client_secret = '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'
const root = 'http://luffy.ee.ncku.edu.tw:6412'
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

  req.session.user = getData.data // 加密的cookie

  res.redirect('/welcome');
  saveUserData(getData.data, req)

})

function ADDloginCnt(studentID, req) {
  fs.readFile('user.json', 'utf8', (err, jsonString) => {
    if (err) {
      console.log('Error reading file:', err);
      return;
    }

    try {
      const data = JSON.parse(jsonString);
      data[studentID]["loginCnt"]++;
      // 更新user.json文件
      fs.writeFile('user.json', JSON.stringify(data), 'utf8', (err) => {
        if (err) {
          console.log('Error writing file:', err);
          return;
        }
      })
    }
    catch (error) {
      console.log('Error parsing JSON:', error);
    }
  });
}

app.get('/welcome', auth, (req, res) => {
  const userName = req.session.user.given_name
  const studentID = req.session.user.family_name;
  ADDloginCnt(studentID, req);

  console.log(`${userName} 已登入`);
  res.redirect('/login.html')
})

app.get('/logout', (req, res) => {
  console.log(`${req.session.user.given_name} 已登出`);
  req.session.destroy();
  res.clearCookie("user");
  res.redirect('/login.html');
})

/*------------------把新註冊使用者資料註冊進JSON------------------*/
function saveUserData(userData, req) {
  // 讀取現有的 JSON 檔案
  let jsonData = {};
  try {
    const existingData = fs.readFileSync('user.json');
    jsonData = JSON.parse(existingData);

  } catch (error) {
    // 若檔案不存在或解析失敗，忽略錯誤，並將 jsonData 設為空物件
    console.error('Error reading existing file:', error);
  }

  // 判斷是否已註冊
  if (jsonData.hasOwnProperty(userData.family_name)) return;
  delete userData["verified_email"];
  delete userData["locale"];
  delete userData["hd"];

  userData.dep_year = Dep_Year(userData.family_name);
  userData.picture = "./img/userpic/小恐龍.png"
  userData.award = "0";
  userData.loginCnt = 0;

  // 將新的使用者資料以 "family_name" 屬性值為主鍵加入 jsonData 物件
  jsonData[userData.family_name] = userData;
  // 寫入更新後的 JSON 資料到檔案
  const data = JSON.stringify(jsonData, null, 2);
  fs.writeFile('user.json', data, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log(`新註冊成員：${jsonData[userData.family_name].given_name}`);
  });
}

function Dep_Year(studentID) {
  const id = studentID.substring(0, 2);
  var dep = "雜系ㄏㄏ";
  if (id == "E7") dep = "建築系"
  else if (id == "F2") dep = "都計"
  else if (id == "F3") dep = "工設"
  else if (id == "FZ") dep = "規設"
  else if (id == "E0") dep = "工院"
  else if (id == "E1") dep = "機械"
  else if (id == "E3") dep = "化工"
  else if (id == "E4") dep = "資源"
  else if (id == "E5") dep = "材料"
  else if (id == "E6") dep = "土木"
  else if (id == "E8") dep = "水利"
  else if (id == "E9") dep = "工科"
  else if (id == "F0") dep = "能源"
  else if (id == "F1") dep = "系統"
  else if (id == "F4") dep = "航太"
  else if (id == "F5") dep = "環工"
  else if (id == "F6") dep = "測量"
  else if (id == "F9") dep = "醫工"
  else if (id == "D0") dep = "社科"
  else if (id == "D2") dep = "法律"
  else if (id == "D4") dep = "政治"
  else if (id == "D5") dep = "經濟"
  else if (id == "D8") dep = "心理"
  else if (id == "I2") dep = "護理"
  else if (id == "I3") dep = "醫技"
  else if (id == "I5") dep = "醫學"
  else if (id == "I6") dep = "物治"
  else if (id == "I7") dep = "職治"
  else if (id == "I8") dep = "藥學"
  else if (id == "I9") dep = "牙醫"
  else if (id == "H1") dep = "會計"
  else if (id == "H2") dep = "統計"
  else if (id == "H3") dep = "工資"
  else if (id == "H4") dep = "企管"
  else if (id == "H5") dep = "交管"
  else if (id == "HZ") dep = "管院"
  else if (id == "B0") dep = "文院"
  else if (id == "B1") dep = "中文"
  else if (id == "B2") dep = "外文"
  else if (id == "B3") dep = "歷史"
  else if (id == "B5") dep = "台文"
  else if (id == "C1") dep = "數學"
  else if (id == "C2") dep = "物理"
  else if (id == "C3") dep = "化學"
  else if (id == "C4") dep = "地科"
  else if (id == "CZ") dep = "理學院"
  else if (id == "F8") dep = "光電"
  else if (id == "E2") dep = "電機"
  else if (id == "F7") dep = "資訊"
  else if (id == "C5") dep = "生科"
  else if (id == "C6") dep = "生技"
  else if (id == "J0") dep = "敏求"
  else if (id == "AN") dep = "不分系"
  else if (id == "C0") dep = "科學班"

  const year = 100 + parseInt(studentID.substring(3, 5)) + 4;
  if (id == "I5") year += 2;
  return dep + year.toString();
}

/*------------------File Upload------------------*/
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
  let doc_info = req.body.doc_info.split(',');
  const [col, dep, grade, lec, teac, year, clas] = doc_info;
  const file = req.file, filename = file.filename, name = file.originalname;
  console.log("file", file)
  const extname = path.extname(file.originalname);
  const label = Date.now();

  res.redirect("/upload2JSON?col=" + col + "&dep=" +
    dep + "&grade=" + grade + "&lec=" + lec + "&teac=" +
    teac + "&year=" + year + "&clas=" + clas +
    "&filename=" + filename + "&label=" + label + "&name=" + name);

});

app.get('/upload2JSON', (req, res) => {
  const { col, dep, grade, lec, teac, year, clas, filename, label, name } = req.query;
  console.log(req.query)
  const data = {
    [label]: {
      name: name,
      url: filename,
      year,
      dep,
      lec,
      teac,
      clas,
      upid: req.session.user.family_name,
      like: {
        count: 0,
        user: []
      },
      tagA: { score: 0, user: {} },
      tagB: { score: 0, user: {} }
    }
  };

  fs.readFile('document.json', 'utf-8', (err, fileData) => {
    if (err) {
      console.error(err);
      res.send("讀取 JSON 檔案失敗");
    } else {
      let existingData = {};
      try {
        existingData = JSON.parse(fileData);
      } catch (err) {
        console.error(err);
      }

      existingData = { ...existingData, ...data };

      fs.writeFile('document.json', JSON.stringify(existingData), (err) => {
        if (err) {
          // console.error(err);
          res.send("寫入 JSON 檔案失敗");
        } else {
          // console.log("JSON 檔案寫入成功");
          res.send("上傳成功");
        }
      });
    }
  });
});
/**/

/*---------------登入後使用者資訊---------------*/
// 把UserInfo送到前端
app.get('/UserInfo', (req, res) => {
  res.send(req.session.user);
});

app.get('/UserInfo_pic', (req, res) => {
  fs.readFile('./user.json', 'utf8', function (err, data) {
    data = JSON.parse(data);
    let user = req.session.user;
    try {
      res.send(data[user.family_name].picture);
    } catch (err) { }
  })
});

app.get('/UserInfo_JSON', (req, res) => {
  fs.readFile('./user.json', 'utf8', function (err, data) {
    data = JSON.parse(data);
    let user = req.session.user;
    try {
      // console.log(data[user.family_name]);
      res.send(data[user.family_name]);
    } catch (err) { }
  })
});

/*-----------------改名小視窗-----------------*/
app.get('/UserInfoChange', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);

    data[req.session.user.family_name].name = req.query.username;
    // data[req.session.user.family_name].picture = req.query.userpic;

    fs.writeFile('./user.json', JSON.stringify(data), 'utf8', function (err) {
      if (err) throw err;
    });
    res.send('修改成功')
  })
});

app.get('/UserInfoRead', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    for (let i in data) {
      if (data[i].id == req.query.userID) {
        res.send(data[i]);
      }
    }
  })
})

app.get('/NickName', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) throw err;

    data = JSON.parse(data);
    try {
      const studentID = req.session.user.family_name;
      if (data[studentID].loginCnt == 1)//要改
        res.send("Edit nickname");
      else
        res.send("Login");

    } catch (err) { }


  })
});


/* Personal */
const storage_userpic = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'dist/img/userpic');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// 創建 multer 中間件
const upload_pic = multer({ storage: storage_userpic });
// 定義上傳圖片的路由處理
app.post('/upload_userpic', upload_pic.single('file'), (req, res) => {
  // 取得使用者輸入的檔案資訊
  const file = req.file

  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    data[req.session.user.family_name].picture = file.path.substring(5);

    fs.writeFile('./user.json', JSON.stringify(data), 'utf8', function (err) {
      if (err) throw err;
    });
  });



});