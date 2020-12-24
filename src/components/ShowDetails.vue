<template>
  <div class="w-2/3">
    <p class="font-black text-3xl text-center">Controls</p>
    <div class="flex justify-between items-center mb-5">
      <button
        class="bg-green-500 hover:bg-green-700 px-4 py-1 text-white font-bold focus:outline-none"
      >
        Set Data
      </button>
      <button
        class="bg-red-500 hover:bg-red-700 px-4 py-1 text-white font-bold focus:outline-none"
        @click="onDeleteData"
      >
        Clear Data on Server
      </button>
      <button
        :disabled="isFetchingUserData"
        class="px-4 py-1 text-white font-bold focus:outline-none"
        :class="{
          'bg-blue-500 hover:bg-blue-700': !isFetchingUserData,
          'bg-gray-200': isFetchingUserData,
        }"
        @click="onGetAllData"
      >
        Get Results
      </button>
    </div>

    <div v-if="currentUserData.length > 0">
      <p class="font-black text-4xl text-center">Your Results</p>
      <table class="table-auto">
        <thead>
          <tr>
            <th class="w-1/2 px-4 py-2">{{ h1 }}</th>
            <th class="w-1/4 px-4 py-2">{{ h2 }}</th>
            <th class="w-1/4 px-4 py-2">{{ h3 }}</th>
            <th class="w-1/4 px-4 py-2">{{ h4 }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, key) in currentUserData" :key="key">
            <td class="border px-4 py-2">{{ data.name }}</td>
            <td class="border px-4 py-2">{{ data.age }}</td>
            <td class="border px-4 py-2">{{ data.height }}</td>
            <td class="border px-4 py-2">{{ data.income }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showAllData && usersData.length > 0">
      <p class="font-black text-4xl text-center mt-5">All Results</p>
      <table class="table-auto">
        <thead>
          <tr>
            <th class="w-1/2 px-4 py-2">{{ h1 }}</th>
            <th class="w-1/4 px-4 py-2">{{ h2 }}</th>
            <th class="w-1/4 px-4 py-2">{{ h3 }}</th>
            <th class="w-1/4 px-4 py-2">{{ h4 }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            :class="{ 'bg-gray-100': key !== 0 && key % 2 !== 0 }"
            v-for="(data, key) in usersData"
            :key="key"
          >
            <td class="border px-4 py-2">{{ data.name }}</td>
            <td class="border px-4 py-2">{{ data.age }}</td>
            <td class="border px-4 py-2">{{ data.height }}</td>
            <td class="border px-4 py-2">{{ data.income }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import axios from "../utils/axios";
import { userPool } from "../utils";

export default {
  name: "ShowDetails",
  props: {
    usersData: {
      type: Array,
    },
    currentUser: {
      type: Object,
    },
  },
  data() {
    return {
      h1: this.data && this.data.length === 1 ? "Your Name" : "Name",
      h2: this.data && this.data.length === 1 ? "Your Age" : "Age",
      h3: this.data && this.data.length === 1 ? "Your Height" : "Height",
      h4: this.data && this.data.length === 1 ? "Your Income" : "Income",
      isFetchingUserData: false,
      showAllData: false,
    };
  },

  computed: {
    currentUserData() {
      const { name } = this.getUserName();

      const found = this.usersData.filter((user) => user.name === name);
      return found;
    },
  },
  methods: {
    getUserName() {
      const user = userPool.getCurrentUser();
      let name = " ";

      user.getSession(function (err) {
        if (err) return;
        user.getUserData((err) => {
          if (err) return;
          const found = user.UserAttributes.find(
            (userData) => userData.Name === "name"
          );
          name = found.Value;
        });
      });

      return { name };
    },
    async onGetAllData() {
      this.isFetchingUserData = true;

      const user = this.currentUser;
      if (!user) return false;

      const queryParam = `?accessToken=${user.accessToken}`;
      try {
        const res = await axios({
          url: `/compare-yourself/all${queryParam}`,
          method: "get",
          headers: {
            Authorization: user.idToken,
          },
        });
        const data = await res.data;
        this.$emit("users-data", data);

        this.isFetchingUserData = false;
        this.showAllData = true;
      } catch (error) {
        this.isFetchingUserData = false;
        this.showAllData = false;
        console.log(error);
      }
    },
    async onDeleteData() {
      this.isFetchingUserData = true;

      const user = this.currentUser;
      if (!user) return false;

      const queryParam = `?accessToken=${user.accessToken}`;
      try {
        const res = await axios({
          url: `/compare-yourself${queryParam}`,
          method: "delete",
          headers: {
            Authorization: user.idToken,
          },
        });
        const data = await res.data;
        this.$emit("users-data", data);

        this.isFetchingUserData = false;
      } catch (error) {
        this.isFetchingUserData = false;
        console.log(error);
      }
    },
  },
  destroyed() {
    this.isFetchingUserData = false;
    this.showAllData = false;
  },
};
</script>

<style scoped>
</style>