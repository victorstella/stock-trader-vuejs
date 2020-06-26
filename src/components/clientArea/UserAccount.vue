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
            v-model="editedData.firstName">
          <br>
          
          <label for="Name">Last Name</label>
          <div  v-if="!editing" class="font-weight-bold">
            {{ userData.lastName }}
          </div>
          <input 
            class="form-control col-8 col-lg-4"
            v-if="editing" 
            type="text"
            v-model="editedData.lastName">
          <br>

          <label for="Document">Document</label>
          <div v-if="!editing" class="font-weight-bold">
            {{ userData.usrDoc }}
          </div>
          <input 
            class="form-control col-10 col-lg-5"
            v-if="editing" 
            type="number"
            v-model="editedData.usrDoc">
          <br>

          <label for="Email">Email Address</label>
          <div v-if="!editing" class="font-weight-bold">
            {{ userData.email }}
          </div>
          <input 
            class="form-control col-lg-5"
            v-if="editing" 
            type="email"
            v-model="editedData.email">
          <br>

          <button
            type="button"
            class="btn btn-danger mb-4"
            v-if="!editing"
            data-toggle="modal"
            data-target="#confirmDeleteAcc">Delete Account
          </button>

          <div 
            class="modal fade col-12" 
            id="confirmDeleteAcc" 
            tabindex="-1" 
            role="dialog" 
            aria-labelledby="confirmDeleteAcc" 
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              
              <div class="modal-content col-11 mx-auto">
                <div class="modal-header py-2">
                  <h6 class="modal-title mx-2"><strong>Delete Account</strong></h6>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
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

          <button 
            type="submit" 
            class="btn btn-dark btn-block"
            v-if="!editing"
            @click.prevent="editUserInfo()">Edit
          </button>

          <div class="row justify-content-center" v-if="editing">
            <button class="btn btn-danger mx-3" @click.prevent="editUserInfo()">Cancel</button>
            <button class="btn btn-success mx-3" @click.prevent="saveData()">Save</button>
          </div>

        </form>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      editedData: {
        firstName: this.$store.getters.getUserServerData.firstName,
        lastName: this.$store.getters.getUserServerData.lastName,
        usrDoc: this.$store.getters.getUserServerData.usrDoc,
        email: this.$store.getters.getUserServerData.email
      },
      editing: false
    }
  },
  computed: {
    userData(){
      if(this.$store.getters.getUserServerData) {
        return this.$store.getters.getUserServerData;
      }
    }
  },
  methods: {
    editUserInfo() {
      this.editing = !this.editing;
      if(!this.editing) {
        this.editedData.firstName = this.$store.getters.getUserServerData.firstName;
        this.editedData.lastName = this.$store.getters.getUserServerData.lastName;
        this.editedData.usrDoc = this.$store.getters.getUserServerData.usrDoc;
        this.editedData.email = this.$store.getters.getUserServerData.email;
      };
    },
    saveData() {
      this.$store.dispatch('storeUserAccountModifications', this.editedData);
      this.editUserInfo();
    },
    deleteAcc() {
      this.$store.dispatch('deleteAccount');
      this.$router.push({ name: 'login' });
    }
  }
}
</script>

<style scoped>
  #userData {
    font-size: 18px;
  }
</style>