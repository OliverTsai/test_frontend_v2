<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="container">
        <h1 class="logo">{{ $t('welcome') }}</h1>
        <div class="language-switcher">
          <select v-model="$i18n.locale">
            <option value="zh-TW">{{ $t('chinese') }}</option>
            <option value="en-US">{{ $t('english') }}</option>
          </select>
        </div>
      </div>
    </header>
    
    <main class="app-main">
      <slot />
    </main>
    
    <footer class="app-footer">
      <div class="container">
        <p>© {{ $t('created_at') }} 2015-12-17</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

const formatDate = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.app-header {
  background-color: #4caf50;
  color: white;
  padding: 16px 0;
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
  }
  
  .language-switcher select {
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid white;
    background-color: transparent;
    color: white;
    
    option {
      background-color: white;
      color: #333;
    }
  }
}

.app-main {
  flex: 1;
  padding: 20px 0;
}

.app-footer {
  background-color: #f5f5f5;
  padding: 16px 0;
  text-align: center;
  color: #666;
}

/* RWD */
@media (max-width: 768px) {
  .app-header {
    padding: 12px 0;
    
    .logo {
      font-size: 18px;
    }
  }
}

@media (max-width: 320px) {
  .container {
    padding: 0 10px;
  }
  
  .app-header .logo {
    font-size: 16px;
  }
}
</style>