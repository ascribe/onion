'use strict';

import React from 'react';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from './form';
import Property from './property';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';

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
        return {email: this.props.currentUser.email};
    },

    render() {
        let selectedState;
        let selectDefaultValue = ' -- ' + getLangText('select an association') + ' -- ';

        if (this.props.currentUser && this.props.currentUser.profile
            && this.props.currentUser.profile.copyright_association) {
            selectedState = AppConstants.copyrightAssociations.indexOf(this.props.currentUser.profile.copyright_association);
            selectedState = selectedState !== -1 ? AppConstants.copyrightAssociations[selectedState] : selectDefaultValue;
        }

        if (this.props.currentUser && this.props.currentUser.email){
            return (
                <Form
                    ref='form'
                    url={ApiUrls.users_profile}
                    getFormData={this.getProfileFormData}
                    handleSuccess={this.handleSubmitSuccess}>
                    <Property
                        name="copyright_association"
                        className="ascribe-property-collapsible-toggle"
                        label={getLangText('Copyright Association')}
                        style={{paddingBottom: 0}}>
                        <select defaultValue={selectedState} name="contract">
                            <option
                                name={0}
                                key={0}
                                value={selectDefaultValue}>
                                {selectDefaultValue}
                            </option>
                            {AppConstants.copyrightAssociations.map((association, i) => {
                                return (
                                    <option
                                        name={i + 1}
                                        key={i + 1}
                                        value={association}>
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
        return null;
    }
});

export default CopyrightAssociationForm;