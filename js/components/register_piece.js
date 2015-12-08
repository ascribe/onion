'use strict';

import React from 'react';
import { History } from 'react-router';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import WhitelabelActions from '../actions/whitelabel_actions';
import WhitelabelStore from '../stores/whitelabel_store';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import UserStore from '../stores/user_store';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import Property from './ascribe_forms/property';
import RegisterPieceForm from './ascribe_forms/form_register_piece';

import { mergeOptions } from '../utils/general_utils';
import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


let RegisterPiece = React.createClass( {

    propTypes: {
        headerMessage: React.PropTypes.string,
        submitMessage: React.PropTypes.string,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element,
            React.PropTypes.string
        ]),
        location: React.PropTypes.object
    },

    mixins: [History],

    getInitialState(){
        return mergeOptions(
            UserStore.getState(),
            WhitelabelStore.getState(),
            PieceListStore.getState()
        );
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
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

        this.history.pushState(null, `/pieces/${response.piece.id}`);
    },

    getSpecifyEditions() {
        if(this.state.whitelabel && this.state.whitelabel.acl_create_editions || Object.keys(this.state.whitelabel).length === 0) {
            return (
                <Property
                    name="num_editions"
                    checkboxLabel={getLangText('Specify editions')}
                    expanded={false}>
                    <span>{getLangText('Editions')}</span>
                    <input
                        type="number"
                        placeholder="(e.g. 32)"
                        min={0}/>
                </Property>
            );
        }
    },

    render() {
        setDocumentTitle(getLangText('Register a new piece'));

        return (
            <Row className="no-margin">
                <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                    <RegisterPieceForm
                        {...this.props}
                        isFineUploaderActive={true}
                        handleSuccess={this.handleSuccess}
                        location={this.props.location}>
                        {this.props.children}
                        {this.getSpecifyEditions()}
                    </RegisterPieceForm>
                </Col>
            </Row>
        );
    }
});


export default RegisterPiece;
