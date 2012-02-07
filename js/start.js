/**
 * Start module to wire up the MVC.
 */
jQuery(function () {

    /**
     * Model.
     */
    var tagGalleryModel = new TGNS.taggallerymodel();

    /**
     * View.
     */
    var tagGalleryView = new TGNS.taggalleryview();

    /**
     * Helper for manipulating the model.
     */
    var loader = new TGNS.loader();

    /**
     * Controller. Handles all the three previous objects.
     */
    var tagGalleryController = new TGNS.taggallerycontroller(loader, tagGalleryModel, tagGalleryView);

});