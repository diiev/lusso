function vacancies () {

    const { createApp, ref, onMounted } = Vue;

    createApp({
      setup() {
        const isMobileMenuOpen = ref(false);
        const mobileLinks = ref([
          { n: "01", t: "Главная", h: "index.html" },
          { n: "02", t: "Меню", h: "menu.html" },
          { n: "03", t: "О нас", h: "about.html" },
          { n: "04", t: "Вакансии", h: "vacancies.html" },
        ]);

        const jobs = ref([
          {
            id: 1,
            title: "Бариста",
            location: "LUSSO · Кавказская, 52",
            type: "Full-time",
            short: "Работа с кофемашиной, приготовление напитков по стандартам LUSSO, общение с гостями.",
            schedule: "5/2, смены по 8 часов",
            experience: "Опыт работы от 6 месяцев будет плюсом, но не обязателен",
            responsibilities: [
              "Приготовление эспрессо и напитков на его основе",
              "Соблюдение рецептур и стандартов подачи",
              "Коммуникация с гостями, помощь в выборе напитка",
              "Поддержание чистоты барной зоны",
            ],
            requirements: [
              "Любовь к кофе и интерес к теме specialty",
              "Внимательность к деталям и аккуратность",
              "Умение работать в команде и в ритме кофейни",
              "Готовность обучаться и развиваться",
            ],
          },
          {
            id: 2,
            title: "Бариста (URBAN HAVEN)",
            location: "LUSSO URBAN HAVEN · Кадырова, 28",
            type: "Part-time",
            short: "Подходит для тех, кто совмещает учебу и работу. Современный ритм, много to-go заказов.",
            schedule: "Гибкий, от 3 смен в неделю",
            experience: "Желателен опыт работы с гостями",
            responsibilities: [
              "Приготовление напитков на основе эспрессо и фильтра",
              "Работа с to-go заказами и доставкой",
              "Поддержание порядка в зале и на баре",
              "Работа с кассой и терминалами",
            ],
            requirements: [
              "Коммуникабельность и дружелюбие",
              "Собранность в динамичной среде",
              "Готовность к сменной работе",
              "Минимум базовых знаний о кофе — обучаем остальному",
            ],
          },
          {
            id: 3,
            title: "Старший бариста",
            location: "LUSSO · обе локации",
            type: "Full-time",
            short: "Ответственность за смену, контроль качества, обучение новых сотрудников.",
            schedule: "Сменный график, обсуждается индивидуально",
            experience: "Опыт работы бариста от 1 года",
            responsibilities: [
              "Организация работы смены",
              "Контроль качества напитков и сервиса",
              "Обучение и ввод новых сотрудников",
              "Взаимодействие с управляющим",
            ],
            requirements: [
              "Глубокое понимание процессов кофейни",
              "Лидерские качества и тактичность",
              "Умение работать с обратной связью",
              "Желание расти в управленческом направлении",
            ],
          },
        ]);

        const selectedJob = ref(jobs.value[0] || null);

        const form = ref({
          name: "",
          phone: "",
          position: "",
          message: "",
        });
        const formSent = ref(false);
         const activeJobModal = ref(null); // Состояние открытой модалки
        const whyRef = ref(null);
        const jobsRef = ref(null);
        const formRef = ref(null);

        const handleMobileNav = (href) => {
          isMobileMenuOpen.value = false;
          if (href.startsWith("#")) {
            const el = document.querySelector(href);
            if (el) {
              setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 200);
            }
          }
        };
      

         const openJobModal = (job) => {
        activeJobModal.value = job;
        // Блокируем скролл основной страницы при открытой модалке
        document.body.style.overflow = 'hidden';
    }; 

      const closeJobModal = () => {
        activeJobModal.value = null;
        document.body.style.overflow = '';
    };

    const scrollToApply = () => {
        const jobTitle = activeJobModal.value.title;
        activeJobModal.value = null; // Закрываем модалку
        document.body.style.overflow = '';
        
        // Устанавливаем название вакансии в форму автоматически
        form.value.position = jobTitle;
        
        // Скроллим к форме
        setTimeout(() => {
            const formEl = document.querySelector('#form-vacan');
            if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };
        const selectJob = (job) => {
          selectedJob.value = job;
          if (!form.value.position) form.value.position = job.title;
          const el = document.querySelector("#form");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        };

        const handleSubmit = () => {
          if (!form.value.name || !form.value.phone || !form.value.position) {
            alert("Пожалуйста, заполните имя, телефон и выберите позицию.");
            return;
          }
          formSent.value = true;
          setTimeout(() => {
            formSent.value = false;
          }, 5000);
          // Здесь можно добавить отправку на бэкенд или в Telegram
        };

        onMounted(() => {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add("visible");
                }
              });
            },
            { threshold: 0.2 }
          );

          [whyRef.value, jobsRef.value, formRef.value].forEach((el) => {
            if (el) observer.observe(el);
          });
        });

        return {
           activeJobModal,
        openJobModal,
        closeJobModal,
        scrollToApply,
          isMobileMenuOpen,
          mobileLinks,
          jobs,
          selectedJob,
          selectJob,
          form,
          formSent,
          handleSubmit,
          handleMobileNav,
          whyRef,
          jobsRef,
          formRef,
        };
      },
    }).mount("#app-vacan");
  

} 

export default vacancies