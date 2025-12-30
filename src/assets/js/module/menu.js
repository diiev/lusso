
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
                const selectedItem = ref(null)
                const activeSlide = ref(0)

                const cart = ref([]);
                const form = ref({ name: '', phone: '', type: 'pickup', address: '' });

                const locations = [
                    { name: 'LUSSO', addr: 'ул. Кавказская, 52', desc: 'Первая specialty кофейня в городе. Островок тишины и эстетики.', image: 'assets/img/lusso_1.jpg', whatsapp: '79389997788' },
                    { name: 'LUSSO URBAN HAVEN', addr: 'Проспект А. Кадырова, 28', desc: 'Городское убежище для продуктивной работы и встреч.', image: 'assets/img/lusso_2.jpg', whatsapp: '79389998118' }
                ];

                const categories = ['Все', 'Кофе', 'Сендвичи', 'Десерты', 'Завтраки'];
                const items = [
                    { id: 1, name: 'Эспрессо', price: 200, desc: 'Такой эспрессо ты точно не пробовал.', fullDesc: "dsdsdsdsdsdsdsdsdsdsdsdddddddddddddddddddd", category: 'Кофе', image: 'assets/img/espresso.jpg', 
                        images: [
    'assets/img/cap.jpg',
    'assets/img/espresso.jpg',
    'assets/img/fletwhite.jpg'
  ], 
  isNew: false,  
   nutrition: {
    proteins: 6,
    fats: 7,
    carbs: 8,
    calories: 120
  }
                      },
                    { id: 2, name: 'Сэндвич с курицей', price: 370, desc: 'С грибным соусом,моцареллой и томатами', category: 'Сендвичи', image: 'assets/img/chikensandwich.jpg' },
                    { id: 3, name: 'Бельгийские вафли с мороженным', price: 320, desc: 'C ягодами и шоколадным соусом.', category: 'Десерты', image: 'assets/img/belg.jpg' },
                    { id: 4, name: 'Флэт Уайт', price: 250, desc: 'Насыщенный кофейный вкус с минимальным слоем пены.', category: 'Кофе', image: 'assets/img/fletwhite.jpg' },
                    { id: 5, name: 'Американо', price: 200, desc: '', category: 'Кофе', image: 'assets/img/americano.jpg' }, 
                    { id: 6, name: 'Английский завтрак', price: 200, desc: '', category: 'Завтраки', image: 'assets/img/english_morning.jpg' }, 
                  {
  id: 7,
  name: 'Капучино',
  desc: 'Классический напиток',
  fullDesc: 'Классический итальянский капучино на свежем эспрессо и молоке.',
  image: 'assets/img/cap.jpg',
  images: [
    'assets/img/cap.jpg',
    'assets/img/espresso.jpg'
  ],
  price: 250,
  isNew: true,
  ingredients: ['Эспрессо', 'Молоко'],
  allergens: ['Молоко'],
  nutrition: {
    proteins: 6,
    fats: 7,
    carbs: 8,
    calories: 120
  }
}
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


const lockScroll = () => {
    document.body.style.overflow = 'hidden'
}

const unlockScroll = () => {
    document.body.style.overflow = ''
}

const openCheckout = () => {
    checkoutMode.value = 'order'
    showCheckout.value = true
    lockScroll()
}

const closeModal = () => {
    showCheckout.value = false
    confirmClear.value = false
    unlockScroll()
}  

const openItemModal = (item) => {
    selectedItem.value = item
    activeSlide.value = 0
    lockScroll()
}

const closeItemModal = () => {
    selectedItem.value = null
    unlockScroll()
}

 const nextSlide = () => {
    if (!selectedItem.value?.images?.length) return
    activeSlide.value =
        (activeSlide.value + 1) % selectedItem.value.images.length
}

const prevSlide = () => {
    if (!selectedItem.value?.images?.length) return
    activeSlide.value =
        (activeSlide.value - 1 + selectedItem.value.images.length) %
        selectedItem.value.images.length
}   

const addFromModal = () => {
    changeQty(selectedItem.value, 1)
    closeItemModal()
}

const touchStartX = ref(0)

const onTouchStart = (e) => {
    touchStartX.value = e.touches[0].clientX
}

const onTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX.value
    if (Math.abs(diff) < 40) return
    diff < 0 ? nextSlide() : prevSlide()
}


  
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


                return { isMobileMenuOpen, selectedLocation, showNotice, noticeText, locations, categories, activeCategory, filteredItems, cart, showCheckout, confirmClear, checkoutMode, searchQuery, form, selectedItem, activeSlide,  closeModal, selectLocation, closeItemModal, openItemModal, getItemQty, changeQty, nextSlide, prevSlide, cartTotalSum, sendToWhatsapp, addFromModal, clearCart, openCheckout, removeItem };
            }
        }).mount('#app-menu');

} 

export default menu;