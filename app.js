const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selected = {
    guide: guideChecked,
    audio: audioChecked,
    catalog: catalogChecked
  };

  const items = services
    .filter(service => selected[service.id])
    .map(service => {
      const { title, price } = service;
      return { title: title.trim(), price };
    });

  const total = items.reduce((sum, item) => sum + item.price, 0);
  return { count: items.length, total, items };
}

const serviceForm = document.querySelector('#service-form');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');
const showProgram = document.querySelector('#show-program');
const program = document.querySelector('#program');
const guide = document.querySelector('#guide');
const audio = document.querySelector('#audio');
const catalog = document.querySelector('#catalog');

let data;

try {
  data = JSON.parse(sourceJson);
} catch (error) {
  dataError.textContent = 'Ошибка данных.';
  dataError.hidden = false;
  serviceForm.hidden = true;
  showProgram.disabled = true;
}

if (data) {
  document.querySelector('#event-title').textContent = data.event.title;
  document.querySelector('#event-date').textContent = data.event.date;
  document.querySelector('#event-place').textContent = data.event.place;
  document.querySelector('#event-description').textContent = data.event.description;

  data.services.forEach(service => {
    document.querySelector('#' + service.id + '-title').textContent = service.title.trim();
    document.querySelector('#' + service.id + '-price').textContent = service.price + ' руб.';
  });

  serviceForm.hidden = false;

  function handleProgramClick() {
    program.innerHTML = data.event.meeting;
    program.hidden = false;
    showProgram.setAttribute('aria-expanded', 'true');
  }

  function handleSubmit(event) {
    event.preventDefault();

    const report = buildReport(data.services, guide.checked, audio.checked, catalog.checked);

    if (report.count === 0) {
      choiceError.textContent = 'Выберите хотя бы одну услугу.';
      choiceError.hidden = false;
      result.hidden = true;
      reportJson.hidden = true;
      return;
    }

    const jsonString = JSON.stringify(report);
    JSON.parse(jsonString);

    const titles = report.items.map(item => item.title);
    result.innerHTML = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.<br>${titles.join('<br>')}`;
    reportJson.textContent = jsonString;
    choiceError.hidden = true;
    result.hidden = false;
    reportJson.hidden = false;
  }

  showProgram.addEventListener('click', handleProgramClick);
  serviceForm.addEventListener('submit', handleSubmit);
}
