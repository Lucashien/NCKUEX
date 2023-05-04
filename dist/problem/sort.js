let collegeTarget = 7;
let departmentTarget = 0;
let gradeTarget = null;
let lectureTarget = null;

let departmentData = [
  ['建築系', '都計系', '工設系', '規劃設計學院學士'],
  ['工學院', '機械系', '化工系', '資源系', '材料系', '土木系', '水利系', '工科系', '能源學程', '系統系', '航太系', '環工系', '測量系', '醫工系'],
  ['社會科學院', '法律系', '政治系', '經濟系', '心理系'],
  ['護理系', '醫技系', '醫學系', '物治系', '職治系', '藥學系', '牙醫系'],
  ['會計系', '統計系', '工資系', '企管系', '交管系', '管理學院'],
  ['文學院學士班', '中文系', '外文系', '歷史系', '台文系'],
  ['數學系', '物理系', '化學系', '地科系', '理學院學士班', '光電系'],
  ['電機系', '資訊系'],
  ['生科系', '生技系'],
  ['智慧半導體及永續製造學院'],
  ['敏求學院課程'],
  ['不分系學程', '科學班'],
];

let lectureData = [
  ['微積分', '線性代數', '程式設計', '物理學'],
  ['離散數學', '資料結構與演算法', '電路學', '計算機組織'],
  ['作業系統', '編譯器', '資料庫系統', '計算機網路'],
  ['人工智慧', '機器學習', '資訊安全', '分散式系統'],
  ['高等演算法', '資訊檢索', '自然語言處理', '深度學習']
];

let teacherData = Array.from({ length: 5 }, () =>
  Array.from({ length: 4 }, () => new Array(3).fill('謝宗翰'))
);

/* ////////////////////////////////////// */
//點擊展開列表

let leftList = ['college', 'department'];
let rightList = ['lecture', 'teacher', 'year', 'clas'];

function active(selector) {
  document.getElementById(selector).addEventListener('click', function () {
    this.classList.toggle('active');
  });
}

for (let i = 0; i < leftList.length; i++) {
  active(leftList[i]);
}
for (let i = 0; i < rightList.length; i++) {
  active(rightList[i]);
}
/* ////////////////////////////////////// */
//點擊其他地方收起列表

function removeActive(event, selector) {
  if (!event.target.closest('#' + selector)) {
    document.querySelectorAll('#' + selector + '.active').forEach(function (el) {
      el.classList.remove('active');
    });
  }
}

document.addEventListener('click', function (event) {
  for (let i = 0; i < leftList.length; i++) {
    removeActive(event, leftList[i], 0);
  }
  for (let i = 0; i < rightList.length; i++) {
    removeActive(event, rightList[i], 1);
  }
});

/* ////////////////////////////////////// */
//學院科系選擇器

let college = document.querySelector('#college .content ul');
let department = document.querySelector('#department .content ul');
let collegeHeader = document.querySelector('#college .header li');
let departmentHeader = document.querySelector('#department .header li');

college.addEventListener('click', function (event) {
  if (event.target.tagName === 'LI') {
    collegeTarget = Array.from(college.children).indexOf(event.target);
    changeHeader(collegeHeader, event.target);
    changeContent(departmentData, collegeTarget, department);
    departmentHeader.innerText = '-請選擇科系-';
    departmentTarget = null;
  }
});

department.addEventListener('click', function (event) {
  if (event.target.tagName === 'LI') {
    departmentTarget = Array.from(department.children).indexOf(event.target);
    changeHeader(departmentHeader, event.target);
  }
});

function changeHeader(selectorHeader, target) {
  selectorHeader.innerText = target.innerText;
  removeActiveGrade();
  lectureTarget = null;
  departmentJudgement();
}
/* ////////////////////////////////////// */
//年級選擇器

let grade = document.querySelectorAll('#grade li');

grade.forEach(function (li) {
  li.addEventListener('click', function () {
    removeActiveGrade();
    this.classList.add('active');
    gradeTarget = Array.from(grade).indexOf(this);
    departmentJudgement()
  });
});

function removeActiveGrade() {
  document.querySelectorAll('#grade li.active').forEach(function (el) {
    el.classList.remove('active');
  });
  gradeTarget = null;
}

/* ////////////////////////////////////// */
//課程教師選擇器

let lecture = document.querySelector('#lecture .content ul');
let teacher = document.querySelector('#teacher .content ul');

departmentJudgement()

lecture.addEventListener('click', function (event) {
  if (event.target.tagName === 'LI') {
    lectureTarget = Array.from(lecture.children).indexOf(event.target);
    departmentJudgement();
  }
});

teacher.addEventListener('click', function (event) {
  if (event.target.tagName === 'LI') {
    teacherTarget = Array.from(teacher.children).indexOf(event.target);
  }
});

/* ////////////////////////////////////// */
//年份類別選擇器

let year = document.querySelector('#year .content ul');
let clas = document.querySelector('#clas .content ul');
let yearTarget = null;
let clasTarget = null;

year.addEventListener('click', function (event) {
  if (event.target.tagName === 'LI') {
    yearTarget = Array.from(year.children).indexOf(event.target);
  }
});

clas.addEventListener('click', function (event) {
  if (event.target.tagName === 'LI') {
    clasTarget = Array.from(clas.children).indexOf(event.target);
  }
});

/* ////////////////////////////////////// */
//抽換列表內容的公式

function changeContent(data, index, output) {
  let HTML = '';
  if (index == null) {
    for (let index = 0; index < data.length; index++) {
      for (let i = 0; i < data[index].length; i++) {
        HTML += '<li>' + data[index][i] + '</li>';
      }
    }
  }
  else {
    for (let i = 0; i < data[index].length; i++) {
      HTML += '<li>' + data[index][i] + '</li>';
    }
  }
  output.innerHTML = HTML;
}

function changeContent3D(data, index1, index2, output) {
  let HTML = '';
  if (index1 == null || index2 == null) {
    for (let index1 = 0; index1 < data.length; index1++) {
      for (let index2 = 0; index2 < data[index1].length; index2++) {
        for (let i = 0; i < data[index1][index2].length; i++) {
          HTML += '<li>' + data[index1][index2][i] + '</li>';
        }
      }
    }
  }
  if (index1 != null && index2 != null) {
    for (let i = 0; i < data[index1][index2].length; i++) {
      HTML += '<li>' + data[index1][index2][i] + '</li>';
    }
  }
  output.innerHTML = HTML;
}

function departmentJudgement() {
  if (collegeTarget == 7 && departmentTarget == 0) {
    changeContent(lectureData, gradeTarget, lecture);
    changeContent3D(teacherData, gradeTarget, lectureTarget, teacher);
  }
  else {
    lecture.innerHTML = '<li></li>';
    teacher.innerHTML = '<li></li>';
  }
}

/* ////////////////////////////////////// */


// From 宗宗
// 點擊頭像時，顯示出個人頁面
function showModal() {
  const modal = document.createElement("div");
  modal.id = "modal";
  document.body.appendChild(modal);

  fetch("./personal_page.html")
    .then(response => response.text())
    .then(html => {
      modal.innerHTML = html;
      modal.classList.add("visible");
    });
}


// 功能：點擊非浮動視窗時，關閉浮動視窗
// 獲取頁面 A 的 body 元素
const body = document.body;

// 添加點擊事件監聽器
body.addEventListener('click', (event) => {
  // 判斷事件觸發的目標元素是否為頁面 B 或頁面 B 中的元素
  if (!modal.contains(event.target)) {
    // 如果不是，就關閉頁面 B
    modal.style.display = 'none';
  }
});