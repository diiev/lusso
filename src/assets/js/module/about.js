function about() {
    const { createApp, ref, onMounted } = Vue;

    createApp({
        setup() {
            // --- 1. НАВИГАЦИЯ & МОБИЛЬНОЕ МЕНЮ ---
            const isMobileMenuOpen = ref(false);
           

            // --- 2. КАРТА / ТАБЫ (Маршруты) ---
            const activePoint = ref('lusso');

      // --- 1. ЛОКАЦИИ (Данные + Состояние слайдера) ---
            const locations = ref([
                {
                    id: 1,
                    title: 'LUSSO',
                    address: 'ул. Кавказская, 52',
                    description: 'Первая кофейня LUSSO. Спокойный ритм, много дневного света, акцент на классическом эспрессо и десертах.',
                    phone: '+7 (938) 999 77 88',
                    hours: 'Ежедневно 08:00–23:00',
                    mapLink: '...', // Ссылка на маршрут, если нужно
                    // У каждой карточки СВОЙ счетчик слайда
                    currentSlide: 0, 
                    // СВОИ фото
                    photos: [
                        { src: 'assets/img/lusso_1.jpg', alt: 'Кавказская интерьер' },
                        { src: 'assets/img/lusso_3.webp', alt: 'Кавказская зал' },
                        { src: 'assets/img/lusso_5.webp', alt: 'Кавказская детали' },
                    ]
                },
                {
                    id: 2,
                    title: 'LUSSO / URBAN',
                    address: 'пр. Проспект, 10', // Другой адрес
                    description: 'Новая точка в центре города. Быстрый ритм, завтраки весь день и альтернативные способы заваривания.',
                    phone: '+7 (999) 123 45 67',
                    hours: 'Ежедневно 07:30–22:00',
                    mapLink: '...',
                    currentSlide: 0, // Отдельный счетчик для второй карточки
                    photos: [
                        // ДРУГИЕ фото
                        { src: 'assets/img/urban_1.jpg', alt: 'Урбан вход' },
                        { src: 'assets/img/urban_2.jpg', alt: 'Урбан бар' },
                        { src: 'assets/img/urban_3.jpg', alt: 'Урбан еда' },
                    ]
                }
            ]);

            // --- Методы навигации (принимают индекс карточки) ---
            
            const nextSlide = (index) => {
                const loc = locations.value[index];
                loc.currentSlide = (loc.currentSlide + 1) % loc.photos.length;
            };

            const prevSlide = (index) => {
                const loc = locations.value[index];
                const len = loc.photos.length;
                loc.currentSlide = (loc.currentSlide - 1 + len) % len;
            };

            // --- Свайпы (Touch Events) ---
            // Нам нужно знать, на какой карточке начался свайп
            let touchStartX = 0;
            let touchEndX = 0;
            let activeCardIndex = null; 

            const handleTouchStart = (e, index) => {
                touchStartX = e.touches[0].clientX;
                activeCardIndex = index; // Запоминаем, какую карточку трогаем
            };

            const handleTouchMove = (e) => {
                touchEndX = e.touches[0].clientX;
            };

            const handleTouchEnd = () => {
                if (activeCardIndex === null) return;
                
                const threshold = 50;
                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        nextSlide(activeCardIndex);
                    } else {
                        prevSlide(activeCardIndex);
                    }
                }
                activeCardIndex = null; // Сброс
            };
           
            // --- 4. ФОРМА ОБРАТНОЙ СВЯЗИ ---
            const form = ref({ name: '', contact: '', topic: '', message: '' });
            const formSent = ref(false);

            const handleForm = () => {
                if (!form.value.name || !form.value.contact || !form.value.message) {
                    alert('Пожалуйста, заполните имя, контакт и сообщение.');
                    return;
                }
                // Имитация отправки
                formSent.value = true;
                
                // Очистка формы (опционально)
                // form.value = { name: '', contact: '', topic: '', message: '' };
                
                setTimeout(() => { formSent.value = false; }, 5000);
            };

            // --- 5. АНИМАЦИИ ПРИ СКРОЛЛЕ (Intersection Observer) ---
            const locationsRef = ref(null);
            const routeRef = ref(null);
            const contactRef = ref(null);

            onMounted(() => {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) entry.target.classList.add('visible');
                        });
                    },
                    { threshold: 0.15 }
                );
                [locationsRef.value, routeRef.value, contactRef.value].forEach(el => {
                    if (el) observer.observe(el);
                });
            });

            // ---6. ИСТОРИЯ БРЕНДА (Синхронизированный слайдер) ---
            const isHistoryModalOpen = ref(false);
            const currentHistorySlide = ref(0);
            
            // ВАЖНО: Используем массив объектов, чтобы менять и фото, и текст
            const historySlides = [
                {
                    year: '2018',
                    title: 'В поисках смысла',
                    text: 'Всё началось с поездки в регион Гедео, Эфиопия. Там, на высоте 2000 метров, мы поняли, что настоящий кофе рождается не в машине, а в руках фермера.',
                    img: 'assets/img/lusso_1.jpg'
                },
                {
                    year: '2019',
                    title: 'Первый огонь',
                    text: 'Мы привезли первый ростер Giesen в пустой склад. Месяцы экспериментов, сотни сожженных килограммов зерна, пока мы не нашли тот самый профиль обжарки.',
                    img: 'assets/img/lusso_5.webp'
                },
                {
                    year: '2021',
                    title: 'Рождение LUSSO',
                    text: 'Открытие первой кофейни на Кавказской. Мы хотели создать место, где время замедляется, а вкус кофе говорит сам за себя без сиропов и добавок.',
                    img: 'assets/img/lusso_3.webp'
                },
                {
                    year: '2025',
                    title: 'Новая высота',
                    text: 'Запуск Urban Haven и собственной школы бариста. Мы продолжаем искать редкие лоты и учить людей культуре потребления спешелти зерна.',
                    img: 'assets/img/vacan.jpg'
                }
            ];

            const openHistoryModal = () => {
                isHistoryModalOpen.value = true;
                document.body.style.overflow = 'hidden'; // Блокируем скролл фона
            };

            const closeHistoryModal = () => {
                isHistoryModalOpen.value = false;
                document.body.style.overflow = ''; // Возвращаем скролл
            };

            const nextHistorySlide = () => {
                currentHistorySlide.value = (currentHistorySlide.value + 1) % historySlides.length;
            };

            const prevHistorySlide = () => {
                const len = historySlides.length;
                currentHistorySlide.value = (currentHistorySlide.value - 1 + len) % len;
            };

            // Управление с клавиатуры
            window.addEventListener('keydown', (e) => {
                if (isHistoryModalOpen.value) {
                    if (e.key === 'Escape') closeHistoryModal();
                    if (e.key === 'ArrowRight') nextHistorySlide();
                    if (e.key === 'ArrowLeft') prevHistorySlide();
                }
            });

            return {
                // Навигация
                isMobileMenuOpen,
                // Карта
                activePoint,
                 // Фотогалерея локаций
                 locations, // Возвращаем массив локаций
                nextSlide,
                prevSlide,
                handleTouchStart,
                handleTouchMove,
                handleTouchEnd,
                // Форма
                form, formSent, handleForm,
                // Скролл-рефы
                locationsRef, routeRef, contactRef,
                // История
                isHistoryModalOpen, openHistoryModal, closeHistoryModal,
                currentHistorySlide, nextHistorySlide, prevHistorySlide, 
                historySlides // <-- Важно: возвращаем именно этот массив
            };
        }
    }).mount('#app-about');
}

export default about;
