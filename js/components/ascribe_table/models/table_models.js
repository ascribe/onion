'use strict';

export class ColumnModel {
    // ToDo: Add validation for all passed-in parameters
    constructor(transformFn, columnName, displayName, displayType, rowWidth, canBeOrdered, transition, className) {
        this.transformFn = transformFn;
        this.columnName = columnName;
        this.displayName = displayName;
        this.displayType = displayType;
        this.rowWidth = rowWidth;
        this.canBeOrdered = canBeOrdered;
        this.transition = transition;
        this.className = className ? className : '';
    }
}

/**
 * If a user opens an editionList of a piece and clicks on a specific edition to go to the
 * piece detail page, all previously opened editionLists are still saved as show = true in the
 * pieceList store.
 *
 * So if the user now comes back to this view the old data will still be in this store,
 * since the browser wasn't able to load the new data (only containing show = undefined = false).
 *
 * This means that without closing all pieces after a transition, we'll get this flickering of editionLists.
 *
 * Since react-router does not implement a callback function for its transitionTo method, we have to do it
 * our selfes, using this TransitionModel.
 */
export class TransitionModel {
    constructor(to, queryKey, valueKey, callback) {
        this.to = to;
        this.queryKey = queryKey;
        this.valueKey = valueKey;
        this.callback = callback;
    }

    toReactRouterLinkProps(queryValue) {
        let props = {
            to: this.to,
            params: {}
        };

        props.params[this.queryKey] = queryValue;

        return props;
    }
}