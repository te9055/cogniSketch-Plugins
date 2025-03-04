import { registerCanvasExecuteCallback } from "/javascripts/interface/callbackFunction.js";
import { getPalette } from "/javascripts/private/state.js";
import { createNewFullNode, deleteNode } from "/javascripts/private/core/create.js";

const TYPE_NAME = 'datasetsFunction';
registerCanvasExecuteCallback(TYPE_NAME, runDatasets);


async function runDatasets() {
    let uniqueNodeId = `node-${Date.now()}`;
    // Fetch the data associated with the node first
    let container = await createNodeWithData(uniqueNodeId);
    let nodeType = getPalette().getItemById('table');
    createNewFullNode(nodeType, container.title.outerHTML, { x: 250, y: 250 }, null, { table: { value: container.outerHTML, type: "normal" } });

}

async function createNodeUsingDefinedTable(nodeId,table){
    let uniqueNodeId = nodeId
    let container = await createNodeWithTableData(uniqueNodeId, table);
    let nodeType = getPalette().getItemById('table');

    let parentDiv = document.getElementById(nodeId).querySelector("div");


    let nId = parentDiv.parentElement.parentElement.parentElement.parentElement.id;

    // delete existing node
    d3.select('#'+ nId).remove();
    createNewFullNode(
        nodeType, container.title.outerHTML, { x: 250, y: 250 }, null, {
            table: { value: container.outerHTML, type: "normal" },
            dataset_id: { value: uniqueNodeId, type: "normal" }
        }
    );


}

// Function to create node and fetch data from the backend
async function createNodeWithTableData(nodeId, table) {
    let container = document.createElement("div");
    container.setAttribute("id", nodeId);

    let title = document.createElement("p");
    title.innerText = `${nodeId}`;
    container.appendChild(title);

    container.appendChild(table);  // Add the table to the container

    // Append the 'Add File' button
    let addButton = createAddFileButton(nodeId, table);
    container.appendChild(addButton);  // Append the button

    // Return the container with the table and button
    return container;
}


// Function to create node and fetch data from the backend
async function createNodeWithData(nodeId) {
    let container = document.createElement("div");
    container.setAttribute("id", nodeId);

    let title = document.createElement("p");
    title.innerText = `${nodeId}`;
    container.appendChild(title);

    // Fetch the table data from the backend and associate it
    let table = await createTableWithBackendData(nodeId); // Check the table data here
    container.appendChild(table);  // Add the table to the container

    // Append the 'Add File' button
    let addButton = createAddFileButton(nodeId, table);
    container.appendChild(addButton);  // Append the button

    // Return the container with the table and button
    return container;
}


// Fetch data from the backend and create the table dynamically
async function createTableWithBackendData(nodeId) {
    try {
        let response = await fetch("http://127.0.0.1:5000/getfiles", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'page': nodeId })
        });

        let data = await response.json();
        let table = document.createElement("table");
        table.id = nodeId;  // Ensure the table has a unique ID to store/retrieve its data

        table.innerHTML = `<thead><tr><th>Title</th><th>Publication Date</th></tr></thead><tbody></tbody>`;
        let tbody = table.querySelector("tbody");

        // If localStorage data exists, use it to restore the table
        const savedTableData = localStorage.getItem(nodeId);
        if (savedTableData) {
            const rows = JSON.parse(savedTableData);
            rows.forEach(row => {
                addRowToTable(table, row.title, row.date);
            });
        } else {
            // Populate the table with backend data if no saved data exists
            data.files.forEach(file => {
                if (typeof file.title === "string" && typeof file.date === "string") {
                    let tr = document.createElement("tr");
                    tr.innerHTML = `<td>${file.title}</td><td>${file.date}</td>`;
                    tbody.appendChild(tr);
                }
            });
        }

        return table;
    } catch (error) {
        return createEmptyTable();  // Return an empty table if error occurs
    }
}



function createAddFileButton(nodeId) {
    let addButtonContainer = document.createElement("div");

    // Use innerHTML to create the button and attach the onclick function
    addButtonContainer.innerHTML = `
        <button class="cs-allow-clicks" onclick="window.handleAddFileButtonClick('${nodeId}')">
            Add File
        </button>
    `;

    // Return the container with the button
    return addButtonContainer;
}


window.handleAddFileButtonClick = function (nodeId) {
    // Find the table based on nodeId
    let table = document.getElementById(nodeId).querySelector("table");
    if (!table) {
        return;
    }

    // Proceed with the file upload process
    handleFileUpload(table, nodeId); // Reusing the existing function
};




