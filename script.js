function update(){
    totalpercent = 0
    totalcomplete = 0
    for(const module of data.modules){
        moduletotal = 0
        modulecomplete = 0
        for(const task of module.tasks){
            id = module.id + task.id
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
    
    saveScore()
}


function load(){
    html = "<tr><th>Module</th><th>Tasks</th><th>Score</th></tr>"
    for(const module of data.modules){
        for(const task of module.tasks){
            if(task.id=='a'){
                html += `<tr><td rowspan="${module.tasks.length}"><span class="module">${module.name}</span><br><span class="small">(${module.credits} credits - ${(module.credits/data.totalCredits*100).toFixed(2)}%)</span><br><b id="p${module.id}">0.00%</b><br><br><div class="progress-bar"><div class="progress-bar-inner" style="width:0%" id="${'b'+module.id}"></div></div><span class="small" id="${'m'+module.id}">--/100% of module</span><br><span class="small" id="${'a'+module.id}">--/--% of all</span><div class="progress-bar"><div class="progress-bar-inner" style="width:0%" id="${'bc'+module.id}"></div></div><span class="small" id="${'mc'+module.id}">--/--% of module</span><br><span class="small" id="${'ac'+module.id}">--/--% of all</span></td>`
            }else{
                html += `<tr>`
            }
            html += `<td class="${task.type}">${task.name}<br><span class="small">(${task.weight*100}%)</span><br><span class="small">(${task.date})</span></td><td><input type="number" min="0" max="${task.maxScore}" id="${'i'+module.id+task.id}" onchange="update()"> /${task.maxScore}<div class="progress-bar"><div class="progress-bar-inner" style="width:0%" id="${'b'+module.id+task.id}"></div></div><span class="small" id="${'t'+module.id+task.id}">--/100% of task</span><br><span class="small" id="${'m'+module.id+task.id}">--/100% of module</span><br><span class="small" id="${'a'+module.id+task.id}">--/100% of all</span></td></tr>`
        }
    }
    return html
}

setTimeout(() => {
    document.getElementById('table').innerHTML = load()
    loadScore()
    document.getElementById('jsoninput').value = JSON.stringify(data)
},100)

function loadScore(){
    cookie = getCookie("scores")
    if(cookie!=''){
        scores = JSON.parse(getCookie("scores"))
        for(const module of data.modules){
            for(const task of module.tasks){
                id = module.id + task.id
                document.getElementById('i' + id).value = scores[id]
            }
        }
    }
    update()
}

function saveScore(){
    scores = {}
    for(const module of data.modules){
        for(const task of module.tasks){
            id = module.id + task.id
            scores[id] = document.getElementById('i' + id).value
        }
    }
    setCookie("scores",JSON.stringify(scores))
}


// cookies

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

function switchtab(){
    if(document.getElementById("main").style.display=="none"){
        document.getElementById("main").style.display="block"
        document.getElementById("json").style.display="none"
    }else{
        document.getElementById("main").style.display="none"
        document.getElementById("json").style.display="block"
    }
}

function updateJSON(){
    try{
        data = JSON.parse(document.getElementById("jsoninput").value)
        document.getElementById('table').innerHTML = load()
    }catch{
        window.alert("Invalid JSON!")
    }
}