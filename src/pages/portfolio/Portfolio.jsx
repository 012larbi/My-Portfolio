import React, { useMemo, useState } from 'react'
import { RiLink, RiGithubFill } from "react-icons/ri";
import { useProjects } from '../../projects/useProjects'
import { useCategories } from '../../categories/useCategories'
import { techIcon } from '../../config/technologies'
import { ALL_CATEGORY, categoryLabel } from '../../config/projectCategories'
import ProjectFilter from './ProjectFilter'
import './portfolio.css'

const Portfolio = () => {
  const { projects, loading, error } = useProjects()
  const { categories } = useCategories()
  const [active, setActive] = useState(ALL_CATEGORY.id)

  // Build filter options from the managed categories + any categories
  // that actually appear in the data, so nothing is ever hidden.
  const options = useMemo(() => {
    const present = new Set(projects.map((p) => p.category))
    const known = categories.filter((c) => present.has(c.id))
    const extras = [...present]
      .filter((id) => id && !categories.some((c) => c.id === id))
      .map((id) => ({ id, label: categoryLabel(id, categories) }))

    const cats = [...known, ...extras].map((c) => ({
      id: c.id,
      label: c.label,
      count: projects.filter((p) => p.category === c.id).length,
    }))

    return [
      { id: ALL_CATEGORY.id, label: ALL_CATEGORY.label, count: projects.length },
      ...cats,
    ]
  }, [projects, categories])

  const visible = useMemo(() => {
    if (active === ALL_CATEGORY.id) return projects
    return projects.filter((p) => p.category === active)
  }, [projects, active])

  return (
    <section className="portfolio section">
      <h2 className="section-title">
        My <span>Portfolio</span>
      </h2>

      <div className="portfolio-layout container">
        <ProjectFilter options={options} active={active} onChange={setActive} />

        <div className="portfolio-main">
          {error && (
            <p className="portfolio-state">
              Projects couldn&apos;t be loaded right now. Please try again later.
            </p>
          )}

          {loading && !error && (
            <p className="portfolio-state">Loading projects…</p>
          )}

          {!loading && !error && visible.length === 0 && (
            <p className="portfolio-state">No projects in this category yet.</p>
          )}

          {!loading && !error && visible.length > 0 && (
            <div className="portfolio-container" key={active}>
              {visible.map(({ id, image, title, description, technologies, githubUrl, liveUrl, category }, index) => (
                <article
                  className="portfolio-card"
                  key={id}
                  style={{ animationDelay: `${Math.min(index, 9) * 60}ms` }}
                >
                  <a
                    href={liveUrl || githubUrl || undefined}
                    className="portfolio-img-wrapper"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={image} alt={title} className="portfolio-img" loading="lazy" />
                    <span className="portfolio-category">{categoryLabel(category, categories)}</span>
                  </a>

                  <div className="portfolio-content">
                    <h3 className="portfolio-title">{title}</h3>
                    <p className="portfolio-description">{description}</p>

                    {technologies.length > 0 && (
                      <div className="portfolio-skills">
                        {technologies.map((tech) => {
                          const icon = techIcon(tech)
                          return icon ? (
                            <img
                              src={icon}
                              alt={tech}
                              title={tech}
                              className="portfolio-skill"
                              key={tech}
                            />
                          ) : (
                            <span className="portfolio-skill-tag" key={tech}>
                              {tech}
                            </span>
                          )
                        })}
                      </div>
                    )}

                    <div className="portfolio-links">
                      {liveUrl && (
                        <a
                          href={liveUrl}
                          className="portfolio-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <RiLink className="link-icon" />
                          Demo
                        </a>
                      )}
                      {githubUrl && (
                        <a
                          href={githubUrl}
                          className={`portfolio-link ${liveUrl ? 'portfolio-link--ghost' : ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <RiGithubFill className="link-icon" />
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Portfolio
