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
import FormPropertyHeader from '../../../ascribe_forms/form_property_header';

import Table from '../../../ascribe_table/table';
import TableItem from '../../../ascribe_table/table_item';
import TableItemText from '../../../ascribe_table/table_item_text';

import GlobalNotificationModel from '../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../actions/global_notification_actions';

import AppConstants from '../../../../constants/application_constants';
import apiUrls from '../../../../constants/api_urls';

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
        let prize_settings = null;
        if (this.state.currentUser.is_admin){
            prize_settings = <PrizeSettings />;
        }
        return (
            <SettingsContainer>
                {prize_settings}
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
    },

    render() {
        let content = (
            <div style={{textAlign: 'center'}}>
                <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
            </div>);

        if (this.state.members.length > -1) {
            content = this.state.members.map(function(member, i) {
                return (
                    <Property
                        name={member.email}
                        label={member.email}
                        key={i}>
                        <div className="row-same-height">
                            <div className="no-padding col-xs-6 col-sm-10 col-xs-height col-middle">
                            {member.status}
                            </div>
                            <div className="col-xs-6 col-sm-2 col-xs-height">
                                <button
                                    className="pull-right btn btn-default btn-sm"
                                    data-id={member.name}>
                                    {getLangText('RESEND INVITATION')}
                                </button>
                            </div>
                        </div>
                    </Property>);
            }, this);
            content = (
                <div>
                    <Form>
                        {content}
                        <hr />
                    </Form>
                </div>);
        }
        return (
            <div>
                <Form
                    url={apiUrls.jury}
                    handleSuccess={this.handleCreateSuccess}
                    buttonSubmitText='INVITE'>
                    <FormPropertyHeader>
                        <h4 style={{margin: '30px 0px 10px 10px'}}>Jury Members</h4>
                    </FormPropertyHeader>
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
                {content}
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