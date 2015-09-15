'use strict';

import React from 'react';

import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItemLink from 'react-router-bootstrap/lib/MenuItemLink';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

let NavRoutesLinksLink = React.createClass({
    propTypes: {
        headerTitle: React.PropTypes.string,
        routeName: React.PropTypes.string,

        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),

        depth: React.PropTypes.number
    },

    render() {
        let { children, headerTitle, depth, routeName } = this.props;

        // if the route has children, we're returning a DropdownButton that will get filled
        // with MenuItemLinks
        if(children) {
            return (
                <DropdownButton title={headerTitle}>
                    {children}
                </DropdownButton>
            );
        } else {
            if(depth === 1) {
                // if the node's child is actually a node of level one (a child of a node), we're
                // returning a DropdownButton matching MenuItemLink
                return (
                    <MenuItemLink to={routeName}>{headerTitle}</MenuItemLink>
                );
            } else if(depth === 0) {
                return (
                    <NavItemLink to={routeName}>{headerTitle}</NavItemLink>
                );
            } else {
                return null;
            }
        }
    }
});

export default NavRoutesLinksLink;