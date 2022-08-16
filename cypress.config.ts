import { defineConfig } from 'cypress'

export default defineConfig({
  env: {
    email: 'test@example.com',
    username: 'Joe Tester Doe',
    password: 'TestPassword1',
  },
  viewportWidth: 1024,
  viewportHeight: 1280,
  defaultCommandTimeout: 7500,
  pageLoadTimeout: 90000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
  },
})
