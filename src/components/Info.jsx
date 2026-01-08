import { personalInfo } from "../Data"

const Info = () => {
    return (
        <>
            {personalInfo.map(({ title, description, skills }, index) => {
                return (
                    <li className="info-items" key={index}>
                        <span className="info-title"> {title}</span>
                        <span className="info-description"> {description}</span>

                    </li>
                )
            })}
        </>
    )
}

export default Info
