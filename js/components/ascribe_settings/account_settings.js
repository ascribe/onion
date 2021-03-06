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
import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang_utils';

let AccountSettings = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        loadUser: React.PropTypes.func.isRequired,
        whitelabel: React.PropTypes.object.isRequired
    },

    handleSuccess() {
        this.props.loadUser(true);

        const notification = new GlobalNotificationModel(getLangText('Settings succesfully updated'), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getFormDataProfile() {
        return { 'email': this.props.currentUser.email };
    },

    render() {
        const { currentUser, whitelabel } = this.props;
        let content = <AscribeSpinner color='dark-blue' size='lg' />;
        let profile = null;

        if (currentUser.username) {
            content = (
                <Form
                    url={ApiUrls.users_username}
                    handleSuccess={this.handleSuccess}>
                    <Property
                        name='username'
                        label={getLangText('Username')}>
                        <input
                            type="text"
                            defaultValue={currentUser.username}
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
                            defaultValue={currentUser.email}
                            placeholder={getLangText('Enter your username')}
                            required/>
                    </Property>
                    <hr />
                </Form>
            );
            profile = (
                <AclProxy
                    aclObject={whitelabel}
                    aclName="acl_view_settings_account_hash">
                    <Form
                        url={ApiUrls.users_profile}
                        handleSuccess={this.handleSuccess}
                        getFormData={this.getFormDataProfile}>
                        <Property
                            name="hash_locally"
                            className="ascribe-property-collapsible-toggle">
                            <InputCheckbox
                                defaultChecked={currentUser.profile.hash_locally}>
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
                    aclObject={whitelabel}
                    aclName="acl_view_settings_copyright_association">
                    <CopyrightAssociationForm currentUser={currentUser} />
                </AclProxy>
                {profile}
            </CollapsibleParagraph>
        );
    }
});

export default AccountSettings;
