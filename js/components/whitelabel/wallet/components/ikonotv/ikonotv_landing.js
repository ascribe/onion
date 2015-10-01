'use strict';

import React from 'react';

import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import { getLangText } from '../../../../../utils/lang_utils';


let IkonotvLanding = React.createClass({
    propTypes: {
        location: React.PropTypes.object
    },

    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getEnterButton() {
        let redirect = 'login';

        if(this.state.currentUser && this.state.currentUser.email) {
            redirect = 'pieces';
        }
        else if (this.props.location.query && this.props.location.query.redirect) {
            redirect = this.props.location.query.redirect;
        }
        return (
            <ButtonLink to={redirect} query={this.props.location.query}>
                {getLangText('ENTER TO START')}
            </ButtonLink>
        );
    },

    render() {
        return (
            <div className="ikonotv-landing">
                <header>
                    <img src="https://s3-us-west-2.amazonaws.com/ascribe0/whitelabel/ikonotv/ikono_tv.png" />
                    <div className="tagline">
                        <h1>PROTECT</h1>
                        <div className="poster">
                            <div className="content">
                            </div>
                        </div>
                        <h1>&amp; SHARE</h1>
                    </div>
                    <h2>Welcome to the ikonoTV<br />Registration Page</h2>
                </header>
                <article>
                    <section>
                        <h1>
                            ONLINE-ONLY FOR YOUR PROTECTION
                        </h1>
                        <p>
                            As an entirely digital broadcasting and licensing company we’re always keen to properly handle the content that artists, museums, and archives consign to us. The main concern with art online is the risk it will be misused. Thanks to our partnership with ascribe.io, we can address that issue in a way that is faster and more efficient for our users.
                            Using ascribe means we can do away with paper contracts and replace them with an online-only version. Partnering with ascribe also means we can encrypt digital work once it is uploaded. This revolutionary service will allow you to keep track of your works and share without worry.
                        </p>
                    </section>
                    <section>
                        <h1>
                            NEW SUBSCRIPTION SERVICE
                        </h1>
                        <p>
                            IkonoTV has developed an app that provides playlists on demand—soon to be available on all online devices and SmartTVs. We can now offer the possibility of a share in revenue to compensate for the artist’s work.
                        </p>
                    </section>
                    <section>
                        <h1>
                            THE RAPID GROWTH OF IkonoTV
                        </h1>
                        <p>
                            In October 2014, our first app was installed on Amazon Fire TV. During the first month it was downloaded 200 times, and jumped to 5,000 by the second month. Today, we’re well over the 285,000 mark, making us the number one app in our category in the US, Canada, UK and Germany.
                        </p>
                    </section>
                    <section>
                        <h1>
                            FULL TRANSPARENCY
                        </h1>
                        <p>
                            We expect a similar success with each SmartTV brand. For us, this marks the beginning of a new way to offer hassle-free licensing to visual artists—and we’re very proud to be an integral part of this virtual market. In the future, should we plan anything not directly mentioned in the contract, we will always make sure to secure the artist’s approval first. ikonoTV was developed to serve art and artists, and for this reason it’s of the utmost importance to us to respect this relationship. Thanks to you, we now look forward to our next big step.
                        </p>
                    </section>
                    <footer>
                        <p>Elizabeth Markevitch</p>
                        <p>Founder &amp; CEO Markevitch Media GmbH</p>
                        {this.getEnterButton()}
                    </footer>
                </article>
            </div>
        );
    }
});

export default IkonotvLanding;
