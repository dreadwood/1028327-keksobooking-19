'use strict';

(function () {
  var PRICE_DEFAULT = 1000;
  var MIN_PRICE_HOUSING_TYPE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var formAd = document.querySelector('.ad-form');
  var titleFormAd = formAd.querySelector('#title');
  var addressFormAd = formAd.querySelector('#address');
  var numberOfRoomsFormAd = formAd.querySelector('#room_number');
  var capacityRoomFormAd = formAd.querySelector('#capacity');
  var housingTypeFormAd = formAd.querySelector('#type');
  var priceFormAd = formAd.querySelector('#price');
  var timeinFormAd = formAd.querySelector('#timein');
  var timeoutFormAd = formAd.querySelector('#timeout');
  var resetButtonFormAd = formAd.querySelector('.ad-form__reset');

  // Получить кординаты pin--main и вставить в поле адреса
  var getAddress = function (center) {
    addressFormAd.defaultValue = center ? window.pin.coordsOfCenterMain() : window.pin.coordsOfPointerMain();
  };

  // Заблокировать поля формы
  var changeDisabledForm = function (form, block) {
    var fieldsetOfForm = form.querySelectorAll('fieldset, select');
    if (block) {
      for (var j = 0; j < fieldsetOfForm.length; j++) {
        fieldsetOfForm[j].setAttribute('disabled', '');
      }
    } else {
      for (var k = 0; k < fieldsetOfForm.length; k++) {
        fieldsetOfForm[k].removeAttribute('disabled');
      }
    }
  };

  // Валидация комнат и гостей
  var validateRoomsAdnCapacity = function () {
    if (numberOfRoomsFormAd.value === '100' && capacityRoomFormAd.value !== '0') {
      numberOfRoomsFormAd.setCustomValidity('Такое колличество комнат не для гостей');
    } else if (numberOfRoomsFormAd.value !== '100' && capacityRoomFormAd.value === '0') {
      numberOfRoomsFormAd.setCustomValidity('"Не для гостей" можно выбрать только 100 комнат');
    } else if (Number(numberOfRoomsFormAd.value) < Number(capacityRoomFormAd.value)) {
      numberOfRoomsFormAd.setCustomValidity('Колличество комнат должно быть больше или равно колличеству гостей');
    } else {
      numberOfRoomsFormAd.setCustomValidity('');
    }
  };

  // Валидация типа жилья и цены
  var validatePriceRoom = function () {
    var minPrice = MIN_PRICE_HOUSING_TYPE[housingTypeFormAd.value];
    priceFormAd.placeholder = minPrice;
    if (priceFormAd.value < minPrice) {
      priceFormAd.setCustomValidity('Минимальная цена данного типа жилья ' + minPrice + ' рублей');
    } else {
      priceFormAd.setCustomValidity('');
    }
  };

  // Валидация времени заезда и выезда
  var validateTime = function (evt) {
    if (evt.target.name === 'timeout' || evt.target.name === 'timein') {
      timeinFormAd.value = evt.target.value;
      timeoutFormAd.value = evt.target.value;
    }
  };

  // Вся валидация форм
  var validationFormAdHandler = function (evt) {
    validateRoomsAdnCapacity();
    validatePriceRoom();
    validateTime(evt);
  };

  // Обработчик отправки формы
  formAd.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(formAd), window.map.createSuccess, window.map.createError);
  });

  // Активация формы
  var activateFormAd = function () {
    formAd.classList.remove('ad-form--disabled'); // удал стиль блокир
    changeDisabledForm(formAd, false); // разблок поля форм
    getAddress(); // заполн адрес pin--main
    titleFormAd.setAttribute('required', ''); // устан обязат атриб полю title
    formAd.addEventListener('change', validationFormAdHandler); // доб валидац

    resetButtonFormAd.addEventListener('click', window.change.resetHandler); // сброс форм
  };

  // Сброс формы
  var resetFormAd = function () {
    formAd.reset(); // сброс знач форм
    priceFormAd.placeholder = PRICE_DEFAULT; // устан станд цену в прайс
    formAd.classList.add('ad-form--disabled'); // доб стиль блокир
    window.form.changeDisabled(formAd, true); // заблок поля форм
    resetPhotoFormAd(); // удал аватар и фото
    getAddress(true); // заполн адрес pin--main
  };

  // Загрузка аватара и фотографий
  var inputAvatar = formAd.querySelector('#avatar');
  var previewAvatar = formAd.querySelector('.ad-form-header__preview img');
  var inputImages = formAd.querySelector('#images');
  var photoContainer = formAd.querySelector('.ad-form__photo-container');
  var previewPhoto = formAd.querySelectorAll('.ad-form__photo');
  var tooglePreview = true;

  var resetPhotoFormAd = function () {
    previewAvatar.src = 'img/muffin-grey.svg';
    window.data.deleteElements(photoContainer, 'ad-form__photo--extra');
    previewPhoto[0].style = '';
    tooglePreview = true;
  };

  inputAvatar.addEventListener('change', function () {
    var file = inputAvatar.files[0];

    var reader = new FileReader();

    reader.addEventListener('load', function () {
      previewAvatar.src = reader.result;
    });

    reader.readAsDataURL(file);
  });

  inputImages.addEventListener('change', function () {
    var files = Array.from(inputImages.files);

    files.forEach(function (file) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        previewPhoto = formAd.querySelectorAll('.ad-form__photo');
        var stylePreview = 'background: #e4e4de url("' + reader.result + '") top/100% no-repeat;';
        if (tooglePreview) {
          previewPhoto[0].style = stylePreview;
          tooglePreview = false;
        } else {
          var previewPhotoElement = previewPhoto[0].cloneNode();
          previewPhotoElement.classList.add('ad-form__photo--extra');
          previewPhotoElement.style = stylePreview;
          photoContainer.appendChild(previewPhotoElement);
        }
      });

      reader.readAsDataURL(file);
    });
  });


  window.form = {
    changeDisabled: changeDisabledForm,
    address: getAddress,
    activate: activateFormAd,
    reset: resetFormAd
  };
})();
