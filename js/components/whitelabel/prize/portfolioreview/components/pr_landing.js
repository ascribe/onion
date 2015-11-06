'use strict';

import React from 'react';
import { History } from 'react-router';

import PrizeActions from '../../simple_prize/actions/prize_actions';
import PrizeStore from '../../simple_prize/stores/prize_store';

import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import { mergeOptions } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';

const PRLanding = React.createClass({

    mixins: [History],

    getInitialState() {
        return mergeOptions(
            PrizeStore.getState(),
            UserStore.getState()
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
        PrizeStore.listen(this.onChange);
        PrizeActions.fetchPrize();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        PrizeStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getButtons() {
        if (this.state.prize && this.state.prize.active){
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
        }
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
    },

    getTitle() {
        if (this.state.prize && this.state.prize.active){
            return (
                <p>
                    {getLangText('This is the submission page for Portfolio Review 2015.')}
                </p>
            );
        }
        return (
            <p>
                {getLangText('Submissions for Portfolio Review 2015 are now closed.')}
            </p>
        );
    },
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 wp-landing-wrapper">
                        <h1>
                            {getLangText('Welcome to Portfolio Review 2015')}
                        </h1>
                        {this.getTitle()}
                        {this.getButtons()}
                    </div>
                </div>
            </div>
        );
    }
});

export default PRLanding;