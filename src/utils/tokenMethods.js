import cookie from 'cookie_js';

const adminToken = "admin_toKen";
const usernameKey = "username"

export function getToKen(){
  return cookie.get(adminToken);
}

export function setToKen(token){
  return cookie.set(adminToken,token);
}

export function removeToKen(){
  return cookie.remove(adminToken)
}

export function setUserName(username){
  return cookie.set(usernameKey,username)
}

export function getUserName(){
  return cookie.get(usernameKey)
}

export function removeUserName(){
  return cookie.remove(usernameKey)
}