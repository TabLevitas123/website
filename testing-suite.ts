import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';

// Mock server setup
const server = setupServer(
  rest.get('/api/endpoint', (req, res, ctx) => {
    return res(ctx.json({ data: 'mocked data' }));
  })  
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Example component test
describe('Component Tests', () => {
  test('renders component correctly', () => {
    render(<Component />);
    const element = screen.getByText(/expected text/i);
    expect(element).toBeInTheDocument();
  });

  test('handles user interactions', () => {
    render(<Component />);
    userEvent.click(screen.getByText('Click me')); 
    expect(screen.getByText('Button clicked')).toBeInTheDocument();
  });
});

// Example integration test
describe('Integration Tests', () => {
  test('fetches and displays data', async () => {
    render(<DataComponent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await screen.findByText('mocked data');
    expect(screen.getByText('mocked data')).toBeInTheDocument();
  });
});

// Example E2E test (with Cypress)
describe('E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('navigates through pages', () => {
    cy.findByText('Welcome').click();
    cy.url().should('include', '/welcome');
    
    cy.findByText('Platform').click();
    cy.url().should('include', '/platform');
  });

  it('submits the contact form', () => {
    cy.findByText('Contact').click();
    cy.url().should('include', '/contact');

    cy.findByLabelText('Name').type('John Doe');
    cy.findByLabelText('Email').type('john@example.com'); 
    cy.findByLabelText('Message').type('Test message');

    cy.findByText('Submit').click();
    
    cy.findByText(/Message sent/i).should('exist');
  });
});
