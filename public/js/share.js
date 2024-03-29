const FACEBOOK_APP_ID = '4299168130154860';
const twitterText = 'Mis+resultados+del+Test+de+Afinidad+de+%23miderechomivoto%3A+';
const currentLocation = window.location.href;

const emailSubject = 'Mi resultado del test de afinidad de "Mi derecho, mi voto"';
const emailBody = `Este fue mi resultado en el test de afinidad: ${currentLocation}`;

window.fbAsyncInit = function () {
  FB.init({
    appId: FACEBOOK_APP_ID,
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v7.0',
  });
};

$('#twitterButton').click(function () {
  window.open(
    `https://twitter.com/intent/tweet?text=${twitterText}&url=${currentLocation}`,
    '_blank'
  );
});

$('#facebookButton').click(function () {
  FB.ui(
    {
      method: 'feed',
      link: currentLocation,
      redirect_uri: 'https://www.mimi.do/',
      hashtag: '#miderechomivoto',
      quote: 'Estos fueron mis resultados del Test de Afinidad de "Mi derecho, mi voto"',
    },
    function (response) {}
  );
});

$('#emailButton').click(function () {
  window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
});

$('#downloadButton').click(function () {
  const el = document.querySelector('main');
  const options = {
    margin: 15,
    filename: 'resultados.pdf',
    jsPDF: { unit: 'px', format: [el.offsetHeight + 75, el.offsetWidth + 50] },
  };

  html2pdf().set(options).from(el).save();
});

$('#linkInput').attr('value', currentLocation);

$('#copyButton').click(function () {
  const el = document.querySelector('#linkInput');

  el.select();
  console.log(el);
  document.execCommand('copy');

  $('#copyButton').html('<i class="check icon"></i> ¡Copiado!');

  setTimeout(function () {
    $('#copyButton').html('<i class="copy icon"></i> Copiar enlace');
  }, 3000);
});
