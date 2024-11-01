const category2display = {
    "name": "Name",
    "serveCount" : "Total Serves",
    "serve%": "Serve Rating",
    "passCount" : "Total Passes",
    "pass%": "Pass Average",
    "attackCount" : "Total Attacks",
    "attack%": "Attack Rating",
}

let placeholder = 0

const number2player = {
    1: "Grace-Ann",
    2: "Elizabeth",
    3: "Clara",
    4: "Dinero",
    5: "Moran",
    6: "Julia",
    7: "Alyssa",
    8: "Sarah",
    9: "Fiona",
    10: "CJ",
    11: "Charlotte",
    12: "Jackie",
    13: "Lucy",
    14: "Claire",
    15: "Ela",
    17: "Janie"
};


const categories = ["name", "serveCount", "serve%", "passCount", "pass%", "attackCount", "attack%"]
const category2button = {

}


let table = document.querySelector("table tbody");


function sortTableByCategory(category){
    const categoryIndex = category2index[category]
    const isDescending = categoryDescending[category]

    let rows = Array.from(table.querySelectorAll("tr"));
    rows.sort(function(rowA, rowB) {
        let ratingA = parseFloat(rowA.cells[categoryIndex].innerText) || 0;  // Pass Rating column
        let ratingB = parseFloat(rowB.cells[categoryIndex].innerText) || 0;  // Pass Rating column

        // Sort in descending order
        if (isDescending) {
            return ratingB - ratingA;
        } else {
            return ratingA - ratingB;
        }
    });
  rows.forEach(row => table.appendChild(row));
};


function resetOtherCategories(category){
    for (let i = 0; i < Object.keys(category2index).length; i++) {
        currentCategory = Object.keys(category2index)[i]
        console.log(currentCategory)
        if (currentCategory === category){
            continue;
        }

        categoryDescending[currentCategory] = true;
        category2button[currentCategory].innerHTML = category2display[currentCategory];
    }
}

function handleSort(button, category) {
    //alert("!")
    button.addEventListener("click", function() {
        alert("AMOGSUS")
        sortTableByCategory(category);
        alert("AMOGSUS")
        categoryDescending[category] = !categoryDescending[category];
        button.innerHTML = categoryDescending[category] ? `${category2display[category]} ↓` : `${category2display[category]} ↑`;
        resetOtherCategories(category)
    });
    alert("made it out?")
}

function calcPercentage(infoArray){
    //alert("infoArray:"+infoArray)

    if (infoArray.length === 0){
        //alert("!")
        return ""
    }

    let rawVal = (infoArray.filter(item => item === "K").length - infoArray.filter(item => item === "E").length) / infoArray.length
    let percentageVal = Math.round(rawVal * 100)

    return percentageVal + "%"
}

function calcAverage(infoArray){
    if (infoArray.length === 0){
        return ""
    }
    let sum = 0
    for(let v = 0; v < infoArray.length; v++){
        sum += parseInt(infoArray[v]);
    }

    return (sum / infoArray.length).toFixed(2);
}

function initTable(){
    let displayRows = Array.from(table.querySelectorAll("tr"));

    for (let p = 0; p < 16; p++){
        //alert("p: "+p)
        let total_serves = [];
        let total_passes = [];
        let total_attacks = [];

        let num = Object.keys(number2player)[p]
        //alert("num: "+num)

        let playerTable = infoTable.filter(infoRow => infoRow[0] == num)
        //alert(playerTable)

        for (let infoRow of playerTable){
            //alert("InfoRow: "+infoRow)
            //console.log("infoRow[2] is "+infoRow[2]+"!")

            if (infoRow[2] === null){
                infoRow[2] = ""
            }
            if (infoRow[3] === null){
                infoRow[3] = ""
            }
            if (infoRow[4] === null){
                infoRow[4] = ""
            }

            serves = infoRow[2].split("")
            passes = infoRow[3].split("")
            attacks = infoRow[4].split("")

            total_serves = total_serves.concat(serves)
            total_passes = total_passes.concat(passes)
            total_attacks = total_attacks.concat(attacks)

            //alert("total serves: "+total_serves)
            //alert("total passes: "+total_passes)
            //alert("total attacks: "+total_attacks)

        }

        let displayRow = displayRows[p];
        let cells = Array.from(displayRow.querySelectorAll("td"))

        cells[0].innerHTML = num;
        cells[1].innerHTML = number2player[num];

        cells[2].innerHTML = total_serves.length;
        cells[3].innerHTML = calcPercentage(total_serves)
        placeholder += total_serves.filter(x => x == "E").length;
        console.log("placeholder:",placeholder)

        cells[4].innerHTML = total_passes.length;
        cells[5].innerHTML = calcAverage(total_passes)

        cells[6].innerHTML = total_attacks.length;
        cells[7].innerHTML = calcPercentage(total_attacks)
    }
}

/*
const resetButton = document.getElementById("reset")

function handleReset(resetButton){
    resetButton.addEventListener("click", function(){
        let tableBody = document.querySelector("table tbody");
        tableBody.innerHTML = "";

        infoTable.forEach(player => {
        let playerRow = document.createElement("tr");

        player.forEach(category => {
            let categoryDatum = document.createElement("td");
            categoryDatum.innerText = category;  // Assuming 'player' contains the data to display
            playerRow.appendChild(categoryDatum);
        });

        tableBody.appendChild(playerRow);
    });

    resetOtherCategories("");

    document.getElementById("nameSearch").value = ""
    filterTable();

    })
}


handleReset(resetButton)
*/


//Dynamic name search
const searchInput = document.getElementById('nameSearch');
const tableBody = document.getElementById('table-body');
/*

function filterTable() {
    const searchTerm = searchInput.value.toLowerCase();  // Convert search term to lowercase for case-insensitive search
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const playerName = row.cells[1].innerText.toLowerCase();  // Assuming name is in the second column (index 1)

        // Check if the player name contains the search term
        if (playerName.includes(searchTerm)) {
            row.style.display = '';  // Show the row
        } else {
            row.style.display = 'none';  // Hide the row
        }
    });
}

searchInput.addEventListener('input', filterTable);
*/


function easyCategorySetup(){
    //for fuckall easy category setup
    //so even if there's a category overhaul
    //I wouldn't have to fix every fucking variable name
    //u know

    //thank fucking god (or actually curse him ???) for js global scope variables

    for(let c = 0; c < categories.length; c++){
        category = categories[c]
        category2index[category] = c+1
        categoryDescending[category] = true
        category2button[category] = document.getElementById(category)
        //alert('worked til here')
        handleSort(category2button[category], category)
        //alert("plox!")

    }

}

function infoBlurbs(){
    const totalMissedServes = document.getElementById("totalMissedServes");
    console.log(placeholder);
    totalMissedServes.innerHTML = placeholder;

}

document.getElementById("opponentName").innerText = infoArray[0][1]
//weird af flask gimmick

document.addEventListener('DOMContentLoaded', function() {
    initTable();
    infoBlurbs();
    //easyCategorySetup();
});

//To-Do
//Just get the data to LOAD correctly omfg!!!!!!!
