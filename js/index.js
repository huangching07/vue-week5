import productModal from './components/productModal.js';

// 載入Vee Validate所有規則
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.0.2/dist/locale/zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = Vue.createApp({
    // 資料
    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'ching',
            products: [],
            cart: {},
            tempProduct: {},
            qty: 1,
            loadingItem: '',
            orderFormData: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: ''
                },
                message: ''
            }
        }
    },
    // 方法
    methods:{
        getProducts(){
            axios.get(`${this.apiUrl}/api/${this.apiPath}/products/all`)
                .then((response) => {
                    this.products = response.data.products;
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        },
        getCart(){
            axios.get(`${this.apiUrl}/api/${this.apiPath}/cart`)
                .then((response) => {
                    this.cart = response.data.data;
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        },
        getProduct(id){
            this.loadingItem = id;
            axios.get(`${this.apiUrl}/api/${this.apiPath}/product/${id}`)
                .then((response) => {
                    this.tempProduct = response.data.product;
                    this.qty = 1;
                    this.loadingItem = '';
                    this.$refs.productModal.openModal();
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        },
        addToCart(product_id, qty = 1){
            const data = {
                product_id,
                qty
            };
            this.loadingItem = product_id;
            axios.post(`${this.apiUrl}/api/${this.apiPath}/cart`, { data })
                .then((response) => {
                    alert(response.data.message);
                    this.getCart();
                    this.loadingItem = '';
                    this.$refs.productModal.closeModal();
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        },
        updateCartItem(item){
            const data = {
                product_id: item.product_id,
                qty: item.qty
            };
            this.loadingItem = item.id;
            axios.put(`${this.apiUrl}/api/${this.apiPath}/cart/${item.id}`, { data })
                .then((response) => {
                    alert(response.data.message);
                    this.getCart();
                    this.loadingItem = '';
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        },
        deleteCartItem(itemId){
            this.loadingItem = itemId;
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/cart/${itemId}`)
                .then((response) => {
                    alert(response.data.message);
                    this.getCart();
                    this.loadingItem = '';
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        },
        deleteCart(){
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/carts`)
                .then((response) => {
                    alert(response.data.message);
                    this.getCart();
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        },
        createOrder(){
            let loader = this.$loading.show();
            const orderData = this.orderFormData;
            axios.post(`${this.apiUrl}/api/${this.apiPath}/order`, { data: orderData })
                .then((response) => {
                    alert(response.data.message);
                    this.$refs.form.resetForm();
                    this.orderFormData.message = '';
                    this.getCart();
                    loader.hide();
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        }
    },
    // 生命週期（當元件載入完成時）
    mounted(){
        this.getProducts();
        this.getCart();
    },
    components: {
        productModal
    }
});
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.use(VueLoading.LoadingPlugin);
app.mount('#app');