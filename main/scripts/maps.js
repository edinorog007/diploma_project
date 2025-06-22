let center = [58.60987655141214, 99.18213530118133];

function init() {
    let map = new ymaps.Map('map', {
            center: center,
            zoom: 18
        }, {
        searchControlProvider: 'yandex#search'
    });

    let placeMark = new ymaps.Placemark(center, {
        balloonContentHeader: 'БатутОГО',
        balloonContentBody:'Батутный центр',
        balloonContentFooter: '10:00 - 20:00'
    }, {
        iconLayout: 'default#image',
        iconImageHref: 'images/icon-location.png',
        iconImageSize: [50, 50],
        iconImageOffSet: [-15, -10],
        iconOffset: [-15, -10]
    });

    map.geoObjects.add(placeMark);
    placeMark.balloon.open();
}

// Динамическая загрузка API
function loadYandexMaps() {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=bb72970d-611d-4bc9-af81-e472cde0ca84&lang=ru_RU';
    script.onload = () => resolve(window.ymaps);
    document.head.appendChild(script);
  });
}


ymaps.ready(init);