import React from 'react';
import withRouter from 'react-router/es6/withRouter';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import Property from './ascribe_forms/property';
import RegisterPieceForm from './ascribe_forms/form_register_piece';

import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


const RegisterPiece = React.createClass( {
    propTypes: {
        router: React.PropTypes.object.isRequired,

        headerMessage: React.PropTypes.string,
        submitMessage: React.PropTypes.string,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element,
            React.PropTypes.string
        ]),

        // Provided from AscribeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object.isRequired,

        // Provided from router
        location: React.PropTypes.object
    },

    getInitialState(){
        return PieceListStore.getState();
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleSuccess(response) {
        const { filterBy, orderAsc, orderBy, page, pageSize, search } = this.state;

        const notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        // once the user was able to register a piece successfully, we need to make sure to keep
        // the piece list up to date
        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });

        this.props.router.push(`/pieces/${response.piece.id}`);
    },

    getSpecifyEditions() {
        const { whitelabel } = this.props;

        if (whitelabel.acl_create_editions || Object.keys(whitelabel).length) {
            return (
                <Property
                    name="num_editions"
                    checkboxLabel={getLangText('Specify editions')}
                    expanded={false}>
                    <span>{getLangText('Editions')}</span>
                    <input
                        type="number"
                        placeholder="(e.g. 32)"
                        min={1}
                        max={100} />
                </Property>
            );
        }
    },

    render() {
        setDocumentTitle(getLangText('Register a new piece'));

        return (
            <Row className="no-margin">
                <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                    <RegisterPieceForm
                        {...this.props}
                        isFineUploaderActive={true}
                        handleSuccess={this.handleSuccess}>
                        {this.props.children}
                        {this.getSpecifyEditions()}
                    </RegisterPieceForm>
                </Col>
            </Row>
        );
    }
});


export default withRouter(RegisterPiece);
