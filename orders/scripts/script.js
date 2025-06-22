$(document).ready(() => {

    let open = $('#open');
    let modal = $('.modal');
    let wind = $('.admin-orders-card-desc');
    let close = $('#close');
    let ed = $('#ed');
    let desc = $('.admin-orders-st-desc');

    open.click(()=> {
        modal.css('display', 'inline-block');
        wind.css({
           'transform': 'scale(1)',
           'transition': '.3s'
        });
    });

    close.click(()=> {
        modal.css('display', 'none');
        wind.css({
            'transform': 'scale(0)',
            'transition': '.3s'
        });
    });

    ed.click(()=> {
        desc.text('Готовится').css({
            background: '#5A94CA'
        })
    });

});

