import axios from 'axios'
import router from '../router/routes.js'
import * as firebase from 'firebase/app'
import * as firebaseAuth from 'firebase/auth'

const buyStock = ({ commit }, order) => {
  commit('BUY_STOCK', order)
}

const sellStock = ({ commit }, order) => {
  commit('SELL_STOCK', order)
}

const signup = async ({ commit, dispatch }, authData) => {
  const firebaseConfig = {
    apiKey: 'AIzaSyADgubmeI4xoGzlA0ZNBoHYl8KTB36bcZg',
    authDomain: 'vuejs-http-d192f.firebaseapp.com',
    projectId: 'my-stock-trader',
    storageBucket: 'vuejs-http-d192f.firebaseio.com/'
  }

  try {
    const app = firebase.initializeApp(firebaseConfig)
    const auth = firebaseAuth.getAuth(app)
    await firebaseAuth.createUserWithEmailAndPassword(auth, authData.email, authData.pwrd)
      .then(async firstResponse => {
        if (firstResponse) {
          const credential = firebaseAuth.EmailAuthProvider.credential(authData.email, authData.pwrd)
          await firebaseAuth.linkWithCredential(credential)
            .then(usercred => {
              console.log(usercred)
            }).catch(error => alert(error))

          commit('AUTH_USER', {
            idToken: firstResponse.user.uid,
            userEmail: firstResponse.user.email
          })
          dispatch('storeUser', authData)

          await axios({
            url: 'https://vuejs-http-d192f.firebaseio.com/stocks.json?',
            method: 'GET',
            headers: {
              authorization: 'Bearer ' + firstResponse.user.uid
            }
          })

          // axios.get('https://vuejs-http-d192f.firebaseio.com/stocks.json?auth=' + firstResponse.user.uid)
            .then(secondResponse => {
              commit('SET_STOCKS', secondResponse.data)
            })
          localStorage.setItem('userEmail', authData.email)
          localStorage.setItem('userPwrd', authData.pwrd)

          router.replace({ name: 'stocks' })
        }
      })
  } catch (error) {
    alert(error)
  }
}

const deleteAccount = ({ commit, getters }) => {
  axios.post('https://identitytoolkit.googleapis.com/v1/accounts:delete?' +
    'key=AIzaSyADgubmeI4xoGzlA0ZNBoHYl8KTB36bcZg', { idToken: getters.getIdToken })
    .catch(error => alert(error))

  axios.delete('https://vuejs-http-d192f.firebaseio.com/users/' + getters.getUserServerData.userServerId +
    '.json?auth=' + getters.getIdToken)
    .then(response => {
      if (!response.data) {
        commit('LOGOUT')
      }
    })
    .catch(error => alert(error))
}

const tryAutoLogin = ({ dispatch }) => {
  const userEmail = localStorage.getItem('userEmail')
  const userPwrd = localStorage.getItem('userPwrd')
  if (!userEmail || !userPwrd) {
    return
  }
  const expirationDate = localStorage.getItem('expirationDate')
  const now = new Date()
  if (now >= expirationDate) {
    return
  }
  dispatch('login', {
    email: userEmail,
    pwrd: userPwrd
  })
}

const login = ({ commit, dispatch }, authData) => {
  axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?' +
    'key=AIzaSyADgubmeI4xoGzlA0ZNBoHYl8KTB36bcZg', {
    email: authData.email,
    password: authData.pwrd,
    returnSecureToken: true
  })
    .then(firstResponse => {
      commit('AUTH_USER', {
        idToken: firstResponse.data.idToken,
        // localId: firstResponse.data.localId,
        userEmail: authData.email
      })

      axios.get('https://vuejs-http-d192f.firebaseio.com/users.json?orderBy="email"&equalTo="' +
      authData.email + '"')
        .then(secondResponse => {
          const secondResponseArr = Object.values(secondResponse.data)
          commit('STORE_USER_INFO', secondResponseArr[0])
        })

      axios.get('https://vuejs-http-d192f.firebaseio.com/stocks.json')
        .then(thirdResponse => {
          commit('SET_STOCKS', thirdResponse.data)
        })

      const now = new Date()
      const expirationDate = new Date(now.getTime() + firstResponse.data.expiresIn * 1000)
      localStorage.setItem('expirationDate', expirationDate)
      localStorage.setItem('userEmail', authData.email)
      localStorage.setItem('userPwrd', authData.pwrd)
      // dispatch('logoutTimer', firstResponse.data.expiresIn)

      router.replace({ name: 'stocks' })
    })
}

