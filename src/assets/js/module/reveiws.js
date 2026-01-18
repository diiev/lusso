/**
 * Скрипт страницы отзывов LUSSO с Infinite Scroll
 */
function feedbackPage() {
    const { createApp, ref, computed, onMounted } = Vue;

    createApp({
        setup() {
            // --- СОСТОЯНИЕ UI ---
            const showForm = ref(false);
            const isMobileMenuOpen = ref(false);
            const previewImages = ref([]);
            const newReview = ref({ author: '', text: '', rating: 5 });

            // --- ДАННЫЕ ОТЗЫВОВ (Имитация Базы Данных) ---
            // В реальном проекте эти данные приходят с сервера
            const allReviewsDb = [
                {
                    id: 1, author: "Виктория С.", date: "14 янв 2026", rating: 5,
                    text: "Это место вдохновляет. Свет, запах зерна, музыка — всё складывается в идеальную картину.",
                    photos: ["assets/img/lusso_1.jpg", "assets/img/lusso_3.webp"],
                    reply: { text: "Виктория, рады быть вашим местом силы!" }
                },
                {
                    id: 2, author: "Алексей М.", date: "12 янв 2026", rating: 5,
                    text: "Лучший фильтр в городе. Эфиопия просто раскрылась цветами.",
                    photos: [], reply: null
                },
                {
                    id: 3, author: "Мария К.", date: "10 янв 2026", rating: 4,
                    text: "Очень вкусно, но пришлось подождать столик. Популярное место!",
                    photos: [], reply: { text: "Мария, спасибо за терпение! Стараемся размещать гостей как можно быстрее." }
                },
                {
                    id: 4, author: "Дмитрий В.", date: "05 янв 2026", rating: 5,
                    text: "Атмосфера топ, бариста профи.",
                    photos: ["assets/img/lusso_5.webp"], reply: null
                },
                {
                    id: 5, author: "Елена Р.", date: "02 янв 2026", rating: 5,
                    text: "Миндальный круассан - это любовь.",
                    photos: [], reply: null
                },
                {
                    id: 6, author: "Сергей П.", date: "28 дек 2025", rating: 5,
                    text: "Отличное место для работы с ноутбуком утром.",
                    photos: [], reply: null
                },
                {
                    id: 7, author: "Ольга Т.", date: "25 дек 2025", rating: 5,
                    text: "Приятно удивил выбор зерна.",
                    photos: [], reply: null
                },
                {
                    id: 8, author: "Андрей Л.", date: "20 дек 2025", rating: 4,
                    text: "Кофе отличный, десертов к вечеру мало осталось.",
                    photos: [], reply: { text: "Андрей, учтем! Стараемся печь больше к вечеру." }
                }
            ];

            // --- ЛОГИКА INFINITE SCROLL ---
            const visibleReviews = ref([]); // То, что сейчас на экране
            const loadingReviews = ref(false);
            const infiniteScrollTrigger = ref(null); // Ссылка на DOM-элемент
            const pageSize = 3; // Грузим по 3 отзыва

            const hasMoreReviews = computed(() => {
                return visibleReviews.value.length < allReviewsDb.length;
            });

            const loadMoreReviews = () => {
                if (loadingReviews.value || !hasMoreReviews.value) return;
                
                loadingReviews.value = true;
                
                // Имитация задержки сети (800мс)
                setTimeout(() => {
                    const currentLen = visibleReviews.value.length;
                    const nextChunk = allReviewsDb.slice(currentLen, currentLen + pageSize);
                    visibleReviews.value.push(...nextChunk);
                    loadingReviews.value = false;
                }, 800);
            };

            // Загрузка первой партии
            loadMoreReviews();

            onMounted(() => {
                const observer = new IntersectionObserver((entries) => {
                    // Если триггер виден и есть еще отзывы -> грузим
                    if (entries[0].isIntersecting && hasMoreReviews.value) {
                        loadMoreReviews();
                    }
                }, { rootMargin: "200px" }); // Начинать грузить заранее (за 200px до низа)

                if (infiniteScrollTrigger.value) {
                    observer.observe(infiniteScrollTrigger.value);
                }
            });

            // --- МЕТОДЫ ФОРМЫ ---
            const handleFileUpload = (e) => {
                Array.from(e.target.files).forEach(file => {
                    if (previewImages.value.length < 3) {
                        const reader = new FileReader();
                        reader.onload = (ev) => previewImages.value.push(ev.target.result);
                        reader.readAsDataURL(file);
                    }
                });
            };
            const removePhoto = (i) => previewImages.value.splice(i, 1);
            
            const submitReview = () => {
                // Добавляем новый отзыв в НАЧАЛО видимого списка и в базу
                const newReviewItem = {
                    id: Date.now(),
                    ...newReview.value,
                    photos: [...previewImages.value],
                    date: "Только что",
                    reply: null
                };
                
                visibleReviews.value.unshift(newReviewItem);
                allReviewsDb.unshift(newReviewItem); // Чтобы он остался при перезагрузках (в рамках сессии)

                newReview.value = { author: '', text: '', rating: 5 };
                previewImages.value = [];
                showForm.value = false;
            };

            // --- LIGHTBOX ---
            const lightbox = ref({ visible: false, images: [], index: 0 });

            const openLightbox = (images, index) => {
                lightbox.value.images = images;
                lightbox.value.index = index;
                lightbox.value.visible = true;
                document.body.style.overflow = 'hidden';
            };

            const closeLightbox = () => {
                lightbox.value.visible = false;
                document.body.style.overflow = '';
            };

            const nextImage = () => {
                lightbox.value.index = (lightbox.value.index + 1) % lightbox.value.images.length;
            };

            const prevImage = () => {
                const len = lightbox.value.images.length;
                lightbox.value.index = (lightbox.value.index - 1 + len) % len;
            };

            window.addEventListener('keydown', (e) => {
                if (!lightbox.value.visible) return;
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
            });

            return { 
                showForm, isMobileMenuOpen,
                previewImages, newReview, 
                // Возвращаем visibleReviews вместо reviews для рендеринга
                reviews: visibleReviews, // Алиас, чтобы не ломать шаблон
                visibleReviews, loadingReviews, infiniteScrollTrigger, hasMoreReviews, // Для скролла
                lightbox,
                handleFileUpload, removePhoto, submitReview,
                openLightbox, closeLightbox, nextImage, prevImage
            };
        }
    }).mount('#app-feed');
}

// Экспорт (если используется модульная система)
// export default feedbackPage; 
// Или просто вызов, если это обычный скрипт:
feedbackPage();