// Create an empty table (if needed as a fallback)
function createEmptyTable() {
    let table = document.createElement("table");
    table.innerHTML = `<thead><tr><th>Title</th><th>Publication Date</th></tr></thead><tbody></tbody>`;
    return table;
}


// Adds a row to the table with the file data
function addRowToTable(table, title, date) {
    if (!title || !date) {
        return;
    }

    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${title}</td><td>${date}</td>`;
    table.querySelector("tbody").appendChild(tr);

    // Save the table's content to localStorage
    saveTableStateToLocalStorage(table);
}

function saveTableStateToLocalStorage(table) {
    const tableData = [];
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        tableData.push({
            title: cells[0].textContent,
            date: cells[1].textContent
        });
    });

    localStorage.setItem(table.id, JSON.stringify(tableData));
}



// Handle file upload and sync it with the backend
async function handleFileUpload(table, nodeId) {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt,.csv,.json";
    fileInput.style.display = "none";  // Hide the input element

    fileInput.addEventListener("change", async (event) => {
        let file = event.target.files[0];
        if (!file) return;

        let reader = new FileReader();
        reader.onload = async function () {
            let fileContent = reader.result;
            let pageData = {
                dataset_id: nodeId,
                file: {
                    filename: file.name,
                    lastModified: new Date(file.lastModified).toISOString(),
                    content: fileContent
                }
            };

            let response = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page: pageData })
            });

            let responseData = await response.json();
            if (response.ok && responseData.code === "SUCCESS") {
                // Immediately check the updated data after upload
                await restoreTableDataFromBackend(nodeId, table);
            } else {
                console.error("File upload failed:", responseData.message);
            }
        };
        reader.readAsText(file);
    });

    document.body.appendChild(fileInput); // Append the input to the body
    fileInput.click();  // Trigger the file selection
}



// Restore table data from backend (sync UI with backend data)
async function
restoreTableDataFromBackend(nodeId, table) {
    try {
        let response = await fetch("http://127.0.0.1:5000/getfiles", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'page': nodeId })
        });

        let data = await response.json();
        let tbody = table.querySelector("tbody");
        tbody.innerHTML = ""; // Clear table to prevent duplicates

        if (!data || !data.files || !Array.isArray(data.files)) {
            console.warn(`Invalid response format for node: ${nodeId}`);
            return;
        }
        // Populate table with new data
        data.files.forEach(file => {
            if (typeof file.title === "string" && typeof file.date === "string") {
                addRowToTable(table, file.title, file.date);


            } else {
                console.warn("Skipping file with missing data:", file);
            }
        });
        await createNodeUsingDefinedTable(nodeId, table)

    } catch (error) {
        console.error("Error while restoring table data from backend:", error);
    }
}

async function refreshNodeData(nodeId) {
    // Check if the data is stored in localStorage
    const savedTableData = localStorage.getItem(nodeId);

    let table;
    if (savedTableData) {
        const rows = JSON.parse(savedTableData);
        table = createEmptyTable();  // Create an empty table and populate it
        const tbody = table.querySelector("tbody");
        rows.forEach(row => {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td>${row.title}</td><td>${row.date}</td>`;
            tbody.appendChild(tr);
        });
    } else {
        // If no saved data, fetch the data from the backend
        let response = await fetch("http://127.0.0.1:5000/getfiles", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'page': nodeId })
        });

        let data = await response.json();
        // Create and populate the table with backend data
        table = createEmptyTable();
        let tbody = table.querySelector("tbody");
        data.files.forEach(file => {
            if (typeof file.title === "string" && typeof file.date === "string") {
                let tr = document.createElement("tr");
                tr.innerHTML = `<td>${file.title}</td><td>${file.date}</td>`;
                tbody.appendChild(tr);
            }
        });

        // Save the data to localStorage for future use
        const tableData = [];
        table.querySelectorAll("tbody tr").forEach(row => {
            const cells = row.querySelectorAll("td");
            tableData.push({
                title: cells[0].textContent,
                date: cells[1].textContent
            });
        });
        localStorage.setItem(nodeId, JSON.stringify(tableData));
    }

    // Update the node with the new table
    let nodeContainer = document.querySelector(`#${nodeId}`);
    if (nodeContainer) {
        let existingTable = nodeContainer.querySelector("table");
        if (existingTable) {
            nodeContainer.removeChild(existingTable);
        }
        nodeContainer.appendChild(table);
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    console.log('time for refresh');

    // Assuming nodes have the class 'node'
    let nodeIds = document.querySelectorAll('.node');

    // Loop through each node ID and refresh the data for each
    nodeIds.forEach(async (node) => {
        let nodeId = node.id;  // Get the node ID dynamically
        await refreshNodeData(nodeId);  // Refresh the data for the node
    });
});
