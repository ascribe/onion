'use strict';

import React from 'react';
import { History } from 'react-router';

import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import Button from 'react-bootstrap/lib/Button';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import AscribeSpinner from '../../../../ascribe_spinner';

import { mergeOptions } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';


let CylandLanding = React.createClass({

    mixins: [History],

    getInitialState() {
        return mergeOptions(
            UserStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
        WhitelabelStore.listen(this.onChange);
        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);

        // if user is already logged in, redirect him to piece list
        if(this.state.currentUser && this.state.currentUser.email) {
            // FIXME: hack to redirect out of the dispatch cycle
            window.setTimeout(() => this.history.replaceState(null, '/collection'), 0);
        }
    },

    render() {
        setDocumentTitle('CYLAND MediaArtLab');

        return (
            <div className="container ascribe-form-wrapper cyland-landing">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="row" style={{border: '1px solid #CCC', padding: '2em'}}>
                            <img src={this.state.whitelabel.logo} width="400px"/>
                            <div style={{marginTop: '1em'}}>
                                {getLangText('Submissions to Cyland Archive are powered by') + ' '}
                                <span>
                                    <span className="icon-ascribe-logo"></span>
                                </span>
                            </div>
                        </div>
                        <div className="row" style={{border: '1px solid #CCC', borderTop: 'none', padding: '2em'}}>
                            <div className="col-xs-6">
                                <p>
                                    {getLangText('Existing ascribe user?')}
                                </p>
                                <LinkContainer to="/login">
                                    <Button>
                                        {getLangText('Log in')}
                                    </Button>
                                </LinkContainer>
                            </div>
                            <div className="col-xs-6">
                                <p>
                                    {getLangText('Do you need an account?')}
                                </p>
                                <LinkContainer to="/signup">
                                    <Button>
                                        {getLangText('Sign up')}
                                    </Button>
                                </LinkContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default CylandLanding;
