const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
    specPattern: 'testing/**/*.cy.{js,ts}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
}); 