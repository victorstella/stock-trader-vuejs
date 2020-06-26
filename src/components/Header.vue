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
        v-if="loggedUser"
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
            class="nav-link dropdown-toggle"
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
  </nav>
</template>

<script>
import { mapActions } from 'vuex';

export default {
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