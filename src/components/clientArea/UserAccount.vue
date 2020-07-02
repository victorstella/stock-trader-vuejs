<template>
    <div class="card mx-3 mx-lg-5" style="background-color: lightgrey;">
      <h3 class="card-header text-center">User Account Details</h3>
      <div class="card-body mb-1 mx-3 mx-lg-5">
        <form id="userData">

          <label for="Name">First Name</label>
          <div v-if="!editing" class="font-weight-bold">
            {{ userData.firstName }}
          </div>
          <input
            class="form-control col-8 col-lg-4"
            v-if="editing"
            type="text"
            v-model="editedData.firstName"
            :class="{invalidField: $v.editedData.firstName.$error}"
            @blur="$v.editedData.firstName.$touch()">
            <small style="color: red" v-if="$v.editedData.firstName.$error">Please enter your first name.<br></small>
          <br>

          <label for="Name">Last Name</label>
          <div  v-if="!editing" class="font-weight-bold">
            {{ userData.lastName }}
          </div>
          <input
            class="form-control col-8 col-lg-4"
            v-if="editing"
            type="text"
            v-model="editedData.lastName"
            :class="{invalidField: $v.editedData.lastName.$error}"
            @blur="$v.editedData.lastName.$touch()">
            <small style="color: red" v-if="$v.editedData.lastName.$error">Please enter your last name.<br></small>
          <br>

          <label for="Document">Document</label>
          <div v-if="!editing" class="font-weight-bold">
            {{ userData.usrDoc }}
          </div>
          <input
            class="form-control col-10 col-lg-5"
            v-if="editing"
            type="number"
            v-model="editedData.usrDoc"
            :class="{invalidField: $v.editedData.usrDoc.$error}"
            @blur="$v.editedData.usrDoc.$touch()">
            <small style="color: red" v-if="$v.editedData.usrDoc.$error">Please provide a valid document.<br></small>
          <br>

          <label for="Email">Email Address</label>
          <div v-if="!editing" class="font-weight-bold">
            {{ userData.email }}
          </div>
          <input
            class="form-control col-lg-5"
            v-if="editing"
            type="email"
            v-model="editedData.email"
            :class="{invalidField: $v.editedData.email.$error}"
            @blur="$v.editedData.email.$touch()">
            <small style="color: red" v-if="$v.editedData.email.$error">Please provide a valid e-mail address.<br></small>
          <br>

          <div class="row mb-4 pb-2 px-3">
            <button
              type="button"
              class="btn btn-secondary mr-auto"
              v-if="!editing"
              data-toggle="modal"
              data-target="#changePassword">Change Password
            </button>
            <button
              type="button"
              class="btn btn-danger"
              v-if="!editing"
              data-toggle="modal"
              data-target="#confirmDeleteAcc">Delete Account
            </button>
          </div>

          <button
            type="submit"
            class="btn btn-dark btn-block"
            v-if="!editing"
            @click.prevent="editUserInfo()">Edit
          </button>

          <div class="row justify-content-center" v-if="editing">
            <button class="btn btn-danger mx-3" @click.prevent="editUserInfo()">Cancel</button>
            <button class="btn btn-success mx-3" :disabled="$v.$invalid" @click.prevent="saveData()">Save</button>
          </div>

          <div
            class="modal fade col-12"
            id="confirmDeleteAcc"
            tabindex="-1"
            role="dialog"
            aria-labelledby="confirmDeleteAcc"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">

              <div class="modal-content col-11 col-lg-9 mx-auto">
                <div class="modal-header py-1">
                  <h6 class="modal-title mx-2 py-1"><strong>Delete Account</strong></h6>
                  <button type="button" class="close py-1 my-0" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body mx-2 pb-0">
                  <p>Do you really want to delete the account?</p>
                </div>
                <div class="modal-footer py-2">
                  <button type="button" class="btn btn-danger mx-auto" data-dismiss="modal">No</button>
                  <button
                    type="button"
                    class="btn btn-success mx-auto"
                    data-dismiss="modal"
                    @click.prevent="deleteAcc()">Yes
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div
            class="modal fade col-12"
            id="changePassword"
            tabindex="-1"
            role="dialog"
            aria-labelledby="changePassword"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">

              <div class="modal-content col-11 col-lg-9 mx-auto">
                <div class="modal-header py-1">
                  <h6 class="modal-title mx-2 py-1"><strong>Change Password</strong></h6>
                  <button type="button" class="close py-1 my-0" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <div class="modal-body py-2 mx-2">
                  <label for="newPassword">New Password</label>
                  <input
                    type="password"
                    class="form-control col-lg-8 col-9"
                    v-model="newPwrd"
                    :class="{ invalidField: $v.newPwrd.$error }"
                    @blur="$v.newPwrd.$touch()">
                  <small class="form-text text-muted">Your password must be at least 6 digits.</small>
                  <br>
                  <label for="confirmNewPassword">Confirm New Password</label>
                  <input
                    type="password"
                    class="form-control col-lg-8 col-9 mb-2"
                    v-model="confirmNewPwrd"
                    :class="{ invalidField: $v.confirmNewPwrd.$error }"
                    @blur="$v.confirmNewPwrd.$touch()">
                </div>

                <div class="modal-footer py-2">
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-dismiss="modal"
                    @click="cancelNewPwrd()">Cancel
                  </button>
                  <button
                    type="button"
                    class="btn btn-success mx-2"
                    data-dismiss="modal"
                    :disabled="$v.$invalid"
                    @click.prevent="changePwrd()">Save
                  </button>
                </div>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
