import React from 'react';
import AltContainer from 'alt/AltContainer';
import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';


let Header = React.createClass({

    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserStore.listen(this.onChange)
        UserActions.fetchCurrentUser();
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        return (
            <nav className="navbar navbar-default navbar-fixed-top">
              <div className="container">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand" href="#">
                       <span>ascribe</span> 
                       <span className="glyph-ascribe-spool-chunked"></span>
                  </a>
                </div>
                <div id="navbar" className="navbar-collapse collapse">
                  <ul className="nav navbar-nav navbar-right">
                    <li className="dropdown">
                      <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{this.state.currentUser.username} <span className="caret"></span></a>
                      <ul className="dropdown-menu" role="menu">
                        <li><a href="/art/faq/">Account Settings</a></li>
                        <li className="divider"></li>
                        <li><a href="/art/faq/">FAQ</a></li>
                        <li><a href="/art/terms/">Terms of Service</a></li>
                        <li className="divider"></li>
                        <li><a href="/api/users/logout/">Log out</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
        )
    }
});

export default Header;
