function indexPage () {
        const { createApp, ref, onMounted } = Vue;
        createApp({
            setup() {
                const currentSlide = ref(0);
                const currentMenuIndex = ref(0);
                const currentReviewIndex = ref(0);  
                 const isMobileMenuOpen = ref(false); // Новая переменная для контроля меню


                 // Логика свайпов
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
        const threshold = 50; // порог чувствительности
        if (touchStartX - touchEndX > threshold) {
            nextMenu(); // Свайп влево -> следующий
        } else if (touchEndX - touchStartX > threshold) {
            prevMenu(); // Свайп вправо -> предыдущий
        }
    };

                const slides = [
                    { title: "ВКУС ЭСТЕТИКИ", image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000" },
                    { title: "МАГИЯ ОБЖАРКИ", image: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?q=80&w=2000" }
                ];

                const menuItems = [
                    { name: "Авторский Капучино", category: "Кофе", price: 280, desc: "На двойном эспрессо с тонким ароматом мускатного ореха и густой сливочной пенкой.", img: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=1000" },
                    { name: "Миндальный Круассан", category: "Выпечка", price: 250, desc: "Классический французский рецепт с обилием миндальных лепестков и нежного крема.", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000" },
                    { name: "Матча Латте", category: "Чай", price: 320, desc: "Японский чай высшего сорта на альтернативном молоке с добавлением ванильного сиропа.", img: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=1000" }
                ];

                const reviews = [
                    { text: "Lusso — это место, где время замедляется. Внимание к деталям и вкус кофе просто поражают. Лучшая атмосфера в городе.", author: "Ваха Мусаев" },
                    { text: "Каждый раз, приходя сюда, чувствую себя особенным гостем. Ребята знают о кофе всё и даже больше!", author: "Лом-Али Якубов" },
                    { text: "Миндальный круассан и флэт уайт здесь — мой обязательный ритуал выходного дня. Идеально.", author: "Делина Вахаева" }
                ];

                const nextMenu = () => { currentMenuIndex.value = (currentMenuIndex.value + 1) % menuItems.length; };
                const prevMenu = () => { currentMenuIndex.value = (currentMenuIndex.value - 1 + menuItems.length) % menuItems.length; };

                onMounted(() => {
                    setInterval(() => { currentSlide.value = (currentSlide.value + 1) % slides.length; }, 6000);
                    setInterval(() => { currentReviewIndex.value = (currentReviewIndex.value + 1) % reviews.length; }, 8000);
                });

                return { currentSlide, currentMenuIndex, currentReviewIndex, isMobileMenuOpen, slides, menuItems, reviews, touchStart, nextMenu, prevMenu };
            }
        }).mount('#app');
    } 
    export default indexPage