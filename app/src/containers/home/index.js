import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import _ from 'lodash';
import moment from 'moment';
import ReactTable from "react-table";
import FoldableHoc from './foldableHoc';
import Highlighter from "react-highlight-words";

import { fetchPosts, fetchCategories, fetchUsers } from '../../actions';

const Ftable = FoldableHoc(ReactTable);

const foldIconComponent = ({ collapsed }) => {
	if (collapsed)
		return <div className="fold-expand"></div>
	return <div className="fold-collapse"></div>
}

const foldButtonComponent = ({ header, collapsed, icon, onClick }) => {
	return (
		<div className={"rt-fold-button " + (collapsed ? "collapsed" : "open")}>
			<div className="rt-fold-icon" onClick={onClick}>
				<div>{icon}</div>
			</div>
			{!collapsed && <div>{header}</div>}
		</div>
	);
}

const foldedColumn = {
	Cell: c => '',
	width: 24,
	sortable: false,
	resizable: false,
	filterable: false,
}

const pageSizeOptions = [10, 20, 50, 100];

class Home extends React.Component {
	constructor () {
		super()
		this.state = {
			search: '',
			pageSize: 10,
			foldable: false,
			striped: true
		}
	}

	componentDidMount () {
		this.props.fetchPosts();
		this.props.fetchCategories();
		this.props.fetchUsers();
	}

	toggleFoldable = () => {
		this.setState({
			foldable: !this.state.foldable
		});
	}

	toggleStriped = () => {
		this.setState({
			striped: !this.state.striped
		});
	}

	onPageSizeChange = (value) => {
		console.log(this.state.pageSize);
		this.setState({
			pageSize: value
		});
	}

	sortSimpleLinks = (a, b, desc) => {
		// force null and undefined to the bottom
		a.text = a.text === null || a.text === undefined ? '' : a.text
		b.text = b.text === null || b.text === undefined ? '' : b.text

		// force any string values to lowercase
		let aText = typeof a.text === 'string' ? a.text.toLowerCase() : a.text
		let bText = typeof b.text === 'string' ? b.text.toLowerCase() : b.text
		
		// Return either 1 or -1 to indicate a sort priority
		if (aText > bText) {
			return 1
		}

		if (aText < bText) {
			return -1
		}
		// returning 0, undefined or any falsey value will use subsequent sorts or
		// the index as a tiebreaker
		return 0
	}

	sortDates = (a, b, desc) => {
		// force null and undefined to the bottom
		a.timestamp = a.timestamp === null || a.timestamp === undefined ? '' : a.timestamp
		b.timestamp = b.timestamp === null || b.timestamp === undefined ? '' : b.timestamp
		
		// Return either 1 or -1 to indicate a sort priority
		if (a.timestamp > b.timestamp) {
			return 1
		}

		if (a.timestamp < b.timestamp) {
			return -1
		}
		// returning 0, undefined or any falsey value will use subsequent sorts or
		// the index as a tiebreaker
		return 0
	}

