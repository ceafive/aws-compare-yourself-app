<template>
  <div id="app">
    <Header @auth-mode="setLogin" :currentUser="currentUser" @logout="logout" />
    <div class="flex flex-col justify-center items-center py-10 h-full">
      <Auth
        v-if="!currentUser"
        :login-mode="loginMode"
        :on-set-user="setUser"
      />
      <Main
        v-else-if="currentUser && usersData.length === 0"
        @users-data="setData"
        :currentUser="currentUser"
      />
      <ShowDetails
        v-else-if="currentUser && usersData.length > 0"
        :users-data="usersData"
        @users-data="setData"
        :currentUser="currentUser"
      />
    </div>
  </div>
</template>

<script>
import Header from "./components/Header";
import Auth from "./components/Auth";
import Main from "./components/Main";
import ShowDetails from "./components/ShowDetails";

import { userPool } from "./utils";

export default {
  name: "App",
  components: {
    Header,
    Auth,
    Main,
    ShowDetails,
  },
  data() {
    return {
      currentUser: null,
      isLogin: true,
      usersData: [],
    };
  },
  computed: {
    loginMode() {
      return this.isLogin;
    },
  },
  methods: {
    isAuthenticated() {
      const user = userPool.getCurrentUser();
      if (!user) {
        console.log("No User");
        return null;
      } else {
        return user.getSession((err, session) => {
          if (err) {
            console.log("No User", err);
            return null;
          } else {
            if (session.isValid()) {
              const userDetails = {
                accessToken: session.accessToken.jwtToken,
                idToken: session.idToken.jwtToken,
                refreshToken: session.refreshToken.jwtToken,
                isValid: session.isValid,
              };
              this.currentUser = userDetails;

              return true;
            } else return null;
          }
        });
      }
    },
    setLogin(value) {
      this.isLogin = value;
    },
    setUser(details) {
      this.currentUser = details;
    },
    setData(data) {
      this.usersData = data;
    },
    logout() {
      userPool.getCurrentUser().signOut();
      this.currentUser = null;
    },
  },
  mounted() {
    this.isAuthenticated();
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f4efef;
  min-height: 100vh;
}
</style>
