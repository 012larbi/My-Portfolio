import { FaLinkedinIn } from "react-icons/fa";
import { ABOUT_DEFAULTS } from "../content/aboutDefaults";

const Info = ({ items = ABOUT_DEFAULTS.personalInfo }) => {
    return (
        <>
            {items.map((item, index) => (
                <li className="info-item" key={index}>
                    <span className="info-title">{item.title}</span>

                    <span className="info-description">
                        {item.link ? (
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaLinkedinIn className="nav-icon" />
                            </a>
                        ) : (
                            item.description
                        )}
                    </span>
                </li>
            ))}
        </>
    );
};

export default Info;
