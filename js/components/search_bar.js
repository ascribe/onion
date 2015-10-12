'use strict';

import React from 'react/addons';

import Input from 'react-bootstrap/lib/Input';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { getLangText } from '../utils/lang_utils';


const { func, string, number } = React.PropTypes;
const { update } = React.addons;

const SearchBar = React.createClass({
    propTypes: {
        searchFor: func.isRequired,
        searchQuery: string.isRequired,

        className: string,

        // in milliseconds
        threshold: number.isRequired
    },

    getInitialState() {
        return {
            timers: [],
            searchQuery: '',
            searching: false
        };
    },

    componentDidUpdate(prevProps) {
        const searchQueryProps = this.props.searchQuery;
        const searchQueryPrevProps = prevProps.searchQuery;
        const searchQueryState = this.state.searchQuery;
        const { searching } = this.state;

        if(searching && (searchQueryProps && searchQueryState && searchQueryProps === searchQueryState || !searchQueryPrevProps && searchQueryProps === searchQueryState)) {
            this.setState({ searching: false });
        }
    },

    startTimers(searchQuery) {
        const { timers } = this.state;
        const { threshold } = this.props;
        const timer = {
            searchQuery,
            cb: setTimeout(this.evaluateTimer(timers.length, searchQuery), threshold)
        };

        const newTimers = update(timers, {$push: [timer]});
        this.setState({ timers: newTimers });
    },

    evaluateTimer(timerIndex, searchQuery) {
        return () => {
            const { timers } = this.state;

            if(timers.length <= timerIndex + 1) {
                // clean the timers array
                this.setState({ timers: [], searching: true }, () => {
                    // search for the query
                    this.props.searchFor(searchQuery);
                });
            }
        };
    },

    handleChange({ target: { value }}) {
        this.startTimers(value);
        this.setState({ searchQuery: value });
    },

    render() {
        let searchIcon = <Glyphicon glyph='search' className="filter-glyph"/>;
        const { className } = this.props;
        const { searching } = this.state;

        if(searching) {
            searchIcon = <span className="glyph-ascribe-spool-chunked ascribe-color spin"/>;
        }

        return (
            <span className={className}>
                <Input
                    type='text'
                    placeholder={getLangText('Search%s', '...')}
                    onChange={this.handleChange}
                    addonAfter={searchIcon} />
            </span>
        );
    }
});


export default SearchBar;