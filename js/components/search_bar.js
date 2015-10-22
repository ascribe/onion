'use strict';

import React from 'react';

import Input from 'react-bootstrap/lib/Input';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import AscribeSpinner from './ascribe_spinner';

import { getLangText } from '../utils/lang_utils';


const { func, string, number } = React.PropTypes;

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
            timer: null,
            searchQuery: '',
            loading: false
        };
    },

    componentWillReceiveProps(nextProps) {
        /**
         * This enables the `PieceListStore` to override the state
         * of that component in case someone is changing the `searchQuery` on
         * another component.
         *
         * Like how it's being done in the 'Clear search' dialog.
         */
        if(this.props.searchQuery !== nextProps.searchQuery || !this.state.searchQuery) {
            this.setState({ searchQuery: nextProps.searchQuery });
        }
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
         * (
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
         * )
         */

        const firstCondition = !!loading;
        const secondCondition = searchQueryProps && searchQueryState && searchQueryProps === searchQueryState;
        const thirdCondition = !searchQueryPrevProps && searchQueryProps === searchQueryState;

        if(firstCondition && (secondCondition || thirdCondition)) {
            this.setState({ loading: false });
        }
    },

    startTimer(searchQuery) {
        const { timer } = this.state;
        const { threshold } = this.props;

        // The timer waits for the specified threshold time in milliseconds
        // and then calls `evaluateTimer`.
        // If another letter has been called in the mean time (timespan < `threshold`),
        // the present timer gets cleared and a new one is added to `this.state`.
        // This means that `evaluateTimer`, will only be called when the threshold has actually
        // passed,
        clearTimeout(timer); // apparently `clearTimeout` can be called with null, without throwing errors
        const newTimer = setTimeout(this.evaluateTimer(searchQuery), threshold);

        this.setState({ timer: newTimer });
    },

    evaluateTimer(searchQuery) {
        return () => {
            this.setState({ timer: null, loading: true }, () => {
                // search for the query
                this.props.searchFor(searchQuery);
            });
        };
    },

    handleChange({ target: { value }}) {
        // On each letter entry we're updating the state of the component
        // and start a timer, which we're also pushing to the state
        // of the component
        this.startTimer(value);
        this.setState({ searchQuery: value });
    },

    render() {
        let searchIcon = <span className='ascribe-icon icon-ascribe-search'/>;
        const { className } = this.props;
        const { loading, searchQuery } = this.state;

        if(loading) {
            searchIcon = <AscribeSpinner size='sm' color='dark-blue'/>;
        }

        return (
            <span className={className}>
                <Input
                    type='text'
                    value={searchQuery}
                    placeholder={getLangText('Search%s', '...')}
                    onChange={this.handleChange}
                    addonAfter={searchIcon} />
            </span>
        );
    }
});


export default SearchBar;