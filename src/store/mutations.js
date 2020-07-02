const SET_STOCKS = (state, currentStock) => {
  state.stocks = Object.values(currentStock)
}

const CREATE_NEW_STOCK = (state, newStockList) => {
  state.stocks = newStockList
}

const DEL_STOCK = (state, stockId) => {
  state.stocks.splice(stockId, 1)
  let newId = 0
  state.stocks.forEach(stock => {
    stock.id = newId
    newId++
  })
}

const SET_PORTFOLIO = (state, portfolio) => {
  state.userServerData.lastSavedData.funds = portfolio.funds
  state.myPortfolio = portfolio.stockPortfolio ? Object.values(portfolio.stockPortfolio) : []
}

const RANDOM_STOCKS = (state) => {
  const randValue = (param) => {
    return Math.round(param * (1 + Math.random() - 0.465))
  }
  let newPrice = 0

  state.stocks.forEach(stocksElement => {
    newPrice = randValue(stocksElement.price)
    stocksElement.price = newPrice
  })

  if (state.myPortfolio) {
    state.myPortfolio.forEach(portfolioElement => {
      state.stocks.forEach(stocksElement => {
        if (portfolioElement.id === stocksElement.id) {
          portfolioElement.price = stocksElement.price
        }
      })
    })
  }
}

const BUY_STOCK = (state, userBuyOrder) => {
  const inPortfolioStock = state.myPortfolio.findIndex(element => element.id === userBuyOrder.id)

  if (inPortfolioStock >= 0) {
    state.myPortfolio[inPortfolioStock].quantity += userBuyOrder.quantity
  } else {
    state.myPortfolio.push(userBuyOrder)
  }
  state.userServerData.lastSavedData.funds -= userBuyOrder.quantity * userBuyOrder.price
}

const SELL_STOCK = (state, userSellOrder) => {
  const stockToSell = state.myPortfolio.findIndex(element => element.id === userSellOrder.id)

  if (state.myPortfolio[stockToSell].quantity > userSellOrder.quantity) {
    state.myPortfolio[stockToSell].quantity -= userSellOrder.quantity
  } else {
    state.myPortfolio.splice(stockToSell, 1)
  }
  state.userServerData.lastSavedData.funds += userSellOrder.quantity * userSellOrder.price
}

const AUTH_USER = (state, userData) => {
  state.idToken = userData.idToken
  state.localId = userData.localId
  state.userEmail = userData.userEmail
}

const LOGOUT = (state) => {
  state.idToken = null
  state.localId = null
  state.userEmail = null
  state.userServerData = null
  state.stocks = []
  state.myPortfolio = []
  localStorage.removeItem('expirationDate')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userPwrd')
}

const STORE_USER_INFO = (state, userInfo) => {
  state.userServerData = userInfo
  if (userInfo.lastSavedData.stockPortfolio) {
    state.myPortfolio = Object.values(userInfo.lastSavedData.stockPortfolio)
  }
  if (userInfo.email !== state.userEmail) {
    state.userEmail = userInfo.email
  }
}

const STORE_USER_MODIFICATIONS = (state, newAccData) => {
  state.userServerData.firstName = newAccData.firstName
  state.userServerData.lastName = newAccData.lastName
  state.userServerData.usrDoc = newAccData.usrDoc
  state.userServerData.email = newAccData.email
  state.userEmail = newAccData.email
}

const CHANGE_PASSWORD = (state, newData) => {
  state.idToken = newData.newIdToken
  state.userServerData.pwrd = newData.newPassword
  state.userServerData.confPwrd = newData.newPassword
}

export default {
  SET_STOCKS,
  CREATE_NEW_STOCK,
  DEL_STOCK,
  RANDOM_STOCKS,
  BUY_STOCK,
  SELL_STOCK,
  SET_PORTFOLIO,
  AUTH_USER,
  LOGOUT,
  STORE_USER_INFO,
  STORE_USER_MODIFICATIONS,
  CHANGE_PASSWORD
}
