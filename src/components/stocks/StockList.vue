<template>
  <div class="card" style="background-color: lightgrey;">
    <label for="StockList"><h3 class="card-header px-4">Stock List</h3></label>
    <div class="row p-4">
      
      <app-stock-list 
        v-for="company in stockListCompanies" 
        :key="company.id" 
        :stock="company">
      </app-stock-list>
      
      <div class="col-sm-6 col-md-4">
        <div 
          :class="addStockClass"
          @mouseenter="addStockClass = 'card bg-dark text-white addStock'"
          @mouseleave="addStockClass = 'card bg-secondary text-white addStock'"
          type="button"
          data-toggle="modal"
          data-target="#addNewStock">
          <div class="card-body mx-auto pt-3">
            <img class="icon mx-auto" src="../../assets/addStock.png" alt="my icon"/>
          </div>
          <h6 class="text-center pb-2">Add Stock</h6>
        </div>
      </div>

      <div 
        class="modal fade" 
        id="addNewStock" 
        tabindex="-1" 
        role="dialog" 
        aria-labelledby="addNewStock" 
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h6 class="modal-title"><strong>New Stock</strong></h6>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>
                <label for="newStockName">Stock Name</label>
                <input class="form-control col-6" type="text" placeholder="Name" v-model="newStockName">
              </p>
              <p>
                <label for="newStockPrice">Stock Price</label>
                <input class="form-control col-4" type="number" placeholder="Price" v-model="newStockPrice">
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
              <button 
                type="button" 
                class="btn btn-success" 
                data-dismiss="modal" 
                @click.prevent="addNewStock()">Save
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import StockListStock from './Stock.vue';

export default {
  data() {
    return {
      currentStockListSize: 0,
      newStockName: '',
      newStockPrice: '',
      addStockClass: 'card bg-secondary text-white addStock'
    }
  },
  components: {
    appStockList: StockListStock
  },
  computed: {
    stockListCompanies() {
      if(this.$store.getters.getStocks) {
        this.currentStockListSize = parseInt(this.$store.getters.getStocks.length);
        return this.$store.getters.getStocks;
      }
    }
  },
  methods: {
    addNewStock() {
      let stockListSize = parseInt(this.$store.getters.getStocks.length);
      let newStockId = parseInt(this.$store.getters.getStocks[stockListSize - 1].id) + 1;
      let newStockList = this.$store.getters.getStocks;
      newStockList.push({
        id: newStockId,
        name: this.newStockName,
        price: parseInt(this.newStockPrice)
      })
      this.$store.commit('CREATE_NEW_STOCK', newStockList);
      this.newStockName = '';
      this.newStockPrice = '';
    }
  }
}
</script>

<style>
  .addStock {
    height: 129px;
  }
</style>