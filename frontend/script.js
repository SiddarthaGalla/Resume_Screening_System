
/* ===== PARTICLES BACKGROUND ===== */

if(typeof particlesJS !== "undefined" && document.getElementById("particles-js")){

particlesJS("particles-js",
{
particles:
{
number:
{
value:80,
density:
{
enable:true,
value_area:800
}
},

color:
{
value:"#3b82f6"
},

shape:
{
type:"circle"
},

opacity:
{
value:0.5
},

size:
{
value:3,
random:true
},

line_linked:
{
enable:true,
distance:150,
color:"#3b82f6",
opacity:0.4,
width:1
},

move:
{
enable:true,
speed:2
}

},

interactivity:
{
detect_on:"canvas",

events:
{
onhover:
{
enable:true,
mode:"repulse"
},

onclick:
{
enable:true,
mode:"push"
}
},

modes:
{
repulse:
{
distance:100
},

push:
{
particles_nb:4
}
}
},

retina_detect:true
})

}

function togglePassword(){
const password=document.getElementById("password")
if(password.type==="password"){
password.type="text"
}else{
password.type="password"
}
}

/* ===== SIGNUP USER ===== */
/* ===== SIGNUP USER ===== */
async function signupUser(){
const name=document.getElementById("name").value
const email=document.getElementById("email").value
const password=document.getElementById("password").value
const response=await fetch("http://127.0.0.1:5000/signup",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name:name,
email:email,
password:password
})
})
const data=await response.json()
alert(data.message)
if(data.message==="Signup successful"){
window.location.href="login.html"
}
}


/* ===== LOGIN USER ===== */
async function loginUser(){
const email=document.getElementById("loginEmail").value
const password=document.getElementById("loginPassword").value
const response=await fetch("http://127.0.0.1:5000/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email:email,
password:password
})
})
const data=await response.json()
if(data.message==="Login successful"){
localStorage.setItem("loggedInUser",data.name)
window.location.href="dashboard.html"
}else{
alert(data.message)
}
}

/* ===== START SCREENING FUNCTION ===== */
/* ===== START AI SCREENING ===== */
async function startScreening(){
const files=document.getElementById("resumeUpload").files
const job=document.getElementById("jobDesc").value
if(files.length===0){
alert("Please upload resumes")
return
}
const formData=new FormData()
for(let i=0;i<files.length;i++){
formData.append("resumes",files[i])
}
formData.append("job",job)
const response=await fetch("http://127.0.0.1:5000/upload-resumes",{
method:"POST",
body:formData
})
const data=await response.json()
console.log(data)
alert(data.message)
}

/* ===== LOGOUT FUNCTION ===== */
function logoutUser(){
localStorage.removeItem("loggedInUser")
window.location.href="login.html"
}

/* ===== PROTECT DASHBOARD ===== */
if(window.location.pathname.includes("dashboard.html")){
const user=localStorage.getItem("loggedInUser")
if(!user){
window.location.href="login.html"
}
}

/* ===== START AI SCREENING ===== */
async function startScreening(){
const files=document.getElementById("resumeUpload").files
const job=document.getElementById("jobDesc").value
if(files.length===0){
alert("Please upload resumes")
return
}
const formData=new FormData()
for(let i=0;i<files.length;i++){
formData.append("resumes",files[i])
}
formData.append("job",job)
try{
const response=await fetch("http://127.0.0.1:5000/screen",{
method:"POST",
body:formData
})
const data=await response.json()
console.log("Screening results:",data)
alert("AI Screening Completed")
// update table after screening
setTimeout(()=>{
loadCandidates()
},2000)
}catch(error){
console.error(error)
}
}

/* ===== DISPLAY CANDIDATE RANKING ===== */

function displayRanking(data){

let table=`<table class="ranking-table">
<tr>
<th>Candidate</th>
<th>Match Score</th>
<th>Rank</th>
</tr>`

data.forEach((item,index)=>{

table+=`
<tr>
<td>${item.candidate}</td>
<td>${item.score}%</td>
<td>${index+1}</td>
</tr>
`

})

table+=`</table>`

document.querySelector(".main").innerHTML+=table

}

/* ===== GLOBAL CANDIDATE DATA ===== */
let candidateData=[]

/* ===== DISPLAY CANDIDATE TABLE ===== */
function displayRanking(data){

candidateData=data

renderTable(data)

}

/* ===== TABLE RENDER FUNCTION ===== */
function renderTable(data){

let table=`<table class="ranking-table">
<tr>
<th>Name</th>
<th>CGPA</th>
<th>Experience (Years)</th>
<th>Projects</th>
<th>Skill Match %</th>
</tr>`

data.forEach(candidate=>{

table+=`
<tr>
<td>${candidate.name}</td>
<td>${candidate.cgpa}</td>
<td>${candidate.experience}</td>
<td>${candidate.projects}</td>
<td>${candidate.score}%</td>
</tr>
`

})

table+=`</table>`

document.getElementById("rankingResults").innerHTML=table

}

