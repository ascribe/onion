'use strict';

import React from 'react';

import Nav from 'react-bootstrap/lib/Nav';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItemLink from 'react-router-bootstrap/lib/MenuItemLink';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

import { sanitizeList } from '../utils/general_utils';


let NavRoutesLinks = React.createClass({
    propTypes: {
        routes: React.PropTypes.element
    },

    extractLinksFromRoutes(node, i) {
        if(!node) {
            return;
        }

        node = node.props;

        let links = node.children.map((child, j) => {

            // check if this a candidate for a link generation
            if(child.props.headerTitle && typeof child.props.headerTitle === 'string') {

                // also check if it is a candidate for generating a dropdown menu
                if(child.props.children && child.props.children.length > 0) {
                    return (
                        <DropdownButton title={child.props.headerTitle} key={j}>
                            {this.extractLinksFromRoutes(child, i++)}
                        </DropdownButton>
                    );
                } else if(i === 1) {
                    // if the node's child is actually a node of level one (a child of a node), we're
                    // returning a DropdownButton matching MenuItemLink
                    return (
                        <MenuItemLink to={child.props.name} key={j}>{child.props.headerTitle}</MenuItemLink>
                    );
                } else if(i === 0) {
                    return (
                        <NavItemLink to={child.props.name} key={j}>{child.props.headerTitle}</NavItemLink>
                    );
                } else {
                    return null;
                }
            } else {
                return null;
            }
        });

        // remove all nulls from the list of generated links
        return sanitizeList(links);
    },

    render() {
        return (
            <Nav {...this.props}>
                {this.extractLinksFromRoutes(this.props.routes, 0)}
            </Nav>
        );
    }
});

export default NavRoutesLinks;