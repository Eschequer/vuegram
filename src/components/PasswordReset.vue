<template>
  <div class="modal">
    <div class="modal-content">
      <div @click="$emit('close')" class="close">close</div>
      <h3>Reset Password</h3>
      <div v-if="!showSuccess">
        <p>Enter your email to reset your password</p>
        <form @submit.prevent>
          <input
            v-model.trim="email"
            type="email"
            placeholder="you@email.com"
          />
        </form>
        <p class="error" v-if="errorMsg !== ''">{{ errorMsg }}</p>
        <button @click="resetPassword" class="button">Reset</button>
      </div>
      <p v-else>Success! Check your email for a reset link.</p>
    </div>
  </div>
</template>

<script>
import { auth } from "../../firebase";

export default {
  name: "PasswordReset",
  data() {
    return {
      email: "",
      showSuccess: false,
      errorMsg: ""
    };
  },
  methods: {
    async resetPassword() {
      this.errorMsg = "";

      try {
        await auth.sendPasswordResetEmail(this.email);
        this.showSuccess = true;
      } catch (error) {
        this.errorMsg = error;
      }
    }
  }
};
</script>

<style scoped></style>