// const logoutTimer = ({ commit }, expirationTime) => {
//   setTimeout(() => {
//     commit('LOGOUT')
//     router.replace({ name: 'login' })
//   }, expirationTime * 1000)
// }

const storeUser = ({ getters, commit }, userData) => {
  if (getters.getIdToken) {
    axios.post('https://vuejs-http-d192f.firebaseio.com/users.json?auth=' + getters.getIdToken, userData)
      .then(response => {
        Object.defineProperty(userData, 'userServerId', {
          value: response.data.name
        })
        commit('STORE_USER_INFO', userData)
        axios.patch('https://vuejs-http-d192f.firebaseio.com/users/' + response.data.name +
        '.json?auth=' + getters.getIdToken, { userServerId: response.data.name })
      })
      .catch(error => alert(error))
  }
}

const storeUserAccountModifications = ({ getters, commit }, userModData) => {
  const emailChanged = userModData.email !== getters.getLoggedUser

  const userData = getters.getUserServerData
  userData.firstName = userModData.firstName
  userData.lastName = userModData.lastName
  userData.usrDoc = userModData.usrDoc
  userData.email = userModData.email

  axios.patch('https://vuejs-http-d192f.firebaseio.com/users/' + getters.getUserServerData.userServerId +
    '.json?auth=' + getters.getIdToken, userData)
    .catch(error => alert(error))
  if (emailChanged) {
    axios.post('https://identitytoolkit.googleapis.com/v1/accounts:update?' +
      'key=AIzaSyADgubmeI4xoGzlA0ZNBoHYl8KTB36bcZg', {
      idToken: getters.getIdToken,
      email: userData.email,
      returnSecureToken: true
    })
      .then(response => {
        commit('AUTH_USER', {
          idToken: response.data.idToken,
          // localId: response.data.localId,
          userEmail: response.data.email
        })
      })
      .catch(error => alert(error))
  }
  commit('STORE_USER_MODIFICATIONS', userData)
}

const changePassword = ({ commit, getters }, newPwrd) => {
  axios.post('https://identitytoolkit.googleapis.com/v1/accounts:update?' +
    'key=AIzaSyADgubmeI4xoGzlA0ZNBoHYl8KTB36bcZg', {
    idToken: getters.getIdToken,
    password: newPwrd,
    returnSecureToken: true
  })
    .then(firstResponse => {
      commit('CHANGE_PASSWORD', {
        newPassword: newPwrd,
        newIdToken: firstResponse.data.idToken
      })
    })
  axios.patch('https://vuejs-http-d192f.firebaseio.com/users/' + getters.getUserServerData.userServerId +
    '.json?auth=' + getters.getIdToken, {
    pwrd: newPwrd,
    confPwrd: newPwrd
  })
    .catch(error => alert(error))
  localStorage.setItem('userPwrd', newPwrd)
}

const loadStockServer = ({ commit, getters }) => {
  axios.get('https://vuejs-http-d192f.firebaseio.com/users/' + getters.getUserServerData.userServerId + '.json')
    .then(firstResponse => {
      commit('SET_PORTFOLIO', firstResponse.data.lastSavedData)
    })
    .catch(error => alert(error))

  axios.get('https://vuejs-http-d192f.firebaseio.com/stocks.json')
    .then(secondResponse => {
      commit('SET_STOCKS', secondResponse.data)
    })
    .catch(error => alert(error))
}

const sendStockServer = ({ getters }) => {
  const lastSavedData = {
    funds: getters.getUserServerData.lastSavedData.funds,
    stockPortfolio: getters.getMyPortfolio
  }

  axios.patch('https://vuejs-http-d192f.firebaseio.com/users/' + getters.getUserServerData.userServerId +
    '.json?auth=' + getters.getIdToken, { lastSavedData: lastSavedData })
    .catch(error => alert(error))

  axios.patch('https://vuejs-http-d192f.firebaseio.com/.json?auth=' + getters.getIdToken,
    { stocks: getters.getStocks })
    .catch(error => alert(error))
}

export default {
  buyStock,
  sellStock,
  signup,
  deleteAccount,
  tryAutoLogin,
  login,
  // logoutTimer,
  storeUser,
  storeUserAccountModifications,
  changePassword,
  loadStockServer,
  sendStockServer
}
