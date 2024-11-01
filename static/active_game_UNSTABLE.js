let infoTable = Object.values(dataObject)
//alert(infoTable)
/*
infoTable layout
0   1    2      3      4
# name serves passes attacks
*/

function sqldata2jsdata(){
    for(let r = 0; r < infoTable.length; r++){
        for(let c = 0; c < 6; c++){
            if (c === 2 || c === 3 || c === 4 || c === 5){
                if(infoTable[r][c] === null){
                    infoTable[r][c] = []
                } else {
                if (typeof infoTable[r][c] !== "string"){
                    infoTable[r][c] = String(infoTable[r][c])
                }
                infoTable[r][c] = infoTable[r][c].split("")
                }
            }
        }
    }
}

let display = {
    "O": "&#9711;",
    "K": "&#9679;",
    "E": "&#8855;"
}

let displayTable = document.querySelector("table tbody");
let rows;
let currentRow = 0;
let currentColumn = 2;


sqldata2jsdata();


// Function to update the form with infoTable before submission

function updateForm() {
    let infoTableFields = document.getElementsByName('dummyData');
    for (let i = 0; i < infoTableFields.length; i++) {
        infoTableFields[i].value = JSON.stringify(infoTable);  // Set the value of each field to the JSON string
    }
}


// Bind the form submission to updateForm to make sure data is passed



function specialRender(entryArray){
    //convert O, K, E to the stylized circles
    let displayString = ""
    for(let i = 0; i < entryArray.length; i++){
        displayString += display[entryArray[i]]
    }
    return displayString
}

function refreshSelectedRow(){
    cells[currentRow][currentColumn].innerHTML = specialRender(infoTable[currentRow][currentColumn])
}

function updateTableColors(){
    for(let i = 0; i < rows.length; i++){
        let tds = rows[i].querySelectorAll("td");
        if(rows[i].id === "player"+currentRow){
            let counter = 0
            tds.forEach(td => {
                if (counter === currentColumn){
                    td.className = ""
                    td.classList.add("text-bg-warning");

                    counter += 1;
                } else {
                td.className = ""
                td.classList.add("text-bg-danger");

                counter += 1;
                }
            });
            } else {
            tds.forEach(td => {
                td.className = ""
                td.classList.add("text-bg-primary");

            });
        }
    }
}

function updateTable(){
    rows = Array.from(displayTable.querySelectorAll("tr"));
    //alert('ski')
    for(let i = 0; i < rows.length; i++){
        rows[i].id = "player"+i
        cells = rows[i].querySelectorAll("td");
        for(let j = 0; j < cells.length; j++){
            if (j === 2 ||  j === 4 || j === 5){
                cells[j].innerHTML = infoTable[i][j].map((item)=>display[item]).join("")
                //alert("hello???")
            } else if (j === 3){
                cells[j].innerHTML = infoTable[i][j].join(" ")
            } else {
                cells[j].innerHTML = infoTable[i][j]
                //alert("it's not selected.")
            }
        }
    }
    //alert("SKIBIDI")
    updateTableColors()
}

updateTable()

document.addEventListener("keydown", handleKeyDown)

function handleKeyDown(event){
let key = event.key

if (key == "ArrowDown"){
    if ((currentRow + 1) >= infoTable.length){
    return
    }
    currentRow += 1
    //currentDigit = infoTable[currentRow][2].length
    //alert("skib"+currentDigit)
    updateTableColors()
    updateTable()
}


if (key == "ArrowUp"){
    if ((currentRow - 1) <= -1){
    return
    }
    currentRow -= 1
    //currentDigit = infoTable[currentRow][2].length
    updateTableColors()
    updateTable()
}

if (key == " " || key == "o"){
    if (currentColumn === 2 || currentColumn === 4 || currentColumn === 5){
    infoTable[currentRow][currentColumn].push("O")
    //alert("receive list after: "+infoTable[currentRow][2])
    }
    updateTable()

}

if ((event.ctrlKey || event.metaKey) && key === "z"){
    //alert("undo log entry (aka delete the most recent entry.)")
    infoTable[currentRow][2].pop()
    updateTable()
}

if (key == "ArrowLeft") {
    /*
    if ((currentDigit - 1) <= -1) {
    //alert("OUT OF BOUNDS! stawp")
    return
    }
    currentDigit -= 1
    updateTable()
    */

    if ((currentColumn - 1) < 2) {
    return
    }
    currentColumn -= 1
    updateTable()

}

if (key == "ArrowRight") {

    //alert(infoTable[currentRow][2].length)

    /*
    if ((currentDigit + 1) >= infoTable[currentRow][2].length + 1) {
    //alert("OUT OF BOUNDS! stawp")
    return
    }
    currentDigit += 1
    updateTable()
    */
    if ((currentColumn + 1) > 5) {
    return
    }
    currentColumn += 1
    updateTable()
}

if (key === "Enter" || key === "k"){
    if (currentColumn === 2 || currentColumn === 4 || currentColumn === 5){
        infoTable[currentRow][currentColumn].push("K")
    }
    updateTable()

}

if (key === "x" || key === "e" || key === "\\"){
    if (currentColumn === 2 || currentColumn === 4 || currentColumn === 5){
    infoTable[currentRow][currentColumn].push("E")
    }
    updateTable()

}

if (key === "Backspace"){
    if (infoTable[currentRow][currentColumn].length != 0){
    infoTable[currentRow][currentColumn].splice(infoTable[currentRow][currentColumn].length-1, 1)
    updateTable()
    }
}

if (key === "0" || key === "1" || key === "2" || key === "3"){
    console.log(currentColumn)
    if (currentColumn === 3){
        infoTable[currentRow][currentColumn].push(key);
        updateTable()
    }
}

}

function handleSubmit(){
const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", function(){
    updateForm()
    //alert("submit button pressed!")
})
}

handleSubmit()

function handleSave(){
const saveButtons = document.getElementsByName("save");
saveButtons.forEach((saveButton) => {
    saveButton.addEventListener("click", function() {
        updateForm();
    });
});

}

handleSave()

function showCurrentSet(){
    const setNavItem = document.getElementById("set"+setId);
    setNavItem.classList.add("active");
    setNavItem.classList.add("fw-bold");
}

showCurrentSet()
