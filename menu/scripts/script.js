$(document).ready(() => {


    $('.card-menu-action button').click(function () {
        $(this).text('Добавлено в корзину').css({
            background: '#44BB3A'
        });

        setTimeout(() => {
            $(this).text('Добавить в корзину').css({
                background: '#FDA843'
            });
        }, 1000);
    });

    let cartNone = $('.cart-none');
    let cartActive = $('.cart');

    $('.carts').hover(() => {
        cartNone.removeClass().addClass('cart');
    }, () => {
        cartActive.removeClass().addClass('cart-none');
    });

});
