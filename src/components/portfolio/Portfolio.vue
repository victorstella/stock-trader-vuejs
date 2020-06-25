<template>
  <div class="card" style="background-color: lightgrey;">
    <label for="StockList"><h3 class="card-header px-4">My Portfolio</h3></label>
    <div class="row p-4">
      <app-portfolio-stock 
        v-for="(company, index) in getCompanies"
        :key="index"
        :stock="company"
      ></app-portfolio-stock>
    </div>
  </div>
</template>

<script>
import PortfolioStock from './Stock.vue';

export default {
  components: {
    appPortfolioStock: PortfolioStock
  },
  computed: {
    getCompanies() {
      return this.$store.getters.getMyPortfolio;
    }
  }
}
</script>