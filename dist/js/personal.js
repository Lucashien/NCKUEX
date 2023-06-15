$(document).ready(function () {
    /* ////////////////////////////////////// */
    $('.personal').find('.filter').click(function () {
        $('.personal').find('.filter').not(this).find('.content').removeClass('active');
        $(this).find('.content').toggleClass('active');
    });

    $(document).click(function (event) {
        if (!$(event.target).closest('.filter').length) {
            $('.personal').find('.filter .active').removeClass('active');
        }
    })

    /* ////////////////////////////////////// */
    let collegeTarget;
    let departmentTarget;
    let gradeTarget;
    let lectureTarget;
    let teacherTarget;
    let yearTarget;
    let clasTarget;

    $('.personal').find('#college .content').on('click', 'li', function (event) {
        collegeTarget = event.target.innerText;
        $('.personal').find('#college .header li').text(collegeTarget);
        $('.personal').find('#department .header li').text('-請選擇-');
        $('.personal').find('#lecture .header li').text('-請選擇-');
        $('.personal').find('#teacher .header li').text('-請選擇-');
        updateContent('department')
    });

    $('.personal').find('#department .content').on('click', 'li', function (event) {
        departmentTarget = event.target.innerText;
        $('.personal').find('#department .header li').text(departmentTarget);
        $('.personal').find('#lecture .header li').text('-請選擇-');
        $('.personal').find('#teacher .header li').text('-請選擇-');
        updateContent('lecture')
    });

    $('.personal').find('#grade .content').on('click', 'li', function (event) {
        gradeTarget = event.target.innerText;
        $('.personal').find('#grade .header li').text(gradeTarget);
        $('.personal').find('#lecture .header li').text('-請選擇-');
        $('.personal').find('#teacher .header li').text('-請選擇-');
        updateContent('lecture')
    });

    $('.personal').find('#lecture .content').on('click', 'li', function (event) {
        lectureTarget = event.target.innerText;
        $('.personal').find('#lecture .header li').text(lectureTarget);
        $('.personal').find('#teacher .header li').text('-請選擇-');
        updateContent('teacher')
    });

    $('.personal').find('#teacher .content').on('click', 'li', function (event) {
        teacherTarget = event.target.innerText;
        $('.personal').find('#teacher .header li').text(teacherTarget);
    });

    $('.personal').find('#year .content').on('click', 'li', function (event) {
        yearTarget = event.target.innerText;
        $('.personal').find('#year .header li').text(yearTarget);
    });

    $('.personal').find('.personal #clas').on('click', 'div', function (event) {
        $(this).addClass('active').siblings().removeClass('active');
        if ($(this).attr('id') == 'exam') { clasTarget = '大考' }
        if ($(this).attr('id') == 'quiz') { clasTarget = '小考' }
        if ($(this).attr('id') == 'homework') { clasTarget = '作業' }
        if ($(this).attr('id') == 'other') { clasTarget = '其他' }
    });


    /* ////////////////////////////////////// */

    function updateContent(target) {
        $.get('/update' + target + '', {
            json: target,
            col: collegeTarget,
            dep: departmentTarget,
            grade: gradeTarget,
            lec: lectureTarget
        }, (data) => {
            $('.personal').find('#' + target + ' .content ul').html(data);
        });
    }

    /* ////////////////////////////////////// */

    /*上傳後顯示表單*/
    $('.personal').find('#file').on('change', function () {
        $('.personal').find('.upload_container').css('display', 'none');
        $('.personal').find('.upload_info').css('display', 'block');
    })

    const fileInput = document.getElementById('file');

    fileInput.addEventListener('change', function () {
        console.log("File Changed");
        const fileName = fileInput.files[0].name;
        // fileNamePlaceholder.textContent = fileName;
        $('.file_name p').text(fileName);
    });
})


// 抓取使用者選取的檔案資訊
$('.confirm_button').on('click', function () {
    const selectElements = document.querySelectorAll('.personal .header li');
    const doc_info = [];
    var flag = false;
    // 迭代選取到的 <li> 元素，擷取並存儲內容
    selectElements.forEach((element) => {
        console.log(element);
        const content = element.textContent;
        doc_info.push(content);
        if (content == "-請選擇-") {
            flag = true;
        }
    });
    if (flag) {
        alert("有選項沒選");
        return;
    }
    console.log(doc_info);

    const activeChoise = document.querySelector('.choise.active');
    var clas = "";
    if (activeChoise) {
        var idValue = activeChoise.id;
        console.log(idValue);
        if (idValue == "exam") clas = "大考"
        else if (idValue == "quiz") clas = "小考"
        else if (idValue == "homework") clas = "作業"
        else if (idValue == "other") clas = "其他"
        doc_info.push(clas);
    }

    var fileInput = document.getElementById('file');
    var file = fileInput.files[0]; // 取得選擇的檔案
    // 使用 FormData 將檔案包裝起來
    var formData = new FormData();
    formData.append('file', file);
    formData.append('doc_info', doc_info);

    // 發送 Fetch 請求
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            if (data == "上傳成功")
                alert("上傳成功！");
        })
        .catch(error => {
            // 處理錯誤的邏輯
            console.error(error);
        });
})