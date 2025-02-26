import { registerCanvasExecuteCallback } from "/javascripts/interface/callbackFunction.js";
import { getPalette } from "/javascripts/private/state.js";
import { createNewFullNode } from "/javascripts/private/core/create.js";

const TYPE_NAME = 'datasetsFunction';
registerCanvasExecuteCallback(TYPE_NAME, runDatasets);

async function runDatasets() {
    let uniqueNodeId = `node-${Date.now()}`;
    let container = createNodeContainer(uniqueNodeId);

    let nodeType = getPalette().getItemById('table');
    let desNode = createNewFullNode(nodeType, container.title.outerHTML, { x: 250, y: 250 }, null, { table: { value: container.outerHTML, type: "normal" } });

    setTimeout(() => initializeNode(uniqueNodeId), 100);
}

function createNodeContainer(nodeId) {
    let container = document.createElement("div");
    container.setAttribute("id", nodeId);

    let title = document.createElement("p");
    title.innerText = `Multi-file Corpus ${nodeId}`;
    container.appendChild(title);

    let table = createEmptyTable();
    container.appendChild(table);

    let addButton = createAddFileButton(nodeId, table);
    container.appendChild(addButton);

    return container;
}

function createAddFileButton(nodeId, table) {
    let addButton = document.createElement("button");
    addButton.innerText = "Add File";
    addButton.classList.add("cs-allow-clicks");
    addButton.addEventListener("click", () => handleFileUpload(table, nodeId));
    return addButton;
}

function initializeNode(nodeId) {
    let nodeElement = document.getElementById(nodeId);
    if (!nodeElement) return setTimeout(() => initializeNode(nodeId), 100);

    let table = nodeElement.querySelector("table");
    let addButton = nodeElement.querySelector("button");

    if (table && addButton) {
        restoreTableData(nodeId, table);
        addButton.addEventListener("click", () => handleFileUpload(table, nodeId));
        console.log("Node initialized with event listeners.");
    }
}

async function handleFileUpload(table, nodeId) {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt,.csv,.json";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", async (event) => {
        let file = event.target.files[0];
        if (!file) return;

        let reader = new FileReader();
        reader.onload = async function () {
            let fileContent = reader.result;
            let pageData = {
                dataset_id: nodeId, // Use nodeId as dataset ID
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
                console.log("File uploaded successfully.");
                addRowToTable(table, file.name, pageData.file.lastModified);
                saveTableData(nodeId, table);
            } else {
                console.error("File upload failed:", responseData.message);
            }
        };
        reader.readAsText(file);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
}

function createEmptyTable() {
    let table = document.createElement("table");
    table.innerHTML = `<thead><tr><th>Title</th><th>Publication Date</th></tr></thead><tbody></tbody>`;
    return table;
}

function saveTableData(nodeId, table) {
    let rows = Array.from(table.querySelectorAll("tbody tr")).map(tr => {
        let cells = tr.querySelectorAll("td");
        return { title: cells[0].innerText, date: cells[1].innerText };
    });
    localStorage.setItem(`table-${nodeId}`, JSON.stringify(rows));
}

function restoreTableData(nodeId, table) {
    let savedData = localStorage.getItem(`table-${nodeId}`);
    if (!savedData) return;
    JSON.parse(savedData).forEach(row => addRowToTable(table, row.title, row.date));
}

function addRowToTable(table, title, date) {
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${title}</td><td>${date}</td>`;
    table.querySelector("tbody").appendChild(tr);
}
