function indexPage() {
    const { createApp, ref, computed, onMounted } = Vue;

    createApp({
        setup() {
            // --- СОСТОЯНИЕ (REFS) --- 
            const isMobileMenuOpen = ref(false);
            const currentSlide = ref(0);
            const currentReviewIndex = ref(0);
            const transitionName = ref('slide-next');

            // Рефы для анимации появления (Intersection Observer)
            const refNews = ref(null);
            const refReviews = ref(null);
            const refAbout = ref(null);

            // --- ДАННЫЕ: СЛАЙДЕР ГЛАВНЫЙ ---
            const slides = [
                { title: "ВКУС ЭСТЕТИКИ", image: "assets/img/slider1.jpeg" },
                { title: "МАГИЯ ОБЖАРКИ", image: "assets/img/slider2.jpeg" }
            ];

            // --- ДАННЫЕ: ОТЗЫВЫ ---
            const reviews = [
                { text: "Lusso — это место, где время замедляется.", author: "Ваха Мусаев" },
                { text: "Каждый раз, приходя сюда, чувствую себя особенным.", author: "Лом-Али Якубов" },
                { text: "Миндальный круассан и флэт уайт здесь — идеал.", author: "Делина Вахаева" }
            ];
// --- ДАННЫЕ КОМАНДЫ (6 человек) ---
const team = ref([
    // --- СТРАНИЦА 1 ---
    { 
        id: 1, 
        name: 'Ахмед', 
        role: 'Шеф-бариста', 
        img: 'assets/img/team1.jpg', 
        desc: 'Победитель чемпионата бариста 2023. Кофейный гик и перфекционист.',
        slides: [
            { 
                title: 'Путь к мастерству', 
                text: 'Ахмед в индустрии уже 7 лет. В 2023 году он занял первое место на региональном чемпионате, удивив судей своим авторским методом ферментации зерна перед завариванием.', 
                img: 'assets/img/team1.jpg' 
            },
            { 
                title: 'Философия V60', 
                text: 'Его любимый метод — воронка V60. Ахмед считает, что только ручное заваривание способно полностью раскрыть цветочные и ягодные ноты эфиопского зерна.', 
                img: 'assets/img/team1_brew.jpg' 
            },
            { 
                title: 'Наставничество', 
                text: 'Каждое утро он проводит калибровку эспрессо с командой, обучая молодых бариста чувствовать малейшие нюансы экстракции.', 
                img: 'assets/img/team1_teach.jpg' 
            }
        ] 
    },
    { 
        id: 2, 
        name: 'Мадина', 
        role: 'Управляющая', 
        img: 'assets/img/team2.jpg', 
        desc: 'Душа заведения. Создает атмосферу, в которую хочется возвращаться.',
        slides: [
            { 
                title: 'Атмосфера Lusso', 
                text: 'Для Мадины кофейня — это не просто бизнес, а дом. Она лично подбирает плейлисты, следит за освещением и тем, чтобы каждый гость чувствовал заботу.', 
                img: 'assets/img/team2.jpg' 
            },
            { 
                title: 'Сервис без скриптов', 
                text: 'Она внедрила систему сервиса, основанную на эмпатии. У нас нет заученных фраз — только искреннее общение и желание сделать день гостя лучше.', 
                img: 'assets/img/team2_hall.jpg' 
            }
        ] 
    },
    { 
        id: 3, 
        name: 'Ислам', 
        role: 'Обжарщик', 
        img: 'assets/img/team3.avif', 
        desc: 'Управляет огнем. Создает уникальный профиль обжарки для каждого лота.',
        slides: [
            { 
                title: 'Алхимия вкуса', 
                text: 'Ислам отвечает за сердце кофейни — ростер. Он обжаривает зерно малыми партиями (по 5-10 кг), чтобы контролировать каждую секунду развития вкуса и реакции Майяра.', 
                img: 'assets/img/team3.avif' 
            },
            { 
                title: 'Экспедиции', 
                text: 'Раз в год Ислам летает в страны произрастания (Бразилию или Колумбию), чтобы лично выбрать зеленый кофе, пожать руку фермерам и привезти эксклюзивные микролоты.', 
                img: 'assets/img/team3_farm.jpg' 
            },
            { 
                title: 'Каппинг', 
                text: 'Каждая партия проходит строгий контроль качества. Если профиль чашки не соответствует стандартам Lusso, зерно не попадает в бар.', 
                img: 'assets/img/team3_cup.jpg' 
            }
        ] 
    },

    // --- СТРАНИЦА 2 ---
    { 
        id: 4, 
        name: 'Елена', 
        role: 'Кондитер', 
        img: 'assets/img/team4.jpg', 
        desc: 'Автор наших знаменитых миндальных круассанов и десертов.',
        slides: [
            { 
                title: 'Парижская школа', 
                text: 'Елена обучалась кондитерскому искусству во Франции. Она привезла в Lusso аутентичные рецепты слоеного теста, которое готовится в течение 48 часов.', 
                img: 'assets/img/team4.jpg' 
            },
            { 
                title: 'Натуральные ингредиенты', 
                text: 'Никаких маргаринов и улучшителей. Только новозеландское сливочное масло, бельгийский шоколад и натуральная ваниль. Это её бескомпромиссное правило.', 
                img: 'assets/img/team4_kitchen.jpg' 
            }
        ] 
    },
    { 
        id: 5, 
        name: 'Дмитрий', 
        role: 'Бариста', 
        img: 'assets/img/team5.jpg', 
        desc: 'Мастер латте-арта и создатель лучшего настроения по утрам.',
        slides: [
            { 
                title: 'Искусство в чашке', 
                text: 'Дмитрий превращает каждый капучино в маленький шедевр. Он может нарисовать лебедя или сложную розетту даже в самый загруженный час пик.', 
                img: 'assets/img/team5.jpg' 
            },
            { 
                title: 'Энергия утра', 
                text: 'Он помнит имена и любимые напитки более 50 постоянных гостей. Люди приходят к нему не только за кофеином, но и за зарядом позитива на весь день.', 
                img: 'assets/img/team5_bar.jpg' 
            },
            { 
                title: 'Авторские напитки', 
                text: 'Именно Дмитрий придумал наш сезонный "Кедровый Раф", который стал хитом этой зимы.', 
                img: 'assets/img/team5_drink.jpg' 
            }
        ] 
    },
    { 
        id: 6, 
        name: 'Алина', 
        role: 'SMM & Бренд', 
        img: 'assets/img/team6.jpg', 
        desc: 'Визуальный голос бренда. Транслирует эстетику Lusso в мир.',
        slides: [
            { 
                title: 'Визуальный язык', 
                text: 'Алина отвечает за то, чтобы вкус нашего кофе можно было почувствовать даже через экран смартфона. Она создает весь фото и видео контент для наших соцсетей.', 
                img: 'assets/img/team6.jpg' 
            },
            { 
                title: 'Комьюнити', 
                text: 'Она организует наши открытые каппинги и мастер-классы, объединяя любителей кофе в одно большое и дружное сообщество.', 
                img: 'assets/img/team6_content.jpg' 
            }
        ] 
    }
]);

// --- ЛОГИКА ПАГИНАЦИИ (ПОКАЗАТЬ ЕЩЕ) ---
const currentPage = ref(0);
const itemsPerPageTeam = 3;

// Вычисляем, кого показывать прямо сейчас
const visibleTeam = computed(() => {
    const start = currentPage.value * itemsPerPageTeam;
    return team.value.slice(start, start + itemsPerPageTeam);
});

// Кнопка "Показать других"
const showNextTeam = () => {
    const totalPages = Math.ceil(team.value.length / itemsPerPageTeam);
    // Переключаем на следующую, если дошли до конца - возвращаемся в начало (цикл)
    currentPage.value = (currentPage.value + 1) % totalPages;
};

// --- ЛОГИКА МОДАЛКИ И СЛАЙДЕРА ---
// Логика переключения (чуть подправил под slides)
const selectedMember = ref(null);
const activeSlide = ref(0);

const openMemberModal = (member) => {
    selectedMember.value = member;
    activeSlide.value = 0;
    document.body.style.overflow = 'hidden';
};

const closeMemberModal = () => {
    selectedMember.value = null;
    document.body.style.overflow = '';
};

const nextSlide = () => {
    if (!selectedMember.value) return;
    const len = selectedMember.value.slides.length;
    activeSlide.value = (activeSlide.value + 1) % len;
};

const prevSlide = () => {
    if (!selectedMember.value) return;
    const len = selectedMember.value.slides.length;
    activeSlide.value = (activeSlide.value - 1 + len) % len;
};


            // --- ЛОГИКА НОВОСТЕЙ (LAZY LOAD) ---
            const allNews = [
                { id: 1, title: "Экспедиция в Эфиопию", tag: "Origin", date: "12 Янв 2026", excerpt: "Поиск идеальных лотов в регионе Гедео.", img: "assets/img/news1.avif", link: "news-single.html" },
                { id: 2, title: "Зимнее меню", tag: "Menu", date: "10 Янв 2026", excerpt: "Пряный раф и новые десерты.", img: "assets/img/news2.jpeg", link: "news-single.html" },
                { id: 3, title: "Мастер-класс V60", tag: "Event", date: "05 Янв 2026", excerpt: "Учимся заваривать дома.", img: "assets/img/news3.jpeg", link: "news-single.html" },
                { id: 4, title: "Интервью с обжарщиком", tag: "People", date: "28 Дек 2025", excerpt: "Философия светлой обжарки.", img: "assets/img/news4.jpeg", link: "news-single.html" },
                { id: 5, title: "Новая кофемашина", tag: "Gear", date: "20 Дек 2025", excerpt: "Обновление оборудования в баре.", img: "assets/img/news5.jpeg", link: "news-single.html" },
                { id: 6, title: "История фермы", tag: "Story", date: "15 Дек 2025", excerpt: "Как растет наш кофе в Колумбии.", img: "assets/img/news6.avif", link: "news-single.html" }
            ];

            const visibleNews = ref([]); 
            const itemsPerPage = 2; 
            const loading = ref(false);

            const hasMoreNews = computed(() => visibleNews.value.length < allNews.length);

            const loadMore = () => {
                if (loading.value || !hasMoreNews.value) return;
                loading.value = true;
                
                setTimeout(() => {
                    const nextItems = allNews.slice(
                        visibleNews.value.length, 
                        visibleNews.value.length + itemsPerPage
                    );
                    visibleNews.value.push(...nextItems);
                    loading.value = false;
                }, 600);
            };

            // Загрузка первых новостей
            loadMore();

            // --- НАВИГАЦИЯ ОТЗЫВОВ ---
            const nextReview = () => {
                transitionName.value = 'slide-next';
                currentReviewIndex.value = (currentReviewIndex.value + 1) % reviews.length;
            };

            const prevReview = () => {
                transitionName.value = 'slide-prev';
                currentReviewIndex.value = (currentReviewIndex.value - 1 + reviews.length) % reviews.length;
            };

            // --- Lifecycle Hooks ---
            onMounted(() => {
                // 1. Анимация появления при скролле
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            // observer.unobserve(entry.target); // Можно раскомментировать, если анимация нужна только 1 раз
                        }
                    });
                }, { threshold: 0.15 });

                [refNews.value, refReviews.value, refAbout.value].forEach(el => {
                    if (el) observer.observe(el);
                });

                // 2. Авто-слайдеры
                setInterval(() => { 
                    currentSlide.value = (currentSlide.value + 1) % slides.length; 
                }, 6000);
                
                setInterval(() => { 
                    nextReview(); // Используем функцию для правильной анимации
                }, 8000);
            }); 

            return {
                // Состояние
                currentSlide,
                currentReviewIndex,
                transitionName,
                isMobileMenuOpen,
                // Данные
                slides,
                reviews,
                team,
                
                // Новости
                visibleNews,
                hasMoreNews,
                loading,
                loadMore,

                // Refs
                refNews,
                refReviews,
                refAbout,

                // Методы
                nextReview,
                prevReview,  

                 selectedMember,
    activeSlide,
    openMemberModal,
    closeMemberModal,
    nextSlide,
    prevSlide,
    visibleTeam,
    showNextTeam
    
            };
        }
    }).mount('#app');
}

export default indexPage;
