'use strict';

import React from 'react';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import CopyrightAssociationForm from '../ascribe_forms/form_copyright_association';
import Form from '../ascribe_forms/form';
import InputCheckbox from '../ascribe_forms/input_checkbox';
import Property from '../ascribe_forms/property';

import CollapsibleParagraph from '../ascribe_collapsible/collapsible_paragraph';

import AclProxy from '../acl_proxy';
import AscribeSpinner from '../ascribe_spinner';
import { currentUserShape, whitelabelShape } from '../prop_types';

import ApiUrls from '../../constants/api_urls';

import { getLangText } from '../../utils/lang_utils';
import { withCurrentUser, withWhitelabel } from '../../utils/react_utils';

let AccountSettings = React.createClass({
    propTypes: {
        loadUser: React.PropTypes.func.isRequired,

        // Injected through HOCs
        currentUser: currentUserShape.isRequired, // eslint-disable-line react/sort-prop-types
        whitelabel: whitelabelShape.isRequired // eslint-disable-line react/sort-prop-types
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
                    <CopyrightAssociationForm />
                </AclProxy>
                {profile}
            </CollapsibleParagraph>
        );
    }
});

export default withCurrentUser(withWhitelabel(AccountSettings));
