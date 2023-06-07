$(document).ready(function () {
  /* ////////////////////////////////////// */
  //收合側欄

  $('#barbutton').click(function () {
    if ($(this).hasClass('active')) {
      $('#barbutton').toggleClass('active');
      setTimeout(function () {
        $('aside, #right, #leftfix').toggleClass('active');
      }, 100);
    }
    else {
      $('aside, #right, #leftfix').toggleClass('active');
      setTimeout(function () {
        $('#barbutton').toggleClass('active');
      }, 200);
    }
  });

  /* ////////////////////////////////////// */
  //展開與收起列表

  $('.filter').click(function () {
    $('.filter').not(this).find('.content').removeClass('active');
    $(this).find('.content').toggleClass('active');
  });

  $(document).click(function (event) {
    if (!$(event.target).closest('.filter').length) {
      $('.filter .active').removeClass('active');
    }
  })

  /* ////////////////////////////////////// */
  //選擇器

  let collegeTarget = $('#college li:first').text();
  let departmentTarget = $('#department li:first').text();
  let gradeTarget;
  let lectureTarget;
  let clasTarget;

  $('#college .content').on('click', 'li', function (event) {
    collegeTarget = event.target.innerText;
    $('#college .header li').text(collegeTarget);
    $('#department .header li').text('-請選擇-');
    documentReset()
    updateContent('department')
    if (collegeTarget == '通識課程') { $('#grade').css('display', 'none') }
    else { $('#grade').css('display', 'flex') }
  });

  $('#department .content').on('click', 'li', function (event) {
    departmentTarget = event.target.innerText;
    $('#department .header li').text(departmentTarget);
    documentReset()
    updateContent('lecture')
  });

  $('#grade li').click(function () {
    $(this).toggleClass('active').siblings().removeClass('active');
    gradeTarget = $(this).hasClass('active') ? $(this).text() : undefined;
    lectureTarget = undefined;
    $('#lecture .header li').text('-請選擇-');
    $('#documentcontainer').empty().css('display', 'none');
    $('.bot').css('opacity', '.25');
    updateContent('lecture')
  });

  $('#lecture .content').on('click', 'li', function (event) {
    lectureTarget = event.target.innerText;
    $('#lecture .header li').text(lectureTarget);
    documentSelect();
  });

  $('#clas .content').on('click', 'li', function (event) {
    clasTarget = event.target.innerText;
    $('#clas .header li').text(clasTarget);
    documentSelect();
  });

  function documentReset() {
    gradeTarget = undefined;
    lectureTarget = undefined;
    clasTarget = undefined;
    $('#grade li.active, #clas li.active').removeClass('active');
    $('#lecture .header li, #clas .header li').text('-請選擇-');
    $('#lecture .content ul').html('<li></li>');
    $('#documentcontainer').empty().css('display', 'none');
    $('.bot').css('opacity', '.25');
  }

  /* ////////////////////////////////////// */
  //更新列表

  updateContent('lecture')
  updateContent('department')

  function updateContent(target) {
    $.get('/update' + target + '', {
      json: target,
      col: collegeTarget,
      dep: departmentTarget,
      grade: gradeTarget
    }, (data) => {
      $('#' + target + ' .content ul').html(data);
    });
  }


  /* ////////////////////////////////////// */
  //排序檔案

  let yearOrder = 1;
  let likeOrder = 1;

  $('#year h4').click(function () {
    if ($('#documentcontainer').css('display') == 'block') {
      $('#like .triangle').addClass('inactive').removeClass('reverse');
      $('#year .triangle').removeClass('inactive').toggleClass('reverse');
      yearOrder = yearOrder == 1 ? 0 : 1;
      let documents = $('.document');
      documents.sort((a, b) => {
        let A = $(a).find('.year h4').text();
        let B = $(b).find('.year h4').text();
        if (yearOrder == 0) { if (A > B) { return 1 } else { return -1 } }
        if (yearOrder == 1) { if (A < B) { return 1 } else { return -1 } }
      });
      $('#documentcontainer').append(documents);
    }
  });

  $('#like h4').click(function () {
    if ($('#documentcontainer').css('display') == 'block') {
      $('#year .triangle').addClass('inactive').removeClass('reverse');
      $('#like .triangle').removeClass('inactive').toggleClass('reverse');
      likeOrder = likeOrder == 1 ? 0 : 1;
      let documents = $('.document');
      documents.sort((a, b) => {
        let A = parseInt($(a).find('.like h4').text());
        let B = parseInt($(b).find('.like h4').text());
        if (likeOrder == 0) { return A - B }
        if (likeOrder == 1) { return B - A }
      });
      $('#documentcontainer').append(documents);
    }
  });

  /* ////////////////////////////////////// */
  //檔案生成

  function documentSelect() {
    if (lectureTarget != undefined && clasTarget != undefined) {
      $('#documentcontainer').css('display', 'block');
      $('.bot').css('opacity', '1');
      $.get('/documentSelect', {
        lec: lectureTarget,
        clas: clasTarget
      }, (data) => {
        $('#documentcontainer').html(data);
      });
    }
  }

  function documentSearch() {
    if ($('#search-box').val() != '') {
      $('#documentcontainer').css('display', 'block');
      $('.bot').css('opacity', '1');
      $.get('/documentSearch', {
        search: $('#search-box').val()
      }, (data) => {
        $('#documentcontainer').html(data);
      });
    }
  }

  /* ////////////////////////////////////// */
  //搜索功能

  $('#search-box').on('input', function () {
    documentSearch()
  });

  $('#search-box').on('blur', function () {
    if ($('#search-box').val() === '') {
      $('#documentcontainer').empty().css('display', 'none');
      $('.bot').css('opacity', '.25');
      $('html').css('cursor', '');
    }
  });

  /* ////////////////////////////////////// */
  /* ------------------------------------------------------------------------------------------------------------------------- */
  //假登入

  $('#login').click(function () {
    fetch('/UserInfo')
      .then(response => response.json())
      .then(data => {
        // data會是會員資訊
        if ($('#login p').text() == '登 入') {
          login(data);
        }
        console.log("接收成功")
      })
      .catch(error => {
        console.error(error);
      });
    setTimeout(() => {
      $('#text').toggleClass('active');
      $('#login p').text($('#login p').text() == '登 入' ? '登 出' : '登 入');
      if ($('#login p').text() == '登 入') {
        $('#user p').text('');
        $('#user .userpic img').attr('src', '');
      }
    }, 100);
  })

  let userID = 1234567;

  function login(UserInfo) {
    console.log(UserInfo.username);
    console.log("login");
    $('#user p').text(UserInfo.given_name);
    $('#user .userpic img').attr('src', UserInfo.picture);
  }

  $('.userpic').click(function () {
    if ($('#text').hasClass('active')) {
      console.log("導向personal page");
      showModal('personal_page', '');
    }
  });


  /* ////////////////////////////////////// */
  //預覽視窗

  $(document).on('click', '.document', function () {
    showModal('view', $(this).attr('id'));
  });

  $(document).on('click', '.view #quit', function () {
    $('.view #file, .view #load').css('transition', '.3s ease-in-out').css('opacity', '0.5');
    quitView = true;
    closeModal();
    setTimeout(function () { quitView = false }, 500);
  });
  let quitView = false;

  $(document).on('click', '.view #userpic img', function () {
    showModal('preview_personal', '');
  });


  $(document).on('click', '.preview_personal #null', function () {
    closeModal();
  });

  function showModal(page, doc) {
    $('html').css('cursor', 'wait');
    let modal = $('<div>').attr('id', doc).addClass('modal').addClass(page);
    $('body').append(modal);
    Page(page, doc)
    setTimeout(function () {
      modal.css('opacity', 1);
      $('html').css('cursor', '');
    }, 400);
    modal.attr('tabindex', '0').focus();
    modal.on('keydown', function (e) {
      if (e.key == 'Escape' || e.key == ' ') {
        closeModal();
      }
    });
    $('[data-target="upload"]').on('change', handleFileUpload);
  }

  function closeModal() {
    $('.modal').last().css('opacity', 0);
    setTimeout(function () {
      $('.modal').last().removeClass('').html('').remove();
    }, 500);
  }

  function Page(page, doc) {
    if (page == 'view') { viewPage(page, doc); }
  }

  function viewPage(page, doc) {
    $.get('/' + page + '', {
      userID: userID,
      doc: doc
    }, (data) => {
      $('#' + doc + '.modal').html(data[0]);
      Interactive('like', data[1])
      Interactive('rate', false)
      viewScroll()
      renderPDF($('#download a').attr('href'));
    });
  }
  /* ////////////////////////////////////// */
  //倒讚幫

  function like() {
    $('html').css('cursor', 'wait');
    $.get('/like', {
      userID: userID,
      doc: $('.modal.view').attr('id')
    }, (data) => {
      console.log(data);
    });
    setTimeout(function () {
      $('#documentcontainer').empty()
      documentSelect()
      documentSearch()
      $('html').css('cursor', '');
      $('.view #like img').toggleClass('active');
    }, 100);
  }

  function Interactive(target, iff) {
    console.log($('.view #' + target + ' img'));
    if (iff) { $('.view #' + target + ' img').toggleClass('active'); }
    else {
      $('.view #' + target).css('cursor', 'pointer').click(like).hover(
        function () { $(this).css('transform', 'scale(1.2)') },
        function () { $(this).css('transform', 'scale(1)') }
      )
    }
  }

  /* ////////////////////////////////////// */
  //pdf

  window['pdfjs-dist/build/pdf'].GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

  async function renderPDF(url) {
    console.log('renderPDF');
    $('.view').css('cursor', 'wait');
    try {
      const pdf = await pdfjsLib.getDocument(url).promise;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        if (quitView) { break }

        const canvasElement = $('<canvas>').attr('id', pageNumber);
        $('.view #file').append(canvasElement);

        const page = await pdf.getPage(pageNumber);

        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const context = canvasElement[0].getContext('2d');
        canvasElement[0].height = viewport.height;
        canvasElement[0].width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        await page.render(renderContext).promise;
      }

      console.log('PDF rendering completed');
    } catch (error) {
    }
    $('.view').css('cursor', '');
    $('.view #load').css('display', 'none');
    $('.view #file').css('display', 'flex');
  }

  /* ////////////////////////////////////// */
  //奇怪的東西

  function viewScroll() {
    let fixed = false
    $('.view').on('scroll', function () {
      var scroll = $(this).scrollTop();
      var offset = $('.view #right').offset().top;
      if (scroll > offset) {
        if (!fixed) {
          fixed = true;
          $('.view #right').addClass('fixed');
        }
      } else {
        fixed = false;
        $('.view #right').removeClass('fixed');
      }
    });
  }
})
