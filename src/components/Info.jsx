import { personalInfo } from "../Data";


const Info = () => {
    return (
        <>
            {personalInfo.map((item, index) => (
                <li className="info-item" key={index}>
                    <span className="info-title">{item.title}</span>

                    <span className="info-description">
                        {item.link ? (
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {item.icon}
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
