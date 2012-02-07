/**
 * Module for the view.
 * @export TGNS.taggalleryview
 */
(function (TGNS, jQuery) {

    /**
     * Thin view of the MVC.
     * @constructor
     */
    function TagGalleryView() {

        this._initEvents();
    }

    /**
     * Installa user events and asigns their handlers.
     * @private
     */
    TagGalleryView.prototype._initEvents = function () {

        jQuery('p#load_button').bind('click', this._loadOnMoreEntryHandler.bind(this));
        jQuery('div#entries').delegate('div.entry', 'click', this._displayBigImgHandler.bind(this));
    };

    /**
     * Handler of the load one more entry event.
     * @private
     */
    TagGalleryView.prototype._loadOnMoreEntryHandler = function () {
        pubsubz.publish('loadonemoreentry', 'Load One More Entry!');
    };

    /**
     * Handler of the display the big image of the entry event.
     * @private
     * @param {jquery event} jEvent
     */
    TagGalleryView.prototype._displayBigImgHandler = function (jEvent) {
        pubsubz.publish('displaybigimg', jEvent);
    };

    /**
     * Displays the big image of the entry.
     * @public
     * @param {String} url
     */
    TagGalleryView.prototype.displayBigImg = function (url) {
        jQuery('div#content').css('background-image', 'url(' + url + ')');
    };

    /**
     * Generates and displays one more entry in the sidebar.
     * @public
     * @param {String} url
     * @param {String} info
     * @param {String} title
     * @param {Number} i
     */
    TagGalleryView.prototype.generateOneEntry = function (url, info, title, i) {

        var jDivEntry = jQuery('<div class="entry"></div>').attr('name', i),
            jDivClosure = jQuery('<div class="closure"></div>'),
            jImg = jQuery('<img width="75px" height="75px" />').attr({src: url, alt: title}),
            jPTitle = jQuery('<p class="title"></p>').text(title),
            jDivClearing = jQuery('<div class="clearing"></div>'),
            jPInfo = jQuery('<p class="info"></p>').text(info);

        jDivClosure.append(jImg).append(jPTitle);
        jDivEntry.append(jDivClosure).append(jDivClearing).append(jPInfo).css('display', 'none');
        jQuery('div#entries').append(jDivEntry);
        jDivEntry.fadeIn('slow', function () {
             jQuery('div#sidebar').animate({scrollTop: (jQuery('div#for_scroll').height() - jQuery('div#sidebar').height())});
        });
    };

    TGNS.taggalleryview = TagGalleryView;
}(TGNS, jQuery));