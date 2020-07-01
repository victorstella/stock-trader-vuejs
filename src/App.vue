<template>
  <div id="app">

    <app-header></app-header>
    <div class="row m-0">
      <div id="routerView" class="col-md-11 px-0 pb-2">
        <transition name="slide" mode="out-in">
          <router-view id="body"></router-view>
        </transition>
      </div>
    </div>

  </div>
</template>

<script>
import Header from './components/Header.vue'
export default {
  name: 'app',
  components: {
    'app-header': Header
  },
  created () {
    this.$store.dispatch('tryAutoLogin')
  }
}
</script>

<style>
  @media only screen and (min-width: 992px){
    div.col-md-11 {
      margin-left: 4%;
      margin-right: 5%;
    }
  }

  .slide-enter-active {
    animation: slide-in 300ms ease-out forwards;
  }

  .slide-leave-active {
    animation: slide-out 300ms ease-out forwards;
  }

  @keyframes slide-in {
    from {
      transform: translateY(-30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-out {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-30px);
      opacity: 0;
    }
  }
</style>
