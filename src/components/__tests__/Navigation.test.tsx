import React from 'react';
import { render, screen } from '@testing-library/react';
import Navigation from '../Navigation';

describe('Navigation Component', () => {
  test('renders navigation links correctly', () => {
    render(<Navigation activeModule="welcome" setActiveModule={() => {}} />);
    
    // Check if navigation links are rendered
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Intake')).toBeInTheDocument();
    expect(screen.getByText('Predictions')).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Trust')).toBeInTheDocument();
    expect(screen.getByText('Portal')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
  });
});