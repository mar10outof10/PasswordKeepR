const adjustDropdownAlignment = () => {
  if ($(window).width() >= 992) {
    $('div.dropdown-menu').addClass('dropdown-menu-right');
  } else {
    $('div.dropdown-menu').removeClass('dropdown-menu-right');
  }
};


$(() => {
  adjustDropdownAlignment();

  $(window).resize(() => {
    adjustDropdownAlignment();
  });

// Generate password modal

  $('.generate-password').on('click', function() {
    $('.modal-bg').css('display', 'block');
    $('.modal-content').css('display', 'block');

  })

// Keep buttons activated on click

// Lowercase option
$('.lowercase-choice-yes').on('click', function() {
  $('.lowercase-choice-no').removeClass('active')
  $(this).addClass('active');
})

$('.lowercase-choice-no').on('click', function() {
  $('.lowercase-choice-yes').removeClass('active')
  $(this).addClass('active');
})

// Uppercase option
$('.uppercase-choice-yes').on('click', function() {
  $('.uppercase-choice-no').removeClass('active')
  $(this).addClass('active');
})

$('.uppercase-choice-no').on('click', function() {
  $('.uppercase-choice-yes').removeClass('active')
  $(this).addClass('active');
})

// Numbers
$('.number-choice-yes').on('click', function() {
  console.log('yo')
  $('.number-choice-no').removeClass('active')
  $(this).addClass('active');
})

$('.number-choice-no').on('click', function() {
  $('.number-choice-yes').removeClass('active')
  $(this).addClass('active');
})

// Symbols
$('.symbol-choice-yes').on('click', function() {
  console.log('yo')
  $('.symbol-choice-no').removeClass('active')
  $(this).addClass('active');
})

$('.symbol-choice-no').on('click', function() {
  $('.symbol-choice-yes').removeClass('active')
  $(this).addClass('active');
})


// Cancel password modal

  $('.pw-cancel').on('click', function() {
    $('.modal-bg').css('display', 'none');
    $('.modal-content').css('display', 'none');
    $('.pw-error').css('display', 'none');
  })
});

// Hide or show password on checkbox
$('#show-password').on('click', function() {
  if (this.checked) {
    $('#inputPassword').attr('type','text');
  } else {
    $('#inputPassword').attr('type','password');
  }
})

  // Generate random password
  $('.pw-generate').on('click', function() {
    // get input for all params
    const passwordLength = $('.pw-length').val();
    const lowerCase = $('.lowercase-choice-yes').hasClass('active');
    const upperCase = $('.uppercase-choice-yes').hasClass('active');
    const containsNumbers = $('.number-choice-yes').hasClass('active');
    const containsSymbols = $('.symbol-choice-yes').hasClass('active');
    const stringParams = { passwordLength, lowerCase, upperCase, containsNumbers, containsSymbols };
    if (passwordLength > 64 || passwordLength < 1) {
      $('.pw-error').text('Please choose a password length of less than 64 characters')
      return $('.pw-error').css('display', 'block');
    }
    if (!stringParams.upperCase && !stringParams.lowerCase && !stringParams.containsNumbers && !stringParams.containsSymbols) {
      $('.pw-error').text('You must choose at least one password parameter')
      return $('.pw-error').css('display', 'block');
    }
    const newPassword = generateRandomString(stringParams);
    // call generateRandom string
    // append password to password field
    $('#inputPassword').val(newPassword);
    $('.modal-bg').css('display', 'none');
    $('.modal-content').css('display', 'none');
  })

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

