$(document).ready(function (){
  handleAjaxForm('#userLoginForm','/')
  handleAjaxForm('#userSignupForm','/')
})

function handleAjaxForm(selector, successRedirect = null) {
  $(selector).submit(function(e) {
    e.preventDefault();
    let form = $(this); // save the form reference
    let formData = {};
    form.serializeArray().forEach(field => {
      formData[field.name] = field.value;
    });

    let actionURL = form.attr('action') || window.location.pathname;
    let method = form.attr('method') || 'post';

    $.ajax({
      url: actionURL,
      method: method,
      data: formData,
      success: function(response) { 
        console.log("AJAX response:", response);
        if (response.status && successRedirect) {
          window.location.href = successRedirect;
        } else {
          form.find('.form-error').text(response.message);
        }
      },
      error: function(err) {
        console.error("AJAX error:", err);
      }
    });
  });
}
