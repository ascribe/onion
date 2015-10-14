'use strict';

import { altThirdParty } from '../alt';
import EventActions from '../actions/event_actions';



class DebugHandler {
    constructor() {
        let symbols = [];

        for (let k in EventActions) {
            if (typeof EventActions[k] === 'symbol') {
                symbols.push(EventActions[k]);
            }
        }

        this.bindListeners({
            onWhateverEvent: symbols
        });
    }

    onWhateverEvent() {
        let args = arguments[0];
        let symbol = arguments[1];
        console.debug(symbol, args);
    }
}

export default altThirdParty.createStore(DebugHandler, 'DebugHandler');
