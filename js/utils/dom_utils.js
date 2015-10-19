'use strict';


/**
 * Get the number of unread notifications in the title.
 *
 * @return {int} the number of unread notifications
 */
function getUnreadCount() {
    const match = document.title.match(/^\((\d+)\)/);
    return match ? match[1] : null;
}


/**
 * Set the title in the browser window while keeping the unread notification count (if any).
 *
 * @return {string} the new document title
 */
export function setDocumentTitle(title) {
    const count = getUnreadCount();
    let newTitle = title;

    if (count) {
        newTitle = `(${count}) ` + newTitle;
    }

    document.title = newTitle;
    return newTitle;
}
