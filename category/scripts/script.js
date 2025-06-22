$(document).ready(() => {

    let add = $('#categoryadd');
    let edit = $('#edit');

    add.click(() => {
       alert('Категория добавлена');
        $('#categorywrite').val('');
    });

    edit.click(()=> {
        let change = $('#categorycha');
        let a = $('#categorywrite').val(change.val());

    });

});

