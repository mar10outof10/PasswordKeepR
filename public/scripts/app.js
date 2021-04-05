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

// Generate password window

  $('.generate-password').on('click', function() {
    // click will trigger modal window to appear
    $('.modal').css('display', 'block');
    $('.modal-content').css('display', 'block');
    // change modal display from none to anything
    // generate and display password
    // move password to password field on page
  })

// While inside password window
  // cancel out of window
  $('.pw-cancel').on('click', function() {
    $('.modal').css('display', 'none');
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
    const stringParams = { passwordLength, lowerCase, upperCase, containsNumbers };
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
  let result = '';
  for (let i = stringParams.passwordLength; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

