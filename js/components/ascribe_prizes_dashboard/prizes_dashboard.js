'use strict';

import React from 'react';

import PrizeListActions from '../../actions/prize_list_actions';
import PrizeListStore from '../../stores/prize_list_store';

import Table from '../ascribe_table/table';
import TableItem from '../ascribe_table/table_item';
import TableItemText from '../ascribe_table/table_item_text';

import { ColumnModel} from '../ascribe_table/models/table_models';
import { getLangText } from '../../utils/lang_utils';

let PrizesDashboard = React.createClass({

    getInitialState() {
        return PrizeListStore.getState();
    },

    componentDidMount() {
        PrizeListStore.listen(this.onChange);
        PrizeListActions.fetchPrizeList();
    },

    componentWillUnmount() {
        PrizeListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getColumnList() {
        return [
            new ColumnModel(
                (item) => {
                    return {
                        'content': item.name
                    }; },
                    'name',
                    getLangText('Name'),
                    TableItemText,
                    6,
                    false,
                    null
            ),
            new ColumnModel(
                (item) => {
                    return {
                        'content': item.domain
                    }; },
                    'domain',
                    getLangText('Domain'),
                    TableItemText,
                    1,
                    false,
                    null
            )
        ];
    },

    render() {
        return (
            <Table
                responsive
                className="ascribe-table"
                columnList={this.getColumnList()}
                itemList={this.state.prizeList}>
                {this.state.prizeList.map((item, i) => {
                    return (
                         <TableItem
                            className="ascribe-table-item-selectable"
                            key={i}/>
                    );
                })}
            </Table>
        );
    }
});

export default PrizesDashboard;