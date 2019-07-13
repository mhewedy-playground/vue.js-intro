Vue.component('product', {
    template: `
    <div class="container">
        <div class="row">
            <div class="col-3">
                <img :src="image"/>
            </div>

            <div class="col-9">
            
                <product-header></product-header>
               
                <p v-if="inventory > 10">In stock</p>
                <p v-else-if="inventory <= 10 && inventory > 0">
                    Almost sold out!</p>
                <p :style="styles.outOfStock" v-else>Out of stock</p>
                
                <p><div>Shipping: {{ shipping }}</div></p>

                <p>Sizes: {{ sizes.join(', ') }}</p>

                
                <div class="row" style="padding-left: 10px">
                    Variants:
                    <div v-for="(variant, index) in variants" :key="variant.id"
                         class="color-box" :style="{backgroundColor: variant.color}"
                         @mouseover="updateProduct(index)">
                    </div>
                </div>
                <p v-if="onSale">On Sale!</p>

                <div class="row">
                    <div class="col-3">
                        <button class="btn btn-primary"
                                :disabled="inventory <= 0 || cart.length >= inventory"
                                @click="addToCart">
                            Add to cart
                        </button>
                    </div>
                    
                    <div class="col-4">
                        <button class="btn btn-danger"
                                :disabled="inventory <= 0 || cart.length <= 0 "
                                @click="removeFromCart">
                            Remove from cart
                        </button>
                    </div>
                </div> 
            </div>
        </div>
        
        <product-tabs></product-tabs>
    </div>
    `,
    props: {
        premium: {
            type: Boolean,
            required: true
        },
        cart: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            selectedVariant: 0,
            variants: [{
                id: 1234,
                color: 'green',
                image: 'green-socks.jpeg',
                inventory: 9,
                sizes: ['XS', 'L', 'XL', 'XXL'],
                onSale: true
            }, {
                id: 1235,
                color: 'blue',
                image: 'blue-socks.jpeg',
                inventory: 0,
                sizes: ['XXS', 'L'],
                onSale: false
            }]
            ,
            styles: {
                outOfStock: {
                    'text-decoration': 'line-through'
                }
            }
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].id)
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].id)
        },
        updateProduct(index) {
            this.selectedVariant = index
        }
    },
    computed: {
        image() {
            return this.variants[this.selectedVariant].image
        },
        inventory() {
            return this.variants[this.selectedVariant].inventory
        },
        sizes() {
            return this.variants[this.selectedVariant].sizes
        },
        onSale() {
            return this.variants[this.selectedVariant].onSale
        },
        shipping() {
            return this.premium ? "Free" : "$3.55"
        }
    }
});

Vue.component('product-header', {
    template: `
        <div>
            <h3>{{ title }}</h3>
            <p> {{ description }}</p>
            
        <p>Details:</p>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>
    `,
    props: {},
    data() {
        return {
            brand: 'Mohammad Hewedy',
            name: 'Socks',
            description: 'Italian socks build with quality',
            details: ["80% Cotton", "20% Polyester", "Gender neutral"]
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.name
        }
    }
});

Vue.component('product-review', {
    template: `
        <form @submit.prevent="onSubmit">
            <div v-if="errors.length > 0">
                Please correct following error(s):
                <ul>
                    <li v-for="error in errors"> {{error}}</li>
                </ul>            
            </div>
        
            <div class="row">
                <div class="col-1"><label for="name">Name </label></div>
                <div class="col-3"><input id="name" v-model="name" /></div>
            </div>
            <div class="row">
                <div class="col-1"> <label for="review">Review </label> </div>
                <div class="col-3"> <textarea id="review" v-model="review" /></div>
            </div>
            <div class="row">
                <div class="col-1"><label for="rating">Ratting </label></div>
                <div class="col-3">
                    <select name="rating" v-model.number="rating">
                        <option v-for="e in [1, 2, 3, 4, 5]" :value="e">{{ e }}</option>
                    </select>
                </div>
            </div>
            <input type="submit" class="btn btn-success" />
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                this.$emit('review-submitted', {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                });
                this.name = null;
                this.review = null;
                this.rating = null;
                this.errors = []
            } else {
                !this.name && this.errors.push("Name required");
                !this.rating && this.errors.push("Rating required");
                !this.review && this.errors.push("Review required");
            }
        }
    }
});

Vue.component('product-tabs', {
    template: `
    <div>
        <span class="tab" :class="{active: selectedTab === tab}" 
             v-for="(tab, index) in tabs" :key="index"  
            @click="selectedTab = tab">
            {{tab}}
        </span>
        
        <div class="tab-content">
            <div v-if="selectedTab == 'Reviews'">
                <div v-if="reviews.length == 0"> There's no review yet!</div>
                <div v-for="review in reviews">
                    <div class="row">Name: {{review.name}}</div>
                    <div class="row"> Review: {{review.review}}</div>
                    <div class="row"> Rating: {{review.rating}}</div>
                </div>
            </div>
            
            <product-review 
                @review-submitted="addReview"
                v-if="selectedTab == 'Make a Review'"></product-review>
        </div>
        
    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews',
            reviews: []
        }
    },
    methods: {
        addReview(review) {
            this.reviews.push(review)
        }
    }
});

new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        addToCart(id) {
            this.cart.push(id)
        },
        removeFromCart(id) {
            this.cart.splice(
                this.cart.findIndex(it => it === id), 1
            )
        }
    }
});
