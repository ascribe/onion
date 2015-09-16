'use strict';

import React from 'react';

import UserStore from '../../stores/user_store';
import UserActions from '../../actions/user_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';
import InputCheckbox from '../ascribe_forms/input_checkbox';
import CollapsibleParagraph from '../ascribe_collapsible/collapsible_paragraph';

import CopyrightAssociationForm from '../ascribe_forms/form_copyright_association';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';

import { getLangText } from '../../utils/lang_utils';

let AccountSettings = React.createClass({
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

    handleSuccess(){
        UserActions.fetchCurrentUser();
        let notification = new GlobalNotificationModel(getLangText('Settings succesfully updated'), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getFormDataProfile(){
        return {'email': this.state.currentUser.email};
    },
    
    render() {
        let content = <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />;
        let profile = null;

        if (this.state.currentUser.username) {
            content = (
                <Form
                    url={ApiUrls.users_username}
                    handleSuccess={this.handleSuccess}>
                    <Property
                        name='username'
                        label={getLangText('Username')}>
                        <input
                            type="text"
                            defaultValue={this.state.currentUser.username}
                            placeholder={getLangText('Enter your username')}
                            required/>
                    </Property>
                    <Property
                        name='email'
                        label={getLangText('Email')}
                        editable={false}>
                        <input
                            type="text"
                            defaultValue={this.state.currentUser.email}
                            placeholder={getLangText('Enter your username')}
                            required/>
                    </Property>
                    <hr />
                </Form>
            );
            profile = (
                <Form
                    url={ApiUrls.users_profile}
                    handleSuccess={this.handleSuccess}
                    getFormData={this.getFormDataProfile}>
                    <Property
                        name="hash_locally"
                        className="ascribe-settings-property-collapsible-toggle"
                        style={{paddingBottom: 0}}>
                        <InputCheckbox
                            defaultChecked={this.state.currentUser.profile.hash_locally}>
                            <span>
                                {' ' + getLangText('Enable hash option, e.g. slow connections or to keep piece private')}
                            </span>
                        </InputCheckbox>
                    </Property>
                    <hr />
                    {/*<Property
                        name='language'
                        label={getLangText('Choose your Language')}
                        editable={true}>
                        <select id="select-lang" name="language">
                            <option value="fr">
                                Fran&ccedil;ais
                            </option>
                            <option value="en"
                                    selected="selected">
                                English
                            </option>
                        </select>
                    </Property>*/}
                </Form>
            );
        }
        return (
            <CollapsibleParagraph
                title={getLangText('Account')}
                show={true}
                defaultExpanded={true}>
                {content}
                <CopyrightAssociationForm currentUser={this.state.currentUser}/>
                {profile}
                {/*<Form
                    url={AppConstants.serverUrl + 'api/users/set_language/'}>
                    <Property
                        name='language'
                        label={getLangText('Choose your Language')}
                        editable={true}>
                        <select id="select-lang" name="language">
                            <option value="fr">
                                Fran&ccedil;ais
                            </option>
                            <option value="en"
                                    selected="selected">
                                English
                            </option>
                        </select>
                    </Property>
                    <hr />
                </Form>*/}
            </CollapsibleParagraph>
        );
    }
});

export default AccountSettings;