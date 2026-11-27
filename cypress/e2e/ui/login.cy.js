// Demo credentials are published on the-internet.herokuapp.com's login page.
describe('Login', () => {
  beforeEach(() => {
    cy.fixture('logins').as('logins');
  });

  it('valid user reaches the secure area and can log out', function () {
    const { username, password } = this.logins.valid;
    cy.loginUi(username, password);
    cy.location('pathname').should('eq', '/secure');
    cy.flashShouldContain('You logged into a secure area!');

    cy.contains('a', 'Logout').click();
    cy.location('pathname').should('eq', '/login');
    cy.flashShouldContain('You logged out of the secure area!');
  });

  it('secure page is not reachable without logging in', () => {
    cy.visit('/secure');
    cy.location('pathname').should('eq', '/login');
    cy.flashShouldContain('You must login to view the secure area!');
  });

  // Data-driven: one test per fixture row
  const invalid = require('../../fixtures/logins.json').invalid;
  invalid.forEach((row) => {
    it(`rejects ${row.case}`, () => {
      cy.loginUi(row.username, row.password);
      cy.location('pathname').should('eq', '/login');
      cy.flashShouldContain(row.message);
    });
  });
});
