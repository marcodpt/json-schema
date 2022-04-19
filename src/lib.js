const eq = (X, Y) => {
  if (X && typeof X == "object" && Y && typeof Y == "object") {
    return Object.keys(X)
      .concat(Object.keys(Y))
      .reduce((pass, k) => pass && eq(X[k], Y[k]), true)
  } else {
    return X === Y
  }
}

const isObj = X => X != null && typeof X == 'object' && !(X instanceof Array)

const copy = X => JSON.parse(JSON.stringify(X))

export {eq, isObj, copy}
