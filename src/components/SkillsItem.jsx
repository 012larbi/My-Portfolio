import { techIcon } from '../config/technologies'

const isImageRef = (v) =>
    !!v && (/^https?:\/\//i.test(v) || v.startsWith('/') || v.startsWith('data:image/'))

const SkillsItem = ({ img, icon, title, level }) => {
    const src =
        img ||
        (isImageRef(icon) ? icon : techIcon(icon)) ||
        techIcon(title)

    return (
        <div className="skills-data">
            <div className="skills-blob">
                {src ? (
                    <img src={src} alt="" className="skills-img" />
                ) : (
                    <span
                        className="skills-img"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                        }}
                    >
                        {(title || '?').trim().slice(0, 2)}
                    </span>
                )}
            </div >
            <h3 className="skills-name">{title}</h3>
            <span className="skills-level">{level}</span>


        </div>
    )
}
export default SkillsItem
