const getMyPortfolio = (state) => {
  return state.myPortfolio
}

const getStocks = (state) => {
  return state.stocks
}

const getLoggedUser = (state) => {
  return state.userEmail
}

const getState = (state) => {
  return state
}

const getIdToken = (state) => {
  return state.idToken
}

const getUserServerData = (state) => {
  return state.userServerData
}

export default {
  getMyPortfolio,
  getStocks,
  getLoggedUser,
  getState,
  getIdToken,
  getUserServerData
}
