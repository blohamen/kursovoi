
class Problem{
    constructor(nameProblem, solutions,experts, ratings) {
    this.nameProblem = nameProblem;
    this.solutions = solutions;
    this.experts = experts;
    this.ratings = ratings;
    }
}
const wrapper = document.getElementById("wrapper");



const problemNameDiv = document.getElementById("problemName");
let problemName;
problemNameDiv.addEventListener("click", (event) =>{
    const target = event.target;
    if(target.previousElementSibling.value){
        problemName = target.previousElementSibling.value;
        target.parentNode.style.display = "none";
        target.parentNode.nextElementSibling.style.display = "grid";
    }
});

const solutionsDiv = document.getElementById("solutions");
const solutions = [];
solutionsDiv.addEventListener("click", (event) => {
    const target = event.target;
    if(target.id === "addSolution"){
        solutionsDiv.appendChild(makeSolutionInput());
        solutionsDiv.appendChild(makeDeleteSolution());
    }
    if(target.id === "close"){
        target.previousElementSibling.style.visibility = "hidden";
        target.previousElementSibling.id = "";
        target.style.visibility = "hidden";
    } 
    if(target.id === "submit"){
        const solutionInput = document.querySelectorAll("#solution");
        solutionInput.forEach(el =>{
            if(el.value) solutions.push(el.value);
        })
        if(solutions.length) solutionsDiv.style.display = "none";   
    }
});

function makeSolutionInput(){
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Предположительное решение";
    input.value = "";
    input.id = "solution";
    return input;
}
let topPosition = 120;
function makeDeleteSolution(){
    const div = document.createElement("div");
    div.innerHTML = "X";
    div.id="close";
    div.className = "close";
    div.style.top = topPosition + "px";
    topPosition += 35;
    return div;
}

