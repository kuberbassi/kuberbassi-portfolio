export const portfolioEvents = {
  navigate: 'kb:navigate',
  sectionChange: 'kb:sectionchange',
  transitionStart: 'kb:transitionstart',
  transitionEnd: 'kb:transitionend',
  cursorSuspend: 'kb:cursorsuspend',
} as const;

interface PortfolioEventDetails {
  [portfolioEvents.navigate]: number;
  [portfolioEvents.sectionChange]: number;
  [portfolioEvents.transitionStart]: undefined;
  [portfolioEvents.transitionEnd]: undefined;
  [portfolioEvents.cursorSuspend]: boolean;
}

type PortfolioEventName = keyof PortfolioEventDetails;

export function emitPortfolioEvent<Name extends PortfolioEventName>(
  name: Name,
  ...detail: PortfolioEventDetails[Name] extends undefined ? [] : [PortfolioEventDetails[Name]]
) {
  window.dispatchEvent(new CustomEvent(name, { detail: detail[0] }));
}

export function listenForPortfolioEvent<Name extends PortfolioEventName>(
  name: Name,
  listener: (detail: PortfolioEventDetails[Name]) => void,
) {
  const handleEvent = (event: Event) => {
    listener((event as CustomEvent<PortfolioEventDetails[Name]>).detail);
  };
  window.addEventListener(name, handleEvent);
  return () => window.removeEventListener(name, handleEvent);
}
