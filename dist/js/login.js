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
            processData(data)
                .then(() => {
                    if (data == "Edit nickname")
                        $('.modal').css('display', 'flex').css('opacity', '1');
                    else {
                        console.log("跳轉");
                        window.location.href = 'http://luffy.ee.ncku.edu.tw:6412/sort.html';
                    }
                })

        })
        .catch(error => {
            // 處理錯誤
            console.error(error);
        });

    function loading() {
        let loading = $('<div>').addClass('loading');
        $('body').append(loading);
        $.get('/loading', {
        }, (data) => {
            $('.loading').html(data);
        });
    }

    function processData(data) {
        loading();
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('處理完成');
            }, 2000);
        });
    }

    $.get('/UserInfo', {
    }, (data) => {
        if (data) {
            userID = data.id;
        }
    })

    /* ////////////////////////////////////// */

    $('#done').click(function () {
        $.get('/UserInfoChange', {
            // userpic: $('#userpic').attr('src'),
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