/* ===== FINAL CORRECTED SKILL PRIORITY SYSTEM ===== */
function getSkillScore(skills){

// convert string → array
if(typeof skills === "string"){
skills = skills.split(",");
}

// safety check
if(!Array.isArray(skills)) return 0;

const skillMap = {

/* ===== AI / ML / DL ===== */
"machine learning":15,
"ml":15,
"deep learning":15,
"artificial intelligence":15,
"ai":15,
"natural language processing":14,
"nlp":14,
"computer vision":14,
"generative ai":15,
"llm":15,
"transformers":14,
"tensorflow":13,
"pytorch":13,
"keras":12,
"huggingface":13,

/* ===== DATA SCIENCE ===== */
"data science":13,
"data analysis":12,
"data analytics":12,
"statistics":12,
"probability":12,
"pandas":12,
"numpy":12,
"matplotlib":11,
"seaborn":11,
"scikit-learn":12,

/* ===== PROGRAMMING ===== */
"python":13,
"java":10,
"c++":10,
"c":9,
"javascript":11,
"typescript":11,
"go":10,
"rust":10,

/* ===== CORE CS ===== */
"data structures":13,
"algorithms":13,
"dsa":13,
"operating system":12,
"os":12,
"dbms":12,
"computer networks":12,
"cn":12,
"system design":13,

/* ===== BACKEND ===== */
"node":11,
"nodejs":11,
"node.js":11,
"express":11,
"spring":11,
"spring boot":12,
"django":11,
"flask":11,
"fastapi":12,

/* ===== DATABASE ===== */
"sql":11,
"mysql":11,
"postgresql":11,
"mongodb":11,
"redis":10,
"firebase":10,

/* ===== FRONTEND ===== */
"react":10,
"reactjs":10,
"angular":9,
"vue":9,
"html":9,
"css":9,
"tailwind":9,
"bootstrap":9,

/* ===== CLOUD / DEVOPS ===== */
"aws":12,
"azure":11,
"gcp":11,
"docker":12,
"kubernetes":12,
"ci/cd":11,
"jenkins":11,
"terraform":11,
"github actions":11,

/* ===== CYBERSECURITY ===== */
"cybersecurity":11,
"network security":11,
"penetration testing":11,

/* ===== MOBILE ===== */
"android":9,
"kotlin":9,
"flutter":9,
"react native":9,

/* ===== UI/UX ===== */
"ui":5,
"ux":5,
"figma":5,
"adobe xd":5

};

let score = 0;

skills.forEach(function(skill){

let s = skill.toLowerCase().trim();

// normalize
s = s.replace(/\./g,"");
s = s.replace(/\s+/g," ");

/* ===== FIX: TAKE ONLY BEST MATCH ===== */
let bestMatch = 0;

for(let key in skillMap){
if(s.includes(key)){
bestMatch = Math.max(bestMatch, skillMap[key]);
}
}

score += bestMatch;

});

return score;
}

/* ===== FINAL SORT FUNCTION ===== */
function sortCandidates(){

const criteria = document.getElementById("sortCriteria").value

let data = window.currentData || []
let sorted = [...data]

if(criteria==="projects"){
sorted.sort((a,b)=>(b.projects||0)-(a.projects||0))
}
else if(criteria==="experience"){
sorted.sort((a,b)=>(b.experience||0)-(a.experience||0))
}
else if(criteria==="cgpa"){
sorted.sort((a,b)=>(b.cgpa||0)-(a.cgpa||0))
}
else if(criteria==="score"){
sorted.sort((a,b)=>(b.score||0)-(a.score||0))
}

/* 🔥 USE YOUR EXISTING DISPLAY FUNCTION */
displayData(sorted)

}

/* ===== UPDATE BOTH TABLES ===== */
function updateTables(data){

// ===== FIRST TABLE =====
const tableBody=document.querySelector("#candidateTable tbody")
tableBody.innerHTML=""

data.forEach(candidate=>{

const row=document.createElement("tr")

row.innerHTML=`
<td>${candidate.name || "Unknown"}</td>
<td>${candidate.email || "Not Found"}</td>
<td>${candidate.skills ? candidate.skills.join(", ") : "None"}</td>
<td>
<button onclick="deleteCandidate('${candidate.email}')">Delete</button>
</td>
`

tableBody.appendChild(row)

})

// ===== SECOND TABLE =====
const rankingBody=document.getElementById("rankingTableBody")
rankingBody.innerHTML=""

data.forEach((candidate,index)=>{

const row=document.createElement("tr")

row.innerHTML=`
<td>${candidate.name}</td>
<td>${candidate.skills.join(", ")}</td>
<td>${candidate.score ? (candidate.score*10).toFixed(1)+"%" : "0%"}</td>
<td>${index+1}</td>
`

rankingBody.appendChild(row)

})

}

