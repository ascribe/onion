'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import PrizeActions from '../actions/prize_actions';
import PrizeStore from '../stores/prize_store';

import { getLangText } from '../../../../../utils/lang_utils';


let Landing = React.createClass({
    propTypes: {
        // Provided from PrizeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    getInitialState() {
        return PrizeStore.getState();
    },

    componentDidMount() {
        PrizeStore.listen(this.onChange);
        PrizeActions.fetchPrize();
    },

    componentWillUnmount() {
        PrizeStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getButtons() {
        if (this.state.prize && this.state.prize.active) {
            return (
                <ButtonGroup className="enter" bsSize="large" vertical>
                    <LinkContainer to="/signup">
                        <Button>
                            {getLangText('Sign up to submit')}
                        </Button>
                    </LinkContainer>

                    <p>
                        {getLangText('or, already an ascribe user?')}
                    </p>
                    <LinkContainer to="/login">
                        <Button>
                            {getLangText('Log in to submit')}
                        </Button>
                    </LinkContainer>
                </ButtonGroup>
            );
        } else {
            return (
                <ButtonGroup className="enter" bsSize="large" vertical>
                    <a className="btn btn-default" href="https://www.ascribe.io/app/signup">
                        {getLangText('Sign up to ascribe')}
                    </a>

                    <p>
                        {getLangText('or, already an ascribe user?')}
                    </p>
                    <LinkContainer to="/login">
                        <Button>
                            {getLangText('Log in')}
                        </Button>
                    </LinkContainer>
                </ButtonGroup>
            );
        }
    },

    getTitle() {
        const { prize } = this.state;

        return (
            <p>
                {getLangText(prize && prize.active ? 'This is the submission page for Sluice_screens ↄc Prize 2015.'
                                                   : 'Submissions for Sluice_screens ↄc Prize 2015 are now closed.')}
            </p>
        );
    },

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 wp-landing-wrapper">
                        <h1>
                            {getLangText('Sluice_screens ↄc Prize 2015')}
                        </h1>
                        {this.getTitle()}
                        {this.getButtons()}
                    </div>
                </div>
            </div>
        );
    }
});

export default Landing;
