'use strict';

import React from 'react';

import LumenusSubmitButton from './lumenus_submit_button';

import AclProxy from '../../../../../acl_proxy';

import DeleteButton from '../../../../../ascribe_buttons/delete_button';

let LumenusAclButtonList = React.createClass({
    propTypes: {
        availableAcls: React.PropTypes.object.isRequired,
        className: React.PropTypes.string,
        editions: React.PropTypes.array,
        handleSuccess: React.PropTypes.func,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    render() {
        return (
            <div className={this.props.className}>
                <AclProxy
                    aclObject={this.props.availableAcls}
                    aclName={'acl_consign'}>
                    <LumenusSubmitButton
                        editions={this.props.editions}
                        handleSuccess={this.props.handleSuccess} />
                </AclProxy>
                {this.props.children}
            </div>
        );
    }
});

export default LumenusAclButtonList;
