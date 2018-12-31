import React from 'react'
import Place from './Place'


const History = ({history, _open, toggle}) => {
  const seen = history.map((place, idx) => <Place key={`${place.id}~${idx}`} place={place}/>)
  return (
    <React.Fragment>
      <div className={`history_container ${_open ? "open" : ""}`}>
        <div className="history_container_inner">
          {
            seen.length > 1 ? seen : "You don't have any history yet."
          }
        </div>
        <div className="close-menu btn--ripple wh" onClick={() => toggle('history')}>x</div>
      </div>
    </React.Fragment>
  )
}

export default History
