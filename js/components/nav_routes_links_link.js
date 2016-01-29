'use strict';

import React from 'react';

import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NavItem from 'react-bootstrap/lib/NavItem';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';


let NavRoutesLinksLink = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        disabled: React.PropTypes.bool,
        depth: React.PropTypes.number,
        headerTitle: React.PropTypes.string,
        routePath: React.PropTypes.string
    },

    render() {
        const { children, headerTitle, depth, disabled, routePath } = this.props;

        // if the route has children, we're returning a DropdownButton that will get filled
        // with MenuItems
        if (children) {
            return (
                <DropdownButton
                    disabled={disabled}
                    id={`nav-route-${headerTitle.toLowerCase()}-dropdown`}
                    title={headerTitle}>
                    {children}
                </DropdownButton>
            );
        } else {
            if (depth === 1) {
                // if the node's child is actually a node of level one (a child of a node), we're
                // returning a DropdownButton matching MenuItem
                return (
                    <LinkContainer
                        disabled={disabled}
                        to={routePath}>
                        <MenuItem>{headerTitle}</MenuItem>
                    </LinkContainer>
                );
            } else if (depth === 0) {
                return (
                    <LinkContainer
                        disabled={disabled}
                        to={routePath}>
                        <NavItem>{headerTitle}</NavItem>
                    </LinkContainer>
                );
            } else {
                return null;
            }
        }
    }
});

export default NavRoutesLinksLink;
