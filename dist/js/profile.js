const $upload = $('#upload'),
    $crop = $('#crop'),
    $result = $('#result'),
    $croppie = $('#croppie');
var cr,
    cr_img = '',
    img_w = 360,
    img_h = 360,
    isCrop = 0;
//支援上傳檔案判斷
$(function () {
    if (window.File && window.FileList && window.FileReader)
        fileInit();
    else
        alert('您的裝置不支援圖片上傳');
});
//圖片上傳及拖曳上傳
var fileselect = document.getElementById("fileselect"),
    filedrag = document.getElementById("filedrag");
function fileInit() {
    // file select
    fileselect.addEventListener("change", FileSelectHandler, false);
    // is XHR2 available?
    var xhr = new XMLHttpRequest();
    // file drop
    if (xhr.upload) {
        filedrag.addEventListener("dragover", FileDragHover, false);
        filedrag.addEventListener("dragleave", FileDragHover, false);
        filedrag.addEventListener("drop", FileSelectHandler, false);
    }
}
// file selection
function FileSelectHandler(e) {
    // cancel event and hover styling
    FileDragHover(e);
    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;
    if (files[0] && files[0].type.match('image.*')) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $upload.hide();
            if (cr_img == '') { //第一次上傳
                cr_img = e.target.result;
                cropInit();
            }
            else {// 綁定圖片
                cr_img = e.target.result;
                bindCropImg();
            }
            $crop.fadeIn(300);
        }
        reader.readAsDataURL(files[0]);
    }
}
// file drag hover
function FileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    filedrag.className = (e.type == "dragover" ? "hover" : "");
}


//裁切設定
function cropInit() {
    cr = $croppie.croppie({
        viewport: {
            width: img_w,
            height: img_h
        },
        boundary: {
            width: img_w,
            height: img_h
        },
        mouseWheelZoom: false,
        enableOrientation: true
    });

    $(".cr-slider-wrap").append('<button id="cr-rotate" onClick="cropRotate(-90);">↻ Rotate</button>');

    bindCropImg();
}
//綁定圖片
function bindCropImg() {
    cr.croppie('bind', {
        url: cr_img
    });
}
//旋轉按鈕
function cropRotate(deg) {
    cr.croppie('rotate', parseInt(deg));
}
//取消裁切
function cropCancel() {
    if ($upload.is(':hidden')) {
        $upload.fadeIn(300).siblings().hide();
        fileselect.value = "";
        isCrop = 0;
    }
}
//圖片裁切
function cropResult() {
    if (!isCrop) {
        isCrop = 1;
        cr.croppie('result', {
            type: 'canvas', // canvas(base64)|html
            size: { width: img_w, height: img_h }, //'viewport'|'original'|{width:500, height:500}
            format: 'jpeg', //'jpeg'|'png'|'webp'
            quality: 1 //0~1
        }).then(function (resp) {
            $crop.hide();
            $result.find('img').attr('src', resp);
            $result.fadeIn(300);
        });
    }
}