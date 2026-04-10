/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

// Translations provided by Vuetify
import { uk, en } from 'vuetify/locale'

import '../styles/layers.css'
import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'system',
  },
  locale: {
    locale: 'uk',
    fallback: 'en',
    messages: { uk, en },
  },
})
