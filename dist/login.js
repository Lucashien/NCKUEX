function Get_member_info(response) {
    var credential = response.credential,
        profile = JSON.parse(decodeURIComponent(escape(window.atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))))), // 對 JWT 進行解碼
        target = document.getElementById("GOOGLE_STATUS_1"),
        html = "";

    html += "ID: " + profile.sub + "<br/>";
    html += "會員暱稱： " + profile.name + "<br/>";
    html += "會員 email：" + profile.email + "<br/>";
    target.innerHTML = html;

    // 在這裡可進行後續的驗證處理、後端呼叫等等
    // 當驗證成功後，您可以進行頁面跳轉或其他操作
    // window.location.href = "./sort.html"; // 頁面跳轉至 sort.html
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function handleCallback(response) {
    const data = parseJwt(response.credential);
    console.log(data);
}
