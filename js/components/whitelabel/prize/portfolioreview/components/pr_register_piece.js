'use strict';

import React from 'react';
import { Link, History } from 'react-router';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import PRRegisterPieceForm from './pr_forms/pr_register_piece_form';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { getCookie } from '../../../../../utils/fetch_api_utils';


const { object } = React.PropTypes;

const PRRegisterPiece = React.createClass({
    propTypes: {
        location: object
    },

    mixins: [History],

    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentDidUpdate() {
        const { currentUser } = this.state;
        if(currentUser && currentUser.email) {
            const submittedPieceId = getCookie(currentUser.email);
            if(submittedPieceId) {
                this.history.pushState(null, `/pieces/${submittedPieceId}`);
            }
        }
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        const { currentUser } = this.state;
        const { location } = this.props;

        setDocumentTitle(getLangText('Submit to Portfolio Review'));
        return (
            <Row>
                <Col xs={6}>
                    <div className="register-piece--info">
                        <h1>Portfolio Review</h1>
                        <h2>{getLangText('Submission closing on %s', ' 21 Dec 2015')}</h2>
                        <p>
                            {getLangText('Submissions are open to everyone, we accept only PDFs.')}
                        </p>
                        <p>
                            {getLangText('We accept only one PDF with up to 20 images from every participant.')}
                        </p>
                        <p>
                            {getLangText('You need to pay 50€ in order to apply. We only accept PayPal.')}
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
                        currentUser={currentUser}/>
                </Col>
            </Row>
        );
    }
});

export default PRRegisterPiece;