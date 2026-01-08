import React from 'react'
import { portfolio } from '../../Data'
import { RiLink } from "react-icons/ri";
import './portfolio.css'

const Portfolio = () => {
  return (
    <section className="portfolio section">
      <h2 className="section-title">
        My <span>Portfolio</span>
      </h2>

      <div className="portfolio-container container grid">
        {portfolio.map(({ id, img, title, description, skills, link, category = "Project" }) => {
          return (
            <article className='portfolio-card' key={id}>
              <div className="portfolio-category">{category}</div>
              
              <a href={link} className="portfolio-img-wrapper">
                <img src={img} alt={title} className="portfolio-img" />
                <div className="portfolio-img-overlay"></div>
              </a>

              <div className="portfolio-content">
                <h3 className="portfolio-title">{title}</h3>
                <p className="portfolio-description">{description}</p>
              </div>

              <div className="portfolio-skills-section">
                <div className="portfolio-skills-title">Technologies Used</div>
                <div className="portfolio-skills">
                  {skills.map((skill, index) => (
                    <img src={skill} alt="" className="portfolio-skill" key={index} />
                  ))}
                </div>
              </div>

              <div className="portfolio-footer">
                <a href={link} className="portfolio-link" target="_blank" rel="noopener noreferrer">
                  <RiLink className='link-icon' />
                  View Project
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Portfolio