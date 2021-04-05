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

const generateRandomString = (length, uppers, lowers, numbers) => {
  let chars = "";
  if (!uppers && !lowers) {
    console.log('error');
  }
  if (uppers) {
    chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  if (lowers) {
    chars += "abcdefghijklmnopqrstuvwxyz";
  }
  if (numbers) {
    chars += "1234567890";
  }
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};


