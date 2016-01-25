'use strict';

import React from 'react';

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
    propTypes: {
        location: React.PropTypes.object
    },

    contextTypes: {
        router: React.PropTypes.object
    },

    getInitialState() {
        return mergeOptions(
            PrizeStore.getState(),
            UserStore.getState()
        );
    },

    componentDidMount() {
        const { location } = this.props;
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
        PrizeStore.listen(this.onChange);
        PrizeActions.fetchPrize();

        if(location && location.query && location.query.redirect) {
            let queryCopy = JSON.parse(JSON.stringify(location.query));
            delete queryCopy.redirect;
            window.setTimeout(() => {
                this.context.router.replace({
                    pathname: `/${location.query.redirect}`,
                    query: queryCopy
                });
            });
        }
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
                    {getLangText('This is the submission page for Portfolio Review 2016.')}
                </p>
            );
        }
        return (
            <p>
                {getLangText('Submissions for Portfolio Review 2016 are now closed.')}
            </p>
        );
    },
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 wp-landing-wrapper">
                        <h1>
                            {getLangText('Welcome to Portfolio Review 2016')}
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