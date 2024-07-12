import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('counter', () => {
  const mobileNo = ref('');

  function setMobileNo(data: any) {
    mobileNo.value = data;
  }

  return { mobileNo, setMobileNo };
});
