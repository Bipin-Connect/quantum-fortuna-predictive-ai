import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';

// Mock the child components to simplify testing
jest.mock('../Navigation', () => {
  return function MockNavigation({ activeModule, setActiveModule }) {
    return <div data-testid="navigation-mock">Navigation Component</div>;
  };
});

jest.mock('../WelcomeModule', () => {
  return function MockWelcomeModule() {
    return <div data-testid="welcome-mock">Welcome Module</div>;
  };
});

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    
    // Check if the navigation component is rendered
    expect(screen.getByTestId('navigation-mock')).toBeInTheDocument();
    
    // Check if the welcome module is rendered by default
    expect(screen.getByTestId('welcome-mock')).toBeInTheDocument();
  });
});