<template>
  <div class="w-full max-w-sm">
    <div class="bg-white p-10 rounded-lg">
      <div>
        <p class="text-2xl font-black mb-6">Set Your Data</p>
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="age">
          Age</label
        >
        <input
          id="age"
          class="appearance-none border-b-2 w-full py-1 pr-3 text-gray-700 leading-tight focus:outline-none"
          type="text"
          placeholder="28"
          v-model="age"
        />
      </div>
      <div>
        <label for="height" class="block text-gray-700 text-sm font-bold mb-2"
          >Height</label
        >
        <input
          id="height"
          class="appearance-none border-b-2 w-full py-1 pr-3 text-gray-700 mb-3 leading-tight focus:outline-none"
          type="text"
          placeholder="171"
          v-model="height"
        />
      </div>
      <div>
        <label for="income" class="block text-gray-700 text-sm font-bold mb-2"
          >Income</label
        >
        <input
          id="income"
          class="appearance-none border-b-2 w-full py-1 pr-3 text-gray-700 mb-3 leading-tight focus:outline-none"
          type="text"
          placeholder="10000"
          v-model="income"
        />
      </div>
      <div class="flex justify-end">
        <button
          :disabled="isButtonDisabled || isFetchingUserData"
          class="flex justify-center items-center w-12 h-12 text-white font-bold py-2 px-4 rounded-full focus:outline-none"
          :class="{
            'bg-blue-500 hover:bg-blue-700':
              !isButtonDisabled || !isFetchingUserData,
            'bg-gray-200': isButtonDisabled || isFetchingUserData,
          }"
          @click="onStoreData"
        >
          <ion-icon name="arrow-forward" size="large" />
        </button>
      </div>
      <div class="flex justify-center">
        <button
          :disabled="isFetchingUserData"
          class="flex justify-center items-center text-white font-bold py-2 px-4 mt-5 focus:outline-none"
          :class="{
            'bg-blue-500 hover:bg-blue-700': !isFetchingUserData,
            'bg-gray-200': isFetchingUserData,
          }"
          @click="onGetUserData"
        >
          I already stored data on the server
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import { userPool } from "../utils";
import axios from "../utils/axios";

export default {
  name: "Main",
  props: {
    currentUser: {
      type: Object,
    },
  },
  data() {
    return {
      details: {},
      age: "",
      height: "",
      income: "",
      isFetchingUserData: false,
    };
  },
  computed: {
    isButtonDisabled() {
      if (!this.age || !this.height || !this.income) return true;
      else return false;
    },
  },
  methods: {
    getUserName() {
      const user = userPool.getCurrentUser();
      let name = "";

      user.getSession(function (err, session) {
        user.getUserData((err, user) => {
          const found = user.UserAttributes.find(
            (userData) => userData.Name === "name"
          );
          name = found.Value;
        });
      });

      return { name };
    },
    async onStoreData() {
      this.isFetchingUserData = true;
      const { name } = this.getUserName();
      const user = this.currentUser;
      if (!name || !user) return false;

      try {
        const res = await axios({
          url: "/compare-yourself",
          method: "post",
          headers: {
            Authorization: user.idToken,
          },
          data: {
            name,
            age: +this.age,
            height: +this.height,
            income: +this.income,
          },
        });
        const data = await res.data;
        this.$emit("users-data", data);
        this.isFetchingUserData = false;
        this.age = "";
        this.height = "";
        this.income = "";
      } catch (error) {
        console.log(error);
        this.isFetchingUserData = false;
      }
    },
    async onGetUserData() {
      this.isFetchingUserData = true;
      const user = this.currentUser;
      if (!user) return false;

      const queryParam = `?accessToken=${user.accessToken}`;
      try {
        const res = await axios({
          url: `/compare-yourself/single${queryParam}`,
          method: "get",
          headers: {
            Authorization: user.idToken,
          },
        });
        const data = await res.data;
        this.$emit("users-data", data);
        this.isFetchingUserData = false;
      } catch (error) {
        console.log(error);
        this.$emit("users-data", []);
      }
    },
  },
};
</script>

<style scoped>
</style>