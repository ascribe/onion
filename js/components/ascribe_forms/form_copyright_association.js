'use strict';

import React from 'react';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from './form';
import Property from './property';

import apiUrls from '../../constants/api_urls';
import appConstants from '../../constants/application_constants';

import { getLangText } from '../../utils/lang_utils';

let CopyrightAssociationForm = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object
    },

    handleSubmitSuccess(){
        let notification = getLangText('Copyright association updated');
        notification = new GlobalNotificationModel(notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getProfileFormData(){
        if (this.props.currentUser && this.props.currentUser.email){
            return {email: this.props.currentUser.email};
        }
        return null;
    },

    render() {
        let selectedState = -1;
        if (this.props.currentUser
            && this.props.currentUser.profile
            && this.props.currentUser.profile.copyright_association) {
            selectedState = appConstants.copyrightAssociations.indexOf(this.props.currentUser.profile.copyright_association);
        }
        return (
            <Form
                ref='form'
                url={apiUrls.users_profile}
                getFormData={this.getProfileFormData}
                handleSuccess={this.handleSubmitSuccess}>
                <Property
                    name="copyright_association"
                    className="ascribe-settings-property-collapsible-toggle"
                    label={getLangText('Copyright Association')}
                    style={{paddingBottom: 0}}>
                    <select name="contract">
                        <option disabled selected={selectedState === -1}>
                            {getLangText(' -- select an association -- ')}
                        </option>
                        {appConstants.copyrightAssociations.map((association, i) => {
                            return (
                                <option
                                    name={i}
                                    key={i}
                                    value={ association }
                                    selected={selectedState === i}>
                                    { association }
                                </option>
                            );
                        })}
                    </select>
                </Property>
                <hr />
            </Form>
        );
    }
});

export default CopyrightAssociationForm;