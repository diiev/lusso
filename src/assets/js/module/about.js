function about() {
    const { createApp, ref, onMounted } = Vue;

    createApp({
        setup() {
            // --- 1. НАВИГАЦИЯ & МОБИЛЬНОЕ МЕНЮ ---
            const isMobileMenuOpen = ref(false);
           

            // --- 2. КАРТА / ТАБЫ (Маршруты) ---
            const activePoint = ref('lusso');


              // --- 3. КАРУСЕЛЬ ФОТОГАЛЕРЕИ ЛОКАЦИЙ ---
            const currentLocationSlide = ref(0);
            
            // Массив фотографий для текущей локации
            const locationPhotos = ref([
                { src: 'assets/img/lusso_1.jpg', alt: 'LUSSO - интерьер' },
                { src: 'assets/img/lusso_3.webp', alt: 'LUSSO - зал' },
                { src: 'assets/img/lusso_5.webp', alt: 'LUSSO - бар' },
                { src: 'assets/img/vacan.jpg', alt: 'LUSSO - атмосфера' }
            ]);

  // Touch события для свайпа
            let touchStartX = 0;
            let touchEndX = 0;

            const handleTouchStart = (e) => {
                touchStartX = e.touches[0].clientX;
            };

            const handleTouchMove = (e) => {
                touchEndX = e.touches[0].clientX;
            };

            const handleTouchEnd = () => {
                const threshold = 50; // минимальное расстояние свайпа
                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        nextLocationSlide();
                    } else {
                        prevLocationSlide();
                    }
                }
            };

            const nextLocationSlide = () => {
                currentLocationSlide.value = (currentLocationSlide.value + 1) % locationPhotos.value.length;
            };

            const prevLocationSlide = () => {
                const len = locationPhotos.value.length;
                currentLocationSlide.value = (currentLocationSlide.value - 1 + len) % len;
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
                currentLocationSlide,
                locationPhotos,
                nextLocationSlide,
                prevLocationSlide,
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
