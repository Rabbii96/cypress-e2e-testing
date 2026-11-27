const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://the-internet.herokuapp.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 8000,
    retries: { runMode: 2, openMode: 0 },   // retry only in CI runs
    video: false,
    screenshotOnRunFailure: true,
    env: {
      apiUrl: 'https://dummyjson.com',
    },
  },
});
