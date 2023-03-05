<template>
  <div class="col-sm-6 col-md-5 m-auto mx-3">

    <div class="card text-center mb-3" style="background-color: lightgrey;">
      <h3 class="card-header">Login</h3>
      <div class="card-body">
        <form>

          <label for="Email">Email Address</label>
          <input
            type="email"
            class="form-control col-lg-9 m-auto"
            :class="{invalidField: $v.email.$error}"
            placeholder="user@example.com"
            @blur="$v.email.$touch()"
            v-model="email"
            autofocus>
          <small style="color: red" v-if="$v.email.$error">Please provide a valid and registered e-mail address.</small>
          <br>
          <br>

          <label for="Password">Password</label>
          <input
            type="password"
            class="form-control col-lg-9 m-auto"
            :class="{invalidField: $v.pwrd.$error}"
            @blur="$v.pwrd.$touch()"
            v-model="pwrd">
          <br>

          <button
            type="submit"
            class="btn btn-info"
            @click.prevent="signin()"
            :disabled="$v.$invalid">Enter
          </button>

        </form>
      </div>
    </div>

  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      email: '',
      pwrd: ''
    }
  },
  validations: {
    email: {
      required,
      email,
      minLength: minLength(6)
    },
    pwrd: {
      required,
      minLength: minLength(6)
    }
  },
  methods: {
    signin () {
      this.$store.dispatch('login', { email: this.email, pwrd: this.pwrd })
      this.email = ''
      this.pwrd = ''
    }
  }
}
</script>

<style>
  .invalidField  {
    border: 1px solid red;
    background-color: #ffb3b3;
  }
</style>
