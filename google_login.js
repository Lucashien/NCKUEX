const express = require('express')
const app = express()

const querystring = require('querystring')
const axios = require('axios')
const bodyParser = require('body-parser')

const port = 3000

//parameter
const client_id =
    '你的clientId'
const client_secret = '你的clientSecret'
const root = 'http://localhost:3000'
const redirect_url = root + '/auth/google/callback'

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.listen(3000, () => {
    console.log(`operate server on port: ${port}`)
})

//登入頁面
app.get('/login', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

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
    res.redirect(`${auth_url}?${querystring.stringify(query)}`)
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

    //利用tokne取得需要的資料
    const { id_token, access_token } = response.data
    const getData = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
            headers: {
                Authorization: `Bearer ${id_token}`
            }
        }
    )

    //轉址指定頁面
    res.redirect('/success')
})

app.get('/success', (req, res) => {
    res.send('get data from google successfully')
})