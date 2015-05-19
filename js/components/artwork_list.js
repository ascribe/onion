import React from 'react';
import Router from 'react-router';

import ArtworkListStore from '../stores/artwork_list_store';
import ArtworkListActions from '../actions/artwork_list_actions';

let Link = Router.Link;

var ArtworkList = React.createClass({
    getInitialState() {
        return ArtworkListStore.getState();
    },

    componentDidMount() {
        ArtworkListStore.listen(this.onChange);
        ArtworkListActions.fetchArtworkList();
    },

    componentWillUnmount() {
        ArtworkListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        return (
            <ul>
                {this.state.artworkList.map((artwork, i) => {
                    return (
                        <li key={i}><Link to="artwork" params={{'bitcoin_ID_noPrefix': artwork.bitcoin_ID_noPrefix}}>{artwork.title}</Link></li>
                    );
                })}
            </ul>
        );
    }
});

export default ArtworkList;
