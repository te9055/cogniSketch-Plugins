import {mainTemplate} from "./templates/examplePaneTemplates.js";
import {
    getSessionValue,
    removeSessionValue
} from "/javascripts/interface/data.js";
import {getPaneElement, closeTab} from "/javascripts/interface/ui.js";
import {createHtmlUsing} from "/javascripts/interface/html.js";

/**
 * The standard definition for this pane.
 *
 * @type {csPaneDefinition}
 */
export const config = {
    'paneName': 'Example',
    'hidden': true,
    'closeable': true,
    'callbacks': {
        'initialise': cbInitialise,
        'render': cbRender,
        'clear': cbClear,
        'close': cbClose
    }
};

/**
 * Called when the pane is first loaded.
 */
function cbInitialise() {
    /* Nothing is needed */
}

/**
 * Called when the pane is cleared.
 */
function cbClear() {
    /* Nothing is needed */
}

/**
 * Generic function to be called whenever the pane needs to be rendered.
 * Just render the text on the node.
 */
function cbRender() {
    let exNode = getSessionValue('exampleNode');

    createHtml(exNode);
}

/**
 * This function is called when the tab is closed.
 */
function cbClose() {
    removeSessionValue('example');
}

/**
 * Create the html for this example pane.
 *
 * @param {[string[]]} cleanData      the raw text data that is to be displayed.
 */
function createHtml(exNode) {
    let parent = getPaneElement(config.paneName);

    if (parent) {
        createHtmlUsing(parent, mainTemplate, calculateExamplePaneConfig(exNode));
    }
}

/**
 * Create the configuration for this example pane.
 *
 * @return {csTemplateConfig}       the template configuration.
 */
function calculateExamplePaneConfig(exNode) {
    let config = {
        'html': {
            'label': exNode.getLabel(),
            'text': exNode.getPropertyNamed('text')
        },
        'events': []
    };

    return config;
}
