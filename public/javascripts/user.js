const selectProblem = document.getElementById("selectProblem");
const chooseExperts = document.getElementById("chooseExperts");
let selectedIndex;
let usersArr;
let problemsArr;

function getArrays(problems, users) {
    problemsArr = problems;
    usersArr = users;
}

selectProblem.addEventListener("click", event=>{
    const target = event.target;
    const select = document.getElementById("select");
    if(target.id === "submit"){
        selectedIndex = select.options.selectedIndex;
        selectProblem.style.display = "none";
        chooseExperts.style.display = "grid";
        addExperts();
    }
});


function addExperts() {
    const expertsList = document.getElementById("expertsList");
    usersArr.forEach(user => {
        if(user.problemRatings.some(problem => {
          return problem.name === problemsArr[selectedIndex].name;  
        })){
            const li = document.createElement("li");
            const p = document.createElement("p");
            p.innerHTML = user.name;
            li.appendChild(p);
            li.classList = "expert";
            expertsList.appendChild(li);
        }
    });
}
const choosenExperts = document.getElementsByClassName("choose");
const tableDiv = document.getElementById("tableDiv");
let results;
chooseExperts.addEventListener("click", event => {
    const target = event.target;
    const mainSolution = document.getElementById("mainSolution");
    const caption = document.getElementById("problemName");
    console.log(target);
    if(target.classList.contains("expert")){
        target.classList.toggle("choose"); 
    } 
    if(target.parentNode.classList.contains("expert")){
        target.parentNode.classList.toggle("choose");
    }
    if(target.id === "submit" && choosenExperts.length) {
        chooseExperts.style.display = "none";
        caption.innerHTML = 'Оценки экспертов по проблеме: ' + problemsArr[selectedIndex].name;
        tableDiv.style.display = "grid";
        generateTable();
        results = getResults();
        mainSolution.innerHTML = `
        Наилучшее решение: ${problemsArr[selectedIndex].solutions[results.indexOf(Math.max(...results))].name} (Решение №${results.indexOf(Math.max(...results))+1})
        `
    }
});

class Expert {
    constructor(name, rating, problemRatings) {
        this.name = name;
        this.rating = rating;
        this.problemRatings = problemRatings;
        Expert.prototype.allRatings += rating;
        Expert.prototype.matrix.push(problemRatings);
    }
    get relativeRating () {
        return (this.rating / Expert.prototype.allRatings).toFixed(2);
    }
    get matrixRating() {
        return Expert.prototype.matrix;
    }
}

Expert.prototype.allRatings = 0;
Expert.prototype.matrix = [];

const expertsArr = [];

function generateTable() {
    const table = document.getElementById("table");
    const solutionsHeader = document.createElement("tr");
    const th = document.createElement("th");
    th.innerHTML = "Эксперты"; 
    solutionsHeader.appendChild(th);
    
    for(let i = 0; i < problemsArr[selectedIndex].solutions.length; i++){
        const th = document.createElement("th");
        th.innerHTML = `Решение ${i+1}`; 
        solutionsHeader.appendChild(th);
    }
    table.appendChild(solutionsHeader);

    for(let i = 0; i < choosenExperts.length; i++) {
        const tr = document.createElement("tr");
        const nameExpert = document.createElement("td");
        nameExpert.innerHTML = choosenExperts[i].firstElementChild.innerHTML;
        tr.appendChild(nameExpert);
        let expertIndex;
        let problemIndex;
        for(let j = 0; j < problemsArr[selectedIndex].solutions.length; j++) {
            const rate = document.createElement("td");
            
        for(let x = 0; x < usersArr.length; x++){
            if(usersArr[x].name === nameExpert.innerHTML) {
                expertIndex = x;
                break;
            }
        }
            
        for(let x = 0; x < usersArr[expertIndex].problemRatings.length; x++){
            if(usersArr[expertIndex].problemRatings[x].name === problemsArr[selectedIndex].name){
                problemIndex = x;
                break;
            }
        }
        
          rate.innerHTML = usersArr[expertIndex].problemRatings[problemIndex].rating[j];
          tr.appendChild(rate);
        }
        expertsArr.push(new Expert(usersArr[expertIndex].name, usersArr[expertIndex].rating, usersArr[expertIndex].problemRatings[problemIndex].rating));
        table.appendChild(tr);
    }
}

tableDiv.addEventListener("click", event => {
    const target = event.target;
    const resultsDiv = document.getElementById("results");
    const diagramCanvas = document.getElementById("diagram");
    diagramCanvas.width = 350;
    diagramCanvas.height = 350;
    const legend = document.getElementById("legend");
    if(target.id === "resultsButton") {
        resultsDiv.style.display = "grid";
        const diagram = new Diagram(
            problemsArr[selectedIndex].solutions,
            results,
            {
                canvas:diagramCanvas,
                colors:["#fde23e","#f16e23", "#57d9ff","#937e88"],
                legend: legend,
            }
        )
        diagram.draw();
        resultsDiv.addEventListener("click", event => {
            if(event.target.id === "submit"){
                resultsDiv.style.display = "none";
            }
        })
    }
})

function getResults() {
    const localResults = new Array(problemsArr[selectedIndex].solutions.length).fill(0);
    for(let i = 0; i< problemsArr[selectedIndex].solutions.length; i++) {
        for(let j = 0; j < expertsArr[0].matrixRating.length; j++) {
            localResults[i] += parseInt(expertsArr[0].matrixRating[j][i]) * parseFloat(expertsArr[j].relativeRating); 
        }
    }
    return localResults;
}


class Diagram {
    constructor(solutions, results,options){
        this.solutions = solutions;
        this.results = results;
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = options.colors;
    }
    draw() {
        let totalValue = results.reduce((a,b)=>{return a+b}, 0);
        let colorIndex = 0;
        let startAngle = 0;
        this.results.forEach(item =>{
            let sliceAngle = 2 * Math.PI * item / totalValue;
            let pieRadius = Math.min(this.canvas.width/2,this.canvas.height/2);
            let labelX = this.canvas.width/2 + (pieRadius / 2) * Math.cos(startAngle + sliceAngle/2);
            let labelY = this.canvas.height/2 + (pieRadius / 2) * Math.sin(startAngle + sliceAngle/2);
            this.drawPieSlice(
                this.ctx,
                this.canvas.width/2,
                this.canvas.height/2,
                Math.min(this.canvas.width/2, this.canvas.height/2),
                startAngle,
                startAngle+sliceAngle,
                this.colors[colorIndex%this.colors.length]
            );
            colorIndex++;
            let labelText = Math.round(100 * item / totalValue);
            this.ctx.fillStyle = "white";
            this.ctx.font = "bold 20px Arial";
            this.ctx.fillText(labelText+"%", labelX,labelY);
            startAngle +=sliceAngle;
            
        })
        colorIndex = 0;
        let legendHTML = "";
        this.solutions.forEach(item =>{
        legendHTML += "<div><span style='display:inline-block;width:20px;background-color:"+this.colors[colorIndex++]+";'>&nbsp;</span> "+"<p>"+item.name+ "(Решение №"+ colorIndex+ ")"+"</p>"+"</div>";
        });
        this.options.legend.innerHTML = legendHTML;
    }
    drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
    }
}