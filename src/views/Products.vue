<script setup>
const products = [
{
  name: "The Watercolorist Box", 
  description: "A curated watercolor kit including paints, brushes, and premium paper for creative exploration.", 
  price: 549.00, 
  category: "Arts & DIY", 
  image: new URL ('../assets/paint.png', import.meta.url)
},

{
    name: "Leatherworking Craft Box", 
  description: "A beginner-friendly leatherworking kit including pre-cut leather pieces, stitching tools, thread, and step-by-step instructions to create a handcrafted accessory.", 
  price: 629.00, 
  category: "Arts & DIY",
  image : new URL('../assets/leatherworks.png', import.meta.url)
},

{
  name: "Crochet Starter Box", 
  description: "A creative crochet kit featuring premium yarn, crochet hooks, and a guided pattern to help beginners create their own handmade project.", 
  price: 499.00, 
  category: "Arts & DIY",
  image : new URL('../assets/crochet.png', import.meta.url)
},
  
{
  name: "Green Living Starter Box", 
  description: "A sustainable gardening kit with seasonal seeds, organic soil pods, fertilizer, and a ceramic pot.",
  price: 499.00,
  category: "Green Living",
  image : new URL('../assets/plants.png', import.meta.url)
},
{
  name: "STEM Explorer Box", 
  description: "A child-friendly STEM kit containing materialsfor a guided monthly science experiment.",
  price: 459.00,
  category: "Education",
  image : new URL('../assets/science.png', import.meta.url)
},
{
  name: "Culinary Discovery Box", 
  description: "A global culinary experience featuring unique spices and authentic recipes from a feautured country.",
  price: 529.00,
  category: "Culinary",
  image : new URL('../assets/spices.png', import.meta.url)
},

]
</script>



<template>
  <main class="products-bg py-4">


  <div class="container py-4">
    <div class="row g-4">
      <div class="col-12 col-md-4" v-for="(product, i) in products" :key="i">
        <div class="card h-100">
          <img :src="product.image" class="card-img-top" :alt="product.name" />
          <div class="card-body">
            <h4 class="card-title">{{ product.name }}</h4>
            <p class="card-text">{{ product.description }}</p>
            <h5 class="card-price">R{{ product.price }}</h5>
            <br>
            <div class="button-row">
              <RouterLink class="btn btn-success" to="/cart">Add to cart</RouterLink>
              <RouterLink class="btn btn-success" to="/pricing">Subscribe</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


    
  </main>
</template>


<style>
.products-bg{
  background-image: url(https://img.freepik.com/free-vector/blurred-light-background-design_1107-160.jpg?t=st=1770904010~exp=1770907610~hmac=0a26e817aab791674c21f016c9f7242727292ad2fe329935bb71ced6b81d2517);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.button-row {
  display: flex;
  gap: 12px; 
  flex-wrap: wrap;     
}

.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgba(54, 79, 122, 0.677);
}

.card-img-top {
  height: auto;
  width: 100%;
  object-fit: contain;
}

.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;

}

.card-text {
  flex-grow: 1;     
}

.button-row {
  margin-top: auto;
  display: flex;
  gap: 10px;
  justify-content: center;   
  width: 100%;
}



.card {
  background-color: rgba(54, 79, 122, 0.218);
  border-radius: 12px;
}

.card-body { 
  background-color: rgba(54, 79, 122, 0.6) !important; 
}


</style>

