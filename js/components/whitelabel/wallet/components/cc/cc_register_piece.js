'use strict';

import React from 'react';
import RegisterPiece from '../../../../register_piece';
import Property from '../../../../ascribe_forms/property';

import LicenseActions from '../../../../../actions/license_actions';
import LicenseStore from '../../../../../stores/license_store';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { mergeOptions } from '../../../../../utils/general_utils';

let CCRegisterPiece = React.createClass({
    propTypes: {
        // Provided from AscribeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    getInitialState() {
        return mergeOptions(
            LicenseStore.getState(),
            {
                selectedLicense: 0
            }
        );
    },

    componentDidMount() {
        LicenseStore.listen(this.onChange);
        LicenseActions.fetchLicense();
    },

    componentWillUnmount() {
        LicenseStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    onLicenseChange(event){
        this.setState({selectedLicense: event.target.selectedIndex});
    },

    getLicenses() {
        if (this.state.licenses && this.state.licenses.length > 1) {
            return (
                <Property
                    name='license'
                    label={getLangText('Copyright license%s', '...')}
                    onChange={this.onLicenseChange}
                    footer={
                        <span className="pull-right">
                            <a
                                href={this.state.licenses[this.state.selectedLicense].url}
                                target="_blank">
                                {getLangText('Learn more about ') + this.state.licenses[this.state.selectedLicense].code}
                            </a>
                            &nbsp;(
                            <a
                                href='https://www.ascribe.io/faq/#legals'
                                target="_blank">
                                {getLangText('ascribe faq')}
                            </a>)
                        </span>
                    }>
                    <select name="license">
                        {this.state.licenses.map((license, i) => {
                            return (
                                <option
                                    name={i}
                                    key={i}
                                    value={ license.code }>
                                    { license.code.toUpperCase() }: { license.name }
                                </option>
                            );
                        })}
                    </select>
                </Property>);
        }
        return null;
    },

    render() {
        setDocumentTitle(getLangText('Register a new piece'));
        return (
            <RegisterPiece
                {...this.props}
                enableLocalHashing={false}
                headerMessage={getLangText('Register under a Creative Commons license')}
                submitMessage={getLangText('Submit')}
                location={this.props.location}>
                {this.getLicenses()}
            </RegisterPiece>
        );
    }
});

export default CCRegisterPiece;
