import { API_URL } from './urls';

// Custom commands keep specs readable: tests say WHAT they do, commands hold HOW.

Cypress.Commands.add('loginUi', (username, password) => {
  cy.visit('/login');
  if (username) cy.get('#username').type(username);
  if (password) cy.get('#password').type(password, { log: false }); // keep passwords out of the command log
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('flashShouldContain', (text) => {
  cy.get('#flash').should('be.visible').and('contain.text', text);
});

/** Logs in through the API once per spec and returns the access token. */
Cypress.Commands.add('apiToken', () => {
  return cy.fixture('api-user').then((user) =>
    cy
      .request('POST', `${API_URL}/auth/login`, { ...user, expiresInMins: 5 })
      .its('body.accessToken'),
  );
});
