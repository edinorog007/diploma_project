$(document).ready(() => {

    let edit = $('#edit');
    let save = $('#save');

    $('.lpers-form').submit(function(e) {
        e.preventDefault();
    });

    edit.click(()=> {
        $('.field').removeAttr('readonly');
        $('.select').removeAttr('disabled');
    });

    save.click(()=> {
        $('.field').attr('readonly', 'readonly');
        $('.select').attr('disabled', 'disabled');
    });
});

