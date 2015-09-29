'use strict';

import React from 'react';

import Nav from 'react-bootstrap/lib/Nav';

import NavRoutesLinksLink from './nav_routes_links_link';

import AclProxy from './acl_proxy';

import { sanitizeList } from '../utils/general_utils';


let NavRoutesLinks = React.createClass({
    propTypes: {
        routes: React.PropTypes.element,
        userAcl: React.PropTypes.object
    },

    /**
     * This method generales a bunch of react-bootstrap specific links
     * from the routes we defined in one of the specific routes.js file
     *
     * We can define a headerTitle as well as a aclName and according to that the
     * link will be created for a specific user
     * @param  {ReactElement} node    Starts at the very top of a routes files root
     * @param  {object} userAcl ACL object we use throughout the whole app
     * @param  {number} i       Depth of the route in comparison to the root
     * @return {Array}         Array of ReactElements that can be displayed to the user
     */
    extractLinksFromRoutes(node, userAcl, i) {
        if(!node) {
            return;
        }

        let links = node.props.children.map((child, j) => {
            let childrenFn = null;
            let { aclName, headerTitle, name, children } = child.props;

            // If the node has children that could be rendered, then we want
            // to execute this function again with the child as the root
            //
            // Otherwise we'll just pass childrenFn as false
            if(child.props.children && child.props.children.length > 0) {
                childrenFn = this.extractLinksFromRoutes(child, userAcl, i++);
            }

            // We validate if the user has set the title correctly,
            // otherwise we're not going to render his route
            if(headerTitle && typeof headerTitle === 'string') {
                // if there is an aclName present on the route definition,
                // we evaluate it against the user's acl
                if(aclName && typeof aclName !== 'undefined') {
                    return (
                        <AclProxy
                            key={j}
                            aclName={aclName}
                            aclObject={this.props.userAcl}>
                            <NavRoutesLinksLink
                                headerTitle={headerTitle}
                                routeName={name}
                                depth={i}
                                children={childrenFn}/>
                        </AclProxy>
                    );
                } else {
                    return (
                        <NavRoutesLinksLink
                            key={j}
                            headerTitle={headerTitle}
                            routeName={name}
                            depth={i}
                            children={childrenFn}/>
                    );
                }
            } else {
                return null;
            }

        });

        // remove all nulls from the list of generated links
        return sanitizeList(links);
    },

    render() {
        let {routes, userAcl} = this.props;

        return (
            <Nav {...this.props}>
                {this.extractLinksFromRoutes(routes, userAcl, 0)}
            </Nav>
        );
    }
});

export default NavRoutesLinks;