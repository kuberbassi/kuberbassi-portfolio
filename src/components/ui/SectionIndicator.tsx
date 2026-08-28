import './SectionIndicator.css';

interface Section {
  id: string;
  label: string;
}

interface Props {
  sections: readonly Section[];
  activeIndex?: number;
  onSelectSection?: (index: number) => void;
}

export function SectionIndicator({ sections, activeIndex = 0, onSelectSection }: Props) {
  const handleClick = (id: string, index: number) => {
    if (onSelectSection) {
      onSelectSection(index);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <nav className="section-indicator" aria-label="Section navigation">
      <div className="section-indicator__track">
        {sections.map((section, i) => (
          <button
            key={section.id}
            className={`section-indicator__item ${i === activeIndex ? 'is-active' : ''}`}
            onClick={() => handleClick(section.id, i)}
            aria-label={`Go to ${section.label}`}
            aria-current={i === activeIndex ? 'page' : undefined}
          >
            <span className="section-indicator__dash" />
            <span className="section-indicator__label">{section.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
