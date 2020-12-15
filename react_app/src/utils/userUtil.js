function getUser() {
  let localUser = localStorage.getItem("loginInfo");
  const loginInfo = localUser
    ? JSON.parse(localUser)
    : { loggedIn: false, username: null, userId: null, adminAccess: false };
  return loginInfo;
}

export default getUser;
