<template>
  <div class="w-full max-w-sm">
    <div class="bg-white p-10 rounded-lg">
      <div v-if="loginMode">
        <SignIn @user-details="onSetUser" />
      </div>
      <div v-else>
        <SignUp
          @show-validate-form="showValidateCodeForm"
          :isShowValidateCodeForm="isShowValidateCodeForm"
        />
      </div>
    </div>
    <div class="mt-4">
      <ValidateCode :isShowValidateCodeForm="isShowValidateCodeForm" />
    </div>
  </div>
</template>


<script>
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ValidateCode from "./ValidateCode";
export default {
  name: "Auth",
  components: {
    SignIn,
    SignUp,
    ValidateCode,
  },
  data() {
    return {
      isShowValidateCodeForm: false,
    };
  },
  props: {
    loginMode: {
      type: Boolean,
      default: true,
    },
    onSetUser: {
      type: Function,
      required: true,
    },
  },
  methods: {
    showValidateCodeForm(value) {
      this.isShowValidateCodeForm = value;
    },
  },
};
</script>

<style scoped>
</style>