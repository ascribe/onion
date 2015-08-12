'use strict';

import React from 'react';
import Router from 'react-router';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import RegisterPieceForm from '../../../../ascribe_forms/form_register_piece';

import Property from '../../../../ascribe_forms/property';
import InputTextAreaToggable from '../../../../ascribe_forms/input_textarea_toggable';
import InputCheckbox from '../../../../ascribe_forms/input_checkbox';

import PieceListStore from '../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../actions/piece_list_actions';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import GlobalNotificationModel from '../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../actions/global_notification_actions';

import SlidesContainer from '../../../../ascribe_slides_container/slides_container';

import { getLangText } from '../../../../../utils/lang_utils';
import { mergeOptions } from '../../../../../utils/general_utils';

let CylandRegisterPiece = React.createClass({

    getInitialState(){
        return mergeOptions(
            UserStore.getState(),
            PieceListStore.getState(),
            {
                selectedLicense: 0,
                isFineUploaderActive: false
            });
    },

    mixins: [Router.Navigation],

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);

        if(this.state.currentUser && this.state.currentUser.email) {
            // we should also make the fineuploader component editable again
            this.setState({
                isFineUploaderActive: true
            });
        }
    },

    handleSuccess(response){
        let notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        // once the user was able to register a piece successfully, we need to make sure to keep
        // the piece list up to date
        PieceListActions.fetchPieceList(
            this.state.page,
            this.state.pageSize,
            this.state.searchTerm,
            this.state.orderBy,
            this.state.orderAsc,
            this.state.filterBy
        );

        this.transitionTo('piece', {pieceId: response.piece.id});
    },

    changeSlide() {
        // only transition to the login store, if user is not logged in
        // ergo the currentUser object is not properly defined
        if(this.state.currentUser && !this.state.currentUser.email) {
            this.onLoggedOut();
        }
    },

    // basically redirects to the second slide (index: 1), when the user is not logged in
    onLoggedOut() {
        this.transitionTo('login');
    },

    render() {
        return (
            <SlidesContainer ref="slidesContainer">
                <div
                    onClick={this.changeSlide}
                    onFocus={this.changeSlide}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <RegisterPieceForm
                                enableLocalHashing={false}
                                headerMessage={getLangText('Submit to Cyland Archive')}
                                submitMessage={getLangText('Submit')}
                                isFineUploaderActive={this.state.isFineUploaderActive}
                                handleSuccess={this.handleSuccess}
                                onLoggedOut={this.onLoggedOut}>
                                <Property
                                    name="terms"
                                    className="ascribe-settings-property-collapsible-toggle"
                                    style={{paddingBottom: 0}}>
                                    <InputCheckbox>
                                        <span>
                                            {' ' + getLangText('I agree to the Terms of Service the art price') + ' '}
                                            (<a href="https://s3-us-west-2.amazonaws.com/ascribe0/whitelabel/sluice/terms.pdf" target="_blank" style={{fontSize: '0.9em', color: 'rgba(0,0,0,0.7)'}}>
                                                {getLangText('read')}
                                            </a>)
                                        </span>
                                    </InputCheckbox>
                                </Property>
                            </RegisterPieceForm>
                        </Col>
                    </Row>
                </div>
                <div>
                    {/* next slide */}
                </div>
            </SlidesContainer>
        );
    }
});

export default CylandRegisterPiece;
