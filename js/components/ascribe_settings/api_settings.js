'use strict';

import React from 'react';

import ApplicationStore from '../../stores/application_store';
import ApplicationActions from '../../actions/application_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';

import ActionPanel from '../ascribe_panel/action_panel';
import CollapsibleParagraph from '../ascribe_collapsible/collapsible_paragraph';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';

import { getLangText } from '../../utils/lang_utils';


let APISettings = React.createClass({
    propTypes: {
        defaultExpanded: React.PropTypes.bool
    },

    getInitialState() {
        return ApplicationStore.getState();
    },

    componentDidMount() {
        ApplicationStore.listen(this.onChange);
        ApplicationActions.fetchApplication();
    },

    componentWillUnmount() {
        ApplicationStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleCreateSuccess() {
        ApplicationActions.fetchApplication();
        let notification = new GlobalNotificationModel(getLangText('Application successfully created'), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    handleTokenRefresh(event) {
        let applicationName = event.target.getAttribute('data-id');
        ApplicationActions.refreshApplicationToken(applicationName);

        let notification = new GlobalNotificationModel(getLangText('Token refreshed'), 'success', 2000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getApplications(){
        let content = <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />;

        if (this.state.applications.length > -1) {
            content = this.state.applications.map(function(app, i) {
                return (
                    <ActionPanel
                        name={app.name}
                        key={i}
                        content={
                            <div>
                                <div className='ascribe-panel-title'>
                                    {app.name}
                                </div>
                                <div className="ascribe-panel-subtitle">
                                    {'Bearer ' + app.bearer_token.token}
                                </div>
                            </div>
                        }
                        buttons={
                            <div className="pull-right">
                                <div className="pull-right">
                                    <button
                                        className="pull-right btn btn-default btn-sm"
                                        onClick={this.handleTokenRefresh}
                                        data-id={app.name}>
                                        {getLangText('REFRESH')}
                                    </button>
                                </div>
                            </div>
                        }/>
                    );
            }, this);
        }
        return content;
    },
    
    render() {
        return (
            <CollapsibleParagraph
                title={getLangText('API Integration')}
                defaultExpanded={this.props.defaultExpanded}>
                <Form
                    url={ApiUrls.applications}
                    handleSuccess={this.handleCreateSuccess}>
                    <Property
                        name='name'
                        label={getLangText('Application Name')}>
                        <input
                            type="text"
                            placeholder={getLangText('Enter the name of your app')}
                            required/>
                    </Property>
                    <hr />
                </Form>
                <pre>
                    Usage: curl &lt;url&gt; -H 'Authorization: Bearer &lt;token&gt;'
                </pre>
                {this.getApplications()}
            </CollapsibleParagraph>
        );
    }
});

export default APISettings;