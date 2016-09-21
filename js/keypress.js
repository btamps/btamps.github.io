var next = $('.arrow-nav .next')[0],
    prev = $('.arrow-nav .prev')[0];

$(window).keydown(function (e) {
    if ( e.which === 39 ) {
        window.location.href = next.href;
    } else if ( e.which === 37 ) {
        window.location.href = prev.href;
    }
});
