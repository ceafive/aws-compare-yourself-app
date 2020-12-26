<template>
  <div>
    <div>
      <p class="text-2xl font-black mb-2">Get Started</p>
    </div>
    <div class="mb-2">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
        Name</label
      >
      <input
        id="name"
        class="appearance-none border-b-2 w-full py-1 pr-3 text-gray-700 leading-tight focus:outline-none"
        type="text"
        placeholder="John Doe"
        v-model="name"
      />
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
    <div class="mb-2">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
        Email</label
      >
      <input
        id="email"
        class="appearance-none border-b-2 w-full py-1 pr-3 text-gray-700 leading-tight focus:outline-none"
        type="text"
        placeholder="john.doe@mail.com"
        v-model="email"
      />
    </div>
    <div class="mb-2">
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
      <p
        v-if="password && password.length < 8"
        class="text-center text-xs text-red-500 font-black"
      >
        Password must be longer than 7 characters and must include numbers
      </p>
    </div>
    <div>
      <label for="password" class="block text-gray-700 text-sm font-bold mb-2"
        >Confirm Password</label
      >
      <div class="relative">
        <input
          id="confirm-password"
          class="appearance-none border-b-2 w-full py-1 pr-3 text-gray-700 mb-2 leading-tight focus:outline-none"
          :type="showPassword ? 'text' : 'password'"
          placeholder="********"
          v-model="confirmPassword"
        />
        <ion-icon
          @click="showPassword = !showPassword"
          :name="!showPassword ? 'eye-outline' : 'eye-off-outline'"
          class="absolute right-0 h-6 w-6 cursor-pointer"
        ></ion-icon>
      </div>
      <p
        v-if="confirmPassword && confirmPassword !== password"
        class="text-center text-xs text-red-500 font-black"
      >
        Confirm password must be equal to password entered above
      </p>
    </div>
    <p v-if="error.status" class="text-center text-sm text-red-500 font-black">
      {{ error.text }}
    </p>
    <div class="flex justify-end mb-2">
      <button
        :disabled="isButtonDisabled || isLoading"
        class="flex justify-center items-center w-12 h-12 text-white font-bold py-2 px-4 rounded-full focus:outline-none"
        :class="{
          'bg-blue-500 hover:bg-blue-700': !isButtonDisabled,
          'bg-gray-200': isButtonDisabled,
        }"
        @click="signup"
      >
        <ion-icon name="arrow-forward" size="large" />
      </button>
    </div>
    <div class="flex justify-center">
      <button
        class="flex justify-center items-center border border-blue-500 hover:text-white hover:bg-blue-500 text-blue-500 font-bold py-2 px-4 focus:outline-none"
        @click="showValidateCodeForm"
      >
        Confirm User
      </button>
    </div>
  </div>
</template>

<script>
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { userPool } from "../utils";

export default {
  name: "SignUp",
  props: {
    error: {
      type: Object,
    },
    isShowValidateCodeForm: {
      type: Boolean,
    },
  },
  data() {
    return {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      isLoading: false,
      user: {},
      showPassword: false,
    };
  },
  computed: {
    isButtonDisabled() {
      if (
        !this.name ||
        !this.username ||
        !this.email ||
        !this.password ||
        !this.confirmPassword ||
        this.password.length < 8 ||
        this.confirmPassword.length < 8
      )
        return true;
      else return false;
    },
  },
  methods: {
    showValidateCodeForm() {
      this.$emit("show-validate-form", !this.isShowValidateCodeForm);
    },
    signup() {
      if (!this.name || !this.email) {
        return this.$emit("set-error", {
          status: true,
          text: "No Name/Email entered",
        });
      }

      const attrList = [];

      const nameAttribute = {
        Name: "name",
        Value: this.name,
      };

      const emailAttribute = {
        Name: "email",
        Value: this.email,
      };

      attrList.push(new CognitoUserAttribute(nameAttribute));
      attrList.push(new CognitoUserAttribute(emailAttribute));
      userPool.signUp(
        this.username,
        this.password,
        attrList,
        null,
        (err, result) => {
          if (err) {
            console.log(err);
            return this.$emit("set-error", {
              status: true,
              text: err.message,
            });
          }
          var cognitoUser = result.user;
          this.user = cognitoUser;
          console.log("User name is " + cognitoUser.getUsername());
        }
      );
    },
  },
  destroyed() {
    this.$emit("show-validate-form", false);

    this.$emit("set-error", {
      status: false,
      text: "",
    });
  },
};
</script>

<style scoped></style>
