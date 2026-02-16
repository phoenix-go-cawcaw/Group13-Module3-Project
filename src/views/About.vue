<script setup>
import hobbyLogo from '../assets/Hobby in a Box.png'
</script>

<template>

  <main class="about-bg py-4">
  <div class="about">
    <h1 class="display-6 fw-bold">Discover, Create, Explore</h1>
    <br>
    <p class="lead text-body-secondary"><strong>Hobby in a Box delivers curated hobby experiences every month, so you can explore your passions, learn new skills, and have fun from home.</strong></p>
    <br>
    <h4>At Hobby in a Box, our mission is to make hobbies accessible, fun, and educational for everyone. We believe that trying new things sparks creativity, builds skills, and brings joy. Whether it's painting, gardening, cooking, or exploring STEM, we make it easy to get started every month.</h4>
    <br>
    <h2 class="display-6 fw-bold">Why Choose Hobby in a Box</h2>
    <br>
    <h4>
      <ul>
        <li>Expertly curated kits - each box is designed by hobby enthusiasts</li>
        <li>Flexible subscription options - monthly or one-time purchases</li>
        <li>Educational & fun - perfect for kids, adults, and lifelong learners</li>
        <li>Sustainable & thoughtful - we use eco-friendly materials whenever possible</li>
      </ul>
  </h4>
  <br>
  <h2 class="display-6 fw-bold">Our Categories</h2>
  <br>
  <h4>
    <ul>
      <li>Arts & DIY: The Watercolorist & The Maker's Studio</li>
      <li>Green Living: Gardening & eco-friendly kits</li>
      <li>STEM Explorer: Hands-on experiments for both kids and adults</li>
      <li>Culinary Discovery: Spices and recipes from around the world</li>
    </ul>
  </h4>
 </div>
 
 <img :src="hobbyLogo" alt="Hobby in a Box Logo" class="logo">

  </main>
</template>

<style>
.about-bg {
  background-image: url(https://img.freepik.com/free-vector/blurred-light-background-design_1107-160.jpg?t=st=1770904010~exp=1770907610~hmac=0a26e817aab791674c21f016c9f7242727292ad2fe329935bb71ced6b81d2517);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 2rem;
}

.logo {
  max-height: 600px;
  width: 100%;
  object-fit: contain; 
}

.about {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

ul {
  text-align: left;
  padding-left: 1.25rem;
  margin: 0 auto;
  width: fit-content
}
</style>
