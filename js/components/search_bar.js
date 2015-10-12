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
        className: string,

        // in milliseconds
        threshold: number.isRequired
    },

    getInitialState() {
        return {
            timers: [],
            currentSearchQuery: ''
        };
    },

    startTimers(searchQuery) {
        const { timers } = this.state;
        const { threshold } = this.props;
        const timer = {
            searchQuery,
            cb: setTimeout(this.evaluateTimer, threshold)
        };


        const newTimers = update(timers, {$push: [timer]});
        this.setState({ timers: newTimers });
    },

    evaluateTimer() {
        console.log(this);
    },

    handleChange({ target: { value }}) {
        this.startTimers(value);
        this.setState({ currentSearchQuery: value });
    },

    render() {
        const searchIcon = <Glyphicon glyph='search' className="filter-glyph"/>;
        const { className } = this.props;

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