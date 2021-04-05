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
  // create helper function insert nev div in .modalclass


  $('.generate-password').on('click', function() {
    // click will trigger modal window to appear
  })
})

const generateRandomString = (length) => {
  const chars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const createModalWindow = () => {

}
