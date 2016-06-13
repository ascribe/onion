import React from 'react';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import PieceListStore from '../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../actions/piece_list_actions';

import PieceStore from '../../../../../stores/piece_store';
import PieceActions from '../../../../../actions/piece_actions';

import MarketAdditionalDataForm from './market_forms/market_additional_data_form';

import Property from '../../../../ascribe_forms/property';
import RegisterPieceForm from '../../../../ascribe_forms/form_register_piece';

import SlidesContainer from '../../../../ascribe_slides_container/slides_container';

import withContext from '../../../../context/with_context';
import { locationShape, routerShape, whitelabelShape } from '../../../../prop_types';

import { setDocumentTitle } from '../../../../../utils/dom';
import { mergeOptions } from '../../../../../utils/general';
import { getLangText } from '../../../../../utils/lang';


let MarketRegisterPiece = React.createClass({
    propTypes: {
        // Injected through HOCs
        router: routerShape.isRequired,
        location: locationShape.isRequired,
        whitelabel: whitelabelShape.isRequired
    },

    getInitialState(){
        return mergeOptions(
            PieceListStore.getState(),
            PieceStore.getInitialState(),
            {
                step: 0
            });
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        PieceStore.listen(this.onChange);

        const queryParams = this.props.location.query;

        // Load the correct piece if the user loads the second step directly
        // by pressing on the back button or using the url
        // We're using 'in' here as we want to know if 'piece_id' is present in the url,
        // we don't care about the value.
        if ('piece_id' in queryParams) {
            PieceActions.fetchPiece(queryParams.piece_id);
        }
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        PieceStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleRegisterSuccess(response) {
        this.refreshPieceList();

        // Also load the newly registered piece for the next step
        if (response && response.piece) {
            PieceActions.updatePiece(response.piece);
        }

        this.nextSlide({ piece_id: response.piece.id });
    },

    handleAdditionalDataSuccess() {
        this.refreshPieceList();

        this.props.router.push('/collection');
    },

    nextSlide(queryParams) {
        // We need to increase the step to lock the forms that are already filled out
        this.setState({
            step: this.state.step + 1
        });

        this.refs.slidesContainer.nextSlide(queryParams);
    },

    refreshPieceList() {
        const { filterBy, orderAsc, orderBy, page, pageSize, search } = this.state;

        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });
    },

    render() {
        const { whitelabel: { name: whitelabelName = 'Market' } } = this.props;
        const { piece, step } = this.state;

        setDocumentTitle(getLangText('Register a new piece'));

        return (
            <SlidesContainer
                ref="slidesContainer"
                forwardProcess={true}
                glyphiconClassNames={{
                    pending: 'glyphicon glyphicon-chevron-right',
                    completed: 'glyphicon glyphicon-lock'
                }}>
                <div data-slide-title={getLangText('Register work')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <RegisterPieceForm
                                {...this.props}
                                disabled={step > 0}
                                enableLocalHashing={false}
                                enableSeparateThumbnail={false}
                                handleSuccess={this.handleRegisterSuccess}
                                headerMessage={getLangText('Consign to %s', whitelabelName)}
                                isFineUploaderActive={true}
                                submitMessage={getLangText('Proceed to additional details')}>
                                <Property
                                    name="num_editions"
                                    label={getLangText('Specify editions')}>
                                    <input
                                        type="number"
                                        placeholder="(e.g. 32)"
                                        min={0}
                                        required />
                                </Property>
                            </RegisterPieceForm>
                        </Col>
                    </Row>
                </div>
                <div data-slide-title={getLangText('Additional details')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <MarketAdditionalDataForm
                                extraData={piece.extra_data}
                                handleSuccess={this.handleAdditionalDataSuccess}
                                otherData={piece.other_data}
                                pieceId={piece.id}
                                showHeading />
                        </Col>
                    </Row>
                </div>
            </SlidesContainer>
        );
    }
});

export default withContext(MarketRegisterPiece, 'location', 'router', 'whitelabel');
