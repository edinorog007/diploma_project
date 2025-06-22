// $(document).ready(() => {

    $(function () {
        $("#accordion").accordion({
            collapsible: true,
            icons: false,
            animate: 500,
            heightStyle: 'content',
        });
    });


    $('.about-card-action button').click(function () {
        $(this).parent().parent().removeClass('about-card');
        $(this).parent().parent().addClass('about-card-none').css({
            'display': 'flex',
            animation: 'animationDisplay 1s linear forwards'
        });

        setTimeout(() => {
            $(this).parent().parent().removeClass('about-card-none');
            $(this).parent().parent().addClass('about-card').css({
                'display': 'flex',
                animation: 'animationDisplayOn 1.1s linear forwards'
            });
        }, 10000)
    })

// });

