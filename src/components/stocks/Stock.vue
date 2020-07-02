<template>
  <div class="col-sm-6 col-md-4">

    <div class="card bg-dark text-white mb-4">
      <h6 class="card-header d-flex align-items-center px-3 py-1">{{ stock.name }}
        <small>(Price: {{ numberToMoney }})</small>
        <button type="button"
          class="close px-2 py-1 ml-auto"
          @click.prevent="stockToDelete()"
          data-toggle="modal"
          data-target="#deleteStock">
          <span aria-hidden="true">&times;</span>
        </button>
      </h6>
      <div class="card-body row">
        <input
          type="number"
          class="form-control col-4 m-auto"
          placeholder="Lots"
          v-model="quantity"
          :class="{danger: insufficientFunds}">
        <button
          class="btn btn-success col-7 m-auto"
          @click="buyStock"
          :disabled="insufficientFunds">{{ insufficientFunds ? 'Insufficient Funds' : 'Buy' }}
        </button>
      </div>
    </div>

    <div
      class="modal fade col-12"
      id="deleteStock"
      tabindex="-1"
      role="dialog"
      aria-labelledby="deleteStock"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">

        <div class="modal-content col-11 col-lg-9 mx-auto">
          <div class="modal-header py-1">
            <h6 class="modal-title mx-2 py-1"><strong>Delete Stock</strong></h6>
            <button type="button" class="close py-1 my-0" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body mx-2 pb-0">
            <p>Do you really want to delete this stock?</p>
            <p>Click on "Save" to apply your modifications and the current state.</p>
          </div>
          <div class="modal-footer py-2">
            <button type="button" class="btn btn-danger mx-auto" data-dismiss="modal">No</button>
            <button
              type="button"
              class="btn btn-success mx-auto"
              data-dismiss="modal"
              @click.prevent="deleteStock()">Yes
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: ['stock'],
  data () {
    return {
      quantity: ''
    }
  },
  computed: {
    insufficientFunds () {
      const userData = this.$store.getters.getUserServerData
      return userData
        ? this.quantity * parseInt(this.stock.price) > parseInt(userData.lastSavedData.funds) || this.quantity <= 0
        : 0
    },
    numberToMoney () {
      return this.stock.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    }
  },
  methods: {
    buyStock () {
      const order = {
        id: parseInt(this.stock.id),
        name: this.stock.name,
        price: parseInt(this.stock.price),
        quantity: parseInt(this.quantity)
      }
      this.$store.dispatch('buyStock', order)
      this.quantity = ''
    },
    stockToDelete () {
      localStorage.setItem('stockToDelete', this.stock.id)
    },
    deleteStock () {
      this.$store.commit('DEL_STOCK', localStorage.getItem('stockToDelete'))
      localStorage.removeItem('storeToDelete')
    }
  }
}
</script>

<style scoped>
  .danger {
    border: 2px solid red;
  }
</style>
