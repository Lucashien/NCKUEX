$(document).ready(function() {
/* ////////////////////////////////////// */
$(' .filter').click(function() {
    $(' .filter').not(this).find(' .content').removeClass('active');
    $(this).find(' .content').toggleClass('active');
});
    
$(document).click(function(event) {
    if (!$(event.target).closest(' .filter').length) {
        $(' .filter .active').removeClass('active');
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

$(' #college .content').on('click', 'li', function(event) {
  collegeTarget = event.target.innerText;
  $(' #college .header li').text(collegeTarget);
  $(' #department .header li').text('-請選擇-');
  $(' #lecture .header li').text('-請選擇-');
  $(' #teacher .header li').text('-請選擇-');
  updateContent('department')
});

$(' #department .content').on('click', 'li', function(event) {
    departmentTarget = event.target.innerText;
    $(' #department .header li').text(departmentTarget);
    $(' #lecture .header li').text('-請選擇-');
    $(' #teacher .header li').text('-請選擇-');
    updateContent('lecture')
});

$(' #grade .content').on('click', 'li', function(event) {
    gradeTarget = event.target.innerText;
    $(' #grade .header li').text(gradeTarget);
    $(' #lecture .header li').text('-請選擇-');
    $(' #teacher .header li').text('-請選擇-');
    updateContent('lecture')
});

$(' #lecture .content').on('click', 'li', function(event) {
    lectureTarget = event.target.innerText;
    $(' #lecture .header li').text(lectureTarget);
    $(' #teacher .header li').text('-請選擇-');
    updateContent('teacher')
});

$(' #teacher .content').on('click', 'li', function(event) {
    teacherTarget = event.target.innerText;
    $(' #teacher .header li').text(teacherTarget);
});

$(' #year .content').on('click', 'li', function(event) {
    yearTarget = event.target.innerText;
    $(' #year .header li').text(yearTarget);
});

$(' #clas .content').on('click', 'li', function(event) {
    clasTarget = event.target.innerText;
    $(' #clas .header li').text(clasTarget);
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
})