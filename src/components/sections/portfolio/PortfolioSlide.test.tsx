// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { Navbar } from '../../layout/Navbar';
import { listenForPortfolioEvent, portfolioEvents } from '../../../utils/portfolioEvents';
import { PortfolioSlide } from './PortfolioSlide';

afterEach(cleanup);

describe('portfolio structure and navigation', () => {
  it('makes inactive desktop slides unavailable to assistive and keyboard navigation', () => {
    const { container } = render(
      <PortfolioSlide id="about" index={1} activeIndex={0} deckEnabled>
        <button>Hidden action</button>
      </PortfolioSlide>,
    );
    const section = container.querySelector('section');
    expect(section?.getAttribute('aria-hidden')).toBe('true');
    expect(section?.hasAttribute('inert')).toBe(true);
  });

  it('keeps native mobile sections available', () => {
    const { container } = render(
      <PortfolioSlide id="about" index={1} activeIndex={0} deckEnabled={false}>
        <p>About content</p>
      </PortfolioSlide>,
    );
    const section = container.querySelector('section');
    expect(section?.getAttribute('aria-hidden')).toBe('false');
    expect(section?.hasAttribute('inert')).toBe(false);
  });

  it('emits the typed section request when a navigation link is clicked', () => {
    let requestedIndex = -1;
    const removeListener = listenForPortfolioEvent(
      portfolioEvents.navigate,
      (index) => { requestedIndex = index; },
    );
    render(<Navbar />);
    fireEvent.click(screen.getByRole('link', { name: 'About' }));
    removeListener();
    expect(requestedIndex).toBe(1);
  });

  it('has no automatically detectable accessibility violations in the main navigation', async () => {
    const { container } = render(<Navbar />);
    const result = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(result.violations).toEqual([]);
  });
});
