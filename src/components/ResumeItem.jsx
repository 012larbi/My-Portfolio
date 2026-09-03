import React from 'react'
import parse from 'html-react-parser'
import { RiBriefcase4Fill, RiGraduationCapFill } from 'react-icons/ri'

const ICONS = { graduation: RiGraduationCapFill, briefcase: RiBriefcase4Fill }

const ResumeItem = ({ icon, iconName, year, title, desc }) => {
    const Ico = ICONS[iconName] || RiGraduationCapFill
    return (
        <div className="resume-item">
            <div className="resume-icon">{icon || <Ico />}</div>

            <span className="resume-date">{ year} </span>

            <h3 className="resume-subtitle">{parse(title || '')} </h3>

            <p className="resume-description"> {desc} </p>
        </div>
    )
}

export default ResumeItem
