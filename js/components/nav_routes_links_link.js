import React from 'react';

import MenuItem from 'react-bootstrap/lib/MenuItem';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';


const NavRoutesLinksLink = React.createClass({
    propTypes: {
        children: React.PropTypes.node,
        depth: React.PropTypes.number,
        disabled: React.PropTypes.bool,
        headerTitle: React.PropTypes.string,
        routePath: React.PropTypes.string

        // All other props are passed through to the backing NavItem, or NavDropdown
    },

    render() {
        const { children, headerTitle, depth, disabled, routePath, ...props } = this.props;

        // if the route has children, we're returning a DropdownButton that will get filled
        // with MenuItems
        if (children) {
            return (
                <NavDropdown
                    {...props}
                    disabled={disabled}
                    id={`nav-route-${headerTitle.toLowerCase()}-dropdown`}
                    title={headerTitle}>
                    {children}
                </NavDropdown>
            );
        } else {
            if (depth === 1) {
                // if the node's child is actually a node of level one (a child of a node), we're
                // returning a MenuItem for the containing NavDropdown
                return (
                    <LinkContainer
                        {...props}
                        disabled={disabled}
                        to={routePath}>
                        <MenuItem>{headerTitle}</MenuItem>
                    </LinkContainer>
                );
            } else if (depth === 0) {
                return (
                    <LinkContainer
                        {...props}
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
