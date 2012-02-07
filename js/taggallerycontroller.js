/**
 * Module for controller.
 * @export TGNS.taggallerycontroller
 */
(function (TGNS) {

    /**
     * Thick controller of the MVC.
     * @constructor
     * @param {TGNS.loader} loader
     * @param {TGNS.taggallerymodel} model
     * @param {TGNS.taggalleryview} view
     */
    function TagGalleryController(loader, model, view) {
        this._loader = loader;
        this._model = model;
        this._model.setPhotos(this._loader.returnDynData());
        this._view = view;

        this._displayBigImg(0);

        pubsubz.subscribe( 'loadonemoreentry', this._loadOneMoreEntrySubscriber.bind(this) );
        pubsubz.subscribe( 'displaybigimg', this._displayBigImgSubscriber.bind(this) );
        pubsubz.subscribe( 'imageinfoloaded', this._imageInfoLoadedSubscriber.bind(this) );

        for (var i = 0; i < 5; i++) {
            this._generateOneEntry(i);
        }
    }

    /**
     * Local reference to the loader.
     * @private
     */
    TagGalleryController.prototype._loader = null;

    /**
     * Local reference to the model.
     * @private
     */
    TagGalleryController.prototype._model = null;

    /**
     * Local reference to the view.
     * @private
     */
    TagGalleryController.prototype._view = null;

    /**
     * Subcriber to the 'loadonemoreentry' event.
     * @private
     * @param {String} topics
     * @param {String} data
     */
    TagGalleryController.prototype._loadOneMoreEntrySubscriber = function (topics , data) {

        var newEndFocus = this._model.getEndFocus() + 1;

        this._generateOneEntry(newEndFocus);
        this._view.displayBigImg(this._model.getPhotos()[newEndFocus].urlBig);
        this._model.setEndFocus(newEndFocus);
    };

    /**
     * Subcriber to the 'displaybigimg' event.
     * @private
     * @param {String} topics
     * @param {jquery event} jEvent
     */
    TagGalleryController.prototype._displayBigImgSubscriber = function (topics , jEvent) {

        this._displayBigImg(jEvent.currentTarget.getAttribute("name"));
    };

    /**
     * Subcriber to the 'imageinfoloaded' event. (Generated on the loader.)
     * @private
     * @param {String} topics
     * @param {Object} data
     */
    TagGalleryController.prototype._imageInfoLoadedSubscriber = function (topics , data) {

        this._view.generateOneEntry(data.urlSmall, data.info, data.title, data.i);
    };

    /**
     * Displays the big image of the entry in focus.
     * @param {Number} i
     */
    TagGalleryController.prototype._displayBigImg = function (i) {
        this._view.displayBigImg(this._model.getPhotos()[i].urlBig);
    };

    /**
     * Generate a new entry.
     * @param {Number} i
     */
    TagGalleryController.prototype._generateOneEntry = function (i) {

        this._loader.loadOneEntry(i, this._model.getPhotos()[i].id);
    };

    TGNS.taggallerycontroller = TagGalleryController;
}(TGNS));