'use strict';

import React from 'react';
import RegisterPiece from '../../../../register_piece';
import Property from '../../../../ascribe_forms/property';

import LicenseActions from '../../../../../actions/license_actions';
import LicenseStore from '../../../../../stores/license_store';

import { getLangText } from '../../../../../utils/lang_utils';
import { mergeOptions } from '../../../../../utils/general_utils';

let CCRegisterPiece = React.createClass({

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
                        <a
                            className="pull-right"
                            href={this.state.licenses[this.state.selectedLicense].url}
                            target="_blank">
                            {getLangText('Learn more')}
                        </a>
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
        return (
            <RegisterPiece
                enableLocalHashing={false}
                headerMessage={getLangText('Submit to Creative Commons')}
                submitMessage={getLangText('Submit')}>
                {this.getLicenses()}
            </RegisterPiece>
        );
    }
});

export default CCRegisterPiece;
