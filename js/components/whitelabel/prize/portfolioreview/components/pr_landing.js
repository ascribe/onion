'use strict';

import React from 'react';
import { History } from 'react-router';

import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import PrizeActions from '../../simple_prize/actions/prize_actions';
import PrizeStore from '../../simple_prize/stores/prize_store';

import { omitFromObject } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';


const PRLanding = React.createClass({
    propTypes: {
        // Provided from PrizeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    mixins: [History],

    getInitialState() {
        return PrizeStore.getState();
    },

    componentDidMount() {
        const { location } = this.props;

        PrizeStore.listen(this.onChange);
        PrizeActions.fetchPrize();

        if (location.query.redirect) {
            window.setTimeout(() => this.history.replace({
                pathname: `/${location.query.redirect}`,
                query: omitFromObject(location.query, ['redirect'])
            }));
        }
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
                {getLangText(prize && prize.active ? 'This is the submission page for Portfolio Review 2016.'
                                                   : 'Submissions for Portfolio Review 2016 are now closed.')}
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
