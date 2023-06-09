$(document).ready(function () {
    /* ////////////////////////////////////// */

    $('#login').click(function () {
        login();
    })

    function login() {
        window.location.href = 'http://luffy.ee.ncku.edu.tw:6412/auth/google';
    }


    fetch('/NickName')
        .then(response => response.text())
        .then(data => {
            console.log("data =", data);
            if (data == "Edit nickname")
                $('.modal').css('display', 'flex').css('opacity', '1');
        })
        .catch(error => {
            // 處理錯誤
            console.error(error);
        });


    $.get('/UserInfo', {
    }, (data) => {
        if (data) {
            userID = data.id;
        }
    })

    /* ////////////////////////////////////// */

    $('#done').click(function () {
        $.get('/UserInfoChange', {
            userpic: $('#userpic').attr('src'),
            username: $('#username').val(),
            userID: userID
        }, (data) => {
            window.location.href = 'http://luffy.ee.ncku.edu.tw:6412/sort.html'
        });
    })

    /* ////////////////////////////////////// */

    $('#quit').click(function () {
        $('.modal').css('display', 'none').css('opacity', '0');
        $.get('/logout', {
        }, (data) => {
        });
    })

    $('#visitor').click(function () {
        window.location.href = 'http://luffy.ee.ncku.edu.tw:6412/sort.html'
    })

    /* ////////////////////////////////////// */
})