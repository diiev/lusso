function indexPage() {
    const { createApp, ref, computed, onMounted } = Vue;

    createApp({
        setup() {
            // --- СОСТОЯНИЕ (REFS) ---
            const currentSlide = ref(0);
            const currentMenuIndex = ref(0);
            const currentReviewIndex = ref(0);
            const isMobileMenuOpen = ref(false);
            const transitionName = ref('slide-next');

            // Рефы для HTML-элементов (анимация появления)
            const refMenu = ref(null);
            const refNews = ref(null);     // Исправлено: добавили объявление
            const refReviews = ref(null);
            const refAbout = ref(null);

            // --- ДАННЫЕ ---
            const slides = [
                { title: "ВКУС ЭСТЕТИКИ", image: "assets/img/slider1.jpeg" },
                { title: "МАГИЯ ОБЖАРКИ", image: "assets/img/slider2.jpeg" }
            ];

          
            const reviews = [
                { text: "Lusso — это место, где время замедляется.", author: "Ваха Мусаев" },
                { text: "Каждый раз, приходя сюда, чувствую себя особенным.", author: "Лом-Али Якубов" },
                { text: "Миндальный круассан и флэт уайт здесь — идеал.", author: "Делина Вахаева" }
            ];

            const team = [
                { name: "Марко Росси", role: "Шеф-бариста", desc: "Чемпион Италии по латте-арту.", img: "assets/img/team1.jpg" },
                { name: "Анна Соколова", role: "Q-грейдер", desc: "Выбирает лучшие лоты зерна.", img: "assets/img/team2.jpg" },
                { name: "Давид ван дер Берг", role: "Мастер обжарки", desc: "Создает уникальные профили обжарки.", img: "assets/img/team3.avif" }
            ];

            // --- ЛОГИКА НОВОСТЕЙ (LAZY LOAD) ---
            const allNews = [
                { id: 1, title: "Экспедиция в Эфиопию", tag: "Origin", date: "12 Янв 2026", excerpt: "Поиск идеальных лотов в регионе Гедео.", img: "assets/img/news1.avif", link: "article.html" },
                { id: 2, title: "Зимнее меню", tag: "Menu", date: "10 Янв 2026", excerpt: "Пряный раф и новые десерты.", img: "assets/img/news2.jpeg", link: "article.html" },
                { id: 3, title: "Мастер-класс V60", tag: "Event", date: "05 Янв 2026", excerpt: "Учимся заваривать дома.", img: "assets/img/news3.jpeg", link: "article.html" },
                { id: 4, title: "Интервью с обжарщиком", tag: "People", date: "28 Дек 2025", excerpt: "Философия светлой обжарки.", img: "assets/img/news4.jpeg", link: "article.html" },
                { id: 5, title: "Новая кофемашина", tag: "Gear", date: "20 Дек 2025", excerpt: "Обновление оборудования в баре.", img: "assets/img/news5.jpeg", link: "article.html" },
                { id: 6, title: "История фермы", tag: "Story", date: "15 Дек 2025", excerpt: "Как растет наш кофе в Колумбии.", img: "assets/img/news6.avif", link: "article.html" }
            ];

            const visibleNews = ref([]); 
            const itemsPerPage = 2; // Грузим по 2 новости
            const loading = ref(false);

            const hasMoreNews = computed(() => {
                return visibleNews.value.length < allNews.length;
            });

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

            // Загрузка первых новостей при инициализации
            loadMore();

            // --- СВАЙПЫ (Touch Events) ---
            let touchStartX = 0;
            let touchEndX = 0;

            const touchStart = (e) => {
                touchStartX = e.changedTouches[0].screenX;
            };

            const touchEnd = (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            };

            const handleSwipe = () => {
                if (touchStartX - touchEndX > 50) nextMenu(); // Влево
                else if (touchEndX - touchStartX > 50) prevMenu(); // Вправо
            };

            // --- НАВИГАЦИЯ ---
            const nextMenu = () => { currentMenuIndex.value = (currentMenuIndex.value + 1) % menuItems.length; };
            const prevMenu = () => { currentMenuIndex.value = (currentMenuIndex.value - 1 + menuItems.length) % menuItems.length; };

            const nextReview = () => {
                transitionName.value = 'slide-next';
                currentReviewIndex.value = (currentReviewIndex.value + 1) % reviews.length;
            };

            const prevReview = () => {
                transitionName.value = 'slide-prev';
                currentReviewIndex.value = (currentReviewIndex.value - 1 + reviews.length) % reviews.length;
            };

            // --- Lifecycle Hooks (onMounted) ---
            onMounted(() => {
                // 1. Intersection Observer для анимации появления секций
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                }, { threshold: 0.15 });

                [refMenu.value, refNews.value, refReviews.value, refAbout.value].forEach(el => {
                    if (el) observer.observe(el);
                });

                // 2. Авто-слайдеры
                setInterval(() => { 
                    currentSlide.value = (currentSlide.value + 1) % slides.length; 
                }, 6000);
                
                setInterval(() => { 
                    currentReviewIndex.value = (currentReviewIndex.value + 1) % reviews.length; 
                }, 8000);
            });

            return {
                // Состояние
                currentSlide,
                currentMenuIndex,
                currentReviewIndex,
                isMobileMenuOpen,
                transitionName,
                
                // Данные
                slides,
                reviews,
                team,
                
                // Новости (Lazy Load)
                visibleNews,
                hasMoreNews,
                loading,
                loadMore,

                // Refs элементов
                refMenu,
                refNews,
                refReviews,
                refAbout,

                // Методы
                touchStart,
                touchEnd,
                nextMenu,
                prevMenu,
                nextReview,
                prevReview
            };
        }
    }).mount('#app');
}

export default indexPage;
