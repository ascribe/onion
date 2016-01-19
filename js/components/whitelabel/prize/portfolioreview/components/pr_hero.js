'use strict';

import React from 'react';
import { Link } from 'react-router';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { getLangText } from '../../../../../utils/lang_utils';


const PRHero = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.shape({
            email: React.PropTypes.object
        })
    },

    render() {
        const { currentUser } = this.props;

        return (
            <div className="piece--hero">
                <h2><Glyphicon glyph="ok" />
                    &nbsp;{getLangText('Congratulations') + (currentUser.email ? ` ${currentUser.email}!` : '!')}
                </h2>
                <h1>{getLangText('You have successfully submitted to Portfolio Review 2016.')}</h1>
                <p>Not you? <Link to="/logout">{getLangText('Change account.')}</Link></p>
            </div>
        );
    }
});

export default PRHero;