/* ===== RENDER CANDIDATE TABLE ===== */
function renderTable(data){

let table=`<table class="ranking-table">
<tr>
<th>Name</th>
<th>CGPA</th>
<th>Experience</th>
<th>Projects</th>
<th>Skill Match</th>
<th>Skills</th>
</tr>`

data.forEach(candidate=>{

let skillTags=candidate.skills.map(skill=>`<span class="skill-tag">${skill}</span>`).join(" ")

table+=`
<tr>
<td>${candidate.name}</td>
<td>${candidate.cgpa}</td>
<td>${candidate.experience}</td>
<td>${candidate.projects}</td>
<td>${candidate.score}%</td>
<td>${skillTags}</td>
</tr>
`

})

table+=`</table>`

document.getElementById("rankingResults").innerHTML=table

}

/* ===== LOAD CANDIDATES ===== */
async function loadCandidates(){
try{

const response = await fetch("http://127.0.0.1:5000/candidates?nocache="+new Date().getTime())
const data = await response.json()

console.log("API DATA:", data)

/* STORE DATA */
window.currentData = data

/* DISPLAY DATA */
displayData(data)

}catch(error){
console.error("Error:", error)
}
}

/* ===== DELETE SINGLE CANDIDATE ===== */
async function deleteCandidate(email){
if(!confirm("Delete this candidate?")) return
await fetch(`http://127.0.0.1:5000/delete-candidate/${email}`,{
method:"DELETE"
})
loadCandidates()
}

/* ===== DELETE ALL CANDIDATES ===== */
async function deleteAllCandidates(){
if(!confirm("Delete ALL candidates?")) return
await fetch("http://127.0.0.1:5000/delete-all-candidates",{
method:"DELETE"
})
loadCandidates()
}

/* ===== DISPLAY BOTH TABLES ===== */
function displayData(data){

// ===== FIRST TABLE =====
const tableBody = document.querySelector("#candidateTable tbody")

if(!tableBody){
console.log("candidateTable not found")
return
}

tableBody.innerHTML = ""

data.forEach(candidate=>{

const row = document.createElement("tr")

row.innerHTML = `
<td>${candidate.name || "Unknown"}</td>
<td>${candidate.email || "Not Found"}</td>
<td>${candidate.skills ? candidate.skills.join(", ") : "None"}</td>
<td>
<button onclick="deleteCandidate('${candidate.email}')">Delete</button>
</td>
`

tableBody.appendChild(row)

})


// ===== SECOND TABLE =====
const rankingBody = document.getElementById("rankingTableBody")

if(!rankingBody){
console.log("rankingTableBody not found")
return
}

rankingBody.innerHTML = ""

const jobDesc = document.getElementById("jobDesc")?.value.trim()

let sorted = [...data]

if(!jobDesc){
console.log("Skill priority ranking")

sorted.sort((a,b)=>{
return getSkillScore(b.skills || []) - getSkillScore(a.skills || [])
})

}else{
console.log("Score ranking")

sorted.sort((a,b)=>(b.score||0)-(a.score||0))
}

sorted.forEach((candidate,index)=>{

const row = document.createElement("tr")

row.innerHTML = `
<td>${candidate.name}</td>
<td>${candidate.skills ? candidate.skills.join(", ") : "None"}</td>
<td>${candidate.score ? (candidate.score*1).toFixed(1)+"%" : "0%"}</td>
<td>${index+1}</td>
`

rankingBody.appendChild(row)

})

/* ===== UPDATE DASHBOARD STATS ===== */

// Total resumes uploaded
document.getElementById("totalResumes").innerText = data.length;

// Processed resumes (same as total for now)
document.getElementById("processedResumes").innerText = data.length;

// Shortlisted (score > threshold)
let shortlisted = data.filter(c => (c.score || 0) > 5).length;

document.getElementById("shortlistedResumes").innerText = shortlisted;

}

/* ===== AUTO LOAD DASHBOARD DATA ===== */
if(window.location.pathname.includes("dashboard.html")){
loadCandidates()
}

/* ===== AUTO REFRESH CANDIDATES ===== */
if(document.getElementById("candidateTable")){
loadCandidates()
setInterval(()=>{
loadCandidates()
},4000)
}

window.onload=()=>{
loadCandidates()
}

