$(document).ready(function() {

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
  })
})

  // generate random password
  $('.pw-generate').on('click', function() {
    // get input for all params
    const passwordLength = $('.pw-length').val();

    const lowerCase = $('.input-group mb-3').is(':checked');
    console.log(lowerCase)
    const upperCase = $('.pw-uppercase').is(':checked');
    const containsNumbers = $('.pw-numbers').is(':checked');
    const containsSymbols = $('.pw-symbols').is(':checked');
    const stringParams = { passwordLength, lowerCase, upperCase, containsNumbers, containsSymbols };
    // call generateRandom string
    const newPassword = generateRandomString(stringParams);
    // append password to password field
    $('#inputPassword').val(newPassword);
    $('.modal-bg').css('display', 'none');
    $('.modal-content').css('display', 'none');
  })

const generateRandomString = (stringParams) => {
  let chars = "";
  if (!stringParams.upperCase && !stringParams.lowerCase) {
    console.log('error');
  }
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

