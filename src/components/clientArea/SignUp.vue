<template>
    <div class="card mb-4 mx-3 mx-lg-5" style="background-color: lightgrey;">
      <h3 class="card-header text-center">Join Us</h3>
      <div class="card-body px-4 mb-3 mx-lg-5">

        <form>
          <label for="Name">Name</label>

          <div class="row">
            <div class="px-3 col-8 col-lg">
              <input
                type="text"
                class="form-control"
                placeholder="First name"
                v-model="firstName"
                autofocus
                :class="{invalidField: $v.firstName.$error}"
                @blur="$v.firstName.$touch()">
              <small style="color: red" v-if="$v.firstName.$error">Please enter your first name.</small>
            </div>
            <div class="px-3 col-8 col-lg">
              <input
                type="text"
                class="form-control"
                placeholder="Last name"
                v-model="lastName"
                :class="{invalidField: $v.lastName.$error}"
                @blur="$v.lastName.$touch()">
              <small style="color: red" v-if="$v.lastName.$error">Please enter your last name.</small>
            </div>
          </div>
          <br>

          <label for="Email">Email Address</label>
          <input
            type="email"
            class="form-control col-lg-5"
            placeholder="user@example.com"
            v-model="email"
            :class="{invalidField: $v.email.$error}"
            @blur="$v.email.$touch()">
          <small style="color: red" v-if="$v.email.$error">Please provide a valid and unregistered e-mail address.<br></small>
          <br>

          <label for="Document">Document</label>
          <input
            type="number"
            class="form-control col-10 col-lg-5"
            placeholder="ID/Passport/Driver Licence"
            v-model="usrDoc"
            :class="{invalidField: $v.usrDoc.$error}"
            @blur="$v.usrDoc.$touch()">
          <small style="color: red" v-if="$v.usrDoc.$error">Please provide a valid document.<br></small>
          <br>

          <label for="CreatePassword">Password</label>
          <input
            type="password"
            class="form-control col-8 col-lg-4"
            placeholder="Create Password"
            v-model="pwrd"
            :class="{invalidField: $v.pwrd.$error}"
            @blur="$v.pwrd.$touch()">
          <small class="form-text text-muted">Your password must be at least 6 digits.</small>
          <br>

          <input
            type="password"
            class="form-control col-8 col-lg-4"
            placeholder="Confirm Password"
            v-model="confPwrd"
            :class="{invalidField: $v.confPwrd.$error}"
            @blur="$v.confPwrd.$touch()">
          <br>

          <div class="form-group form-check" :class="{invalidLabel: !over18}">
            <input
              id="over18"
              type="checkbox"
              class="form-check-input"
              v-model="over18">
            <label class="form-check-label" for="over18">I'm over 18 years old.</label>
          </div>
          <br>

          <label for="DepositFunds">Deposit Funds</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">$</span>
            </div>
            <input
              type="number"
              class="form-control col-7 col-lg-2"
              aria-label="Deposit"
              v-model="funds"
              :class="{invalidField: $v.funds.$invalid}"
              @blur="$v.funds.$touch()">
            <div class="input-group-append">
              <span class="input-group-text">.00</span>
            </div>
          </div>
          <small class="form-text text-muted">The minimum value for deposit is $50.</small>
          <br>
          <br>

          <button
            type="submit"
            class="btn btn-info btn-block mt-3"
            @click.prevent="joinUs()"
            :disabled="!over18 || $v.$anyError">Submit</button>
        </form>

      </div>
    </div>
</template>

<script>
import { required, email, minLength, numeric, sameAs, minValue } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  data () {
    return {
      firstName: '',
      lastName: '',
      email: '',
      usrDoc: null,
      pwrd: '',
      confPwrd: '',
      over18: false,
      funds: ''
    }
  },
  validations: {
    firstName: {
      required,
      minLength: minLength(2)
    },
    lastName: {
      required,
      minLength: minLength(2)
    },
    email: {
      required,
      email,
      emailRegistered: val => {
        if (val === '') return true
        return axios.get('https://vuejs-http-d192f.firebaseio.com/users.json?orderBy="email"&equalTo="' +
          val + '"')
          .then(response => {
            return Object.keys(response.data).length === 0
          })
      }
    },
    usrDoc: {
      required,
      numeric,
      minLength: minLength(6)
    },
    pwrd: {
      required,
      minLength: minLength(6)
    },
    confPwrd: {
      required,
      sameAs: sameAs('pwrd')
    },
    funds: {
      required,
      numeric,
      minValue: minValue(50)
    }
  },
  methods: {
    joinUs () {
      const formData = {
        userServerId: '',
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        usrDoc: this.usrDoc,
        pwrd: this.pwrd,
        confPwrd: this.confPwrd,
        over18: this.over18,
        lastSavedData: {
          funds: this.funds
        }
      }

      this.$store.dispatch('signup', formData)

      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.usrDoc = null
      this.pwrd = ''
      this.confPwrd = ''
      this.over18 = false
      this.funds = ''
    }
  }
}
</script>

<style>
  .invalidField {
    border: 1px solid red;
    background-color: #ffb3b3;
  }

  .invalidLabel {
    color: red;
  }
</style>
