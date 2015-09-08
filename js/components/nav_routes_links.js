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

    extractLinksFromRoutes(node, userAcl, i) {
        if(!node) {
            return;
        }

        let links = node.props.children.map((child, j) => {

            let childrenFn = null;

            if(child.props.children && child.props.children.length > 0) {
                childrenFn = this.extractLinksFromRoutes(child, userAcl, i++);
            }

            let { aclName, headerTitle, name, children } = child.props;
            if(headerTitle && typeof headerTitle === 'string') {

                if(aclName && typeof aclName !== 'undefined') {
                    return (
                        <AclProxy
                            aclName={aclName}
                            aclObject={this.props.userAcl}>
                            <NavRoutesLinksLink
                                key={j}
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