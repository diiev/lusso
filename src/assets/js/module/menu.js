// menu.js
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

            // Состояние модалки товара
            const selectedItem = ref(null);
            const activeSlide = ref(0);
            const currentModifiers = ref([]); // Теперь это реактивная переменная

            const lastLocation = ref(null);
            const cart = ref([]);
            const form = ref({ name: '', phone: '', type: 'pickup', address: '' });

            // --- ЛЕНИВАЯ ЗАГРУЗКА (PAGINATION) ---
            const page = ref(1);
            const itemsPerPage = 8;
            const bottomSentinel = ref(null);
            let observer = null;



            const suggestionItems = ref([]);
            const showSuggestion = ref(false);
            let suggestionTimer = null;
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
                    locations: ['LUSSO', 'LUSSO URBAN HAVEN'],
                    relatedIds: [8,2,3,4,5]
                },
                {
                    id: 2,
                    name: 'Сэндвич с курицей',
                    price: 370,
                    desc: 'С грибным соусом, моцареллой и томатами',
                    category: 'Сендвичи',
                    image: 'assets/img/chikensandwich.jpg',
                    locations: ['LUSSO', 'LUSSO URBAN HAVEN'],
                },
                {
                    id: 3,
                    name: 'Бельгийские вафли с мороженным',
                    price: 320,
                    desc: 'C ягодами и шоколадным соусом.',
                    category: 'Десерты',
                    image: 'assets/img/belg.jpg',
                    locations: ['LUSSO', 'LUSSO URBAN HAVEN'],
                },
                {
                    id: 4,
                    name: 'Флэт Уайт',
                    price: 250,
                    desc: 'Насыщенный кофейный вкус с минимальным слоем пены.',
                    category: 'Кофе',
                    image: 'assets/img/fletwhite.jpg',
                    locations: ['LUSSO', 'LUSSO URBAN HAVEN'],
                },
                {
                    id: 5,
                    name: 'Американо',
                    price: 200,
                    desc: '',
                    category: 'Кофе',
                    image: 'assets/img/americano.jpg',
                    locations: ['LUSSO', 'LUSSO URBAN HAVEN'],
                },
                {
                    id: 6,
                    name: 'Английский завтрак',
                    price: 450,
                    desc: 'Сытный завтрак с яйцами и беконом',
                    category: 'Завтраки',
                    image: 'assets/img/english_morning.jpg',
                    locations: ['LUSSO', 'LUSSO URBAN HAVEN'],
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
                    // Пример массива модификаторов (объекты с id, name, price)
                    modifiers: [
                        { id: 'm1', name: 'Сироп Карамель', price: 50 },
                        { id: 'm2', name: 'Кокосовое молоко', price: 100 },
                        { id: 'm3', name: 'Корица', price: 0 }
                    ],
                    category: 'Кофе',
                    locations: ['LUSSO', 'LUSSO URBAN HAVEN'],
                    nutrition: { proteins: 6, fats: 7, carbs: 8, calories: 120 },
                    ingredients: ['Эспрессо', 'Молоко'],
                    relatedIds: [4]
                },
                {
                    id: 8,
                    name: 'Шот Гранат-Имбирь',
                    price: 250,
                    desc: 'Заряд витаминов',
                    category: 'Напитки',
                    image: 'assets/img/shot.jpg', // Укажите реальную картинку
                    locations: ['LUSSO', 'LUSSO URBAN HAVEN']
                },
            ];


            // --- ВЫЧИСЛЕНИЯ (COMPUTED) ---

            const filteredItems = computed(() => {
                if (!selectedLocation.value) return [];

                return items.filter(item => {
                    const matchesLocation = item.locations && item.locations.includes(selectedLocation.value);
                    if (!matchesLocation) return false;

                    const matchesCategory = activeCategory.value === 'Все' || item.category === activeCategory.value;

                    const searchLower = searchQuery.value.toLowerCase();
                    const matchesSearch = item.name.toLowerCase().includes(searchLower) ||
                        (item.desc && item.desc.toLowerCase().includes(searchLower));

                    return matchesCategory && matchesSearch;
                });
            });

            const visibleItems = computed(() => {
                return filteredItems.value.slice(0, page.value * itemsPerPage);
            });

            // Итоговая сумма считает `finalPrice` (цена с модификаторами) если она есть, иначе обычную `price`
            const cartTotalSum = computed(() => {
                return cart.value.reduce((acc, i) => {
                    const price = i.finalPrice || i.price;
                    return acc + (price * i.qty);
                }, 0);
            });


            const recommendedItems = computed(() => {
                if (!selectedItem.value || !selectedItem.value.relatedIds) return [];

                // Ищем товары по ID и проверяем, доступны ли они в текущей локации
                return items.filter(i => {
                    const isRelated = selectedItem.value.relatedIds.includes(i.id);
                    const isAvailableLoc = i.locations.includes(selectedLocation.value);
                    return isRelated && isAvailableLoc;
                });
            });

            // --- МЕТОДЫ (METHODS) --- 


                       const addSuggestion = (product) => { // Принимаем product аргументом
                if (product) {
                    changeQty(product, 1);
                    // Не закрываем плашку сразу, вдруг человек захочет еще что-то добавить?
                    // Или можно закрывать: showSuggestion.value = false;
                    
                    // Убираем добавленный товар из списка предложений
                    suggestionItems.value = suggestionItems.value.filter(i => i.id !== product.id);
                    
                    if (suggestionItems.value.length === 0) showSuggestion.value = false;
                    
                    showNoticeWithText(`${product.name} добавлен!`);
                }
            };



            const selectLocation = (loc) => {
                if (cart.value.length > 0 && lastLocation.value && lastLocation.value !== loc) {
                    cart.value = [];
                    noticeText.value = "Корзина очищена (смена локации)";
                    showNotice.value = true;
                    setTimeout(() => { showNotice.value = false; }, 3000);
                }
                selectedLocation.value = loc;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };

            // 4. Получение количества для отображения в сетке
            const getItemQty = (originalId) => {
                // Суммируем все вариации этого товара
                // Например: Латте (обычный) + Латте (на кокосовом) = 2 шт
                return cart.value
                    .filter(i => String(i.id) === String(originalId))
                    .reduce((acc, i) => acc + i.qty, 0);
            };

            const clearCart = () => { cart.value = []; confirmClear.value = false; };

            // 2. Функция удаления (вспомогательная)
            const removeItem = (targetCartId) => {
                cart.value = cart.value.filter(i => i.cartId !== targetCartId);
                // Если корзина пуста, закрываем модалку
                if (cart.value.length === 0) showCheckout.value = false;
            };


            const changeQty = (item, delta) => {
                // 1. Сценарий: Мы в корзине (есть cartId)
                if (item.cartId) {
                    const cartItem = cart.value.find(i => i.cartId === item.cartId);
                    if (cartItem) {
                        cartItem.qty += delta;
                        if (cartItem.qty <= 0) removeItem(item.cartId);
                    }
                    return;
                }

                // 2. Сценарий: Мы в каталоге (нет cartId, есть только id товара)
                if (delta > 0) {
                    // --- Добавление (+) ---
                    // Работает только для простых товаров (без модификаторов)
                    const simpleCartId = String(item.id);
                    const existing = cart.value.find(i => i.cartId === simpleCartId);

                    if (existing) {
                        existing.qty++;
                    } else {
                        cart.value.push({
                            ...item,
                            qty: 1,
                            cartId: simpleCartId,
                            modifiers: [],
                            finalPrice: item.price
                        });
                    }

                    // --- ЛОГИКА ПРЕДЛОЖЕНИЯ (UPSELL) ---
                    // Предлагаем доп. товар только если он есть в relatedIds
                                       // --- ЛОГИКА ПРЕДЛОЖЕНИЯ (МАССОВАЯ) ---
                    if (item.relatedIds && item.relatedIds.length > 0) {
                        
                        // Собираем все подходящие товары
                        const candidates = item.relatedIds
                            .map(id => items.find(p => p.id === id)) // Превращаем ID в объекты
                            .filter(prod => 
                                prod && 
                                (!prod.locations || prod.locations.includes(selectedLocation.value)) &&
                                getItemQty(prod.id) === 0 // Исключаем то, что уже в корзине
                            );

                        if (candidates.length > 0) {
                            suggestionItems.value = candidates; // Сохраняем массив
                            showSuggestion.value = true;
                            
                            if (suggestionTimer) clearTimeout(suggestionTimer);
                            suggestionTimer = setTimeout(() => { showSuggestion.value = false; }, 8000); // Чуть подольше держим (8 сек)
                        }
                    }


                } else {
                    // --- Удаление (-) из каталога ---
                    // Ищем последний добавленный экземпляр этого товара
                    // (чтобы можно было удалить "Капучино", даже если в корзине их несколько разных)
                    let foundIndex = -1;
                    for (let i = cart.value.length - 1; i >= 0; i--) {
                        // Сравниваем ID как строки, чтобы "1" == 1
                        if (String(cart.value[i].id) === String(item.id)) {
                            foundIndex = i;
                            break;
                        }
                    }

                    if (foundIndex !== -1) {
                        const targetItem = cart.value[foundIndex];
                        targetItem.qty += delta; // delta = -1
                        if (targetItem.qty <= 0) {
                            cart.value.splice(foundIndex, 1);
                            // Закрываем корзину, если она пуста
                            if (cart.value.length === 0) showCheckout.value = false;
                        }
                    }
                }
            };




            const showNoticeWithText = (text) => {
                noticeText.value = text;
                showNotice.value = true;
                setTimeout(() => { showNotice.value = false; }, 3000);
            }

            const lockScroll = () => { document.body.style.overflow = 'hidden' }
            const unlockScroll = () => { document.body.style.overflow = '' }

            // --- МОДАЛКИ ---
            const openCheckout = () => { checkoutMode.value = 'order'; showCheckout.value = true; lockScroll() }
            const closeModal = () => { showCheckout.value = false; confirmClear.value = false; unlockScroll() }

            const openItemModal = (item) => {
                selectedItem.value = item;
                activeSlide.value = 0;
                currentModifiers.value = []; // Сброс модификаторов
                lockScroll();
            }

            const closeItemModal = () => {
                selectedItem.value = null;
                unlockScroll();
            }

            // --- ЛОГИКА МОДИФИКАТОРОВ ---

            // Проверка, выбран ли чекбокс
            const isModifierSelected = (mod) => {
                return currentModifiers.value.some(m => m.id === mod.id);
            };

            // Подсчет цены внутри модалки
            const calculateModalPrice = () => {
                if (!selectedItem.value) return 0;
                let total = selectedItem.value.price;
                if (currentModifiers.value.length) {
                    currentModifiers.value.forEach(mod => total += mod.price);
                }
                return total;
            };

            // Добавление из модалки
            // 3. Исправленное добавление из модалки (для товаров с добавками)
            const addFromModal = () => {
                if (!selectedItem.value) return;

                // Генерируем уникальный ID: "IDтовара-IDдобавки1-IDдобавки2"
                // Если добавок нет, ID будет просто "1" (как у простого товара)
                const modIds = currentModifiers.value.map(m => m.id).sort().join('-');
                const cartId = modIds ? `${selectedItem.value.id}-${modIds}` : String(selectedItem.value.id);

                const existingItem = cart.value.find(i => i.cartId === cartId);

                if (existingItem) {
                    existingItem.qty++;
                } else {
                    cart.value.push({
                        ...selectedItem.value,
                        cartId: cartId,
                        qty: 1,
                        modifiers: [...currentModifiers.value], // Копируем массив
                        finalPrice: calculateModalPrice()
                    });
                }
                closeItemModal();
            };

            // --- СЛАЙДЕР ---
            const nextSlide = () => {
                if (!selectedItem.value?.images?.length) return
                activeSlide.value = (activeSlide.value + 1) % selectedItem.value.images.length
            }
            const prevSlide = () => {
                if (!selectedItem.value?.images?.length) return
                activeSlide.value = (activeSlide.value - 1 + selectedItem.value.images.length) % selectedItem.value.images.length
            }

            const touchStartX = ref(0)
            const onTouchStart = (e) => { touchStartX.value = e.touches[0].clientX }
            const onTouchEnd = (e) => {
                const diff = e.changedTouches[0].clientX - touchStartX.value
                if (Math.abs(diff) < 40) return
                diff < 0 ? nextSlide() : prevSlide()
            }

            // --- ОТПРАВКА В WHATSAPP ---
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
                cart.value.forEach(i => {
                    const price = i.finalPrice || i.price;
                    text += `— ${i.name} (x${i.qty})`;

                    // Добавляем инфо о модификаторах в текст сообщения
                    if (i.modifiers && i.modifiers.length > 0) {
                        const modsNames = i.modifiers.map(m => m.name).join(', ');
                        text += ` [${modsNames}]`;
                    }

                    text += ` — ${price * i.qty}₽\n`;
                });
                text += `\nИТОГО: ${cartTotalSum.value} ₽`;

                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`);
            };


            // --- НАБЛЮДАТЕЛИ (WATCHERS & OBSERVERS) ---

            watch(selectedLocation, (newVal, oldVal) => {
                if (oldVal && !newVal) {
                    lastLocation.value = oldVal;
                }
            });

            watch([activeCategory, searchQuery, selectedLocation], () => {
                page.value = 1;
            });

            const initObserver = () => {
                if (observer) observer.disconnect();

                observer = new IntersectionObserver((entries) => {
                    const entry = entries[0];
                    if (entry.isIntersecting && visibleItems.value.length < filteredItems.value.length) {
                        page.value++;
                    }
                }, { rootMargin: '200px', threshold: 0.1 });

                if (bottomSentinel.value) {
                    observer.observe(bottomSentinel.value);
                }
            };

            onMounted(() => {
                
                nextTick(() => {
                    initObserver();
                });

            });

            watch(selectedLocation, () => {
                nextTick(() => {
                    initObserver();
                });
            });

            onUnmounted(() => {
                if (observer) observer.disconnect();
            });

            return {
                // State
                isMobileMenuOpen, selectedLocation, showNotice, noticeText,
                locations, categories, activeCategory, filteredItems, visibleItems,
                cart, showCheckout, confirmClear, checkoutMode, searchQuery, form,
                selectedItem, activeSlide, touchStartX, bottomSentinel,
                currentModifiers, // Реактивная переменная доступна в шаблоне

                // Methods
                closeModal, openCheckout, openItemModal, closeItemModal,
                selectLocation, getItemQty, changeQty, clearCart, removeItem,
                nextSlide, prevSlide,

                // Modifiers logic
                addFromModal, isModifierSelected, calculateModalPrice,

                onTouchStart, onTouchEnd,
                cartTotalSum, sendToWhatsapp,
                recommendedItems,
                suggestionItems, showSuggestion, addSuggestion
            };
        }
    }).mount('#app-menu');
}

export default menu;
