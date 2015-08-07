'use strict';

import React from 'react';

import UserStore from '../../../../stores/user_store';
import UserActions from '../../../../actions/user_actions';
import PrizeActions from '../actions/prize_actions';
import PrizeStore from '../stores/prize_store';
import PrizeJuryActions from '../actions/prize_jury_actions';
import PrizeJuryStore from '../stores/prize_jury_store';

import SettingsContainer from '../../../settings_container';
import CollapsibleParagraph from '../../../ascribe_collapsible/collapsible_paragraph';

import Form from '../../../ascribe_forms/form';
import Property from '../../../ascribe_forms/property';

import ActionPanel from '../../../ascribe_panel/action_panel';

import Table from '../../../ascribe_table/table';
import TableItem from '../../../ascribe_table/table_item';
import TableItemText from '../../../ascribe_table/table_item_text';

import GlobalNotificationModel from '../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../actions/global_notification_actions';

import AppConstants from '../../../../constants/application_constants';
import ApiUrls from '../../../../constants/api_urls';

import { ColumnModel} from '../../../ascribe_table/models/table_models';
import { getLangText } from '../../../../utils/lang_utils';


let Settings = React.createClass({
    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        let prizeSettings = null;
        if (this.state.currentUser.is_admin){
            prizeSettings = <PrizeSettings />;
        }
        return (
            <SettingsContainer>
                {prizeSettings}
            </SettingsContainer>
        );
    }
});

let PrizeSettings = React.createClass({

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
    render() {
        return (
            <CollapsibleParagraph
                title={'Prize Settings for ' + this.state.prize.name}
                show={true}
                defaultExpanded={true}>
                <Form >
                    <Property
                        name='prize_name'
                        label={getLangText('Prize name')}
                        editable={false}>
                        <pre className="ascribe-pre">{this.state.prize.name}</pre>
                    </Property>
                    <Property
                        name='prize_rounds'
                        label={getLangText('Active round/Number of rounds')}
                        editable={false}>
                        <pre className="ascribe-pre">{this.state.prize.active_round}/{this.state.prize.rounds}</pre>
                    </Property>
                    <Property
                        name='num_submissions'
                        label={getLangText('Allowed number of submissions per user')}
                        editable={false}>
                        <pre className="ascribe-pre">{this.state.prize.num_submissions}</pre>
                    </Property>
                    <hr />
                </Form>
                <PrizeJurySettings
                    prize={this.state.prize}/>
            </CollapsibleParagraph>
        );
    }
});