	render () {
		const columns = [
			{
				Header: 'Title',
				accessor: 'title',
				foldable: true,
				Cell: e => <SimpleLink link={e.value.link} text={e.value.text} search={this.state.search} />,
				sortMethod: (a, b, desc) => this.sortSimpleLinks(a, b, desc)
			},
			{
				Header: 'Categories',
				accessor: 'categories',
				foldable: true,
				Cell: e => <GroupedLinks categories={e.value} search={this.state.search} />,
				sortMethod: (a, b, desc) => this.sortSimpleLinks(a, b, desc)
			},
			{
				Header: 'Author',
				accessor: 'author',
				foldable: true,
				Cell: e => <SimpleText text={e.value} search={this.state.search} />
			},
			{
				Header: 'Date',
				accessor: 'date',
				foldable: true,
				Cell: e => <SimpleText text={e.value.text} search={this.state.search} />,
				sortMethod: (a, b, desc) => this.sortDates(a, b, desc)
			}
		];

		let posts = this.props.posts;
		let categories = this.props.categories;
		let users = this.props.users;
		let data = [];

		posts.forEach(function(post) {
			let obj = {
				categories: {
					cats: [],
					text: ''
				},
				date: {
					text: '',
					timestamp: ''
				}
			};

			// Title
			obj.title = { text: post.title.rendered, link: post.link };

			// Categories
			post.categories.forEach(function(cat) {
				let i = _.findIndex(categories, function(o) { return o.id == cat });
				if ( i !== -1 ) {
					obj.categories.cats.push(categories[i]);
					if (obj.categories.text == '') {
						obj.categories.text += categories[i].name;
					}

					else {
						obj.categories.text += ', ' + categories[i].name;
					}
				}
			});

			// Author
			let j = _.findIndex(users, function(o) { return o.id == post.author });
			if ( j !== -1 ) {
				obj.author = users[j].name
			}

			// Date
			obj.date.text = moment(post.date).format('MMMM DD, YYYY');
			obj.date.timestamp = moment(post.date).format('X');

			data.push(obj);
		});

		if (this.state.search) {
			data = data.filter(row => {
				let cats = row.categories.cats.filter(cat => { return cat.name.includes(this.state.search) });
				return row.title.text.includes(this.state.search) || row.date.text.includes(this.state.search) || row.author.includes(this.state.search) || (cats !== undefined && cats.length != 0)
			});
		}

		return(
			<div className={"wppt" + (this.state.foldable ? " foldable" : " foldable-hidden") + (this.state.striped ? " striped" : " not-striped")}>
				<div className="wppt-header">
					<input className="wppt-search" placeholder="Search" value={this.state.search} onChange={e => this.setState({search: e.target.value})} />
					<div className="wppt-toolbar">
						<div className="wppt-page-size">
							Show <select onChange={e => this.onPageSizeChange(Number(e.target.value))} value={this.state.pageSize}>
								{pageSizeOptions.map((option, i) => (
									// eslint-disable-next-line react/no-array-index-key
								<option key={i} value={option}>
									{option}
								</option>
								))}
							</select> rows
						</div>
						<span className={"wppt-tool wppt-foldable-toggle" + (this.state.foldable ? " foldable" : " not-foldable")} onClick={this.toggleFoldable} title={(this.state.foldable ? "Hide" : "Show") + " column folding controls"}>F</span>
						<span className={"wppt-tool wppt-striped-toggle" + (this.state.striped ? " striped" : " not-striped")} onClick={this.toggleStriped} title={(this.state.striped ? "Turn off" : "Turn on") + " stripes"}>S</span>
					</div>
				</div>
				<Ftable FoldIconComponent={foldIconComponent} FoldButtonComponent={foldButtonComponent} FoldedColumn={foldedColumn} data={data} columns={columns} pageSize={this.state.pageSize} showPageJump={false} showPageSizeOptions={false} />
			</div>
		)
	}
}

class SimpleText extends React.Component {
	render () {
		return(
			<div>
				{
					this.props.search ? 
					<Highlighter highlightClassName="highlight" searchWords={[this.props.search]} autoEscape={true} textToHighlight={String(this.props.text)} /> :
					<span>{this.props.text}</span>
				}
			</div>
		)
	}
}

class SimpleLink extends React.Component {
	render () {
		return(
			<div>
				{
					this.props.search ? 
					<a href={this.props.link}><Highlighter highlightClassName="highlight" searchWords={[this.props.search]} autoEscape={true} textToHighlight={this.props.text} /></a> :
					<a href={this.props.link}>{this.props.text}</a>
				}
			</div>
		)
	}
}

class GroupedLinks extends React.Component {
	render () {
		return(
			<div>
				{
					// https://stackoverflow.com/questions/23618744/rendering-comma-separated-list-of-links
					this.props.categories.cats.map((o, i) => [
						i > 0 && ", ",
						this.props.search ? <a href={o.link}><Highlighter highlightClassName="highlight" searchWords={[this.props.search]} autoEscape={true} textToHighlight={o.name} /></a> : <a href={o.link}>{o.name}</a>
					])
				}
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		posts: state.posts.payload,
		categories: state.categories.payload,
		users: state.users.payload
	}
};

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			fetchPosts,
			fetchCategories,
			fetchUsers
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home);
