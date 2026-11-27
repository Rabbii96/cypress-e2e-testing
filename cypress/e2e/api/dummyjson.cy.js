// API tests with cy.request against DummyJSON (public fake REST API).
import { API_URL } from '../../support/urls';

const api = () => API_URL;

describe('Auth API', () => {
  it('login returns a token that unlocks /auth/me', () => {
    cy.apiToken().then((token) => {
      expect(token).to.be.a('string').and.have.length.greaterThan(20);
      cy.request({ url: `${api()}/auth/me`, headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.include({ username: 'emilys' });
      });
    });
  });

  // Found while writing this suite: the profile endpoint returns the user's password.
  // This characterization test documents the bug; when the API is fixed it fails, telling us to flip it.
  it('KNOWN BUG: /auth/me returns the password field', () => {
    cy.apiToken().then((token) => {
      cy.request({ url: `${api()}/auth/me`, headers: { Authorization: `Bearer ${token}` } })
        .its('body')
        .should('have.property', 'password');
    });
  });

  it('rejects a bad password with 400 and a message', () => {
    cy.request({
      method: 'POST',
      url: `${api()}/auth/login`,
      body: { username: 'emilys', password: 'wrong' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.match(/invalid credentials/i);
    });
  });

  it('protected endpoint refuses requests without a token', () => {
    cy.request({ url: `${api()}/auth/me`, failOnStatusCode: false }).its('status').should('eq', 401);
  });
});

describe('Products API', () => {
  it('pagination returns the requested window', () => {
    cy.request(`${api()}/products?limit=10&skip=20&select=title,price`).then(({ body }) => {
      expect(body.products).to.have.length(10);
      expect(body.skip).to.eq(20);
      expect(body.products[0].id).to.eq(21);
      body.products.forEach((p) => {
        expect(p).to.have.all.keys('id', 'title', 'price');
        expect(p.price).to.be.a('number').and.be.greaterThan(0);
      });
    });
  });

  it('search only returns matching products', () => {
    cy.request(`${api()}/products/search?q=phone`).then(({ body }) => {
      expect(body.total).to.be.greaterThan(0);
      body.products.forEach((p) => {
        const text = `${p.title} ${p.description} ${p.category}`.toLowerCase();
        expect(text).to.include('phone');
      });
    });
  });

  it('sorting by price ascending is really sorted', () => {
    cy.request(`${api()}/products?sortBy=price&order=asc&limit=30&select=price`).then(({ body }) => {
      const prices = body.products.map((p) => p.price);
      expect(prices).to.deep.eq([...prices].sort((a, b) => a - b));
    });
  });

  it('creating a product echoes the payload with a new id', () => {
    const payload = { title: 'Cypress test jar', price: 5.5 };
    cy.request('POST', `${api()}/products/add`, payload).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.include(payload);
      expect(res.body.id).to.be.a('number');
    });
  });

  it('unknown product returns 404', () => {
    cy.request({ url: `${api()}/products/999999`, failOnStatusCode: false }).its('status').should('eq', 404);
  });
});
