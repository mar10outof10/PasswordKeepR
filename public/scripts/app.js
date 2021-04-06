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

  $('#generate-password').on('click', function() {
    console.log('you pushed me');
  });
});

$('#show-password').on('click', function() {
  if (this.checked) {
    $('#inputPassword').attr('type','text');
  } else {
    $('#inputPassword').attr('type','password');
  }
})
