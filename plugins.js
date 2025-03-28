/**
 * MIT License
 *
 * Copyright (c) 2022 International Business Machines
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

/**
 * @file This is the list of all plugins to be included in this application.
 *
 * @author Dave Braines

 * Plugins provide additional templates beyond the core application, for example one or more of: new palette types,
 * functions, panes or popups.
 *
 * The plugin structure is as follows:
 *  {string} name               The unique name of the plugin
 *  {object[]} [imports]        A list of any imports (from NodeJS modules that are required to be processed to
 *                              start up to ensure they are made available to the client for usage.  These must
 *                              correlate to modules specified in the package.json file for the plugin.
 *                              Each entry is an object that specifies two properties:
 *                                  root - the relative path to be exposed.
 *                                  path - the location within the plugin structure which will be exposed.
 *  {object[]} [routes]         A list of any server side capabilities that are defined by this plugin and which
 *                              will be made available as server HTTP services for this plugin.  These must
 *                              correlate to server javascript files provided within the plugin folder structure.
 *                              Each entry is an object that specifies two properties:
 *                                  root - the relative path to be exposed.
 *                                  path - the location within the plugin structure which will be exposed.
 *  {string[]} [scripts]        A list of javascript files that will be loaded automatically as the page is loaded,
 *                              these are relative paths inside the plugin folder structure.
 *  {string[]} [panes]          A list of the names of any panes that are provided by this plugin.  This should
 *                              correspond to files within the plugin folder structure that define each pane.
 *                              e.g. "new_pane" corresponds to /panes/new_pane/new_pane.js
 *  {string[]} [actions]        A list of the names of any actions that are provided by this plugin (i.e. new
 *                              palette types with special actions defined).  This should correspond to files within
 *                              the plugin folder structure that define each action.
 *                              e.g. "new_action" corresponds to /actions/new_action.js
 *  {string[]} [functions]      A list of the names of any functions that are provided by this plugin (i.e. new
 *                              function items with special code defined).  This should correspond to files within
 *                              the plugin folder structure that define each function.
 *                              e.g. "new_function" corresponds to /functions/new_function.js
 *  {string[]} [stylesheets]    A list of css stylesheet files that will be loaded automatically as the page
 *                              is loaded.
 *  {object} [creds]            A list of any server-side credentials that are needed for this plugin.  These can be
 *                              any name-value pair within the object, and care should be taken not to commit these
 *                              into any repositories.  They are available only to the server and cannot be accessed
 *                              via HTTP requests from the client (e.g. "list plugins").
 *  {object} [client_creds]     A list of any client-side credentials that are needed for this plugin.  These can be
 *                              any name-value pair within the object, and care should be taken not to commit these
 *                              into any repositories.  They are provided to the client encrypted within the cookie
 *                              and can be decrypted and accessed by any client code running within the application.
 **/

/** Module exports */
module.exports = {
    "core": {
        "panes": ['canvas', 'table', 'admin', 'help'],
        "actions": ['email', 'file', 'image', 'text', 'video', 'web', 'json'],
        "functions": []
    },
    "paneOrder": ['canvas', 'table', 'admin', 'help'],
    "plugins": [{
        'name': 'sentiment',
        'routes': [
            { 'root': '/sentiment', 'path': 'sentiment.js' }
        ],
        'stylesheets': [ 'sentiment.css' ],
        'functions': [ 'sentimentFunction' ]
    },
        {
            'name': 'ner',
            'routes': [
                { 'root': '/ner', 'path': 'ner.js' }
            ],
            'stylesheets': [ 'ner.css' ],
            'functions': [ 'nerFunction' ]
        },
        {
            'name': 'translate',
            'routes': [
                { 'root': '/translate', 'path': 'translate.js' }
            ],
            'stylesheets': [ 'translate.css' ],
            'functions': [ 'translateFunction' ]
        },
        {
            'name': 'collocation',
            'routes': [
                { 'root': '/collocation', 'path': 'collocation.js' }
            ],
            'stylesheets': [ 'collocation.css' ],
            'functions': [ 'collocationFunction' ]
        },
        {
            'name': 'concordance',
            'routes': [
                { 'root': '/concordance', 'path': 'concordance.js' }
            ],
            'stylesheets': [ 'concordance.css' ],
            'functions': [ 'concordanceFunction' ]
        },
        {
            'name': 'multidatasets',
            'routes': [
                { 'root': '/multidatasets', 'path': 'multidatasets.js' }
            ],
            'stylesheets': [ 'multidatasets.css' ],
            'functions': [ 'multidatasetsFunction' ]
        },
        {
            'name': 'datasets',
            'routes': [
                { 'root': '/datasets', 'path': 'datasets.js' }
            ],
            'stylesheets': [ 'datasets.css' ],
            'functions': [ 'datasetsFunction' ]
        },
        {
            'name': 'llmSummarization',
            'routes': [
                { 'root': '/llmSummarization', 'path': 'llmSummarization.js' }
            ],
            'stylesheets': [ 'llmSummarization.css' ],
            'functions': [ 'llmSummarizationFunction' ]
        },
        {
            'name': 'topicExtraction',
            'routes': [
                { 'root': '/topicExtraction', 'path': 'topicExtraction.js' }
            ],
            'stylesheets': [ 'topicExtraction.css' ],
            'functions': [ 'topicExtractionFunction' ]
        },
        {
            'name': 'usas',
            'routes': [
                { 'root': '/usas', 'path': 'usas.js' }
            ],
            'stylesheets': [ 'usas.css' ],
            'functions': [ 'usasFunction' ]
        },
        {
            'name': 'neroverall',
            'routes': [
                { 'root': '/neroverall', 'path': 'neroverall.js' }
            ],
            'stylesheets': [ 'neroverall.css' ],
            'functions': [ 'neroverallFunction' ]
        },
        {
            'name': 'usasFine',
            'routes': [
                { 'root': '/usasFine', 'path': 'usasFine.js' }
            ],
            'stylesheets': [ 'usasFine.css' ],
            'functions': [ 'usasFineFunction' ]
        },
        {
            'name': 'nlpStance',
            'routes': [
                { 'root': '/nlpStance', 'path': 'nlpStance.js' }
            ],
            'stylesheets': [ 'nlpStance.css' ],
            'functions': [ 'nlpStanceFunction' ]
        },
        {
            'name': 'testfunc',
            'routes': [
                { 'root': '/testfunc', 'path': 'testfunc.js' }
            ],
            'stylesheets': [ 'testfunc.css' ],
            'functions': [ 'testfunc' ]
        },
        {
            'name': 'generateCSV',
            'routes': [
                { 'root': '/generateCSV', 'path': 'generateCSV.js' }
            ],
            'stylesheets': [ 'generateCSV.css' ],
            'functions': [ 'generateCSV' ]
        }

    ]
};
