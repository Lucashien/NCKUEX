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

  // 點擊非浮動視窗會關閉
  const modal_else = document.createElement("div");
  modal_else.id = "modal_else";
  document.body.appendChild(modal_else);

  fetch("./personal_page.html")
    .then(response => response.text())
    .then(html => {
      modal.innerHTML = html;
      modal.classList.add("visible");
      const fileUploader = document.querySelector('[data-target="upload"]');
      fileUploader.addEventListener("change", handleFileUpload);
    });

  modal.setAttribute("tabindex", "0");
  modal.focus();
  modal.addEventListener("keydown", function (e) {
    console.log("keydown")
    if (e.key == 'Escape' || e.key == ' ') // 按esc或空白鍵
      closeModal();
  });

  modal_else.addEventListener("click", closeModal);
}


// 功能：點擊非浮動視窗時，關閉浮動視窗
function closeModal() {
  console.log("close modal");
  const modal = document.getElementById("modal");
  const modal_else = document.getElementById("modal_else");

  if (modal) {
    modal.style.opacity = 0;
    modal.style.transition = "opacity 0.5s ease-in-out";
    setTimeout(function () {
      modal.classList.remove("visible");
      modal.innerHTML = "";
      document.body.removeChild(modal);
    }, 500); // 等待 0.5 秒後，再移除浮動視窗
  }

  if (modal_else) {
    modal_else.classList.remove("visible");
    modal.classList.add("invisible");
    modal_else.innerHTML = "";
    document.body.removeChild(modal_else);
  }
}

/* Upload */
// STEP 1: select element and register change event
const fileUploader = document.querySelector('[data-target="upload"]');
var FileName = "";



// 當input '有動靜'，執行handlFileUpload
// fileUploader.addEventListener("change", handleFileUpload);

async function handleFileUpload(event) {
  console.log("upload!");
  try {
    const file = event.target.files[0];
    FileName = file.name;
    // setUploading(true);
    if (!file) return; // 沒上傳就沒動靜

    // 1. 確認檔案是否符合上傳規格
    const beforeUploadCheck = await beforeUpload(file);
    if (!beforeUploadCheck.isValid) throw beforeUploadCheck.errorMessages; // 不符合就丟出錯誤

    // 建立緩衝array
    const arrayBuffer = await getArrayBuffer(file); // 拿到2進位的資料型態
    const response = await uploadFileAJAX(arrayBuffer);

    alert("File Uploaded Success"); //上傳成功!
  }

  catch (error) {
    alert(error);
    console.log("Catch Error: ", error);
  }

  finally {
    event.target.value = '';  // reset input file
    // setUploading(false);
  }
}

// STEP 3: change file object into ArrayBuffer
function getArrayBuffer(fileObj) {
  return new Promise((resolve, reject) => {

    // FileReader為JS內建API，可以讀取本地端的檔案並以特定的格式將其轉換成字串或二進制資料
    const reader = new FileReader();
    // Get ArrayBuffer when FileReader on load
    reader.addEventListener("load", () => {
      resolve(reader.result);
    });

    // Get Error when FileReader on error
    reader.addEventListener("error", () => {
      reject("error occurred in getArrayBuffer");
    });

    // 執行完這行後，fileObj的資料就會轉換成2進位給reader，並且履行上方的promise行為
    reader.readAsArrayBuffer(fileObj);
  });
}

// STEP 4: upload file throguth AJAX
function uploadFileAJAX(arrayBuffer) {
  // correct it to your own API endpoint
  return fetch("/file", {
    // 設定特定content-type
    headers: {
      version: 1,
      "content-type": "application/json"
    },
    method: "POST",

    // fetch 的請求主體，將body送到後端
    body:
      JSON.stringify({
        imageId: FileName,
        FileContent: Array.from(new Uint8Array(arrayBuffer))
      })
  })
}

// STEP 5: Create before upload checker if needed
// 確認檔案是否符合上傳規格
function beforeUpload(fileObject) {
  return new Promise(resolve => {
    const validFileTypes = ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const isValidFileType = validFileTypes.includes(fileObject.type);
    let errorMessages = [];

    if (!isValidFileType) {
      errorMessages.push("You can only upload JPG or PNG file!");
    }

    const isValidFileSize = fileObject.size / 1024 / 1024 < 25;
    if (!isValidFileSize) {
      errorMessages.push("Image must smaller than 25MB!");
    }

    resolve({
      isValid: isValidFileType && isValidFileSize,
      errorMessages: errorMessages.join("\n")
    });
  });
}


