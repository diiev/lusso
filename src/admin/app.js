import { createApp, ref, reactive, computed, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const API_BASE = '/api/admin';

const app = createApp({
  setup() {
    // Auth
    const user = ref(null);
    const loginForm = reactive({
      email: '',
      password: ''
    });
    const loginLoading = ref(false);
    const loginError = ref('');

    // Data
    const categories = ref([]);
    const menuItems = ref([]);
    const loading = ref(false);

    // UI State
    const activeTab = ref('menu');
    const modalOpen = ref(false);
    const modalMode = ref(''); // 'create', 'edit', 'category'
    const modalData = reactive({});
    const saving = ref(false);

    // Методы авторизации
    const login = async () => {
      loginLoading.value = true;
      loginError.value = '';
      
      try {
        const res = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginForm)
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        user.value = data.user;
        localStorage.setItem('token', data.token);
      } catch (error) {
        loginError.value = error.message;
      } finally {
        loginLoading.value = false;
      }
    };

    const logout = () => {
      user.value = null;
      localStorage.removeItem('token');
    };

    // Загрузка данных
    const loadData = async () => {
      loading.value = true;
      try {
        const [categoriesRes, itemsRes] = await Promise.all([
          fetch(`${API_BASE}/categories`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(`${API_BASE}/menu-items`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        categories.value = await categoriesRes.json();
        menuItems.value = await itemsRes.json();
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        loading.value = false;
      }
    };

    // Модалка
    const openModal = (mode, data = {}) => {
      modalMode.value = mode;
      Object.assign(modalData, {
        id: data.id || null,
        name: data.name || '',
        category_id: data.category_id || '',
        price: data.price || 0,
        short_desc: data.short_desc || '',
        full_desc: data.full_desc || '',
        is_new: data.is_new || false,
        is_active: data.is_active !== false
      });
      modalOpen.value = true;
    };

    const closeModal = () => {
      modalOpen.value = false;
    };

    const saveItem = async () => {
      saving.value = true;
      try {
        const method = modalData.id ? 'PUT' : 'POST';
        const url = modalData.id 
          ? `${API_BASE}/menu-items/${modalData.id}` 
          : `${API_BASE}/menu-items`;

        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(modalData)
        });

        if (!res.ok) throw new Error('Ошибка сохранения');

        await loadData();
        closeModal();
      } catch (error) {
        console.error('Ошибка сохранения:', error);
      } finally {
        saving.value = false;
      }
    };

    const deleteItem = async (id) => {
      if (!confirm('Удалить позицию?')) return;

      try {
        const res = await fetch(`${API_BASE}/menu-items/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (res.ok) {
          await loadData();
        }
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    };

    // Init
    onMounted(async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await loadData();
          // TODO: проверить токен через API
          // user.value = { email: 'admin@lusso.ru' }; // заглушка
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    });

    return {
      // Auth
      user,
      loginForm,
      loginLoading,
      loginError,
      login,
      logout,

      // Data
      categories,
      menuItems,
      loading,

      // UI
      activeTab,
      modalOpen,
      modalMode,
      modalData,
      saving,

      // Methods
      openModal,
      closeModal,
      saveItem,
      deleteItem
    };
  }
});

app.mount('#app');
