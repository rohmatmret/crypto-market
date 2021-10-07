import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Crypto App', () => {
  render(<App />);
  const linkElement = screen.getByText(/Market Crypto/i);
  expect(linkElement).toBeInTheDocument();
});
