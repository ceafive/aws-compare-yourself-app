<template>
  <div v-if="isShowValidateCodeForm" class="bg-white px-10 py-5 rounded-lg">
    <div class="my-6">
      <label
        class="block text-gray-700 text-sm font-bold mb-2"
        for="validate-username"
      >
        Username</label
      >
      <input
        id="validate-username"
        class="appearance-none border-b-2 w-full py-1 pr-3 text-gray-700 leading-tight focus:outline-none"
        type="text"
        placeholder="johndoe"
        v-model="username"
      />
    </div>
    <div>
      <label
        for="validate-code"
        class="block text-gray-700 text-sm font-bold mb-2"
        >Validation Code</label
      >
      <input
        id="validate-code"
        class="appearance-none border-b-2 w-full py-1 pr-3 text-gray-700 mb-3 leading-tight focus:outline-none"
        type="password"
        placeholder="********"
        v-model="validateCode"
      />
    </div>
    <p v-if="error.status" class="text-center text-sm text-red-500 font-black">
      {{ error.text }}
    </p>
    <div class="flex justify-end">
      <button
        :disabled="isButtonDisabled"
        class="flex justify-center items-center w-12 h-12 text-white font-bold py-2 px-4 rounded-full focus:outline-none"
        :class="{
          'bg-blue-500 hover:bg-blue-700': !isButtonDisabled,
          'bg-gray-200': isButtonDisabled,
        }"
        @click="confirmUser"
      >
        <ion-icon name="arrow-forward" size="large" />
      </button>
    </div>
  </div>
</template>


<script>
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../utils";

export default {
  name: "ValidateCode",
  data() {
    return {
      username: "",
      validateCode: "",
      error: {
        status: false,
        text: "",
      },
    };
  },
  props: {
    isShowValidateCodeForm: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isButtonDisabled() {
      if (!this.username || !this.validateCode) return true;
      else return false;
    },
  },
  methods: {
    confirmUser() {
      const userData = {
        Username: this.username,
        Pool: userPool,
      };
      const cognitoUser = new CognitoUser(userData);

      cognitoUser.confirmRegistration(
        this.validateCode,
        true,
        (err, result) => {
          if (err) {
            console.log({ err });
            return (this.error = {
              status: true,
              text: "User Sign Up Error occurred",
            });
          }

          this.$emit("auth-success", true);
          console.log({ result });
        }
      );
    },
  },
};
</script>

<style scoped>
</style>