/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import i18n from '@/plugins/i18n'

// Components
import App from './App.vue'

// Styles
import 'unfonts.css'
import 'virtual:uno.css'
import 'leaflet/dist/leaflet.css'
import './styles/main.scss'

const app = createApp(App)

registerPlugins(app)

const params = new URLSearchParams(document.location.search);
i18n.global.locale.value = params.get('lang') ?? 'uk';

app.mount('#app')
