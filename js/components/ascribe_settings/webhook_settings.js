'use strict';

import React from 'react';

import WebhookStore from '../../stores/webhook_store';
import WebhookActions from '../../actions/webhook_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';

import AclProxy from '../acl_proxy';

import ActionPanel from '../ascribe_panel/action_panel';
import CollapsibleParagraph from '../ascribe_collapsible/collapsible_paragraph';

import ApiUrls from '../../constants/api_urls';
import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang_utils';


let WebhookSettings = React.createClass({
    propTypes: {
        defaultExpanded: React.PropTypes.bool
    },

    getInitialState() {
        return WebhookStore.getState();
    },

    componentDidMount() {
        WebhookStore.listen(this.onChange);
        WebhookActions.fetchWebhooks();
    },

    componentWillUnmount() {
        WebhookStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    onRemoveWebhook(webhookId) {
        return (event) => {
            WebhookActions.removeWebhook(webhookId);

            const notification = new GlobalNotificationModel(getLangText('Webhook deleted'), 'success', 2000);
            GlobalNotificationActions.appendGlobalNotification(notification);
        };
    },

    handleCreateSuccess() {
        this.refs.webhookCreateForm.reset();
        WebhookActions.fetchWebhooks(true);

        const notification = new GlobalNotificationModel(getLangText('Webhook successfully created'), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getWebhooks() {
        if (this.state.webhooks) {
            return this.state.webhooks.map(function(webhook, i) {
                const event = webhook.event.split('.')[0];

                return (
                    <ActionPanel
                        name={webhook.event}
                        key={i}
                        content={
                            <div>
                                <div className='ascribe-panel-title'>
                                    {event.toUpperCase()}
                                </div>
                                <div className="ascribe-panel-subtitle">
                                    {webhook.target}
                                </div>
                            </div>
                        }
                        buttons={
                            <div className="pull-right">
                                <div className="pull-right">
                                    <button
                                        className="pull-right btn btn-tertiary btn-sm"
                                        onClick={this.onRemoveWebhook(webhook.id)}>
                                        {getLangText('DELETE')}
                                    </button>
                                </div>
                            </div>
                        } />
                    );
            }, this);
        } else {
            return (
                <AscribeSpinner color='dark-blue' size='lg'/>
            );
        }
    },

    getEvents() {
        if (this.state.webhookEvents && this.state.webhookEvents.length) {
            return (
                <Property
                    name='event'
                    label={getLangText('Select the event to trigger a webhook', '...')}>
                    <select name="events">
                        {this.state.webhookEvents.map((event, i) => {
                            return (
                                <option
                                    name={i}
                                    key={i}
                                    value={event + '.webhook'}>
                                    {event.toUpperCase()}
                                </option>
                            );
                        })}
                    </select>
                </Property>);
        } else {
            return null;
        }
    },

    render() {
        return (
            <CollapsibleParagraph
                title={getLangText('Webhooks')}
                defaultExpanded={this.props.defaultExpanded}>
                <div>
                    <p>
                        {getLangText('Webhooks allow external services to receive notifications from ascribe. ' +
                                     'Currently we support webhook notifications when someone transfers, consigns, ' +
                                     'loans or shares (by email) a work to you.')}
                    </p>
                    <p>
                        {getLangText('To get started, simply choose the prefered action that you want to be ' +
                                     'notified upon and supply a target url.')}
                    </p>
                </div>
                <AclProxy show={this.state.webhookEvents && this.state.webhookEvents.length}>
                    <Form
                        ref="webhookCreateForm"
                        url={ApiUrls.webhooks}
                        handleSuccess={this.handleCreateSuccess}>
                        {this.getEvents()}
                        <Property
                            name='target'
                            label={getLangText('Redirect Url')}>
                            <input
                                type="text"
                                placeholder={getLangText('Enter the url to be triggered')}
                                required />
                        </Property>
                        <hr />
                    </Form>
                </AclProxy>
                {this.getWebhooks()}
            </CollapsibleParagraph>
        );
    }
});

export default WebhookSettings;
