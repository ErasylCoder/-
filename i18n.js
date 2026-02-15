const I18N = {
  ru: {
    home: 'Главная', students: 'Ученику', tasks: 'Задачи', games: 'Игры', register: 'Регистрация', admin: 'Админ', director: 'Директор',
    founders: 'Основатели / CEO: Amirtay.E, Ermukhanov.M',
    firstTitle: 'Сначала регистрация — затем доступ к платформе',
    firstText: 'Заполните форму, чтобы начать эко-квесты и попасть в рейтинг школы.',
    enterPlatform: 'Войти в платформу',
    brandSlogan: 'Маленькие шаги к большому будущему',
    mapTitle: 'Карта активности Казахстана',
    mapDesc: 'Ключевые города и вклад школьников в экологию.',
    regTitle: 'Зона регистрации', regHint: 'Красивый безопасный вход для учеников 7–17 лет.',
    name: 'Имя ученика', age: 'Возраст', role: 'Роль', child: 'Ребенок', teen: 'Подросток', city: 'Город', school: 'Школа', submit: 'Зарегистрироваться',
    users: 'Участники', noUsers: 'Пока нет зарегистрированных учеников',
    tasksTitle: 'Экологические задания', upload: 'Загрузка фото-отчета', chooseTask: 'Выберите задачу', comment: 'Комментарий', photo: 'Фото результата', save: 'Сохранить отчет',
    done: 'Фото-отчет сохранен!',
    gamesTitle: 'Логические эко-игры',
    adminTitle: 'Админ-панель (только для вас)', adminDesc: 'Полный мониторинг: кто, когда и что делал.', usersCount: 'Пользователи', reportsCount: 'Отчеты', logsCount: 'События',
    activity: 'Лента активности',
    directorTitle: 'Панель директора', directorDesc: 'Контроль экопроцессов по школе и городу.',
    chooseCity: 'Выберите город',
    chromtauSchools: 'Школы города Хромтау (7 школ)',
    footer: 'EcoBala · Казахстан'
  },
  en: {
    home: 'Home', students: 'Students', tasks: 'Tasks', games: 'Games', register: 'Registration', admin: 'Admin', director: 'Director',
    founders: 'Founders / CEO: Amirtay.E, Ermukhanov.M',
    firstTitle: 'Registration first — then platform access',
    firstText: 'Complete registration to start eco quests and school rankings.',
    enterPlatform: 'Enter platform',
    brandSlogan: 'Small steps to a bigger future',
    mapTitle: 'Kazakhstan activity map',
    mapDesc: 'Key cities and student environmental impact.',
    regTitle: 'Registration zone', regHint: 'Beautiful safe entry for students aged 7–17.',
    name: 'Student name', age: 'Age', role: 'Role', child: 'Child', teen: 'Teen', city: 'City', school: 'School', submit: 'Register',
    users: 'Users', noUsers: 'No users yet',
    tasksTitle: 'Eco tasks', upload: 'Photo report upload', chooseTask: 'Select task', comment: 'Comment', photo: 'Result photo', save: 'Save report',
    done: 'Photo report saved!',
    gamesTitle: 'Eco logic games',
    adminTitle: 'Admin dashboard (only for you)', adminDesc: 'Full monitoring: who did what and when.', usersCount: 'Users', reportsCount: 'Reports', logsCount: 'Events',
    activity: 'Activity feed',
    directorTitle: 'Director dashboard', directorDesc: 'School and city eco-performance control.',
    chooseCity: 'Choose city',
    chromtauSchools: 'Chromtau schools (7 schools)',
    footer: 'EcoBala · Kazakhstan'
  },
  kz: {
    home: 'Басты', students: 'Оқушыға', tasks: 'Тапсырмалар', games: 'Ойындар', register: 'Тіркелу', admin: 'Админ', director: 'Директор',
    founders: 'Құрылтайшылар / CEO: Amirtay.E, Ermukhanov.M',
    firstTitle: 'Алдымен тіркелу — содан кейін платформаға кіру',
    firstText: 'Эко-квесттерді бастау үшін тіркелуді толтырыңыз.',
    enterPlatform: 'Платформаға кіру',
    brandSlogan: 'Үлкен болашаққа кіші қадамдар',
    mapTitle: 'Қазақстан белсенділік картасы',
    mapDesc: 'Негізгі қалалар және оқушылардың экологиялық үлесі.',
    regTitle: 'Тіркелу аймағы', regHint: '7–17 жас оқушыларға арналған әдемі қауіпсіз кіру.',
    name: 'Оқушы аты', age: 'Жасы', role: 'Рөлі', child: 'Бала', teen: 'Жасөспірім', city: 'Қала', school: 'Мектеп', submit: 'Тіркелу',
    users: 'Қатысушылар', noUsers: 'Әзірге тіркелген оқушы жоқ',
    tasksTitle: 'Экологиялық тапсырмалар', upload: 'Фото-есеп жүктеу', chooseTask: 'Тапсырманы таңдаңыз', comment: 'Пікір', photo: 'Нәтиже фотосы', save: 'Есепті сақтау',
    done: 'Фото-есеп сақталды!',
    gamesTitle: 'Эко логикалық ойындар',
    adminTitle: 'Админ панелі (тек сіз үшін)', adminDesc: 'Толық мониторинг: кім, қашан, не істеді.', usersCount: 'Қолданушылар', reportsCount: 'Есептер', logsCount: 'Оқиғалар',
    activity: 'Белсенділік лентасы',
    directorTitle: 'Директор панелі', directorDesc: 'Мектеп және қала эко-үдерістерін бақылау.',
    chooseCity: 'Қаланы таңдаңыз',
    chromtauSchools: 'Хромтау мектептері (7 мектеп)',
    footer: 'EcoBala · Қазақстан'
  }
};

function getLang() { return localStorage.getItem('ecobala_language') || 'ru'; }
function t(key) { return I18N[getLang()]?.[key] ?? I18N.ru[key] ?? key; }
function setLang(lang) { localStorage.setItem('ecobala_language', lang); applyTranslations(); }

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll('.lang-btn').forEach((b) => b.classList.toggle('active', b.dataset.lang === getLang()));
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.lang-btn');
  if (btn) setLang(btn.dataset.lang);
});

document.addEventListener('DOMContentLoaded', applyTranslations);
