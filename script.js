let currentCourse = 'year1';

function switchCourse(course) {
    currentCourse = course;
    setActiveTab(course);
    document.getElementById('table').innerHTML = loadCourseData(course);
    loadCourseScore(course);
}

function setActiveTab(course) {
    const tabs = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    document.getElementById(course).classList.add('active');
}

function loadCourseData(course) {
    const data = modulesData[course];
    html = "<tr><th>Module</th><th>Tasks</th><th>Score</th></tr>"
    for(const module of data.modules){
        for (const task of module.tasks) {
            // Module cell
            if (task.id == 'a') {
                html += `<tr>
                    <td rowspan="${module.tasks.length}">
                        <span class="module">${module.name}</span><br>
                        <span class="small">(${module.credits} credits - ${(module.credits / data.totalCredits * 100).toFixed(2)}%)</span><br>
                        <b id="p${module.id}">0.00%</b><br><br>
                        <div class="progress-bar"><div class="progress-bar-inner" style="width:0%" id="b${module.id}"></div></div>
                        <span class="small" id="m${module.id}">--/100% of module</span><br>
                        <span class="small" id="a${module.id}">--/--% of all</span>
                        <div class="progress-bar"><div class="progress-bar-inner" style="width:0%" id="bc${module.id}"></div></div>
                        <span class="small" id="mc${module.id}">--/--% of module</span><br>
                        <span class="small" id="ac${module.id}">--/--% of all</span>
                        ${(course === 'year3' || course === 'year4') ? `<br><button onclick="deleteModule(${module.id})" style="margin-top: 5px;">Delete Module</button>` : ''}
                    </td>`;
            } else {
                html += `<tr>`;
            }

            // Task cells
                const isCustomYear = (course === 'year3' || course === 'year4');
                if (isCustomYear) {
                html += `
                    <td class="${task.type}">${task.name}</br>
                        <span class="small">(${(task.weight * 100).toFixed(2)}%)</span><br>
                    </td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <div>
                                Score: <input type="number" min="0" max="${task.maxScore}" id="i${module.id + task.id}" onchange="update()"> /${task.maxScore}
                            </div>
                            <div>
                                Weight: <input type="number" min="0" max="100" step="0.1" value="${(task.weight * 100).toFixed(1)}" 
                                id="w${module.id + task.id}" onchange="updateWeight(${module.id}, '${task.id}')" style="width: 60px">%
                            </div>
                        </div>
                        <div class="progress-bar"><div class="progress-bar-inner" style="width:0%" id="b${module.id + task.id}"></div></div>
                        <span class="small" id="t${module.id + task.id}">--/100% of ${task.type === 'test' ? 'exam' : 'coursework'}</span><br>
                        <span class="small" id="m${module.id + task.id}">--/100% of module</span><br>
                        <span class="small" id="a${module.id + task.id}">--/100% of all</span>
                    </td>
                </tr>`;
            } else {
                html += `
                    <td class="${task.type}">${task.name}<br>
                        <span class="small">(${(task.weight * 100).toFixed(2)}%)</span><br>
                        <span class="small">(${task.date})</span>
                    </td>
                    <td>
                        <input type="number" min="0" max="${task.maxScore}" id="i${module.id + task.id}" onchange="update()"> /${task.maxScore}
                        <div class="progress-bar"><div class="progress-bar-inner" style="width:0%" id="b${module.id + task.id}"></div></div>
                        <span class="small" id="t${module.id + task.id}">--/100% of task</span><br>
                        <span class="small" id="m${module.id + task.id}">--/100% of module</span><br>
                        <span class="small" id="a${module.id + task.id}">--/100% of all</span>
                    </td>
                </tr>`;
            }
        }
    }

    // Add the new module section for year 3 and year 4
    if (course === 'year3' || course === 'year4') {
        html += `
            <tr>
                <td colspan="3" style="text-align: center; padding: 20px; background-color: rgba(204,136,255,0.1);">
                    <h3>Add New Module</h3>
                    <input type="text" id="newModuleName" placeholder="module name" style="margin: 5px;"><br>
                    <input type="number" id="newModuleCredits" placeholder="credits" style="margin: 5px;"><br>
                    <input type="number" id="newTaskCount" placeholder="num of courseworks" style="margin: 5px;"><br>
                    <select id="hasExam" style="margin: 5px;">
                        <option value="yes">Exam</option>
                        <option value="no">No Exam</option>
                    </select><br>
                    <button onclick="addNewModule()" style="margin: 5px;">Add Module</button>
                </td>
            </tr>
        `;
    }
    return html
}

