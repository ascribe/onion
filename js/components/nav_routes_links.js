'use strict';

import React from 'react';

import Nav from 'react-bootstrap/lib/Nav';

import AclProxy from './acl_proxy';
import NavRoutesLinksLink from './nav_routes_links_link';

import { sanitizeList } from '../utils/general';


const DISABLE_ENUM = ['hasPieces', 'noPieces'];

let NavRoutesLinks = React.createClass({
    propTypes: {
        hasPieces: React.PropTypes.bool,
        routes: React.PropTypes.arrayOf(React.PropTypes.object),
        userAcl: React.PropTypes.object
    },

    isRouteDisabled(disableOn) {
        const { hasPieces } = this.props;

        if (disableOn) {
            if (!DISABLE_ENUM.includes(disableOn)) {
                throw new Error(`"disableOn" must be one of: [${DISABLE_ENUM.join(', ')}] got "${disableOn}" instead`);
            }

            if (disableOn === 'hasPieces') {
                return hasPieces;
            } else if (disableOn === 'noPieces') {
                return !hasPieces;
            }
        }
    },

    /**
     * This method generates a bunch of react-bootstrap specific links
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
        if (!node) {
            return;
        }

        const links = node.childRoutes.map((child, j) => {
            const { aclName, disableOn, headerTitle, path, childRoutes } = child;

            // We validate if the user has set the title correctly,
            // otherwise we're not going to render his route
            if (headerTitle && typeof headerTitle === 'string') {
                let nestedChildren = null;

                // If the node has children that could be rendered, then we want
                // to execute this function again with the child as the root
                //
                // Otherwise we'll just pass nestedChildren as false
                if (child.childRoutes && child.childRoutes.length) {
                    nestedChildren = this.extractLinksFromRoutes(child, userAcl, i++);
                }

                const navLinkProps = {
                    headerTitle,
                    children: nestedChildren,
                    depth: i,
                    disabled: this.isRouteDisabled(disableOn),
                    routePath: `/${path}`
                };

                // if there is an aclName present on the route definition,
                // we evaluate it against the user's acl
                if (aclName && typeof aclName !== 'undefined') {
                    return (
                        <AclProxy
                            key={j}
                            aclName={aclName}
                            aclObject={this.props.userAcl}>
                            <NavRoutesLinksLink {...navLinkProps} />
                        </AclProxy>
                    );
                } else {
                    return (
                        <NavRoutesLinksLink
                            key={j}
                            {...navLinkProps} />
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
        const {routes, userAcl} = this.props;

        return (
            <Nav {...this.props}>
                {this.extractLinksFromRoutes(routes[0], userAcl, 0)}
            </Nav>
        );
    }
});

export default NavRoutesLinks;
