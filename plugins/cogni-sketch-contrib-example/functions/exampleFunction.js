/**
 * @file The client-side capabilities of the 'example' palette function.
 * @author Dave Braines
 * @status In-progress
 **/

import {registerNodeExecuteCallback} from "/javascripts/interface/callbackFunction.js";
import {
    getProject,
    setSessionValue
} from "/javascripts/interface/data.js";
import {switchToPane} from "/javascripts/interface/ui.js";
import {httpGet} from "/javascripts/interface/http.js";
import {showToast} from "/javascripts/interface/log.js";

const TYPE_NAME = 'exampleFunction';
const URL_EXAMPLE = '/example/';

registerNodeExecuteCallback(TYPE_NAME, runExample);

function runExample(context) {
    if (context.node.getTypeName() === 'text') {
        let labelText = context.node.getLabel();
        let textProperty = context.node.getPropertyNamed('text');

        getNerForText(textProperty)

        let url = URL_EXAMPLE + getProject().getName() + '?label=' + labelText + '&text=' + textProperty;

        setSessionValue('exampleNode', context.node);
        httpGet(url, callbackRunExample);
    } else {
        showToast('Needs to be dropped on a text node');
    }
}

function getNerForText(text) {
    fetch("http://127.0.0.1:5000/ner", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'page': text})
    }).then(response => response.text())
        .then((dataStr) => {
                let data = JSON.parse(dataStr);
                console.log(data.output)
                return data.output;
            }
        )
    return "No Result Found";
}



function callbackRunExample(res) {
    if (res.error) {
        showToast(`Something went wrong: ${res.error}`);
    } else {
        switchToPane('example')
        setSessionValue('exampleNode', res);
        showToast(`Processing successful`);
    }
}
