import React from 'react';

import PieceListStore from '../../stores/piece_list_store';
import PieceListActions from '../../actions/piece_list_actions';

import Input from 'react-bootstrap/lib/Input';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';

let PieceListToolbar = React.createClass({

    getInitialState() {
        return PieceListStore.getState();
    },

    onChange(state) {
        this.setState(state);
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
    },

    componentDidUnmount() {
        PieceListStore.unlisten(this.onChange);
    },

    searchFor() {
         let searchTerm = this.refs.search.getInputDOMNode().value;
         PieceListActions.fetchPieceList(this.state.page, this.pageSize, searchTerm, this.state.orderBy, this.state.orderAsc);
    },

    render() {
        let searchIcon = <Glyphicon glyph='search' />;

        return (
            <div className={this.props.className}>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="row">
                            <div className="ascribe-piece-list-toolbar-search form-inline col-md-3 col-md-offset-right-2 pull-right">
                                <Input type='text' ref="search" placeholder="Search..." onChange={this.searchFor} addonAfter={searchIcon} />
                                &nbsp;&nbsp;
                                <Button>
                                    <Glyphicon glyph='filter' />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default PieceListToolbar;