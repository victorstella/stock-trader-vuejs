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
                autofocus>
            </div>
            <div class="px-3 col-8 col-lg">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Last name"
                v-model="lastName">
            </div>
          </div>
          <br>
          
          <label for="Document">Document</label>
          <input 
            type="number" 
            class="form-control col-10 col-lg-5" 
            placeholder="ID/Passport/Driver Licence"
            v-model="usrDoc">
          <br>
          
          <label for="Email">Email Address</label>
          <input 
            type="email" 
            class="form-control col-lg-5" 
            placeholder="user@example.com"
            v-model="email">
          <br>
          
          <label for="CreatePassword">Password</label>
          <input 
            type="password" 
            class="form-control col-8 col-lg-4"
            placeholder="Create Password"
            v-model="pwrd">
          <small class="form-text text-muted">Your password must be at least 6 digits.</small>
          <br>
          
          <input 
            type="password" 
            class="form-control col-8 col-lg-4" 
            placeholder="Confirm Password"
            v-model="confPwrd">
          <br>
          
          <div class="form-group form-check">
            <input 
              type="checkbox" 
              class="form-check-input"
              v-model="over18">
            <label class="form-check-label" for="exampleCheck1">I'm over 18 years old.</label>
          </div>
          <br>
          
          <label for="DepositFunds">Deposit Funds</label>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">$</span>
            </div>
            <input 
              type="number" 
              class="form-control col-7 col-lg-2" 
              aria-label="Amount (to the nearest dollar)"
              v-model="funds">
            <div class="input-group-append">
              <span class="input-group-text">.00</span>
            </div>
          </div>
          <br>
          <br>
          
          <button 
            type="submit" 
            class="btn btn-info btn-block" 
            @click.prevent="joinUs()"
            :disabled="!over18">Submit</button>
        </form>
      
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      usrDoc: null,
      email: '',
      pwrd: '',
      confPwrd: '',
      over18: false,
      funds: ''
    }
  },
  methods: {
    joinUs() {
      let formData = {
        userServerId: '',
        firstName: this.firstName,
        lastName: this.lastName,
        usrDoc: this.usrDoc,
        email: this.email,
        pwrd: this.pwrd,
        confPwrd: this.confPwrd,
        over18: this.over18,
        lastSavedData: {
          funds: this.funds        
        }
      };
      if(formData.pwrd == formData.confPwrd){
        if(formData.over18) {
          this.$store.dispatch('signup', formData);
        } else {
          alert('Please check if you are over 18 years old.');
        }
      } else {
        alert('Password confirmation does not match.');
      }
      this.firstName = '';
      this.lastName = '';
      this.usrDoc = null;
      this.email = '';
      this.pwrd = '';
      this.confPwrd = '';
      this.over18 = false;
      this.funds = '';
    }
  }
}
</script>

<style>
  @media only screen and (max-width: 992px){
  }
</style>