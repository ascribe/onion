'use strict';

import React from 'react';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from './form';
import Property from './property';

import { currentUserShape } from '../prop_types';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';

import { getLangText } from '../../utils/lang_utils';
import { withCurrentUser } from '../../utils/react_utils';


const { bool } = React.PropTypes;

const CopyrightAssociationForm = React.createClass({
    propTypes: {
        // Injected through HOCs
        currentUser: currentUserShape.isRequired,
    },

    handleSubmitSuccess() {
        const notification = new GlobalNotificationModel(getLangText('Copyright association updated'), 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getProfileFormData() {
        return { email: this.props.currentUser.email };
    },

    render() {
        const { currentUser } = this.props;
        const selectDefaultValue = ' -- ' + getLangText('select an association') + ' -- ';

        let selectedState = selectDefaultValue;
        if (currentUser.profile && currentUser.profile.copyright_association) {
            if (AppConstants.copyrightAssociations.indexOf(currentUser.profile.copyright_association) !== -1) {
                selectedState = AppConstants.copyrightAssociations[selectedState];
            }
        }

        if (currentUser.email) {
            return (
                <Form
                    ref='form'
                    url={ApiUrls.users_profile}
                    getFormData={this.getProfileFormData}
                    handleSuccess={this.handleSubmitSuccess}>
                    <Property
                        name="copyright_association"
                        className="ascribe-property-collapsible-toggle"
                        label={getLangText('Copyright Association')}>
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
        } else {
            return null;
        }
    }
});

export default withCurrentUser(CopyrightAssociationForm);
