function menu () {

        const { createApp, ref, computed } = Vue;
        createApp({
            setup() {
                const isMobileMenuOpen = ref(false);
                const selectedLocation = ref(null); 
                const noticeText = ref("");
                const showNotice = ref(false);
                const activeCategory = ref('Все');
                const showCheckout = ref(false);
                const confirmClear = ref(false);
                const checkoutMode = ref('order'); 
                const searchQuery = ref("");
                const cart = ref([]);
                const form = ref({ name: '', phone: '', type: 'pickup', address: '' });

                const locations = [
                    { name: 'LUSSO', addr: 'ул. Кавказская, 52', desc: 'Первая specialty кофейня в городе. Островок тишины и эстетики.', image: 'assets/img/lusso_1.jpg', whatsapp: '79389997788' },
                    { name: 'LUSSO URBAN HAVEN', addr: 'Проспект А. Кадырова, 28', desc: 'Городское убежище для продуктивной работы и встреч.', image: 'assets/img/lusso_2.jpeg', whatsapp: '79389998118' }
                ];

                const categories = ['Все', 'Кофе', 'Выпечка', 'Десерты', 'Завтраки'];
                const items = [
                    { id: 1, name: 'Капучино', price: 220, desc: 'На двойном эспрессо с воздушной сливочной пенкой.', category: 'Кофе', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=500' },
                    { id: 2, name: 'Круассан', price: 180, desc: 'Классический масляный круассан из 24 слоев теста.', category: 'Выпечка', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=500' },
                    { id: 3, name: 'Чизкейк Нью-Йорк', price: 320, desc: 'Классический сливочный десерт с ягодным соусом.', category: 'Десерты', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500' },
                    { id: 4, name: 'Флэт Уайт', price: 250, desc: 'Насыщенный кофейный вкус с минимальным слоем пены.', category: 'Кофе', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=500' }
                ];

                const filteredItems = computed(() => {
                    return items.filter(item => {
                        const matchesCategory = activeCategory.value === 'Все' || item.category === activeCategory.value;
                        const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.value.toLowerCase());
                        return matchesCategory && matchesSearch;
                    });
                });

                const cartTotalSum = computed(() => cart.value.reduce((acc, i) => acc + (i.price * i.qty), 0));
                const selectLocation = (loc) => selectedLocation.value = loc;
                const getItemQty = (id) => cart.value.find(i => i.id === id)?.qty || 0;
                const clearCart = () => { cart.value = []; confirmClear.value = false; };
                const openCheckout = () => { checkoutMode.value = 'order'; showCheckout.value = true; };
                const removeItem = (id) => { cart.value = cart.value.filter(i => i.id !== id); if(cart.value.length === 0) showCheckout.value = false; };

                const changeQty = (item, delta) => {
                    const existing = cart.value.find(i => i.id === item.id);
                    if (existing) {
                        existing.qty += delta;
                        if (existing.qty <= 0) cart.value = cart.value.filter(i => i.id !== item.id);
                    } else if (delta > 0) {
                        cart.value.push({ ...item, qty: 1 });
                    }
                };

                const sendToWhatsapp = () => { 
                    if (!form.value.name || !form.value.phone) {
                        noticeText.value = "Заполните имя и телефон";
                        showNotice.value = true;
                        setTimeout(() => { showNotice.value = false; }, 3000);
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

                return { isMobileMenuOpen, selectedLocation, showNotice, noticeText, locations, categories, activeCategory, filteredItems, cart, showCheckout, confirmClear, checkoutMode, searchQuery, form, selectLocation, getItemQty, changeQty, cartTotalSum, sendToWhatsapp, clearCart, openCheckout, removeItem };
            }
        }).mount('#app-menu');

} 

export default menu;