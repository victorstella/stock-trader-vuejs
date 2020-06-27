<template>
  <nav id="myNav" class="navbar navbar-expand-lg navbar-dark bg-dark navMargin">
    
    <div class="navbar-header">
      <router-link to="/" class="navbar-brand">Stock Trader</router-link>
    </div>
    <div class="collapse navbar-collapse">
      
      <ul v-if="loggedUser" class="navbar-nav mr-auto">
        <router-link to="/portfolio" class="nav-link" activeClass="active"><a>Portfolio</a></router-link>
        <router-link to="/stocks" class="nav-link" activeClass="active"><a>Stocks</a></router-link>
      </ul>
      
      <ul v-if="loggedUser" class="navbar-nav d-flex justify-content-end">
        <li class="nav-item" @click="endDay()"><a class="nav-link" href="#">End Day</a></li>
        <li class="nav-item dropdown">
          <a 
            href="#"
            class="nav-link dropdown-toggle"
            data-toggle="dropdown"
            role="button"
            aria-haspopup="true"
            aria-expanded="false">Save & Load<span class="caret"></span>
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item" href="#" @click="saveData()">Save Data</a>
            <a class="dropdown-item" href="#" @click="loadData()">Load Data</a>
          </div>
        </li>
      </ul>

      <strong
        v-if="loggedUser && !smallScreen"
        class="navbar-text">Funds: {{ displayFunds }}
      </strong>

      <ul v-if="!loggedUser" class="navbar-nav ml-auto">
        <router-link to="/signup" class="nav-link" activeClass="active"><a>Sign Up</a></router-link>
        <router-link to="/login" class="nav-link" activeClass="active"><a>Login</a></router-link>
      </ul>

      <ul v-if="loggedUser" class="navbar-nav d-flex justify-content-end">
        <li v-if="loggedUser" class="nav-item dropdown">
          <a
            href="#"
            class="nav-lidropdownnk dropdown-toggle nav-link"
            data-toggle="dropdown"
            role="button"
            aria-haspopup="true"
            aria-expanded="false">{{ loggedUser }}<span class="caret"></span>
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <router-link to="/userAccount" class="dropdown-item"><a>Account</a></router-link>
            <router-link to="/login" class="dropdown-item"><a @click="logout()">Logout</a></router-link>
          </div>
        </li>
      </ul>

    </div>

    <div class="ml-auto">
      <strong
        v-if="loggedUser && smallScreen"
        class="navbar-text">Funds: {{ displayFunds }}
      </strong>

      <button
        v-if="loggedUser && smallScreen"
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#responsiveMenuToggle"
        aria-controls="responsiveMenuToggle"
        aria-expanded="false" 
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div v-if="!loggedUser && smallScreen" class="navbar-nav navbar-expand ml-auto">
        <router-link to="/signup" class="nav-link mr-2" activeClass="active"><a>Sign Up</a></router-link>
        <router-link to="/login" class="nav-link ml-2" activeClass="active"><a>Login</a></router-link>
      </div>
    </div>

    <div class="collapse" v-if="loggedUser && smallScreen" id="responsiveMenuToggle">
      <div class="bg-dark px-3">

        <ul class="navbar-nav mr-auto">
          <router-link to="/portfolio" class="nav-link" activeClass="active"><a>Portfolio</a></router-link>
          <router-link to="/stocks" class="nav-link" activeClass="active"><a>Stocks</a></router-link>
        </ul>

        <ul class="navbar-nav d-flex">
          <li class="nav-item" @click="endDay()"><a class="nav-link" href="#">End Day</a></li>
          <li class="nav-item" @click="saveData()"><a class="nav-link" href="#">Save Data</a></li>
          <li class="nav-item" @click="loadData()"><a class="nav-link" href="#">Load Data</a></li>
          <li class="nav-item dropdown">
            <a
              href="#"
              class="nav-lidropdownnk dropdown-toggle nav-link"
              data-toggle="dropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false">{{ loggedUser }}<span class="caret"></span>
            </a>
            <div class="collapse dropdown-menu bg-dark">
              <router-link to="/userAccount" class="dropdown-item text-light"><a>Account</a></router-link>
              <router-link to="/login" class="dropdown-item text-light"><a @click="logout()">Logout</a></router-link>
            </div>
          </li>
        </ul>

      </div>
    </div>

  </nav>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  created() {
    if(window.innerWidth <= 600) {
      this.smallScreen = true;
    }
  },
  data() {
    return {
      smallScreen: false
    }
  },
  computed: {
    displayFunds() {
      let userData = this.$store.getters.getUserServerData;
      if(userData) {
        return parseInt(userData.lastSavedData.funds).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
      }
    },
    loggedUser() {
      return this.$store.getters.getLoggedUser;
    }
  },
  methods: {
    ...mapActions({
      loadServerData: 'loadStockServer',
      sendServerData: 'sendStockServer',
    }),
    endDay() {
      this.$store.commit('RANDOM_STOCKS');
    },
    saveData() {
      this.sendServerData();
    },
    loadData() {
      this.loadServerData();
    },
    logout() {
      this.$store.commit('LOGOUT');
    }
  }
}
</script>

<style>
  .navMargin {
    margin-bottom: 30px;
  }

  .dropdown-menu {
    min-width: 0px;
  }

</style>