const selectProblem = document.getElementById("selectProblem");
let selectedIndex = 0;

let problemsArr;
let currentExpert;

function getProblems(problems, expert) {
    currentExpert = expert;
    problemsArr = problems;
}

const solutions = document.getElementById("solutions");
const rateSolution = document.getElementById("rateSolution");

selectProblem.addEventListener("click", (event)=>{
    const target = event.target;
    const select = document.getElementById("select");
    if(target.id === "submit"){
        selectedIndex = select.options.selectedIndex;
        selectProblem.style.display = "none";
        rateSolution.style.display = "grid";
        addSolutions();
    }
});

function addSolutions() {
    for(let i = 0; i< problemsArr[selectedIndex].solutions.length; i++){
        const solution = document.createElement("div");
        solution.classList = "solution";
        const inputRating = document.createElement("input");
        inputRating.type = "number";
        inputRating.min = "0";
        inputRating.max = "10";
        inputRating.value = "0";
        const title = document.createElement("h3");
        title.innerHTML = problemsArr[selectedIndex].solutions[i].name;
        solution.appendChild(title);
        solution.appendChild(inputRating);
        solutions.appendChild(solution);
    }
}

const endWork = document.getElementById("endWork");
const expertRating = [];
rateSolution.addEventListener("click", (event)=> {
    const inputRating = Array.from(document.querySelectorAll("input"));
    const target = event.target;
    if(target.id === "submit"){
        if(!inputRating.some(elem => elem.value < 0 || elem.value > 10)){
            inputRating.forEach(item =>{
                expertRating.push(item.value);
            });
            rateSolution.style.display = "none";
            endWork.style.display = "grid";
            let problem = new Problem(problemsArr[selectedIndex].name, expertRating);
            for(let i = 0; i< currentExpert.problemRatings.length; i++) {
                if(currentExpert.problemRatings[i].name === problem.name){
                    currentExpert.problemRatings.splice(i,1);
                    break;
                }
            }
            currentExpert.problemRatings.push(problem);
            const xhr = new XMLHttpRequest();
            currentExpert = JSON.stringify(currentExpert);
            xhr.open("POST", "expert");
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(currentExpert);
        }
}
});

class Problem{
    constructor(nameProblem, rating){
        this.name = nameProblem;
        this.rating = rating;
    }
}