function loadCourseScore(course) {
    const data = modulesData[course];
    if(localStorage[course]!=undefined){
        scores = JSON.parse(localStorage[course])
        for(const module of data.modules){
            for(const task of module.tasks){
                id = module.id + task.id
                document.getElementById('i' + id).value = scores[id]
            }
        }
    }
    update()
}

function saveCourseScore(course){
    scores = {}
    const data = modulesData[course];
    for(const module of data.modules){
        for(const task of module.tasks){
            id = module.id + task.id
            scores[id] = document.getElementById('i' + id).value
        }
    }
    localStorage[course] = JSON.stringify(scores)
}

function fixScore(){
    if(localStorage['year1'] == undefined && localStorage['scores'] != undefined){
        localStorage['year1'] = localStorage['scores']
        localStorage.removeItem('score')
    }
}

// updates the progress bars and calculates the average grade
function update(){
    const data = modulesData[currentCourse];
    totalpercent = 0
    totalcomplete = 0
    for(const module of data.modules){
        moduletotal = 0
        modulecomplete = 0
        for(const task of module.tasks){
            id = module.id + task.id
            console.log(id)
            taskpercent = ((document.getElementById('i' + id).value / document.getElementById('i' + id).max) * 100);
            modulepercent = taskpercent * task.weight;
            moduletotal += modulepercent;
            if(modulepercent!=0){modulecomplete += task.weight}
            allpercent = modulepercent * module.credits/data.totalCredits;
            document.getElementById('b' + id).style.width = taskpercent + '%';
            document.getElementById('t' + id).innerHTML = `${taskpercent.toFixed(2)}/100% of task`
            document.getElementById('m' + id).innerHTML = `${modulepercent.toFixed(2)}/${(task.weight*100).toFixed(2)}% of module`
            document.getElementById('a' + id).innerHTML = `${allpercent.toFixed(2)}/${(task.weight*module.credits/data.totalCredits*100).toFixed(2)}% of all`
        }

        document.getElementById('b' + module.id).style.width = moduletotal + '%';
        moduleallpercent = moduletotal * module.credits/data.totalCredits
        document.getElementById('m' + module.id).innerHTML = `${moduletotal.toFixed(2)}/100% of module`
        document.getElementById('a' + module.id).innerHTML = `${moduleallpercent.toFixed(2)}/${(module.credits/data.totalCredits*100).toFixed(2)}% of all`


        if(modulecomplete==0){
            modulecompletepercent = 0
        }else{
            modulecompletepercent = moduletotal / modulecomplete
        }

        document.getElementById('bc' + module.id).style.width = modulecompletepercent + '%';
        moduletotalall = moduletotal * module.credits/data.totalCredits
        modulecompleteall = modulecomplete * module.credits/data.totalCredits
        totalpercent += moduletotalall
        totalcomplete += modulecompleteall
        document.getElementById('mc' + module.id).innerHTML = `${moduletotal.toFixed(2)}/${(modulecomplete*100).toFixed(2)}% of module (completed tasks only)`;
        document.getElementById('ac' + module.id).innerHTML = `${moduletotalall.toFixed(2)}/${(modulecompleteall*100).toFixed(2)}% of all (completed tasks only)`;
        document.getElementById('p' + module.id).innerHTML = `${modulecompletepercent.toFixed(2)}%`
    }
    if(totalcomplete==0){
        document.getElementById("avggrade").innerHTML = 'Current Average: 0.00%'
        document.getElementById("totalcompletepercentbar").style.width = '0.00%'
    }else{
        document.getElementById("avggrade").innerHTML = `Current Average: ${(totalpercent / totalcomplete).toFixed(2)}%`
        document.getElementById("totalcompletepercentbar").style.width = `${(totalpercent / totalcomplete).toFixed(2)}%`
    }

    document.getElementById("totalpercent").innerHTML = `${totalpercent.toFixed(2)}% / 100% Total`
    document.getElementById("totalpercentbar").style.width = `${totalpercent.toFixed(2)}%`
    document.getElementById("totalcompletepercent").innerHTML = `${totalpercent.toFixed(2)}% / ${(totalcomplete*100).toFixed(2)}% Completed`

    saveCourseScore(currentCourse);
}

