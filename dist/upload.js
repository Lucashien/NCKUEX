// STEP 1: select element and register change event
const imagePreview = document.querySelector('[data-target="image-preview"]');
const spinner = document.querySelector('[data-target="spinner"]');
const fileUploader = document.querySelector('[data-target="file-uploader"]');
var FileName = "";
// 當input '有動靜'，執行handlFileUpload
fileUploader.addEventListener("change", handleFileUpload);

//
async function handleFileUpload(event) {
  try {
    const file = event.target.files[0];
    FileName = file.name;
    setUploading(true);
    if (!file) return; // 沒上傳就沒動靜

    // 1. 確認檔案是否符合上傳規格
    const beforeUploadCheck = await beforeUpload(file);
    if (!beforeUploadCheck.isValid) throw beforeUploadCheck.errorMessages; // 不符合就丟出錯誤

    // 建立緩衝array
    const arrayBuffer = await getArrayBuffer(file); // 拿到2進位的資料型態
    const response = await uploadFileAJAX(arrayBuffer);

    alert("File Uploaded Success"); //上傳成功!
    showPreviewImage(file);
  }

  catch (error) {
    alert(error);
    console.log("Catch Error: ", error);
  }

  finally {
    event.target.value = '';  // reset input file
    setUploading(false);
  }
}

// STEP 2: showPreviewImage with createObjectURL
// If you prefer Base64 image, use "FileReader.readAsDataURL"
function showPreviewImage(fileObj) {
  const image = URL.createObjectURL(fileObj);
  imagePreview.src = image;
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

    const isValidFileSize = fileObject.size / 1024 / 1024 < 2;
    if (!isValidFileSize) {
      errorMessages.push("Image must smaller than 2MB!");
    }

    resolve({
      isValid: isValidFileType && isValidFileSize,
      errorMessages: errorMessages.join("\n")
    });
  });
}


function setUploading(isUploading) {
  if (isUploading === true) {
    spinner.classList.add("opacity-1");
  } else {
    spinner.classList.remove("opacity-1");
  }
}
