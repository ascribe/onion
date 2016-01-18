'use strict';

import React from 'react';
import { History } from 'react-router';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

import EditionListActions from '../../actions/edition_list_actions';
import PieceListActions from '../../actions/piece_list_actions';
import PieceListStore from '../../stores/piece_list_store';

import Form from './../ascribe_forms/form';
import Property from './../ascribe_forms/property';

import ListRequestActions from './../ascribe_forms/list_form_request_actions';
import AclButtonList from './../ascribe_buttons/acl_button_list';
import UnConsignRequestButton from './../ascribe_buttons/unconsign_request_button';
import DeleteButton from '../ascribe_buttons/delete_button';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import AclInformation from '../ascribe_buttons/acl_information';

import AclProxy from '../acl_proxy';

import ApiUrls from '../../constants/api_urls';

import { getLangText } from '../../utils/lang_utils';

/*
    A component that handles all the actions inside of the edition detail
    handleSuccess requires a loadEdition action (could be refactored)
 */
let EditionActionPanel = React.createClass({
    propTypes: {
        actionPanelButtonListType: React.PropTypes.func,
        edition: React.PropTypes.object,
        currentUser: React.PropTypes.object,
        handleSuccess: React.PropTypes.func
    },

    mixins: [History],

    getDefaultProps() {
        return {
            actionPanelButtonListType: AclButtonList
        };
    },

    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleDeleteSuccess(response) {
        this.refreshCollection();

        EditionListActions.closeAllEditionLists();
        EditionListActions.clearAllEditionSelections();

        const notification = new GlobalNotificationModel(response.notification, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);

        this.history.push('/collection');
    },

    refreshCollection() {
        const { filterBy, orderAsc, orderBy, page, pageSize, search } = this.state;

        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });
        EditionListActions.refreshEditionList({ pieceId: this.props.edition.parent });
    },

    handleSuccess(response) {
        this.refreshCollection();
        this.props.handleSuccess();
        if (response){
            let notification = new GlobalNotificationModel(response.notification, 'success');
            GlobalNotificationActions.appendGlobalNotification(notification);
        }
    },

    render() {
        const {
            actionPanelButtonListType: ActionPanelButtonListType,
            edition,
            currentUser } = this.props;

        if (edition &&
            edition.notifications &&
            edition.notifications.length > 0){
            return (
                <ListRequestActions
                    pieceOrEditions={[edition]}
                    currentUser={currentUser}
                    handleSuccess={this.handleSuccess}
                    notifications={edition.notifications}/>);
        }

        else {
            return (
                <Row>
                    <Col md={12}>
                        <ActionPanelButtonListType
                            className="ascribe-button-list"
                            availableAcls={edition.acl}
                            pieceOrEditions={[edition]}
                            handleSuccess={this.handleSuccess}>
                            <AclProxy
                                aclObject={edition.acl}
                                aclName="acl_withdraw_transfer">
                                <Form
                                    url={ApiUrls.ownership_transfers_withdraw}
                                    handleSuccess={this.handleSuccess}
                                    className='inline'
                                    isInline={true}>
                                    <Property
                                        name="bitcoin_id"
                                        expanded={false}>
                                        <input
                                            type="text"
                                            value={edition.bitcoin_id}
                                            readOnly />
                                    </Property>
                                    <Button bsStyle="default" className="pull-center" bsSize="small" type="submit">
                                        {getLangText('WITHDRAW TRANSFER')}
                                    </Button>
                                </Form>
                            </AclProxy>
                            <AclProxy
                                aclObject={edition.acl}
                                aclName="acl_withdraw_consign">
                                <Form
                                    url={ApiUrls.ownership_consigns_withdraw}
                                    handleSuccess={this.handleSuccess}
                                    className='inline'
                                    isInline={true}>
                                    <Property
                                        name="bitcoin_id"
                                        expanded={false}>
                                        <input
                                            type="text"
                                            value={edition.bitcoin_id}
                                            readOnly />
                                    </Property>
                                    <Button bsStyle="danger" className="btn-delete pull-center" bsSize="small" type="submit">
                                        {getLangText('WITHDRAW CONSIGN')}
                                    </Button>
                                </Form>
                            </AclProxy>
                            <AclProxy
                                aclObject={edition.acl}
                                aclName="acl_request_unconsign">
                                <UnConsignRequestButton
                                    currentUser={currentUser}
                                    edition={edition}
                                    handleSuccess={this.handleSuccess} />
                            </AclProxy>
                            <DeleteButton
                                handleSuccess={this.handleDeleteSuccess}
                                editions={[edition]}/>
                            <AclInformation
                                aim="button"
                                verbs={['acl_share', 'acl_transfer', 'acl_consign', 'acl_loan', 'acl_delete']}
                                aclObject={edition.acl}/>
                        </ActionPanelButtonListType>
                    </Col>
                </Row>
            );
        }
    }
});

export default EditionActionPanel;
