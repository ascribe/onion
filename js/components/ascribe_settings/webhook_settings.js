'use strict';

import React from 'react';

import WebhookStore from '../../stores/webhook_store';
import WebhookActions from '../../actions/webhook_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';

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
        WebhookActions.fetchWebhookEvents();
    },

    componentWillUnmount() {
        WebhookStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    onDeleteWebhook(event) {
        let webhookId = event.target.getAttribute('data-id');
        WebhookActions.deleteWebhook(webhookId);

        let notification = new GlobalNotificationModel(getLangText('Webhook deleted'), 'success', 2000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    handleCreateSuccess() {
        WebhookActions.fetchWebhooks();
        let notification = new GlobalNotificationModel(getLangText('Webhook successfully created'), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getWebhooks(){
        let content = <AscribeSpinner color='dark-blue' size='lg'/>;

        if (this.state.webhooks.length > -1) {
            content = this.state.webhooks.map(function(webhook, i) {
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
                                        onClick={this.onDeleteWebhook}
                                        data-id={webhook.id}>
                                        {getLangText('DELETE')}
                                    </button>
                                </div>
                            </div>
                        }/>
                    );
            }, this);
        }
        return content;
    },

    getEvents() {
        if (this.state.events && this.state.events.length > 1) {
            return (
                <Property
                    name='event'
                    label={getLangText('Select the event to trigger a webhook', '...')}
                    onChange={this.onLicenseChange}>
                    <select name="license">
                        {this.state.events.map((event, i) => {
                            return (
                                <option
                                    name={i}
                                    key={i}
                                    value={ event + '.webhook' }>
                                    { event.toUpperCase() }
                                </option>
                            );
                        })}
                    </select>
                </Property>);
        }
        return null;
    },

    
    render() {
        return (
            <CollapsibleParagraph
                title={getLangText('Webhooks')}
                defaultExpanded={this.props.defaultExpanded}>
                <Form
                    url={ApiUrls.webhooks}
                    handleSuccess={this.handleCreateSuccess}>
                    { this.getEvents() }
                    <Property
                        name='target'
                        label={getLangText('Redirect Url')}>
                        <input
                            type="text"
                            placeholder={getLangText('Enter the url to be triggered')}
                            required/>
                    </Property>
                    <hr />
                </Form>
                <pre>
                    Usage: curl &lt;url&gt; -H 'Authorization: Bearer &lt;token&gt;'
                </pre>
                {this.getWebhooks()}
            </CollapsibleParagraph>
        );
    }
});

export default WebhookSettings;