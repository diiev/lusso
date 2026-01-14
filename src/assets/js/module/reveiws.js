function feedbackPage() {
    const { createApp, ref } = Vue;

    createApp({
        setup() {
            // Состояние формы
            const showForm = ref(false);
            const previewImages = ref([]);
            const newReview = ref({ author: '', text: '', rating: 5 });

            // Состояние Lightbox (Галереи)
            const lightbox = ref({
                visible: false,
                images: [],
                index: 0
            });

            // Данные отзывов
            const reviews = ref([
                {
                    id: 1, author: "Виктория С.", date: "14 янв 2026", rating: 5,
                    text: "Это место вдохновляет. Свет, запах зерна, музыка — всё складывается в идеальную картину.",
                    photos: [
                        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800",
                        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"
                    ],
                    reply: { text: "Виктория, рады быть вашим местом силы!" }
                }, 
                 {
                    id: 2, author: "Виктория С.", date: "14 янв 2026", rating: 5,
                    text: "Это место вдохновляет. Свет, запах зерна, музыка — всё складывается в идеальную картину.",
                    photos: [
                        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800",
                        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"
                    ],
                    reply: { text: "Виктория, рады быть вашим местом силы!" }
                }, 
                 {
                    id: 3, author: "Виктория С.", date: "14 янв 2026", rating: 5,
                    text: "Это место вдохновляет. Свет, запах зерна, музыка — всё складывается в идеальную картину.",
                    photos: [
                        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800",
                        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"
                    ],
                    reply: { text: "Виктория, рады быть вашим местом силы!" }
                }, 
                 {
                    id: 4, author: "Виктория С.", date: "14 янв 2026", rating: 5,
                    text: "Это место вдохновляет. Свет, запах зерна, музыка — всё складывается в идеальную картину.",
                    photos: [
                        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800",
                        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"
                    ],
                    reply: { text: "Виктория, рады быть вашим местом силы!" }
                }, 
                 {
                    id: 5, author: "Виктория С.", date: "14 янв 2026", rating: 5,
                    text: "Это место вдохновляет. Свет, запах зерна, музыка — всё складывается в идеальную картину.",
                    photos: [
                        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800",
                        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"
                    ],
                    reply: { text: "Виктория, рады быть вашим местом силы!" }
                }, 
                 {
                    id: 6, author: "Виктория С.", date: "14 янв 2026", rating: 5,
                    text: "Это место вдохновляет. Свет, запах зерна, музыка — всё складывается в идеальную картину.",
                    photos: [
                        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800",
                        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"
                    ],
                    reply: { text: "Виктория, рады быть вашим местом силы!" }
                }, 
                 {
                    id: 7, author: "Виктория С.", date: "14 янв 2026", rating: 5,
                    text: "Это место вдохновляет. Свет, запах зерна, музыка — всё складывается в идеальную картину.",
                    photos: [
                        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800",
                        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"
                    ],
                    reply: { text: "Виктория, рады быть вашим местом силы!" }
                }, 
                 {
                    id: 8, author: "Виктория С.", date: "14 янв 2026", rating: 5,
                    text: "Это место вдохновляет. Свет, запах зерна, музыка — всё складывается в идеальную картину.",
                    photos: [
                        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800",
                        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"
                    ],
                    reply: { text: "Виктория, рады быть вашим местом силы!" }
                }
            ]);

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
                reviews.value.unshift({
                    id: Date.now(),
                    ...newReview.value,
                    photos: [...previewImages.value],
                    date: "Только что",
                    reply: null
                });
                newReview.value = { author: '', text: '', rating: 5 };
                previewImages.value = [];
                showForm.value = false;
            };

            // --- МЕТОДЫ LIGHTBOX ---
            const openLightbox = (images, index) => {
                lightbox.value.images = images;
                lightbox.value.index = index;
                lightbox.value.visible = true;
                document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
            };

            const closeLightbox = () => {
                lightbox.value.visible = false;
                document.body.style.overflow = ''; // Возвращаем скролл
            };

            const nextImage = () => {
                lightbox.value.index = (lightbox.value.index + 1) % lightbox.value.images.length;
            };

            const prevImage = () => {
                lightbox.value.index = (lightbox.value.index - 1 + lightbox.value.images.length) % lightbox.value.images.length;
            };

            // Обработка клавиш (Esc, стрелки)
            window.addEventListener('keydown', (e) => {
                if (!lightbox.value.visible) return;
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
            });

            return { 
                showForm, reviews, newReview, previewImages, lightbox,
                handleFileUpload, removePhoto, submitReview,
                openLightbox, closeLightbox, nextImage, prevImage
            };
        }
    }).mount('#app-feed');
}

feedbackPage();
