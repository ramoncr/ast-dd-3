function isObject(obj) {
  console.log(typeof obj);
  return typeof obj === "function" || typeof obj === "object";
}

function generateRandomString(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }
  return result;
}

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function merge(target, source) {
  for (let key in source) {
    if (isObject(target[key]) && isObject(source[key])) {
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function shuffleArray(array) {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function formatDate(date) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

function ensureAuthenticatedRequest() {
  return function _isAuthenticated (req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        console.log(req.originalUrl);

      if (!req.originalUrl.includes("/export")) {
        return res.redirect("/login");
      }
    }

    return next();
  };
}

function ensureAuthenticatedAndAdminRequest() {
  return function _isAuthenticated (req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        console.log(req.originalUrl);

      if (!req.originalUrl.includes("/export")) {
        return res.redirect("/login");
      }
    }

    if(!req.user.isAdmin) {
      return res.redirect("/");
    }

    return next();
  };
}


module.exports = { generateRandomString, formatDate, merge, shuffleArray, generateUniqueId, ensureAuthenticatedRequest, ensureAuthenticatedAndAdminRequest }