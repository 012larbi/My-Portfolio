// ===============================================================
//  PROJECT FILTER  — vertical sidebar (desktop) / chip row (mobile)
// ===============================================================
//  Presentational only. The list of options is built in Portfolio.jsx
//  from the central categories config + the live projects, so adding
//  a category or a project wires itself up automatically.
// ===============================================================
import './projectFilter.css';

export default function ProjectFilter({ options, active, onChange }) {
  return (
    <aside className="pf" aria-label="Filter projects by category">
      <p className="pf__heading">Filter</p>
      <ul className="pf__list">
        {options.map((opt) => {
          const isActive = opt.id === active;
          return (
            <li key={opt.id}>
              <button
                type="button"
                className={`pf__item ${isActive ? 'pf__item--active' : ''}`}
                aria-pressed={isActive}
                onClick={() => onChange(opt.id)}
              >
                <span className="pf__label">{opt.label}</span>
                <span className="pf__count">{opt.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
