'use strict';

import React from 'react/addons';

import Input from 'react-bootstrap/lib/Input';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { getLangText } from '../utils/lang_utils';


const { func, string, number } = React.PropTypes;
const { update } = React.addons;

const SearchBar = React.createClass({
    propTypes: {
        // a function that accepts a string as a search query and updates the
        // propagated `searchQuery` after successfully retrieving the
        // request from the server
        searchFor: func.isRequired,
        searchQuery: string.isRequired,

        className: string,

        // the number of milliseconds the component
        // should wait before requesting search results from the server
        threshold: number.isRequired
    },

    getInitialState() {
        return {
            timers: [],
            searchQuery: '',
            loading: false
        };
    },

    componentDidUpdate(prevProps) {
        const searchQueryProps = this.props.searchQuery;
        const searchQueryPrevProps = prevProps.searchQuery;
        const searchQueryState = this.state.searchQuery;
        const { loading } = this.state;

        /**
         * 1. Condition:    `loading` must be true, which implies that `evaluateTimer`,
         *                  has already been called
         *
         * AND
         *
         *     2. Condition:    `searchQueryProps` and `searchQueryState` are true and equal
         *                      (which means that the search query has been propagated to the inner
         *                      fetch method of `fetchPieceList`, which in turn means that a fetch
         *                      has completed)
         *
         * OR
         *
         *     3. Condition:    `searchQueryProps` and `searchQueryState` can be any value (`true` or
         *                       `false`, as long as they're equal). This case only occurs when the user
         *                       has entered a `searchQuery` and deletes the query in one go, reseting
         *                       `searchQueryProps` to empty string ('' === false) again.
         */

        const firstCondition = !!loading;
        const secondCondition = searchQueryProps && searchQueryState && searchQueryProps === searchQueryState;
        const thirdCondition = !searchQueryPrevProps && searchQueryProps === searchQueryState;

        if(firstCondition && (secondCondition || thirdCondition)) {
            this.setState({ loading: false });
        }
    },

    startTimers(searchQuery) {
        const { timers } = this.state;
        const { threshold } = this.props;

        // the timer waits for the specified threshold time in milliseconds
        // and then calls `evaluateTimer`, that checks if another letter
        // has been added to the query (by checking if there are newer
        // timers on the stack aka. `this.state.timers`)
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

            // If there have been no timers added to `this.state.timers`,
            // while the `threshold` was passed, we start loading
            // by querying the server.
            if(timers.length <= timerIndex + 1) {
                // However, we're doing that only after setting `this.state.loading`
                // to `true`, as we want to display a little spinner while loading.
                // We also clean the now worthless `timers` array.
                this.setState({ timers: [], loading: true }, () => {
                    // search for the query
                    this.props.searchFor(searchQuery);
                });
            }
        };
    },

    handleChange({ target: { value }}) {
        // On each letter entry we're updating the state of the component
        // and start a timer, which we're also pushing to the state
        // of the component
        this.startTimers(value);
        this.setState({ searchQuery: value });
    },

    render() {
        let searchIcon = <Glyphicon glyph='search' className="filter-glyph"/>;
        const { className } = this.props;
        const { loading } = this.state;

        if(loading) {
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