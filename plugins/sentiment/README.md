# cogni-sketch-contrib-example
Example function and pane capabilities for the cogni-sketch environment.
This will be extended with further examples over time as needed.

To add this plugin to the cogni-sketch environment you must do the following:
1. Git clone this repo into the `cogni-sketch/plugins` folder.
2. Run `npm install` for this plugin (in this example there are no modules to import but for real plugins there may well be).
3. To define these examples within the environment, edit `cogni-sketch/plugins.js`, adding the following entry to the `plugins` list:
```
    {
        'name': 'cogni-sketch-contrib-example',
        'routes': [
            { 'root': '/example', 'path': 'example.js' }
        ],
        'panes': [ 'example' ],
        'stylesheets': [ 'example.css' ],
        'functions': [ 'exampleFunction' ]
    }
```    
4. To make the example function available in the cogni-sketch user interface, edit the `data/functions/functions.json` and add the following:
```
{
    "basic": {
        "id": "func-basic",
        "position": 1,
        "label": "Basic",
        "items": [
            {
                "id": "exampleFunction",
                "icon": "/images/palette/icon-json.svg",
                "icon-alt": "icon-example-function",
                "label": "Example function",
                "nodeColor": "red",
                "settings": {}
            }
        ]
    }
}
```
This creates a 'Basic' section and 'Example function' item within the functions section of the user interface and is are available to all users.
5. Restart the cogni-sketch service.

# How to create plugins

## Function plugins
Functions are listed in the palette area on the left-hand side of the cogni-sketch user interface, specifically in the 'functions' section at the bottom.  Like palette items the functions are grouped into sections, with individual functions listed in each section.

The content of the functions section is defined by the `data/functions/functions.json` file (see item 4 above for an example).
Typically functions carry out some kind of processing, either in the context of the canvas (i.e. all data in the project), or a node on the canvas.  the function is invoked by dragging it from the function palette and droppoing it onto the canvas or the target node.  In rare cases the code required for a function can all be executed in the browser, but it is more common for functions to all a server-side API which can contain more advanced processing and will often call out to externally hosted APIs (e.g. for Natural Language Processing, Translation, Search, etc).

From a code perspective the structure of a module for a function plugin looks like this:

* The root folder - `cogni-sketch-contrib-{plugin name}` (e.g. `cogni-sketch-contrib-example`)
* `\cogni-sketch-contrib-{plugin-name}\functions` - This is where any client-side javascripot code is written.
* * There will be one function per file, and the naming of the file corresponds to the definition of the function in the `plugins.js` file.
* * For this example the file is named `exampleFunction.js` and it is mentioned in the `plugins.js` file as 'functions': [ 'exampleFunction' ].
* * For a function to be valid it must register a callback and specify a unique type.  For the example a node callback is registered, meaning that function can be dropped onto nodes on the canvas, and the name of the function is `example`.  The code to achieve this is `registerNodeExecuteCallback('example', runExample);` where `runExample` is the name of a function to be called when the function is dropped onto a node,.
* `\cogni-sketch-contrib-{plugin-name}\node_modules` - standard folder, created when `npm install` or similar is run
* `routes` - the optional server-side code to define local APIs that can be called from the client side function code.  It is important that there is a single file in here and the filename corresponds to the one specified in the route definition in `plugin.js` for this function (e.g. `'routes': [{ 'root': '/example', 'path': 'example.js' }]` would require a file named `example.js` to be defined here)
* `\cogni-sketch-contrib-{plugin-name}\typdefs` - any optional typedef files that are needed

The flow of processing for a function is this:
1. User drags function from function palette and drops onto node or canvas
2. The registered callback in `\functions\{file}.js` is executed and specifies a callback to be run on response
3. This may make a HTTP GET or POST request to a locally defined server-side API located in `\routes\{file}.js`
4. This server-side code is where the bulk of the code is locally to be located, e.g. calls to external services etc
5. The server-side code returns, and the callback defined in step (2) is executed.  This is where any response to the user or update to the UI can be made.  In the example given a pane is shown with values rendered based on the node that was dropped onto.  For this example I used session data to store the node when the function is dropped (in step 2), so that it can be accessed when rendering the result (in step 5).  This is a trivial pattern but may not be useful in more advanced cases where data changes.  A typical function may take some data from the canvas and do something with it to augment or search etc, and that resulting data could be written back onto the canvas.  There should be many possible combinations that are useful for functions.


## Pane plugins
Panes appear as tabs on the main area of the cogn-sketch user interface (where the canvas is located by default).  They contain dynamically rendered html that can access the main canvas graph but maybe render the data (or a subset of it) in a different format.

When defining a pane you must also specify where the pane fits in the 'pane order' (even if the pane is hidden).  You can do this by specifying the pane name at the appropriate point in the list in the `paneOrder` list in `plugins.js`.

From a code perspective the structure of a module for a pane plugin looks like this:

* `\cogni-sketch-contrib-{plugin-name}\images` - any static images or icons that may need to be rendered can be put in here
* `\cogni-sketch-contrib-{plugin-name}\panes` - the code needed to render each pane is located here.  The filename must be the same as the pane name (as defined in `plugins.js`, e.g. `'panes': [ 'example' ]` would correspond to a file named `panes\example.js`).  The pane itself is located in a `templates` subfolder and uses mustache template format.
* * A config such as this is needed to define which functions are called when certain pane actions are triggered:
```
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
```

* `\cogni-sketch-contrib-{plugin-name}\stylesheets` - any optional stylesheets that might be needed to render content.  These are defined in `plugins.js` and the names must match (e.g. `'stylesheets': [ 'example.css' ]`)

