function indexPage() {
    const { createApp, ref, computed, onMounted } = Vue;

    createApp({
        setup() {
            // --- СОСТОЯНИЕ (REFS) ---
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

            // --- ДАННЫЕ: КОМАНДА ---
            const team = ref([
                { 
                    name: 'Ахмед', 
                    role: 'Шеф-бариста', 
                    desc: 'Победитель чемпионата бариста 2023. Знает о кофе всё: от терруара Эфиопии до молекулярной химии экстракции. Любит заваривать V60.', 
                    img: 'assets/img/team1.jpg' 
                },
                { 
                    name: 'Мадина', 
                    role: 'Управляющая', 
                    desc: 'Душа нашего заведения. Следит за тем, чтобы каждая чашка была идеальной, а каждый гость чувствовал себя как дома.', 
                    img: 'assets/img/team2.jpg' 
                },
                { 
                    name: 'Ислам', 
                    role: 'Обжарщик', 
                    desc: 'Человек, который управляет огнем. Именно он создает тот самый уникальный профиль обжарки Lusso, который вы так любите.', 
                    img: 'assets/img/team3.avif' 
                }
            ]);

      



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
    
            };
        }
    }).mount('#app');
}

export default indexPage;
