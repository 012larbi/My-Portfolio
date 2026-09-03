import parse from 'html-react-parser'
import { ABOUT_DEFAULTS } from '../content/aboutDefaults'

const Stats = ({ items = ABOUT_DEFAULTS.stats }) => {
    return (
        <>
        {items.map(({no, title}, index)=>{
            return(
                <div className="stats-box" key={index}>
                    <h3 className="stats-no">{no}</h3>
                    <h3 className="stats-title">{parse(title || '')}</h3>
                </div>
            )
        })}
        </>
    )
}

export default Stats
