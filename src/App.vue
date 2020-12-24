<template>
  <div id="app">
    <Header
      @auth-mode="setLogin"
      :currentUser="currentUser"
      @logout="logout"
      @is-compare="setIsCompare"
    />
    <div class="flex flex-col justify-center items-center py-10 h-full">
      <Auth
        v-if="!currentUser"
        :login-mode="loginMode"
        :on-set-user="setUser"
      />
      <Main
        v-else-if="(currentUser && usersData.length === 0) || switchToCompare"
        @users-data="setData"
        :currentUser="currentUser"
      />
      <ShowDetails
        v-else-if="(currentUser && usersData.length > 0) || !switchToCompare"
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
      switchToCompare: true,
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
            console.log("No valid user session", err);
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
      if (data && data.length > 0) {
        this.switchToCompare = false;
      }
      // console.log({ data });
      this.usersData = data;
    },
    setIsCompare() {
      this.switchToCompare = true;
    },
    logout() {
      userPool.getCurrentUser().signOut();
      this.currentUser = null;
      this.isLogin = true;
      this.usersData = [];
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
