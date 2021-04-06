const adjustDropdownAlignment = () => {
  if ($(window).width() >= 992) {
    $('div.dropdown-menu').addClass('dropdown-menu-right');
  } else {
    $('div.dropdown-menu').removeClass('dropdown-menu-right');
  }
};


const generateRandomString = (stringParams) => {
  let chars = "";
  if (stringParams.upperCase) {
    chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  if (stringParams.lowerCase) {
    chars += "abcdefghijklmnopqrstuvwxyz";
  }
  if (stringParams.containsNumbers) {
    chars += "1234567890";
  }
  if (stringParams.containsSymbols) {
    chars += "!@#$%^&*()_+<>?:{}[]()|\`~";
  }
  let result = '';
  for (let i = stringParams.passwordLength; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};


$(() => {
  adjustDropdownAlignment();

  $(window).resize(() => {
    adjustDropdownAlignment();
  });

  // Generate password modal

  $('.generate-password').on('click', function () {
    $('.modal-bg').css('display', 'block');
    $('.modal-content').css('display', 'block');

  })

  // Keep buttons activated on click

  // Lowercase option
  $('.lowercase-choice-yes').on('click', function () {
    $('.lowercase-choice-no').removeClass('active')
    $(this).addClass('active');
  })

  $('.lowercase-choice-no').on('click', function () {
    $('.lowercase-choice-yes').removeClass('active')
    $(this).addClass('active');
  })

  // Uppercase option
  $('.uppercase-choice-yes').on('click', function () {
    $('.uppercase-choice-no').removeClass('active')
    $(this).addClass('active');
  })

  $('.uppercase-choice-no').on('click', function () {
    $('.uppercase-choice-yes').removeClass('active')
    $(this).addClass('active');
  })

  // Numbers
  $('.number-choice-yes').on('click', function () {
    console.log('yo')
    $('.number-choice-no').removeClass('active')
    $(this).addClass('active');
  })

  $('.number-choice-no').on('click', function () {
    $('.number-choice-yes').removeClass('active')
    $(this).addClass('active');
  })

  // Symbols
  $('.symbol-choice-yes').on('click', function () {
    console.log('yo')
    $('.symbol-choice-no').removeClass('active')
    $(this).addClass('active');
  })

  $('.symbol-choice-no').on('click', function () {
    $('.symbol-choice-yes').removeClass('active')
    $(this).addClass('active');
  });


  // Cancel password modal
  $('.pw-cancel').on('click', function () {
    $('.modal-bg').css('display', 'none');
    $('.modal-content').css('display', 'none');
    $('.pw-error').css('display', 'none');
  });

  // Hide or show password on checkbox
  $('#show-password').on('click', function () {
    if (this.checked) {
      $('#inputPassword').attr('type', 'text');
    } else {
      $('#inputPassword').attr('type', 'password');
    }
  });

  // Confirm update of org parameters on checkbox
  $('#org-update-check').on('click', function () {
    if (this.checked) {
      $('#org-update').attr('type', 'submit');
    } else {
      $('#org-update').attr('type', 'button');
    }
  });

  // Generate random password
  $('.pw-generate').on('click', function () {
    // get input for all params
    const passwordLength = $('.pw-length').val();
    const lowerCase = $('.lowercase-choice-yes').hasClass('active');
    const upperCase = $('.uppercase-choice-yes').hasClass('active');
    const containsNumbers = $('.number-choice-yes').hasClass('active');
    const containsSymbols = $('.symbol-choice-yes').hasClass('active');
    // store them in object
    const stringParams = { passwordLength, lowerCase, upperCase, containsNumbers, containsSymbols };
    // if password length is too long or too short...
    if (passwordLength > 64 || passwordLength < 1) {
      $('.pw-error').text('Please choose a password length of less than 64 characters')
      return $('.pw-error').css('display', 'block');
    }
    // if user hasn't selected any password paramaters....
    if (!stringParams.upperCase && !stringParams.lowerCase && !stringParams.containsNumbers && !stringParams.containsSymbols) {
      $('.pw-error').text('You must choose at least one password parameter')
      return $('.pw-error').css('display', 'block');
    }
    // pass object to password generator function
    const newPassword = generateRandomString(stringParams);
    $('#inputPassword').val(newPassword);
    $('.modal-bg').css('display', 'none');
    $('.modal-content').css('display', 'none');
  });


  // setup 'copy password to clipboard' button
  $('.bi-clipboard-plus').on('click', function() {
    // store password
    const password = $(this).siblings('input')[0].value;
    // create temporary textarea to allow copying to clipboard
    const tmp = $('<textarea id="tmpPassword"></textarea>');
    // put password in textarea
    tmp.val(password);
    // append the textarea to the document body
    $('body').append(tmp);
    // select the password
    tmp.select();
    // copy to clipboard
    document.execCommand('copy');
    // delete the textarea element after
    tmp.remove();
  });

  // enable popovers
  $('[data-toggle="popover"]').popover().on('click', function() {
    setTimeout(function() {
      $('[data-toggle="popover"]').popover('hide');
    }, 2000);
  });
});






