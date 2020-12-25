<template>
  <div>
    <div>
      <p class="text-2xl font-black mb-2">Welcome Back</p>
    </div>
    <div class="mb-2">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Username</label
      >
      <input
        id="username"
        class="appearance-none border-b-2 w-full py-1 pr-3 text-gray-700 leading-tight focus:outline-none"
        type="text"
        placeholder="johndoe"
        v-model="username"
      />
    </div>
    <div>
      <label for="password" class="block text-gray-700 text-sm font-bold mb-2"
        >Password</label
      >
      <div class="relative">
        <input
          id="password"
          class="appearance-none border-b-2 w-full py-1 pr-3 text-gray-700 mb-2 leading-tight focus:outline-none"
          :type="showPassword ? 'text' : 'password'"
          placeholder="********"
          v-model="password"
        />
        <ion-icon
          @click="showPassword = !showPassword"
          :name="!showPassword ? 'eye-outline' : 'eye-off-outline'"
          class="absolute right-0 h-6 w-6 cursor-pointer"
        ></ion-icon>
      </div>
    </div>
    <div class="flex justify-end">
      <button
        :disabled="isButtonDisabled || isSigningIn"
        class="flex justify-center items-center w-12 h-12 text-white font-bold py-2 px-4 rounded-full focus:outline-none"
        :class="{
          'bg-blue-500 hover:bg-blue-700': !isButtonDisabled || !isSigningIn,
          'bg-gray-200': isSigningIn || isButtonDisabled,
        }"
        @click="signin"
      >
        <ion-icon name="arrow-forward" size="large" />
      </button>
    </div>
  </div>
</template>


<script>
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { userPool } from "../utils";

export default {
  name: "SignIn",
  data() {
    return {
      username: "",
      password: "",
      isSigningIn: false,
      showPassword: false,
    };
  },
  computed: {
    isButtonDisabled() {
      if (!this.username || !this.password || this.password.length < 8)
        return true;
      else return false;
    },
  },
  methods: {
    signin() {
      this.isSigningIn = true;
      const authData = {
        Username: this.username,
        Password: this.password,
      };

      const authDetails = new AuthenticationDetails(authData);

      const userData = {
        Username: this.username,
        Pool: userPool,
      };
      const cognitoUser = new CognitoUser(userData);
      var self = this;

      cognitoUser.authenticateUser(authDetails, {
        onSuccess(result) {
          const userDetails = {
            accessToken: result.accessToken.jwtToken,
            idToken: result.idToken.jwtToken,
            refreshToken: result.refreshToken.jwtToken,
            isValid: result.isValid,
          };
          self.$emit("user-details", userDetails);
          this.isSigningIn = false;
        },
        onFailure(err) {
          //TODO: add error object
          console.log(err);
          this.isSigningIn = false;
        },
      });
    },
  },
};
</script>

<style scoped>
</style>