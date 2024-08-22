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
import {getPalette} from "/javascripts/private/state.js";
import {showToast} from "/javascripts/interface/log.js";
import {getPosFromNode} from "/javascripts/interface/graphics.js";
import {computeNewNodePosFrom} from "/javascripts/private/util/coords.js";
import {createNewEmptyNode} from "/javascripts/private/core/create.js";
import {putText} from "/javascripts/interface/graphics.js"

const TYPE_NAME = 'exampleFunction';
const URL_EXAMPLE = '/example/';

registerNodeExecuteCallback(TYPE_NAME, runExample);

//async function runExample(context) {
//    if (context.node.getTypeName() === 'text') {
//        let labelText = context.node.getLabel();
//        let textProperty = context.node.getPropertyNamed('text');
//        let pos = getPosFromNode(context.node.getPos(),9,10);
//        let data = await getNerForText(textProperty);



//        callbackRunExample(pos,data)
//        //setSessionValue('exampleNode', data);

//    } else {
//        showToast('Needs to be dropped on a text node');
//    }
//}

async function runExample(context) {
    let textProperty = context.node.getPropertyNamed('text');
    let pos = getPosFromNode(context.node.getPos(),9,10);
    await fetch("http://127.0.0.1:5000/ner", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'page': textProperty})
    }).then(response => response.text())
        .then((dataStr) => {
                let data = JSON.parse(dataStr);
                return data.output;
            }
        ).then(result => {
            let strresult = JSON.stringify(result);
            let nodeType = getPalette().getItemById('text');
            console.log(strresult)
            createNewEmptyNode(nodeType, strresult, pos)
            })
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



function callbackRunExample(pos,res) {

    //let pos = getPosFromMousePos();
    let strresult = JSON.stringify(res);
    let nodeType = getPalette().getItemById('text');
    createNewEmptyNode(nodeType, strresult, pos)

    //setSessionValue('exampleNode', res);

}

