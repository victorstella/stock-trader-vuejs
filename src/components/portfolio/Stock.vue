<template>
  <div class="col-sm-6 col-md-4">

    <div class="card bg-dark text-white mb-4">
      <h6 class="card-header">{{ stock.name }}
        <small>Price: {{ numberToMoney }}</small>
        <br>
        <small>Quantity: {{ stock.quantity }}</small>
      </h6>
      <div class="card-body row">
        <input
          type="number"
          class="form-control col-4 m-auto"
          placeholder="Lots"
          v-model="quantity"
          :class="{danger: insufficientQuantity}">
        <button
          class="btn btn-danger col-7 m-auto"
          @click="sellStock"
          :disabled="insufficientQuantity">{{ insufficientQuantity ? 'Insufficient Stocks' : 'Sell' }}
        </button>
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
    insufficientQuantity () {
      return this.quantity > parseInt(this.stock.quantity) || this.quantity <= 0
    },
    numberToMoney () {
      const stock = this.$store.getters.getStocks.find(element => element.name === this.stock.name)
      return stock.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    }
  },
  methods: {
    sellStock () {
      const order = {
        id: parseInt(this.stock.id),
        name: this.stock.name,
        price: parseInt(this.stock.price),
        quantity: parseInt(this.quantity)
      }
      this.$store.dispatch('sellStock', order)
      this.quantity = ''
    }
  }
}
</script>

<style scoped>
  .danger {
    border: 2px solid red;
  }
</style>
