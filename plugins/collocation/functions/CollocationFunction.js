import {registerNodeExecuteCallback} from "/javascripts/interface/callbackFunction.js";
import {getPalette} from "/javascripts/private/state.js";
import {getPosFromNode} from "/javascripts/interface/graphics.js";
import {createNewFullNode, createNewLink} from "/javascripts/private/core/create.js";
import {testfuncollocation} from "/plugins/collocation/functions/testFcollocation.js";



const TYPE_NAME = 'collocationFunction';

registerNodeExecuteCallback(TYPE_NAME, runCollocation);


async function runCollocation(context) {
    try {
        let datasetId = context.node.getData().properties['dataset_id'].value;
        //console.log('datasetId inside collocation: ',datasetId);
        // Create a container to append input and button elements
        const container = document.createElement('div');
        //container.id = 'collocation-container'; // optional ID for styling or reference
        container.id = `collocation-container-${datasetId}`; // Unique container ID

        container.style.margin = '10px'; // Add some margin or style if needed

        // Create input box
        const inputBox = document.createElement('input');
        inputBox.type = 'text';
        inputBox.placeholder = 'Type a word...'; // Placeholder text
        //inputBox.id = 'collocation-input';
        inputBox.id = `collocation-input-${datasetId}`; // Unique input box ID tied to the dataset
        inputBox.style.marginRight = '10px'; // Add spacing between input and button
        inputBox.style.padding = '5px'; // Add some padding inside the input box
        inputBox.style.pointerEvents = 'auto';
        //window.inputBox = inputBox;

        container.appendChild(inputBox); // Append the input box to the container


        //window.inputValue = inputBox.value;
        //console.log('inputValue before: ', inputValue);
        let submitButtonContainer = document.createElement("div");
        // Use innerHTML to create the button and attach the onclick function
        submitButtonContainer.innerHTML = `
        <button class="cs-allow-clicks" onclick="window.handleAButtonClick('${datasetId}')">
            Submit
        </button>
    `;

        // Append input and button to container
        //container.appendChild(inputBox);
        container.appendChild(submitButtonContainer);
        let title = document.createElement("p");
        title.innerText = "Provide a word for collocation analysis";
        document.body.appendChild(container);
        document.body.appendChild(title);

        let pos = getPosFromNode(context.node.getPos(), 9, 10);
        //console.log("pos: ", pos);
        let tmp = { value: container.outerHTML, type: "normal" };
        let nodeType = getPalette().getItemById('table');

        let desNode = createNewFullNode(nodeType, title.outerHTML, {
            x: pos.x + 250,
            y: pos.y - 50
        }, null, { "table": tmp });

        let srcNode = context.node;
        window.desNode = desNode;
        createNewLink(srcNode, desNode);


    } catch (err) {
        console.error("Error during runCollocation:", err);
    }
}

window.handleAButtonClick = function (datasetId) {
    //console.log('button clicked')
    console.log('datasetId: ', datasetId);
    // Dynamically fetch the input value from inputBox
    //const inputBox = document.querySelector('#collocation-input');
    const inputBox = document.querySelector(`#collocation-input-${datasetId}`);
    const inputValue = inputBox ? inputBox.value : null;
    //console.log('inputValue: ', inputValue);
    //console.log("DesNode:", window.desNode);
    testfuncollocation(datasetId,inputValue,window.desNode)


};