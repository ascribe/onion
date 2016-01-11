'use strict';

import React from 'react';
import { Link, History } from 'react-router';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import PRRegisterPieceForm from './pr_forms/pr_register_piece_form';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { getCookie } from '../../../../../utils/fetch_api_utils';


const { object } = React.PropTypes;

const PRRegisterPiece = React.createClass({
    propTypes: {
        // Provided from PrizeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        //Provided from router
        location: object
    },

    mixins: [History],

    componentDidUpdate() {
        const { currentUser } = this.props;
        if (currentUser && currentUser.email) {
            const submittedPieceId = getCookie(currentUser.email);
            if (submittedPieceId) {
                this.history.pushState(null, `/pieces/${submittedPieceId}`);
            }
        }
    },

    render() {
        const { currentUser, location } = this.props;

        setDocumentTitle(getLangText('Submit to Portfolio Review'));

        return (
            <Row>
                <Col xs={6}>
                    <div className="register-piece--info">
                        <h1>Portfolio Review</h1>
                        <h2>{getLangText('Submission closing on %s', ' 27 Dec 2015')}</h2>
                        <p>For more information, visit:&nbsp;
                            <a href="http://www.portfolio-review.de/submission/" target="_blank">
                                portfolio-review.de
                            </a>
                        </p>
                        <p style={{marginTop: '1em'}}>
                            {getLangText("You're submitting as %s. ", currentUser.email)}
                            <Link to="/logout">{getLangText('Change account?')}</Link>
                        </p>
                    </div>
                </Col>
                <Col xs={6}>
                    <PRRegisterPieceForm
                        location={location}
                        currentUser={currentUser} />
                </Col>
            </Row>
        );
    }
});

export default PRRegisterPiece;