let PrizeJurySettings = React.createClass({
    propTypes: {
        prize: React.PropTypes.object
    },

    getInitialState() {
        return PrizeJuryStore.getState();
    },

    componentDidMount() {
        PrizeJuryStore.listen(this.onChange);
        PrizeJuryActions.fetchJury();
    },

    componentWillUnmount() {
        PrizeJuryStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleCreateSuccess(response) {
        PrizeJuryActions.fetchJury();
        let notification = new GlobalNotificationModel(response.notification, 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);
        this.refs.form.refs.email.refs.input.getDOMNode().value = null;
    },

    handleActivate(event) {
        let email = event.target.getAttribute('data-id');
        PrizeJuryActions.activateJury(email).then((response) => {
                PrizeJuryActions.fetchJury();
                let notification = new GlobalNotificationModel(response.notification, 'success', 5000);
                GlobalNotificationActions.appendGlobalNotification(notification);
            });
    },

    handleRevoke(event) {
        let email = event.target.getAttribute('data-id');
        PrizeJuryActions.revokeJury(email).then((response) => {
                let notification = new GlobalNotificationModel(response.notification, 'success', 5000);
                GlobalNotificationActions.appendGlobalNotification(notification);
            });
    },

    handleResend(event) {
        let email = event.target.getAttribute('data-id');
        PrizeJuryActions.resendJuryInvitation(email).then((response) => {
                let notification = new GlobalNotificationModel(response.notification, 'success', 5000);
                GlobalNotificationActions.appendGlobalNotification(notification);
            });
    },

    getMembersPending() {
        return this.state.membersPending.map(function(member, i) {
            return (
                <ActionPanel
                    name={member.email}
                    key={i}
                    title={member.email}
                    content={member.status}
                    buttons={
                        <div className="pull-right">
                            <button
                                className="btn btn-default btn-sm margin-left-2px"
                                onClick={this.handleResend}
                                data-id={member.email}>
                                {getLangText('RESEND')}
                            </button>
                            <button
                                className="btn btn-default btn-sm ascribe-btn-gray margin-left-2px"
                                onClick={this.handleRevoke}
                                data-id={member.email}>
                                {getLangText('REVOKE')}
                            </button>
                        </div>
                    }/>
                );
        }, this);
    },
    getMembersActive() {
        return this.state.membersActive.map(function(member, i) {
            return (
                <ActionPanel
                    name={member.email}
                    key={i}
                    title={member.email}
                    content={member.status}
                    buttons={
                        <div className="pull-right">
                            <button
                                className="btn btn-default btn-sm ascribe-btn-gray"
                                onClick={this.handleRevoke}
                                data-id={member.email}>
                                {getLangText('REVOKE')}
                            </button>
                        </div>
                    }/>
                );

        }, this);
    },
    getMembersInactive() {
        return this.state.membersInactive.map(function(member, i) {
            return (
                <ActionPanel
                    name={member.email}
                    key={i}
                    title={member.email}
                    content={member.status}
                    buttons={
                        <div className="pull-right">
                            <button
                                className="btn btn-default btn-sm"
                                onClick={this.handleActivate}
                                data-id={member.email}>
                                {getLangText('ACTIVATE')}
                            </button>
                        </div>
                    }/>
                );

        }, this);
    },
    getMembers() {
        let content = (
            <div style={{textAlign: 'center'}}>
                <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
            </div>);

        if (this.state.members.length > -1) {
            content = (
                <div style={{padding: '1em'}}>
                    <CollapsibleParagraph
                        title={'Active Jury Members'}
                        show={true}
                        defaultExpanded={true}>
                        {this.getMembersActive()}
                    </CollapsibleParagraph>
                    <CollapsibleParagraph
                        title={'Pending Jury Invitations'}
                        show={true}
                        defaultExpanded={true}>
                        {this.getMembersPending()}
                    </CollapsibleParagraph>
                    <CollapsibleParagraph
                        title={'Deactivated Jury Members'}
                        show={true}
                        defaultExpanded={false}>
                        {this.getMembersInactive()}
                    </CollapsibleParagraph>
                </div>);
        }
        return content;
    },
    render() {
        return (
            <div>
                <Form
                    url={ApiUrls.jurys}
                    handleSuccess={this.handleCreateSuccess}
                    ref='form'
                    buttonSubmitText='INVITE'>
                    <div className="ascribe-form-header">
                        <h4 style={{margin: '30px 0px 10px 10px'}}>Jury Members</h4>
                    </div>
                    <Property
                        name='email'
                        label={getLangText('New jury member')}>
                        <input
                            type="email"
                            placeholder={getLangText('Enter an email to invite a jury member')}
                            required/>
                    </Property>
                    <hr />
                </Form>
                {this.getMembers()}
            </div>
        );
    }
});


let PrizesDashboard = React.createClass({

    getColumnList() {
        return [
            new ColumnModel(
                (item) => {
                    return {
                        'content': item.name
                    }; },
                    'name',
                    getLangText('Name'),
                    TableItemText,
                    6,
                    false,
                    null
            ),
            new ColumnModel(
                (item) => {
                    return {
                        'content': item.domain
                    }; },
                    'domain',
                    getLangText('Domain'),
                    TableItemText,
                    1,
                    false,
                    null
            )
        ];
    },

    render() {
        return (
            <Table
                responsive
                className="ascribe-table"
                columnList={this.getColumnList()}
                itemList={this.state.prizeList}>
                {this.state.prizeList.map((item, i) => {
                    return (
                         <TableItem
                            className="ascribe-table-item-selectable"
                            key={i}/>
                    );
                })}
            </Table>
        );
    }
});

export default Settings;