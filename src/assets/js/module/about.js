function about () {


const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const isMobileMenuOpen = ref(false);
        const mobileLinks = ref([
            { n: '01', t: 'Главная', h: 'index.html' },
            { n: '02', t: 'Меню', h: 'menu.html' },
            { n: '03', t: 'О нас', h: '#locations' },
            { n: '04', t: 'Связаться', h: '#contact' }
        ]);

        const activePoint = ref('lusso');
        const form = ref({ name: '', contact: '', topic: '', message: '' });
        const formSent = ref(false);

        const locationsRef = ref(null);
        const routeRef = ref(null);
        const contactRef = ref(null);

        const handleMobileNav = (href) => {
            isMobileMenuOpen.value = false;
            if (href.startsWith('#')) {
                const el = document.querySelector(href);
                if (el) {
                    setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 200);
                }
            }
        };

        const handleForm = () => {
            if (!form.value.name || !form.value.contact || !form.value.message) {
                formSent.value = false;
                alert('Пожалуйста, заполните имя, контакт и сообщение.');
                return;
            }
            formSent.value = true;
            setTimeout(() => { formSent.value = false; }, 5000);
            // Здесь можно подключить отправку на бэкенд или в Telegram
        };

        onMounted(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                },
                { threshold: 0.15 }
            );

            [locationsRef.value, routeRef.value, contactRef.value].forEach(el => {
                if (el) observer.observe(el);
            });
        });

        return {
            isMobileMenuOpen,
            mobileLinks,
            handleMobileNav,
            activePoint,
            form,
            formSent,
            handleForm,
            locationsRef,
            routeRef,
            contactRef
        };
    }
}).mount('#app-about');

} 
export default about