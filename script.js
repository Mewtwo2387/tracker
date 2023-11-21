function updateTask(id, mweight, tweight) {
    const input = document.getElementById('i' + id);
    const bar = document.getElementById('b' + id);
    const taskpercent = ((input.value / input.max) * 100);
    const modulepercent = (taskpercent * tweight);
    const allpercent = (modulepercent * mweight);
    bar.style.width = taskpercent + '%';
    document.getElementById('t' + id).innerHTML = `${taskpercent.toFixed(2)}/100% of task`
    document.getElementById('m' + id).innerHTML = `${modulepercent.toFixed(2)}/${(tweight*100).toFixed(2)}% of module`
    document.getElementById('a' + id).innerHTML = `${allpercent.toFixed(2)}/${(tweight*mweight*100).toFixed(2)}% of all`
}

function load(){
    html = "<tr><th>Module</th><th>Tasks</th><th>Score</th></tr>"
    for(const module of data.modules){
        for(const task of module.tasks){
            if(task.id=='a'){
                html += `<tr><td rowspan="${module.tasks.length}">${module.name}<br><span class="small">(${module.credits} credits - ${(module.credits/data.totalCredits*100).toFixed(2)}%)</span></td>`
            }else{
                html += `<tr>`
            }
            html += `<td>${task.name}<br><span class="small">(${task.weight*100}%)</span></td><td><input type="number" min="0" max="${task.maxScore}" id="${'i'+module.id+task.id}" onchange="updateTask('${module.id+task.id}',${module.credits/data.totalCredits},${task.weight})"> /${task.maxScore}<div class="progress-bar"><div class="progress-bar-inner" id="${'b'+module.id+task.id}"></div></div><span class="small" id="${'t'+module.id+task.id}">--/100% of task</span><br><span class="small" id="${'m'+module.id+task.id}">--/100% of module</span><br><span class="small" id="${'a'+module.id+task.id}">--/100% of all</span></td></tr>`
        }
    }
    return html
}

setTimeout(() => {
    document.getElementById('table').innerHTML = load()
    for(const module of data.modules){
        for(const task of module.tasks){
            updateTask(module.id+task.id,module.credits/data.totalCredits,task.weight)
        }
    }
},100)