document.addEventListener('DOMContentLoaded', () => {
  // Целевая дата: 25 сентября 2026 года, 15:30
  const targetDate = new Date('2026-09-25T15:30:00').getTime();

  function updateDigitGroup(idPrefix, value) {
    const strValue = value.toString().padStart(2, '0');
    const tens = strValue.slice(-2, -1);
    const ones = strValue.slice(-1);

    document.getElementById(`${idPrefix}-tens`).innerText = tens;
    document.getElementById(`${idPrefix}-ones`).innerText = ones;
  }

  function updateTimer() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      const groups = ['days', 'hours', 'minutes', 'seconds'];
      groups.forEach(group => updateDigitGroup(group, 0));
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    updateDigitGroup('days', days);
    updateDigitGroup('hours', hours);
    updateDigitGroup('minutes', minutes);
    updateDigitGroup('seconds', seconds);
  }

  setInterval(updateTimer, 1000);
  updateTimer();

  // --- ОБРАБОТКА И ОТПРАВКА ФОРМЫ ---
  const form = document.getElementById('anketa-form');
  // ВСТАВЬТЕ СЮДА ССЫЛКУ НА ВАШ CLOUDFLARE WORKER:
  const WORKER_URL = 'https://icy-night-821a.awsjfe.workers.dev/';

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerText = 'ОТПРАВКА...';

      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        presence: formData.get('presence'),
        drinks: formData.getAll('drinks[]')
      };

      try {
        const response = await fetch(WORKER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          alert('Спасибо! Ваши ответы успешно отправлены.');
          form.reset();
        } else {
          alert('Произошла ошибка при отправке. Попробуйте еще раз.');
        }
      } catch (err) {
        alert('Ошибка соединения с сервером.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'ОТПРАВИТЬ';
      }
    });
  }
});