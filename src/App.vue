<template>
   <div id="app">
       <transition name="page" mode="out-in">
      <router-view></router-view>
        </transition> 
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html{
overflow-y: hidden; 
overflow-x: hidden;
}
body{
  background-image: url('./assets/wallpaper.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  
}
.page-enter-active, .page-leave-active {
  transition: opacity 1s, transform 1s;
}
.page-enter, .page-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}

</style>
