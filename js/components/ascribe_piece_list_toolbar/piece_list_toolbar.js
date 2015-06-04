import React from 'react';

import PieceListStore from '../../stores/piece_list_store';
import PieceListActions from '../../actions/piece_list_actions';

import Input from 'react-bootstrap/lib/Input';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import PieceListToolbarFilterWidgetFilter from './piece_list_toolbar_filter_widget';

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

    componentWillUnmount() {
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
                            <div className="col-xs-12 col-md-12 col-md-5 col-lg-4 col-sm-offset-1 col-md-offset-2 col-lg-offset-2 clear-paddings">
                                <div className="form-inline">
                                    <Input type='text' ref="search" placeholder="Search..." onChange={this.searchFor} addonAfter={searchIcon} />
                                    &nbsp;&nbsp;
                                    {/*<PieceListToolbarFilterWidgetFilter />*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default PieceListToolbar;