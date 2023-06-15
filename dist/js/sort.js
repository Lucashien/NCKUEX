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

  $('#clas').on('click', '.choise', function (event) {
    $('#clas').find('.choise').not(this).removeClass('active');
    $(this).addClass('active')
    if ($(this).attr('id') == 'exam') { clasTarget = '大考' }
    if ($(this).attr('id') == 'quiz') { clasTarget = '小考' }
    if ($(this).attr('id') == 'homework') { clasTarget = '作業' }
    if ($(this).attr('id') == 'other') { clasTarget = '其他' }
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
      $('#like .triangle').addClass('inactive');
      if ($('#like .triangle').hasClass('reverse')) {
        $('#like .triangle').removeClass('reverse')
        likeOrder = 1;
      }
      $('#year .triangle').removeClass('inactive').toggleClass('reverse');
      yearOrder = yearOrder == 1 ? 0 : 1;
      let documents = $('.document');
      documents.sort((a, b) => {
        let A = $(a).find('.year h4').text();
        let B = $(b).find('.year h4').text();
        if (yearOrder == 1) { if (A > B) { return 1 } else { return -1 } }
        if (yearOrder == 0) { if (A < B) { return 1 } else { return -1 } }
      });
      $('#documentcontainer').append(documents);
    }
  });

  $('#like h4').click(function () {
    if ($('#documentcontainer').css('display') == 'block') {
      likesort()
    }
  });

  function likesort() {
    $('#year .triangle').addClass('inactive');
    if ($('#year .triangle').hasClass('reverse')) {
      $('#year .triangle').removeClass('reverse')
      yearOrder = 1;
    }
    $('#like .triangle').removeClass('inactive').toggleClass('reverse');
    likeOrder = likeOrder == 1 ? 0 : 1;
    let documents = $('.document');
    documents.sort((a, b) => {
      let A = parseInt($(a).find('.like h4').text());
      let B = parseInt($(b).find('.like h4').text());
      if (likeOrder == 1) { return A - B }
      if (likeOrder == 0) { return B - A }
    });
    $('#documentcontainer').append(documents);
  }

  function sortInitial() {
    $('#year .triangle, #like .triangle').addClass('inactive')
    if ($('#year .triangle').hasClass('reverse')) {
      $('#year .triangle').removeClass('reverse')
      yearOrder = 1;
    }
    if ($('#like .triangle').hasClass('reverse')) {
      $('#like .triangle').removeClass('reverse')
      likeOrder = 1;
    }
  }

  /* ////////////////////////////////////// */
  //檔案生成

  function documentSelect() {
    if (lectureTarget != undefined && clasTarget != undefined) {
      sortInitial()
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
      sortInitial()
      $('#documentcontainer').css('display', 'block');
      $('.bot').css('opacity', '1');
      $.get('/documentSearch', {
        search: $('#search-box').val()
      }, (data) => {
        $('#documentcontainer').html(data);
      });
    }
  }

  function documentInitial() {
    $('#documentcontainer').css('display', 'block');
    $('.bot').css('opacity', '1');
    $.get('/documentSearch', {
      search: 'd'
    }, (data) => {
      $('#documentcontainer').html(data);
    });
    setTimeout(function () { likesort() }, 100);
  }
  documentInitial()

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
  //真登入
  fetch('/UserInfo_pic')
    .then(response => response.text())
    .then(data => {
      $('#user .userpic img').attr('src', data);
    })
    .catch(error => {
      // 處理錯誤
      console.error(error);
    });

  fetch('/UserInfo')
    .then(response => response.json())
    .then(data => {
      $.get('/UserInfoRead', {
        userID: data.id,
      }, (json) => {
        $('#user p').text(json.name);
        $('#user .userpic img').attr('src', json.picture);
        $('#login p').text('登 出');
        $('#hi').css('display', 'block');
      });
    })
    .catch(error => {
      // 處理錯誤
      console.error(error);
    });

  $('#login').click(function () {
    fetch('/logout', { method: 'GET' })
      .then(() => {
        window.location.href = '/login.html';  // 執行前端重定向
      })
      .catch(error => {
        // 處理錯誤
        console.error(error);
      });
  });

  $('.userpic').click(function () {
    showModal('personal', userID, '');
  });



  /* ////////////////////////////////////// */
  //預覽視窗

  $(document).on('click', '.document', function () {
    showModal('view', $(this).attr('id'), $(this).find('.uploader h4').attr('id'));
  });

  $(document).on('click', '.view #quit', function () {
    $('.view #file, .view #load').css('transition', '.3s ease-in-out').css('opacity', '0');
    quitView = true;
    closeModal();
    setTimeout(function () { quitView = false }, 500);
  });
  let quitView = false;

  $(document).on('click', '.personal #null, .personal .back_button', function () {
    closeModal();
  });

  function showModal(page, id, up) {
    $('html').css('cursor', 'wait');
    let modal = $('<div>').attr('id', id).addClass('modal').addClass(page);
    $('body').append(modal);
    Page(page, id, up)
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
  }

  function closeModal() {
    $('.modal').last().css('opacity', 0);
    setTimeout(function () {
      $('.modal').last().removeClass('').html('').remove();
    }, 500);
  }

  function Page(page, id, up) {
    if (page == 'view') { viewPage(id, up); }
    if (page == 'personal') { personalPage(id); }
    if (page == 'others') { othersPage(id); }
  }

  function viewPage(doc, up) {
    $.get('/view', {
      userID: userID,
      doc: doc
    }, (data) => {
      $('#' + doc + '.view').html(data[0]);
      $.get('/viewUploader', {
        upid: up
      }, (data) => {
        $('#' + doc + '.view').find('#userpic img').attr('src', data[1]);
        $('#' + doc + '.view').find('#up').text(data[0])
        $('#' + doc + '.view').find('#upload').find('div').eq(2).attr('id', up)
      })
      active_like(data[1])
      active_rate(data[2])
      viewScroll()
      renderPDF($('#download a').attr('href'), doc);
    });
  }

  function personalPage(userid) {
    $.get('/person', {
      userID: userid,
      tar: 'personal'
    }, (data) => {
      $('#' + userid + '.personal').html(data);
    });
    setTimeout(function () {
      $.get('/personaldoc', {
        userID: userid,
      }, (data) => {
        $('#' + userid + '.personal').find('.file_row').html(data[0]);
        $('#' + userid + '.personal').find('.upload_num p').text(data[1]);
        $('#' + userid + '.personal').find('.like_num p').text(data[2]);
      });
    }, 100);
  }

  $(document).on('click', '.personal .edit', function () {
    let infochange = $('<div>').addClass('infochange');
    $('body').append(infochange);
    $.get('/infochange', {
    }, (data) => {
      $('.infochange').html(data);
    });
    $('.infochange').css('display', 'flex');
    setTimeout(function () {
      $('.infochange').css('opacity', '1');
      $('.infochange #done').click(function () {
        $.get('/UserInfoChange', {
          username: $('.infochange #username').val(),
          userID: userID
        }, (data) => {
        });
      })
      $('.infochange #quit').click(function () {
        $('.infochange').css('display', 'none').css('opacity', '0');
      })
    }, 500)
  })

  /* ////////////////////////////////////// */

  $(document).on('click', '.view #userpic img', function () {
    let upid = $('.view').find('#upload').find('div').eq(2).attr('id')
    showModal('others', upid, '');
  });

  $(document).on('click', '.others #null, .others .back_button', function () {
    closeModal();
  });

  function othersPage(userid) {
    $.get('/person', {
      userID: userid,
      tar: 'others'
    }, (data) => {
      $('#' + userid + '.others').html(data);
    });
    setTimeout(function () {
      $.get('/personaldoc', {
        userID: userid,
      }, (data) => {
        $('#' + userid + '.others').find('.file_row').html(data[0]);
        $('#' + userid + '.others').find('.upload_num p').text(data[1]);
        $('#' + userid + '.others').find('.like_num p').text(data[2]);
      });
    }, 100);
  }

  /* ////////////////////////////////////// */
  //倒讚幫

  let userID;
  $.get('/UserInfo', {}, (user) => {
    userID = user.family_name
  });

  function active_like(iff) {
    $('.view #like').hover(
      function () {
        $(this).find('img').attr('src', './img/like3.png');
      },
      function () {
        if (iff) {
          $(this).find('img').attr('src', './img/like2.png');
        } else {
          $(this).find('img').attr('src', './img/like1.png');
        }
      }
    );
    $('.view #like').off('click').click(function () {
      $('.view #like').off('mouseenter mouseleave');
      like(iff);
    });
  }


  function like(iff) {
    $('html').css('cursor', 'wait');
    $.get('/like', {
      userID: userID,
      doc: $('.modal.view').attr('id')
    }, (data) => {
      setTimeout(function () {
        console.log(data);
        $('#documentcontainer').empty();
        documentInitial();
        $('html').css('cursor', '');
        active_like(!iff);
      }, 100);
    });
  }

  /* ////////////////////////////////////// */
  //五星好評

  let rff;
  function active_rate(iff) {
    if (iff != undefined) { rff = iff }
    $('.view #rate').hover(
      function () {
        $(this).find('img').first().attr('src', './img/rate3.png');
      },
      function () {
        if (rff) {
          $(this).find('img').first().attr('src', './img/rate2.png');
        } else {
          $(this).find('img').first().attr('src', './img/rate1.png');
        }
      }
    );
    $('.view #rate').click(function () {
      $(this).off('mouseenter mouseleave');
      $(this).addClass('active');
      active_rateUI(0)
      active_rateUI(1)
      rate()
      $('.view #rate').off('click')
    });
  }

  $(document).click(function (event) {
    if (!$(event.target).closest('.view #rate').length) {
      $('.view #rate').removeClass('active');
      if (rff) {
        $('.view #rate').find('img').first().attr('src', './img/rate2.png');
      } else {
        $('.view #rate').find('img').first().attr('src', './img/rate1.png');
      }
      active_rate(rff)
    }
  })



  let ratescore = [0, 0];
  function active_rateUI(tar) {
    let ratelist = $('.view #rate').find('.ratelist').eq(tar);
    ratelist.find('.star:not(.active)').hover(
      function () {
        $(this).find('img').attr('src', './img/star2.png');
        $(this).nextAll('.star:not(.active)').find('img').attr('src', './img/star2.png');
      },
      function () {
        $(this).find('img').attr('src', './img/star.png');
        $(this).nextAll('.star:not(.active)').find('img').attr('src', './img/star.png');
      }
    );
    ratelist.find('.star').click(function () {
      ratelist.find('.star').removeClass('active').find('img').attr('src', './img/star.png');
      $(this).addClass('active').find('img').attr('src', './img/star2.png');
      $(this).nextAll('.star').addClass('active').find('img').attr('src', './img/star2.png');
      ratelist.find('.star').off('mouseenter mouseleave');
      ratescore[tar] = 6 - $(this).index();
      active_rateUI(tar)
    });
  }


  function rate(iff) {
    $('.view #rate').find('.check').hover(
      function () {
        $(this).find('img').first().attr('src', './img/Group198.png');
      },
      function () {
        $(this).find('img').first().attr('src', './img/Group197.png');
      }
    )
    $('.view #rate').find('.check').off('click').click(function () {
      $('html').css('cursor', 'wait');
      $.get('/rate', {
        score: ratescore,
        userID: userID,
        doc: $('.modal.view').attr('id')
      }, (data) => {
        setTimeout(function () {
          console.log(data);
          $('#documentcontainer').empty();
          documentInitial();
          $('html').css('cursor', '');
          active_rate(!iff);
        }, 100);
      });
    })
  }

  /* ////////////////////////////////////// */
  //pdf

  window['pdfjs-dist/build/pdf'].GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

  async function renderPDF(url, doc) {
    $('#' + doc + '.view').css('cursor', 'wait');
    try {
      const pdf = await pdfjsLib.getDocument(url).promise;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        if (quitView) { break }

        const canvasElement = $('<canvas>').attr('id', pageNumber);
        $('#' + doc + '.view #file').append(canvasElement);

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
      $('#' + doc + '.view #load').css('display', 'none');
      $('#' + doc + '.view #file').css('display', 'flex');
    } catch (error) {
      $('#' + doc + '.view #load').css('display', 'none');
      $('#' + doc + '.view #fail').css('display', 'flex');
    }
    $('#' + doc + '.view').css('cursor', '');
  }

  /* ////////////////////////////////////// */
  //滾軸

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

  /* ////////////////////////////////////// */
})