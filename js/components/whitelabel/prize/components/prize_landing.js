'use strict';

import React from 'react';
import { History } from 'react-router';

import PrizeActions from '../actions/prize_actions';
import PrizeStore from '../stores/prize_store';

import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

import UserStore from '../../../../stores/user_store';
import UserActions from '../../../../actions/user_actions';

import { mergeOptions } from '../../../../utils/general_utils';
import { getLangText } from '../../../../utils/lang_utils';

let Landing = React.createClass({

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

        // if user is already logged in, redirect him to piece list
        if(this.state.currentUser && this.state.currentUser.email) {
            // FIXME: hack to redirect out of the dispatch cycle
            window.setTimeout(() => this.history.replaceState(null, '/pieces'), 0);
        }
    },

    getButtons() {
        if (this.state.prize && this.state.prize.active){
            return (
                <ButtonGroup className="enter" bsSize="large" vertical>
                    <ButtonLink to="signup">
                        {getLangText('Sign up to submit')}
                    </ButtonLink>

                    <p>
                        {getLangText('or, already an ascribe user?')}
                    </p>
                    <ButtonLink to="login">
                        {getLangText('Log in to submit')}
                    </ButtonLink>
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
                <ButtonLink to="login">
                    {getLangText('Log in')}
                </ButtonLink>
            </ButtonGroup>
        );
    },

    getTitle() {
        if (this.state.prize && this.state.prize.active){
            return (
                <p>
                    {getLangText('This is the submission page for Sluice_screens ↄc Prize 2015.')}
                </p>
            );
        }
        return (
            <p>
                {getLangText('Submissions for Sluice_screens ↄc Prize 2015 are now closed.')}
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
