import { stats } from "../Data"
import parse from 'html-react-parser'
const Stats = () => {
    return (
        <>
        {stats.map(({no, title}, index)=>{
            return(
                <div className="stats-box" key={index}>
                    <h3 className="stats-no">{no}</h3>
                    <h3 className="stats-title">{parse(title)}</h3>
                </div>
            )
        })}
        </>
    )
}

export default Stats
