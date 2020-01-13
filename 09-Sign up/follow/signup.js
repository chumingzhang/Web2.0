$(function() {
    $('input:not(.button)').blur(function() {
        if(validator.isFileValid(this.id, $(this).vali())) {
            $(this).parent().find('.error').text('').hide();
        } else {
            $(this).parent().find('.error').text(validator.form[this.id].errorMessage).show();
        }
    });

    $('input.button').click(function() {
        $('input:not(.button)').blur();
        if(!validator.isFormValid)
            return false;
    });
});