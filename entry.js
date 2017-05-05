import React from 'react';
import ReactDOM from 'react-dom';
import {withState, lifecycle, compose} from 'recompose';
import R from 'ramda';
// import {Panel, ListGroup, ListGroupItem} from 'react-bootstrap';

const state = compose(
	withState('tribeArr', 'setTribeArr', [])
);

const cycle = lifecycle({
	componentDidMount: function(){
		fetch('https://script.google.com/macros/s/AKfycbyVPGx-25gAtkFBJV5GrrA1JFLcj0kOW81QJPJzV98Fkdy9Kgo/exec')
		.then(res => res.json())
		.then(arr => {
			console.table(arr);
			this.props.setTribeArr(arr)
		});
	}
});

const Home = ({tribeArr}) => {
	return (
		<div className="container">
		<div className="card-columns">
			{
				tribeArr.map(e => (
					<div key={e.id} className="card" style={{width: '20rem'}}>
					  <div className="card-block">
					    <h4 className="card-title">{e.name}</h4>
					    <p className="card-text">{e.description}</p>
					  </div>
					  <ul className="list-group list-group-flush">
					      <li className="list-group-item">Meeting Time: {e.meeting_day}&nbsp;{e.meeting_time}</li>
					      <li className="list-group-item">Location: {e.area}</li>
					      <li className="list-group-item">Remaining Spots: {R.is(Number, e.group_capacity) ? e.group_capacity - e.current_members : e.group_capacity}</li>
					   </ul>
					   <div className="card-block">
					   	<a href={`https://mountainbrook.ccbchurch.com/easy_email.php?source=w_group_list&ax=create_new&individual_id=${e.leaderId}&group_id=${e.id}&individual_full_name=${encodeURIComponent(e.leaderName)}`} target="_blank" className="btn btn-primary">Email {e.leaderName}</a>
					   </div>		   
					</div>
				))
			}
		</div>
		</div>
	);
}

const enhance = compose(state, cycle);



const App = enhance(Home);
ReactDOM.render(<App />, document.getElementById('react-render-target'));