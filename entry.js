import React from 'react';
import ReactDOM from 'react-dom';
import {withState, lifecycle, withHandlers, compose} from 'recompose';
import R from 'ramda';
// import {Panel, ListGroup, ListGroupItem} from 'react-bootstrap';

const state = compose(
	withState('tribeArr', 'setTribeArr', []),
	withState('filters', 'setFilters', {always: R.always(true)})
);

const handlers = withHandlers({
	setFilter: props => type => e => {
		const val = e.target.value;
		console.log({val});
		if (val){
			props.setFilters(R.assoc(type, R.propEq(type, e.target.value)))
		} else {
			props.setFilters(R.dissoc(type))
		}
	}
});

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

const Home = ({tribeArr, filters, setFilter}) => {
	const filteredTribes = R.values(filters).reduce((arr, pred) => arr.filter(pred), tribeArr);
	const locationArr = R.uniq(tribeArr.map(R.prop('area'))).filter(R.identity);
	const dayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Varies'];
	const timeArr = ['Evening', 'Morning', 'Varies'];
	return tribeArr.length == 0 ? <h1>Loading...</h1> : (
		<div className="container">
		<div>
			<select onChange={setFilter('area')} className="custom-select">
				<option value="">All Locations</option>
				{ locationArr.map(e => <option key={e} value={e}>{e}</option>) }
			</select>
			<select onChange={setFilter('meeting_day')} className="custom-select">
				<option value="">All Days</option>
				{ dayArr.map(e => <option key={e} value={e}>{e}</option>) }
			</select>
			<select onChange={setFilter('meeting_time')} className="custom-select">
				<option value="">All Times</option>
				{ timeArr.map(e => <option key={e} value={e}>{e}</option>) }
			</select>

		</div>
		<div className="card-columns" style={{marginTop: '2rem'}}>
			{
				filteredTribes.map(e => (
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

const enhance = compose(state, handlers, cycle);



const App = enhance(Home);
ReactDOM.render(<App />, document.getElementById('react-render-target'));