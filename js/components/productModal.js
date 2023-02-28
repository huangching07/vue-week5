export default {
    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'ching',
            modal: {},
            qty: 1
        }
    },
    template: '#userProductModal',
    props: ['tempProduct'],
    methods: {
        openModal(){
            this.modal.show();
        },
        closeModal(){
            this.modal.hide();
        },
        addToCart(productId, qty){
            this.$emit('addToCart-emit', productId, qty);
        }
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
}