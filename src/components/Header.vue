<template>
  <div class="w-full py-2 px-4">
    <div class="flex justify-between items-center">
      <p class="font-black text-2xl">Compare Yourself</p>
      <div v-if="!currentUser" class="flex">
        <button
          class="py-1 px-2 focus:outline-none"
          @click="() => setLoginMode(true)"
        >
          Sign In
        </button>
        <button
          class="py-1 px-2 focus:outline-none"
          @click="() => setLoginMode(false)"
        >
          Sign Up
        </button>
      </div>
      <div v-else class="flex">
        <button class="py-1 px-2 focus:outline-none" @click='compare'>Compare</button>
        <button
          class="text-red-500 py-1 px-2 focus:outline-none"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentUser: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    setLoginMode(condition) {
      this.$emit("auth-mode", condition);
    },
    logout() {
      this.$emit("logout");
    },
    compare(){
      this.$emit('is-compare', true)
    }
  },
};
</script>

<style scoped>
</style>