</template>

<script>
import { required, minLength, numeric, email, sameAs } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      editedData: {
        firstName: this.$store.getters.getUserServerData.firstName,
        lastName: this.$store.getters.getUserServerData.lastName,
        usrDoc: this.$store.getters.getUserServerData.usrDoc,
        email: this.$store.getters.getUserServerData.email
      },
      editing: false,
      newPwrd: '',
      confirmNewPwrd: ''
    }
  },
  validations: {
    editedData: {
      firstName: {
        required,
        minLength: minLength(2)
      },
      lastName: {
        required,
        minLength: minLength(2)
      },
      usrDoc: {
        required,
        minLength: minLength(6),
        numeric
      },
      email: {
        required,
        email
      }
    },
    newPwrd: {
      required,
      minLength: minLength(6)
    },
    confirmNewPwrd: {
      required,
      sameAs: sameAs('newPwrd')
    }
  },
  computed: {
    userData () {
      return this.$store.getters.getUserServerData ? this.$store.getters.getUserServerData : {}
    }
  },
  methods: {
    editUserInfo () {
      this.editing = !this.editing
      if (!this.editing) {
        this.editedData.firstName = this.$store.getters.getUserServerData.firstName
        this.editedData.lastName = this.$store.getters.getUserServerData.lastName
        this.editedData.usrDoc = this.$store.getters.getUserServerData.usrDoc
        this.editedData.email = this.$store.getters.getUserServerData.email
      };
    },
    saveData () {
      this.$store.dispatch('storeUserAccountModifications', this.editedData)
      this.editUserInfo()
    },
    deleteAcc () {
      this.$store.dispatch('deleteAccount')
      this.$router.push({ name: 'login' })
    },
    changePwrd () {
      this.$store.dispatch('changePassword', this.confirmNewPwrd)
      this.newPwrd = ''
      this.confirmNewPwrd = ''
      // eslint-disable-next-line no-undef
      $('#changePassword').modal('hide')
    },
    cancelNewPwrd () {
      this.newPwrd = ''
      this.confirmNewPwrd = ''
    }
  }
}
</script>

<style scoped>
  #userData {
    font-size: 18px;
  }

  .invalidField {
    border: 1px solid red;
    background-color: #ffb3b3;
  }
</style>
