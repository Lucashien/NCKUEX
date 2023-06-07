$(document).ready(function() {
/* ////////////////////////////////////// */
$('.personal').find('.filter').click(function() {
    $('.personal').find(' .filter').not(this).find(' .content').removeClass('active');
    $(this).find(' .content').toggleClass('active');
});
    
$(document).click(function(event) {
    if (!$(event.target).closest(' .filter').length) {
        $('.personal').find(' .filter .active').removeClass('active');
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

$('.personal').find('#college .content').on('click', 'li', function(event) {
    collegeTarget = event.target.innerText;
    $('.personal').find(' #college .header li').text(collegeTarget);
    $('.personal').find(' #department .header li').text('-請選擇-');
    $('.personal').find(' #lecture .header li').text('-請選擇-');
    $('.personal').find(' #teacher .header li').text('-請選擇-');
    updateContent('department')
});

$('.personal').find('#department .content').on('click', 'li', function(event) {
    departmentTarget = event.target.innerText;
    $('.personal').find(' #department .header li').text(departmentTarget);
    $('.personal').find(' #lecture .header li').text('-請選擇-');
    $('.personal').find(' #teacher .header li').text('-請選擇-');
    updateContent('lecture')
});

$('.personal').find('#grade .content').on('click', 'li', function(event) {
    gradeTarget = event.target.innerText;
    $('.personal').find(' #grade .header li').text(gradeTarget);
    $('.personal').find(' #lecture .header li').text('-請選擇-');
    $('.personal').find(' #teacher .header li').text('-請選擇-');
    updateContent('lecture')
});

$('.personal').find('#lecture .content').on('click', 'li', function(event) {
    lectureTarget = event.target.innerText;
    $('.personal').find(' #lecture .header li').text(lectureTarget);
    $('.personal').find(' #teacher .header li').text('-請選擇-');
    updateContent('teacher')
});

$('.personal').find('#teacher .content').on('click', 'li', function(event) {
    teacherTarget = event.target.innerText;
    $('.personal').find(' #teacher .header li').text(teacherTarget);
});

$('.personal').find('#year .content').on('click', 'li', function(event) {
    yearTarget = event.target.innerText;
    $('.personal').find(' #year .header li').text(yearTarget);
});

$('.personal').find('#clas .content').on('click', 'li', function(event) {
    clasTarget = event.target.innerText;
    $('.personal').find(' #clas .header li').text(clasTarget);
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
        $('#' + target + ' .content ul').html(data);
    });
}

/* ////////////////////////////////////// */
$('.personal').find('#file').on('change', function() {
    $('.personal').find('.upload_container').css('display', 'none');
    $('.personal').find('.upload_info').css('display', 'block');
})

/* ////////////////////////////////////// */
})


