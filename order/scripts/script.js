$(document).ready(() => {

    let order = $('#order');

    order.click(()=> {
        $('.block-succ').css({
            'transform': 'scale(1)',
            'transition': '.4s'
        });
        $('.modal').css('display', 'inline-block');
        setTimeout(() => {
            $('.block-succ').css({
                'transform': 'scale(0)',
                'transition': '.5s'
            });
            $('.modal').css('display', 'none');
        }, 7000);
    });


});

