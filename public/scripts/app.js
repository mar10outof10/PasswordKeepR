// Helper functions

const generateRandomString = (stringParams) => {
  let chars = "";
  if (stringParams.lowerCase) {
    chars += "abcdefghijklmnopqrstuvwxyz";
  }
  if (stringParams.upperCase) {
    chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
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

             // JQUERY MAGIC SECTION //

  // Generate generate password modal
  $('.modal-call').on('click', function () {
    $('.modal-bg').css('display', 'block');
    $('.modal-content').css('display', 'block');
    $('.length-input').focus();
  })

  // Generate generate password delete modal
  $('#delete-password').on('click', function () {
    $('.modal-bg').css('display', 'block');
    $('.modal-pw-content').css('display', 'block');
    $('.length-input').focus();
  })

  // Cancel modal
  $('.modal-cancel').on('click', function () {
    $('.modal-bg').css('display', 'none');
    $('.modal-content').css('display', 'none');
    $('.pw-error').css('display', 'none');
  });

  // Keep buttons activated on click

  $('.choice-yes').on('click', function () {
    $(this).siblings().removeClass('active')
    $(this).addClass('active');
  })

  $('.choice-no').on('click', function () {
    $(this).siblings().removeClass('active')
    $(this).addClass('active');
  })


  // Hide or show password on checkbox
  $('#show-password').on('click', function () {
    if (this.checked) {
      $('#inputPassword').attr('type', 'text');
    } else {
      $('#inputPassword').attr('type', 'password');
    }
  });

   // changes chevron on add new password button gold on hover
   $(".new-pw-button").on("mouseover", function() {
    $('#add-button').removeClass('text-white');
    $('#add-button').addClass('text-warning');

  });
  $(".new-pw-button").on("mouseout", function() {
    $('#add-button').addClass('text-white');
    $('#add-button').removeClass('text-warning');
  });

  // expands or collapses form at /orgs/:id
  $('.expand-collapse').on('click', function () {
    if ($('.expand-collapse').attr('value') === "down") {
      $('#orgs-show-options').slideUp();
      $('.expand-collapse').attr('value', 'up');
      $('.expand-collapse').text('Edit Organization')
    } else {
      $('#orgs-show-options').slideDown();
      $('.expand-collapse').attr('value', 'down');
      $('.expand-collapse').text('Close Menu');
    }
  })


  $('#by-email').on('click', function () {
    $('#inputUser').attr({type: 'email', placeholder: 'user@email.com'});
  });

  $('#by-userid').on('click', function () {
    $('#inputUser').attr({type: 'number', placeholder: '64'});
  });

  // Generate random password
  $('.pw-generate').on('click', function () {
    // get input for all params
    const passwordLength = $('.pw-length').val();
    const lowerCase = $('.lower-yes').hasClass('active');
    const upperCase = $('.upper-yes').hasClass('active');
    const containsNumbers = $('.number-yes').hasClass('active');
    const containsSymbols = $('.symbol-yes').hasClass('active');
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
    const password = $(this).parent()
                            .siblings('.art-login-info')
                            .children('.art-password')
                            .children('.art-value')[0].value;

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

  // setup 'show password' button
  $('.bi-eye').on('click', function() {
    const passwordInput = $(this).parent()
                            .siblings('.art-login-info')
                            .children('.art-password')
                            .children('.art-value')[0];

    // toggle between type 'password' and 'text' to show/hide
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  });

 // compare passwords on registration form
  $('#password, #confirm-password').on('keyup', function() {
    if ($('#password').val() === $('#confirm-password').val()) {
      $('.register-button').removeAttr('disabled');
      $('[data-toggle="popover"]').popover('hide');
    } else {
      $('.register-button').prop('disabled', 'true');
      $('#confirm-password').popover('show');
      setTimeout(function() {
        $('[data-toggle="popover"]').popover('hide');
      }, 2000);
    }
  });

  // enable popovers
  $('.clipboard').popover().on('click', function() {
    setTimeout(function() {
      $('[data-toggle="popover"]').popover('hide');
    }, 2000);
  });

  $('.search-form').on('submit', function() {
    const query = $('.search-bar')[0].value;
    $(this).attr('action', '/passwords/search/' + query);
  })


});






