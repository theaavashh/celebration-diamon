import { render, screen } from '@testing-library/react';
import type { PropsWithChildren, HTMLAttributes } from 'react';
import Loader from './loader';

// Mock framer-motion for testing
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
      <div {...props}>{children}</div>
    ),
    h1: ({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) => (
      <h1 {...props}>{children}</h1>
    ),
    p: ({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>) => (
      <p {...props}>{children}</p>
    ),
    span: ({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) => (
      <span {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: PropsWithChildren<object>) => <div>{children}</div>,
}));

describe('Loader Component', () => {
  it('renders without crashing', () => {
    render(<Loader />);
    // Since the loader starts with isLoading = true, it should be in the document
    expect(screen.getByText('Celebration Diamond')).toBeInTheDocument();
  });

  it('applies Jim Thompson font class to main text', () => {
    render(<Loader />);
    const mainText = screen.getByText('Celebration Diamond');
    expect(mainText).toHaveClass('jimthompson');
  });

  it('applies Jim Thompson font class to subtitle text', () => {
    render(<Loader />);
    const subtitleText = screen.getByText('Diamond ForEvery0ne');
    expect(subtitleText).toHaveClass('jimthompson');
  });

  it('renders enhanced spinner with animation', () => {
    render(<Loader />);
    // We can't easily test the animation, but we can check if the spinner container exists
    const spinnerContainer = screen.getByTestId('loader-spinner-container');
    expect(spinnerContainer).toBeInTheDocument();
  });
});
