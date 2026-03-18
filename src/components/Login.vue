<script setup lang="ts">
import { ref } from 'vue'
import { apiClient } from '../api'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const handleSignIn = async () => {
  error.value = null
  loading.value = true

  try {
    const response = await apiClient.login({
      email: email.value,
      password: password.value,
    })

    // Store token in localStorage
    localStorage.setItem('token', response.access_token)
    localStorage.setItem('user', JSON.stringify(response.user))

    // Optional: Store remember me preference
    if (rememberMe.value) {
      localStorage.setItem('rememberEmail', email.value)
    }

    // Redirect to dashboard or home
    alert(`Welcome ${response.user.name}! Login successful.`)
  } catch (err) {
    error.value = 'Login failed. Please check your credentials and try again.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="login-page">
    <div class="split-panel left-panel">
      
      <div class="logo-area">
        <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#65288b" stroke-width="4" />
          <path d="M50 20 L40 50 L50 80 L60 50 Z" fill="#f59e0b" />
          <path d="M50 40 L30 40 L40 60 Z" fill="#65288b" />
        </svg>
        <span class="logo-text">Team Achieve</span>
      </div>

      <div class="image-area">
        <img 
          src="https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Happy Team Members" 
          class="hero-image"
        />
      </div>

      <div class="text-area">
        <h2>Team Achieve</h2>
        <p>Your perfect solution for funding your desires</p>
      </div>
      
    </div>
    
    <div class="split-panel right-panel">
      <div class="form-container">
        <h1 class="welcome-title">Welcome Back</h1>
        <p class="welcome-subtitle">Enter your email address and password to access your account.</p>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <form @submit.prevent="handleSignIn" class="login-form">
          <div class="input-group">
            <label for="email">Email Address <span class="required">*</span></label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="Enter your email" 
              required 
            />
          </div>

          <div class="input-group">
            <label for="password">Password <span class="required">*</span></label>
            <div class="password-input-wrapper">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password" 
                placeholder="Enter your password" 
                required 
              />
              <button type="button" class="toggle-password" @click="togglePassword">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
              </button>
            </div>
          </div>

          <div class="form-actions">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              Remember me
            </label>
            <a href="#" class="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" class="sign-in-btn" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="signup-prompt">
          Don't have an account? <a href="#" class="signup-link">Sign up</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Inter:wght@400;500;600&display=swap');

* {
  box-sizing: border-box;
}

.login-page {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Inter', sans-serif;
  color: #333;
}

.left-panel {
  flex: 1;
  background-color: #f6eefe; /* light purple */
  display: flex;
  flex-direction: column;
  padding: 40px;
  max-width: 48%;
  border-radius: 30px;
  margin: 20px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: auto;
}

.logo {
  width: 40px;
  height: 40px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #8c8c8c;
}

.image-area {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin: 30px 0;
}

.hero-image {
  max-width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 20px;
}

.text-area {
  text-align: center;
}

.text-area h2 {
  font-family: 'Merriweather', serif;
  color: #65288b;
  font-size: 1.8rem;
  margin-bottom: 15px;
  font-weight: 700;
}

.text-area p {
  color: #555;
  font-size: 1.1rem;
  font-weight: 500;
}

.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 40px;
}

.form-container {
  width: 100%;
  max-width: 480px;
  padding: 20px;
}

.welcome-title {
  font-family: 'Merriweather', serif;
  color: #65288b;
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 10px;
  font-weight: 700;
}

.welcome-subtitle {
  text-align: center;
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 40px;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  border-left: 4px solid #c33;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.required {
  color: #ef4444; /* red */
}

input[type="email"],
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: 'Inter', sans-serif;
  background-color: #ffffff;
  color: #333333;
}

input[type="email"]:focus,
input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #65288b;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  cursor: pointer;
}

.remember-me input {
  cursor: pointer;
  accent-color: #65288b;
  width: 16px;
  height: 16px;
}

.forgot-password {
  color: #65288b;
  text-decoration: none;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.sign-in-btn {
  background-color: #65288b; /* matching deep purple */
  color: white;
  border: none;
  border-radius: 6px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;
}

.sign-in-btn:hover {
  background-color: #531c73;
}

.sign-in-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.signup-prompt {
  text-align: center;
  margin-top: 24px;
  font-size: 0.95rem;
  color: #555;
}

.signup-link {
  color: #65288b;
  text-decoration: none;
  font-weight: 600;
}

.signup-link:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .login-page {
    flex-direction: column;
  }
  
  .left-panel {
    max-width: 100%;
    border-radius: 0;
    border-bottom-left-radius: 40px;
    border-bottom-right-radius: 40px;
    padding: 30px 20px;
  }
}
</style>