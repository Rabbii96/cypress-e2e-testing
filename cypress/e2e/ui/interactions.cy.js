describe('Common UI interactions', () => {
  it('waits for dynamically loaded content without fixed sleeps', () => {
    cy.visit('/dynamic_loading/2');
    cy.contains('button', 'Start').click();
    cy.get('#loading').should('be.visible');
    // Cypress retries the assertion until the element appears (up to the timeout) — no cy.wait(5000)
    cy.get('#finish', { timeout: 15000 }).should('have.text', 'Hello World!');
    cy.get('#loading').should('not.be.visible');
  });

  it('toggles checkboxes and verifies state', () => {
    cy.visit('/checkboxes');
    cy.get('#checkboxes input').as('boxes').should('have.length', 2);
    cy.get('@boxes').first().check().should('be.checked');
    cy.get('@boxes').last().uncheck().should('not.be.checked');
  });

  it('selects from a dropdown by text and by value', () => {
    cy.visit('/dropdown');
    cy.get('#dropdown').select('Option 2').should('have.value', '2');
    cy.get('#dropdown').select('1').find('option:selected').should('have.text', 'Option 1');
  });

  it('adds and removes elements', () => {
    cy.visit('/add_remove_elements/');
    cy.contains('button', 'Add Element').click().click().click();
    cy.get('#elements .added-manually').should('have.length', 3);
    cy.get('#elements .added-manually').first().click();
    cy.get('#elements .added-manually').should('have.length', 2);
  });

  it('handles JavaScript alerts and confirms', () => {
    cy.visit('/javascript_alerts');
    cy.on('window:confirm', (text) => {
      expect(text).to.eq('I am a JS Confirm');
      return false; // click "Cancel"
    });
    cy.contains('button', 'Click for JS Confirm').click();
    cy.get('#result').should('have.text', 'You clicked: Cancel');
  });

  it('detects broken images', () => {
    cy.visit('/broken_images');
    cy.get('.example img').then(($imgs) => {
      const broken = [...$imgs].filter((img) => img.naturalWidth === 0);
      // The demo page has broken images on purpose; the test reports how many
      expect(broken.length, 'broken images on the page').to.be.greaterThan(0);
    });
  });
});
