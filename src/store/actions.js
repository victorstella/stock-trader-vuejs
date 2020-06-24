import axiosAuth from '../axios-auth-api.js';
import axios from 'axios';
import router from '../routes.js'

const buyStock = ({commit}, order) => {
  commit('BUY_STOCK', order);
};

const sellStock = ({commit}, order) => {
  commit('SELL_STOCK', order);
};

const signup = ({commit, dispatch}, authData) => {
  axiosAuth.post('/signupNewUser?key=AIzaSyADgubmeI4xoGzlA0ZNBoHYl8KTB36bcZg', {
    email: authData.email,
    password: authData.pwrd,
    returnSecureToken: true
  })
  .then(firstResponse => {
    commit('AUTH_USER', {
      idToken: firstResponse.data.idToken,
      localId: firstResponse.data.localId,
      userEmail: authData.email
    });
    dispatch('storeUser', authData);
    axios.get('https://vuejs-http-d192f.firebaseio.com/stocks.json?auth=' + firstResponse.data.idToken)
    .then(secondResponse => {
      commit('SET_STOCKS', secondResponse.data);
    })
    .catch(error => console.log(error));
  })
  .catch(error => {
    if(JSON.stringify(error.firstResponse.data.error.message) == '"EMAIL_EXISTS"') {
      alert('The email address is already in use by another account.');
    };
  });
};

const deleteAccount = ({commit, getters}) => {
  axios.post('https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyADgubmeI4xoGzlA0ZNBoHYl8KTB36bcZg',
    { idToken: getters.getIdToken })
  .catch(error => console.log(error));
  axios.delete('https://vuejs-http-d192f.firebaseio.com/users/' + getters.getUserServerData.userServerId + 
    '.json?auth=' + getters.getIdToken)
  .then(response => {
    if(!response.data) {
      commit('LOGOUT');
    };
  })
  .catch(error => console.log(error));
};

const login = ({commit}, authData) => {
  axiosAuth.post('/verifyPassword?key=AIzaSyADgubmeI4xoGzlA0ZNBoHYl8KTB36bcZg', {
    email: authData.email,
    password: authData.pwrd,
    returnSecureToken: true
  })
  .then(firstResponse => {
    commit('AUTH_USER', {
      idToken: firstResponse.data.idToken,
      localId: firstResponse.data.localId,
      userEmail: authData.email
    });
    axios.get('https://vuejs-http-d192f.firebaseio.com/users.json?auth=' + firstResponse.data.idToken)
    .then(secondResponse => {
      for(let user in secondResponse.data) {
        if(secondResponse.data[user].email == authData.email) {
          axios.get('https://vuejs-http-d192f.firebaseio.com/users/' + secondResponse.data[user].userServerId + 
            '.json?auth=' + firstResponse.data.idToken)
          .then(thirdResponse => {
            commit('STORE_USER_INFO', thirdResponse.data);
          })
          .catch(error => console.log(error));
          axios.get('https://vuejs-http-d192f.firebaseio.com/stocks.json?auth=' + firstResponse.data.idToken)
          .then(fourthResponse => {
            commit('SET_STOCKS', fourthResponse.data);
          })
          .catch(error => console.log(error));
        }
      };
      router.push({ name: 'stocks' });
    })
    .catch(error => {
      if(JSON.stringify(error.secondResponse.data.error.message) == '"INVALID_PASSWORD"') {
        alert('The password is invalid.');
      };      
      if(JSON.stringify(error.secondResponse.data.error.message) == '"EMAIL_NOT_FOUND"') {
        alert('There is no user record corresponding to this email account.');
      };
    });
  })
  .catch(error => console.log(error));
};

const logoutUser = ({commit}) => {
  commit('LOGOUT');
}

const storeUser = ({getters, commit}, userData) => {
  if(getters.getIdToken) {
    axios.post('https://vuejs-http-d192f.firebaseio.com/users.json?auth=' + getters.getIdToken, userData)
      .then(response => {
        Object.defineProperty(userData, 'userServerId', {
          value: response.data.name
        });
        commit('STORE_USER_INFO', userData);
        axios.patch('https://vuejs-http-d192f.firebaseio.com/users/' + response.data.name +
        '.json?auth=' + getters.getIdToken, {userServerId: response.data.name});
      })
      .catch(error => console.log(error));
  } else {
    return;
  }
};

const storeUserAccountModifications = ({getters, commit}, userModData) => {
  let emailChanged = userModData.email != getters.getLoggedUser ? true : false;
  
  let userData = getters.getUserServerData;
  userData.firstName = userModData.firstName;
  userData.lastName = userModData.lastName;
  userData.usrDoc = userModData.usrDoc;
  userData.email = userModData.email;
  
  axios.patch('https://vuejs-http-d192f.firebaseio.com/users/' + getters.getUserServerData.userServerId + '.json?auth=' +
    getters.getIdToken, userData)
  .catch(error => console.log(error));
  if(emailChanged) {
    axios.post('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyADgubmeI4xoGzlA0ZNBoHYl8KTB36bcZg', {
      idToken: getters.getIdToken,
      email: userData.email,
      returnSecureToken: true
    })
    .then(response => {
      commit('AUTH_USER', {
        idToken: response.data.idToken,
        localId: response.data.localId,
        userEmail: response.data.email
      })
    })
  }
  commit('STORE_USER_MODIFICATIONS', userData);
};

const loadStockServer = ({commit, getters}) => {
  axios.get('https://vuejs-http-d192f.firebaseio.com/users/' + getters.getUserServerData.userServerId + '.json?auth=' + 
    getters.getIdToken)
  .then(response => {
    commit('SET_PORTFOLIO', response.data.lastSavedData);
  })
  .catch(error => console.log(error));
  axios.get('https://vuejs-http-d192f.firebaseio.com/stocks.json?auth=' + getters.getIdToken)
  .then(response => {
    commit('SET_STOCKS', response.data);
  })
  .catch(error => console.log(error));
};

const sendStockServer = ({getters}) => {
  let lastSavedData = {
    funds: getters.getUserServerData.lastSavedData.funds,
    stockPortfolio: getters.getMyPortfolio,
  };
  axios.patch('https://vuejs-http-d192f.firebaseio.com/users/' + getters.getUserServerData.userServerId + 
    '.json?auth=' + getters.getIdToken, { lastSavedData: lastSavedData })
  .catch(error => console.log(error));
  axios.patch('https://vuejs-http-d192f.firebaseio.com/.json?auth=' + getters.getIdToken, { stocks: getters.getStocks })
  .catch(error => console.log(error));
};

export default {
  buyStock,
  sellStock,
  signup,
  deleteAccount,
  login,
  logoutUser,
  storeUser,
  storeUserAccountModifications,
  loadStockServer,
  sendStockServer
};