function addNewModule() {
    const moduleName = document.getElementById('newModuleName').value;
    const moduleCredits = parseFloat(document.getElementById('newModuleCredits').value);
    const courseworkCount = parseInt(document.getElementById('newTaskCount').value);
    
    if (!moduleName || isNaN(moduleCredits) || isNaN(courseworkCount) || courseworkCount < 0) {
        alert('Please fill in all fields correctly');
        return;
    }

    const hasExam = document.getElementById('hasExam').value === 'yes';
    const examWeight = hasExam ? 0.8 : 0; // 80% weight for exam if it exists
    const remainingWeight = 1 - examWeight;
    
    const newModule = {
        id: modulesData[currentCourse].modules.length,
        name: moduleName,
        credits: moduleCredits,
        tasks: []
    };

    for (let i = 0; i < courseworkCount; i++) {
        newModule.tasks.push({
            id: String.fromCharCode(97 + i), // a, b, c, ...
            name: `CW${i + 1}`,
            type: 'cw',
            maxScore: 100,
            weight: remainingWeight / courseworkCount,
            date: 'TBD'
        });
    }

    if (hasExam) {
        newModule.tasks.push({
            id: String.fromCharCode(97 + courseworkCount),
            name: 'Final Exam',
            type: 'test',
            maxScore: 100,
            weight: examWeight,
            date: 'TBD'
        });
    }

    modulesData[currentCourse].modules.push(newModule);
    modulesData[currentCourse].totalCredits = modulesData[currentCourse].modules.reduce((sum, module) => sum + module.credits, 0);
    saveCourseData(currentCourse);
    switchCourse(currentCourse);
}

function deleteModule(moduleId) {
    modulesData[currentCourse].modules = modulesData[currentCourse].modules.filter(m => m.id !== moduleId);
    modulesData[currentCourse].totalCredits = modulesData[currentCourse].modules.reduce((sum, module) => sum + module.credits, 0);
    saveCourseData(currentCourse);
    switchCourse(currentCourse);
}

function updateWeight(moduleId, taskId) {
    const module = modulesData[currentCourse].modules.find(m => m.id === moduleId);
    const task = module.tasks.find(t => t.id === taskId);
    const weightInput = document.getElementById('w' + moduleId + taskId);
    const newWeightPercent = parseFloat(weightInput.value);

    if (isNaN(newWeightPercent) || newWeightPercent < 0 || newWeightPercent > 100) {
        alert('Weight must be between 0 and 100');
        weightInput.value = (task.weight * 100).toFixed(1);
        return;
    }

    // Calculate total of other weights
    const totalOtherWeights = module.tasks
        .filter(t => t.id !== taskId)
        .reduce((sum, t) => sum + t.weight, 0);

    if (totalOtherWeights + (newWeightPercent / 100) > 1) {
        alert('Total weights cannot exceed 100%. Current other weights: ' + 
              (totalOtherWeights * 100).toFixed(1) + '%');
        weightInput.value = (task.weight * 100).toFixed(1);
        return;
    }

    task.weight = newWeightPercent / 100;
    saveCourseData(currentCourse);
    update();
}

function saveCourseData(course) {
    localStorage['moduleData_' + course] = JSON.stringify(modulesData[course]);
}

function loadSavedCourseData(course) {
    const savedData = localStorage['moduleData_' + course];
    if (savedData) {
        modulesData[course] = JSON.parse(savedData);
    }
}

window.onload = function() {
    fixScore();
    loadSavedCourseData('year3'); // Load custom year 3 modules
    loadSavedCourseData('year4'); // Load custom year 4 modules
    switchCourse(currentCourse);
}