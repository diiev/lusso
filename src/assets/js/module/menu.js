function menu() {
    const { createApp, ref, computed, watch, onMounted, onUnmounted, nextTick } = Vue;

    createApp({
        setup() {
            // --- СОСТОЯНИЕ (STATE) ---
            const isMobileMenuOpen = ref(false);
            const selectedLocation = ref(null);
            const noticeText = ref("");
            const showNotice = ref(false);
            const activeCategory = ref('Все');
            const showCheckout = ref(false);
            const confirmClear = ref(false);
            const checkoutMode = ref('order');
            const searchQuery = ref("");
            const selectedItem = ref(null);
            const activeSlide = ref(0);
            const lastLocation = ref(null);

            const cart = ref([]);
            const form = ref({ name: '', phone: '', type: 'pickup', address: '' });

            // --- ЛЕНИВАЯ ЗАГРУЗКА (PAGINATION) ---
            const page = ref(1);
            const itemsPerPage = 8;
            const bottomSentinel = ref(null);
            let observer = null;

            // --- ДАННЫЕ (DATA) ---
            const locations = [
                {
                    name: 'LUSSO',
                    addr: 'ул. Кавказская, 52',
                    desc: 'Первая specialty кофейня в городе. Островок тишины и эстетики.',
                    image: 'assets/img/lusso_1.jpg',
                    whatsapp: '79389997788'
                },
                {
                    name: 'LUSSO URBAN HAVEN',
                    addr: 'Проспект А. Кадырова, 28',
                    desc: 'Городское убежище для продуктивной работы и встреч.',
                    image: 'assets/img/lusso2.jpg',
                    whatsapp: '79389998118'
                }
            ];

            const categories = ['Все', 'Кофе', 'Сендвичи', 'Десерты', 'Завтраки'];

            // !!! ВАЖНО: У каждого товара теперь есть массив locations
            const items = [
                {
                    id: 1,
                    name: 'Эспрессо',
                    price: 200,
                    desc: 'Такой эспрессо ты точно не пробовал.',
                    fullDesc: "Классический крепкий черный кофе.",
                    category: 'Кофе',
                    image: 'assets/img/espresso.jpg',
                    images: ['assets/img/espresso.jpg'],
                    isNew: false,
                    locations: ['LUSSO', 'LUSSO URBAN HAVEN'] // Доступен везде
                },
                {
                    id: 2,
                    name: 'Сэндвич с курицей',
                    price: 370,
                    desc: 'С грибным соусом, моцареллой и томатами',
                    category: 'Сендвичи',
                    image: 'assets/img/chikensandwich.jpg',
                    locations: ['LUSSO URBAN HAVEN'] // Только на Проспекте
                },
                {
                    id: 3,
                    name: 'Бельгийские вафли с мороженным',
                    price: 320,
                    desc: 'C ягодами и шоколадным соусом.',
                    category: 'Десерты',
                    image: 'assets/img/belg.jpg',
                    locations: ['LUSSO'] // Только на Кавказской
                },
                {
                    id: 4,
                    name: 'Флэт Уайт',
                    price: 250,
                    desc: 'Насыщенный кофейный вкус с минимальным слоем пены.',
                    category: 'Кофе',
                    image: 'assets/img/fletwhite.jpg',
                    locations: ['LUSSO', 'LUSSO URBAN HAVEN']
                },
                {
                    id: 5,
                    name: 'Американо',
                    price: 200,
                    desc: '',
                    category: 'Кофе',
                    image: 'assets/img/americano.jpg',
                    locations: ['LUSSO', 'LUSSO URBAN HAVEN']
                },
                {
                    id: 6,
                    name: 'Английский завтрак',
                    price: 450,
                    desc: 'Сытный завтрак с яйцами и беконом',
                    category: 'Завтраки',
                    image: 'assets/img/english_morning.jpg',
                    locations: ['LUSSO URBAN HAVEN']
                },
                {
                    id: 7,
                    name: 'Капучино',
                    desc: 'Классический напиток',
                    fullDesc: 'Классический итальянский капучино на свежем эспрессо и молоке.',
                    image: 'assets/img/cap.jpg',
                    images: ['assets/img/cap.jpg', 'assets/img/espresso.jpg'],
                    price: 250,
                    isNew: true,
                    category: 'Кофе',
                    locations: ['LUSSO', 'LUSSO URBAN HAVEN'],
                    nutrition: { proteins: 6, fats: 7, carbs: 8, calories: 120 }
                },
                // ... добавьте больше товаров, чтобы протестировать скролл
            ];

            // --- ВЫЧИСЛЕНИЯ (COMPUTED) ---

            // 1. Фильтрация: Локация + Категория + Поиск
            const filteredItems = computed(() => {
                // Если локация не выбрана - ничего не показываем в меню (экран выбора)
                if (!selectedLocation.value) return [];

                return items.filter(item => {
                    // Проверка локации (есть ли товар в выбранной точке)
                    const matchesLocation = item.locations && item.locations.includes(selectedLocation.value);
                    if (!matchesLocation) return false;

                    // Проверка категории
                    const matchesCategory = activeCategory.value === 'Все' || item.category === activeCategory.value;

                    // Проверка поиска
                    const searchLower = searchQuery.value.toLowerCase();
                    const matchesSearch = item.name.toLowerCase().includes(searchLower) ||
                        (item.desc && item.desc.toLowerCase().includes(searchLower));

                    return matchesCategory && matchesSearch;
                });
            });

            // 2. Ленивая загрузка: Отрезаем кусок для показа
            const visibleItems = computed(() => {
                return filteredItems.value.slice(0, page.value * itemsPerPage);
            });

            const cartTotalSum = computed(() => cart.value.reduce((acc, i) => acc + (i.price * i.qty), 0));

            // --- МЕТОДЫ (METHODS) --- 



            // 2. Обновленная функция выбора
            const selectLocation = (loc) => {
                // Проверяем:
                // 1. В корзине что-то есть?
                // 2. Мы запомнили прошлую локацию?
                // 3. Новая локация отличается от прошлой?
                if (cart.value.length > 0 && lastLocation.value && lastLocation.value !== loc) {
                    cart.value = []; // Очищаем

                    // Показываем уведомление
                    noticeText.value = "Корзина очищена (смена локации)";
                    showNotice.value = true;
                    setTimeout(() => { showNotice.value = false; }, 3000);
                }

                selectedLocation.value = loc;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };

            const getItemQty = (id) => cart.value.find(i => i.id === id)?.qty || 0;

            const clearCart = () => { cart.value = []; confirmClear.value = false; };

            const removeItem = (id) => {
                cart.value = cart.value.filter(i => i.id !== id);
                if (cart.value.length === 0) showCheckout.value = false;
            };

            const changeQty = (item, delta) => {
                const existing = cart.value.find(i => i.id === item.id);
                if (existing) {
                    existing.qty += delta;
                    if (existing.qty <= 0) cart.value = cart.value.filter(i => i.id !== item.id);
                } else if (delta > 0) {
                    cart.value.push({ ...item, qty: 1 });
                }
            };

            const showNoticeWithText = (text) => {
                noticeText.value = text;
                showNotice.value = true;
                setTimeout(() => { showNotice.value = false; }, 3000);
            }

            // Управление скроллом body
            const lockScroll = () => { document.body.style.overflow = 'hidden' }
            const unlockScroll = () => { document.body.style.overflow = '' }

            // Модалки
            const openCheckout = () => { checkoutMode.value = 'order'; showCheckout.value = true; lockScroll() }
            const closeModal = () => { showCheckout.value = false; confirmClear.value = false; unlockScroll() }

            const openItemModal = (item) => {
                selectedItem.value = item;
                activeSlide.value = 0;
                lockScroll()
            }
            const closeItemModal = () => {
                selectedItem.value = null;
                unlockScroll()
            }

            // Слайдер
            const nextSlide = () => {
                if (!selectedItem.value?.images?.length) return
                activeSlide.value = (activeSlide.value + 1) % selectedItem.value.images.length
            }
            const prevSlide = () => {
                if (!selectedItem.value?.images?.length) return
                activeSlide.value = (activeSlide.value - 1 + selectedItem.value.images.length) % selectedItem.value.images.length
            }
            const addFromModal = () => { changeQty(selectedItem.value, 1); closeItemModal() }

            // Touch события
            const touchStartX = ref(0)
            const onTouchStart = (e) => { touchStartX.value = e.touches[0].clientX }
            const onTouchEnd = (e) => {
                const diff = e.changedTouches[0].clientX - touchStartX.value
                if (Math.abs(diff) < 40) return
                diff < 0 ? nextSlide() : prevSlide()
            }

            // Отправка в WhatsApp
            const sendToWhatsapp = () => {
                if (!form.value.name || !form.value.phone) {
                    showNoticeWithText("Заполните имя и телефон");
                    return;
                }
                const currentLocation = locations.find(l => l.name === selectedLocation.value);
                const phone = currentLocation ? currentLocation.whatsapp : "79389997788";

                let text = `Новый заказ от: ${form.value.name}\nТел: ${form.value.phone}\nТочка: ${selectedLocation.value}\nТип: ${form.value.type === 'pickup' ? 'Самовывоз' : 'Доставка'}\n`;
                if (form.value.type === 'delivery') text += `Адрес: ${form.value.address}\n`;

                text += `\nЗаказ:\n`;
                cart.value.forEach(i => { text += `— ${i.name} (x${i.qty}) — ${i.price * i.qty}₽\n`; });
                text += `\nИТОГО: ${cartTotalSum.value} ₽`;

                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`);
            };

            // --- НАБЛЮДАТЕЛИ (WATCHERS & OBSERVERS) ---

            watch(selectedLocation, (newVal, oldVal) => {
                // Если мы выходим из меню (была локация -> стал null), запоминаем, где были
                if (oldVal && !newVal) {
                    lastLocation.value = oldVal;
                }
            });

            // Сброс страницы при смене фильтров
            watch([activeCategory, searchQuery, selectedLocation], () => {
                page.value = 1;
            });

            // Инициализация Observer'а
            const initObserver = () => {
                if (observer) observer.disconnect();

                observer = new IntersectionObserver((entries) => {
                    const entry = entries[0];
                    // Если видим "дно" и есть еще скрытые товары
                    if (entry.isIntersecting && visibleItems.value.length < filteredItems.value.length) {
                        page.value++;
                    }
                }, { rootMargin: '200px', threshold: 0.1 });

                if (bottomSentinel.value) {
                    observer.observe(bottomSentinel.value);
                }
            };

            onMounted(() => {
                // Ждем рендера, чтобы найти bottomSentinel
                nextTick(() => {
                    initObserver();
                });
            });

            // Перезапуск наблюдателя при смене вида (например, перешли из выбора локации в меню)
            watch(selectedLocation, () => {
                nextTick(() => {
                    initObserver();
                });
            });

            onUnmounted(() => {
                if (observer) observer.disconnect();
            });

            return {
                // Состояние
                isMobileMenuOpen, selectedLocation, showNotice, noticeText,
                locations, categories, activeCategory, filteredItems, visibleItems, // Важно: visibleItems
                cart, showCheckout, confirmClear, checkoutMode, searchQuery, form,
                selectedItem, activeSlide, touchStartX, bottomSentinel, // Важно: bottomSentinel

                // Методы
                closeModal, openCheckout, openItemModal, closeItemModal,
                selectLocation, getItemQty, changeQty, clearCart, removeItem,
                nextSlide, prevSlide, addFromModal,
                onTouchStart, onTouchEnd,
                cartTotalSum, sendToWhatsapp
            };
        }
    }).mount('#app-menu');
}

export default menu;
