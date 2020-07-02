/* eslint-disable no-undef */
<template>
  <div class="card mx-3 mx-lg-5" style="background-color: lightgrey;">
    <label for="StockList"><h3 class="card-header px-4">Stock List</h3></label>
    <div class="row px-4 pt-3 pb-4 pb-lg-0">

      <app-stock-list
        v-for="company in stockListCompanies"
        :key="company.id"
        :stock="company">
      </app-stock-list>

      <div class="col-sm-6 col-md-4">
        <div
          class="mb-0 mb-lg-4"
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
        class="modal fade col-12"
        id="addNewStock"
        tabindex="-1"
        role="dialog"
        aria-labelledby="addNewStock"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">

          <div class="modal-content col-11 col-lg-9 mx-auto">
            <div class="modal-header py-1">
              <h6 class="modal-title mx-2 py-1"><strong>New Stock</strong></h6>
              <button type="button" class="close py-1 my-0" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div class="modal-body py-2 mx-2">
              <label for="newStockName">Stock Name</label>
              <input
                class="form-control col-lg-8 col-9"
                type="text"
                placeholder="Name"
                v-model="newStockName"
                :class="{ invalidField: $v.newStockName.$error }"
                @blur="$v.newStockName.$touch()">
              <small style="color: red" v-if="$v.newStockName.$error">Please enter the new stock name.<br></small>
              <br>
              <label for="newStockPrice">Stock Price</label>
              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <span class="input-group-text">$</span>
                </div>
                <input
                  type="number"
                  class="form-control col-lg-6 col-6"
                  aria-label="Amount (to the nearest dollar)"
                  v-model="newStockPrice"
                  :class="{ invalidField: $v.newStockPrice.$error }"
                  @blur="$v.newStockPrice.$touch()">
                <div class="input-group-append">
                  <span class="input-group-text">.00</span>
                </div>
              </div>
            </div>

            <div class="modal-footer py-2">
              <button
                type="button"
                class="btn btn-danger"
                data-dismiss="modal"
                @click="clearNew()">Cancel
              </button>
              <button
                type="button"
                class="btn btn-success mx-2"
                data-dismiss="modal"
                :disabled="$v.$invalid"
                @click="addNewStock()">Save
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import StockListStock from './Stock.vue'
import { required, minLength, numeric, minValue } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      newStockName: '',
      newStockPrice: '',
      addStockClass: 'card bg-secondary text-white addStock'
    }
  },
  computed: {
    stockListCompanies () {
      return this.$store.getters.getStocks
    }
  },
  methods: {
    addNewStock () {
      const stockListSize = parseInt(this.$store.getters.getStocks.length)
      const newStockId = parseInt(this.$store.getters.getStocks[stockListSize - 1].id) + 1
      const newStockList = this.$store.getters.getStocks
      newStockList.push({
        id: newStockId,
        name: this.newStockName,
        price: parseInt(this.newStockPrice)
      })
      if (newStockList.price) this.$store.commit('CREATE_NEW_STOCK', newStockList)
      this.newStockName = ''
      this.newStockPrice = ''
      // eslint-disable-next-line no-undef
      $('#addNewStock').modal('hide')
    },
    clearNew () {
      this.newStockName = ''
      this.newStockPrice = ''
    }
  },
  components: {
    appStockList: StockListStock
  },
  validations: {
    newStockName: {
      required,
      minLength: minLength(2)
    },
    newStockPrice: {
      required,
      numeric,
      minValue: minValue(1)
    }
  }
}
</script>

<style>
  .addStock {
    height: 121px;
  }

  .invalidField {
    border: 1px solid red;
    background-color: #ffb3b3;
  }
</style>
