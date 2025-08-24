import { init } from '@sentinel/vue';
import './assets/main.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);
init({
  dsn: 'http://localhost:3000',
  app
});

app.use(createPinia());
app.use(router);

app.mount('#app');
