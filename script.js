function update(){
    for(const module of data.modules){
        moduletotal = 0
        for(const task of module.tasks){
            id = module.id + task.id
            taskpercent = ((document.getElementById('i' + id).value / document.getElementById('i' + id).max) * 100);
            modulepercent = taskpercent * task.weight;
            moduletotal += modulepercent;
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

    }
}


function load(){
    html = "<tr><th>Module</th><th>Tasks</th><th>Score</th></tr>"
    for(const module of data.modules){
        for(const task of module.tasks){
            if(task.id=='a'){
                html += `<tr><td rowspan="${module.tasks.length}">${module.name}<br><span class="small">(${module.credits} credits - ${(module.credits/data.totalCredits*100).toFixed(2)}%)</span><div class="progress-bar"><div class="progress-bar-inner" style="width:0%" id="${'b'+module.id}"></div></div><span class="small" id="${'m'+module.id}">--/100% of module</span><br><span class="small" id="${'a'+module.id}">--/--% of all</span></td>`
            }else{
                html += `<tr>`
            }
            html += `<td>${task.name}<br><span class="small">(${task.weight*100}%)</span></td><td><input type="number" min="0" max="${task.maxScore}" id="${'i'+module.id+task.id}" onchange="update()"> /${task.maxScore}<div class="progress-bar"><div class="progress-bar-inner" style="width:0%" id="${'b'+module.id+task.id}"></div></div><span class="small" id="${'t'+module.id+task.id}">--/100% of task</span><br><span class="small" id="${'m'+module.id+task.id}">--/100% of module</span><br><span class="small" id="${'a'+module.id+task.id}">--/100% of all</span></td></tr>`
        }
    }
    return html
}

setTimeout(() => {
    document.getElementById('table').innerHTML = load()
    update()
},100)