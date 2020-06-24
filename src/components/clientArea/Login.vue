<template>
  <div class="col-sm-6 col-md-5 m-auto">
    <div class="card text-center" style="background-color: lightgrey;">
      <h3 class="card-header">Login</h3>
      <div class="card-body">
        <form>
          <label for="Email">Email Address</label>
          <input 
            type="email" 
            class="form-control col-9 m-auto" 
            placeholder="user@example.com"
            v-model="email"
          >
          <br>
          <label for="Password">Password</label>
          <input 
            type="password" 
            class="form-control col-9 m-auto"
            v-model="pwrd"
          >
          <br>
          <button 
            type="submit" 
            class="btn btn-info" 
            @click.prevent="signin()"
            :disabled="!email">Enter</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      pwrd: ''
    }
  },
  methods: {
    signin() {
      this.$store.dispatch('login', { email: this.email, pwrd: this.pwrd });
      this.email = '';
      this.pwrd = '';
    }
  }
}
</script>