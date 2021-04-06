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
    const lowerCase = $('.pw-lowercase').is(':checked');
    const upperCase = $('.pw-uppercase').is(':checked');
    const containsNumbers = $('.pw-numbers').is(':checked');
    const containsSymbols = $('.pw-symbols').is(':checked');
    const stringParams = { passwordLength, lowerCase, upperCase, containsNumbers, containsSymbols };
    // call generateRandom string
    const newPassword = generateRandomString(stringParams);
    // append password to password field
    $('#inputPassword').val(newPassword);
    $('.modal').css('display', 'none');
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

