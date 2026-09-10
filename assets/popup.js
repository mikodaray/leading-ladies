
setTimeout(() =>
    {
        if (document.getElementsByClassName('qsk-popup__box-image').length > 0)
        {
            document.getElementsByClassName('qsk-popup__box-image')[0].addEventListener('click', function () {
                window.location.href = 'https://leadingladies.ph/collections/merchandise';
            });
        }
    }
, 3000);