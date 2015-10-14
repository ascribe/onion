'use strict';

import React from 'react';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';
import InputCheckbox from '../ascribe_forms/input_checkbox';
import CollapsibleParagraph from '../ascribe_collapsible/collapsible_paragraph';

import AclProxy from '../acl_proxy';

import CopyrightAssociationForm from '../ascribe_forms/form_copyright_association';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';

import { getLangText } from '../../utils/lang_utils';

let AccountSettings = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        loadUser: React.PropTypes.func.isRequired,
        whitelabel: React.PropTypes.object.isRequired
    },

    handleSuccess(){
        this.props.loadUser();
        let notification = new GlobalNotificationModel(getLangText('Settings succesfully updated'), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getFormDataProfile(){
        return {'email': this.props.currentUser.email};
    },
    
    render() {
        let content = <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />;
        let profile = null;

        if (this.props.currentUser.username) {
            content = (
                <Form
                    url={ApiUrls.users_username}
                    handleSuccess={this.handleSuccess}>
                    <Property
                        name='username'
                        label={getLangText('Username')}>
                        <input
                            type="text"
                            defaultValue={this.props.currentUser.username}
                            placeholder={getLangText('Enter your username')}
                            required/>
                    </Property>
                    <Property
                        name='email'
                        label={getLangText('Email')}
                        overrideForm={true}
                        editable={false}>
                        <input
                            type="text"
                            defaultValue={this.props.currentUser.email}
                            placeholder={getLangText('Enter your username')}
                            required/>
                    </Property>
                    <hr />
                </Form>
            );
            profile = (
                <AclProxy
                    aclObject={this.props.whitelabel}
                    aclName="acl_view_settings_account_hash">
                    <Form
                        url={ApiUrls.users_profile}
                        handleSuccess={this.handleSuccess}
                        getFormData={this.getFormDataProfile}>
                        <Property
                            name="hash_locally"
                            className="ascribe-settings-property-collapsible-toggle"
                            style={{paddingBottom: 0}}>
                            <InputCheckbox
                                defaultChecked={this.props.currentUser.profile.hash_locally}>
                                <span>
                                    {' ' + getLangText('Enable hash option, e.g. slow connections or to keep piece private')}
                                </span>
                            </InputCheckbox>
                        </Property>
                    </Form>
                </AclProxy>
            );
        }
        return (
            <CollapsibleParagraph
                title={getLangText('Account')}
                defaultExpanded={true}>
                {content}
                <AclProxy
                    aclObject={this.props.whitelabel}
                    aclName="acl_view_settings_copyright_association">
                    <CopyrightAssociationForm currentUser={this.props.currentUser}/>
                </AclProxy>
                {profile}
            </CollapsibleParagraph>
        );
    }
});

export default AccountSettings;