const KEY='lifeos_v1';
let data = JSON.parse(localStorage.getItem(KEY) || 'null') || {events:{}, tasks:[], goals:[], txs:[]};
const $ = id => document.getElementById(id);
const today = new Date();
let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
let selected = iso(today), taskFilter = 'all';

function save(){ try{ localStorage.setItem(KEY, JSON.stringify(data)); }catch(e){} }
function iso(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function esc(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
function money(n){ return Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2}); }
function fmtDate(s){ return new Date(s+'T00:00:00').toLocaleDateString(undefined,{month:'short', day:'numeric', year:'numeric'}); }
function startWeek(d){ let x=new Date(d); x.setHours(0,0,0,0); x.setDate(x.getDate()-x.getDay()); return x; }
function inThisWeek(s){ let d=new Date(s+'T00:00:00'), a=startWeek(today), b=new Date(a); b.setDate(b.getDate()+7); return d>=a && d<b; }

const T = {
 en:{navDash:'Dashboard',navCal:'Calendar',navPlanner:'Planner',navGoals:'Goals',navMoney:'Money',tag:'plan · goals · money',
  dashSub:'One place for your plans, goals and money.',tasksToday:'Tasks today',goalProgress:'Goal progress',balance:'Money balance',upcoming:'Upcoming',
  todayTitle:'Today',goalsGlance:'Goals at a glance',upcomingEvents:'Upcoming events',moneyMonth:'Money this month',
  calSub:'Events, deadlines and important dates.',today:'Today',eventPh:'Add event or deadline',add:'Add',
  plannerSub:'Turn your goals into things you can actually do.',taskPh:'What needs to be done',normal:'Normal',high:'High',low:'Low',
  fAll:'All',fToday:'Today',fWeek:'This week',fDone:'Done',addTask:'Add task',
  goalsSub:"Separate where you're going from what you need to do next.",short:'Short-term',medium:'Medium-term',long:'Long-term',
  daysWeeks:'Days & weeks',months:'Months',bigDir:'Big direction',addGoalH:'Add a goal',goalNamePh:'Goal name',progressPh:'Progress %',addGoal:'Add goal',
  moneySub:'Track income, spending and savings.',income:'Income',expense:'Expenses',savingsRate:'Savings rate',addTx:'Add transaction',
  whatWasPh:'What was it',amountPh:'Amount',categoryPh:'Category',monthlySummary:'Monthly summary',transactions:'Transactions',
  noEvents:'Nothing planned for this day.',noTasks:'No tasks here.',noGoals:'No goals yet.',noTx:'No transactions yet.',
  noTasksToday:'Nothing planned for today.',firstGoal:'Add your first goal.',noUpcoming:'No upcoming events.',
  thisMonthIn:'This month in',thisMonthOut:'This month out',net:'Net',dark:'Dark',light:'Light',dataNote:'All data stays in this browser.',remaining:'Remaining this month'},
 fr:{navDash:'Tableau de bord',navCal:'Calendrier',navPlanner:'Planificateur',navGoals:'Objectifs',navMoney:'Argent',tag:'plan · objectifs · argent',
  dashSub:'Un seul endroit pour vos plans, objectifs et finances.',tasksToday:'Tâches du jour',goalProgress:'Progression des objectifs',balance:'Solde',upcoming:'À venir',
  todayTitle:"Aujourd'hui",goalsGlance:'Objectifs en bref',upcomingEvents:'Événements à venir',moneyMonth:'Argent ce mois-ci',
  calSub:'Événements, échéances et dates importantes.',today:"Aujourd'hui",eventPh:'Ajouter un événement ou une échéance',add:'Ajouter',
  plannerSub:'Transformez vos objectifs en actions concrètes.',taskPh:'Que faut-il faire',normal:'Normal',high:'Élevée',low:'Faible',
  fAll:'Tout',fToday:"Aujourd'hui",fWeek:'Cette semaine',fDone:'Terminées',addTask:'Ajouter une tâche',
  goalsSub:'Distinguez votre direction de vos prochaines actions.',short:'Court terme',medium:'Moyen terme',long:'Long terme',
  daysWeeks:'Jours et semaines',months:'Mois',bigDir:'Grande direction',addGoalH:'Ajouter un objectif',goalNamePh:"Nom de l'objectif",progressPh:'Progression %',addGoal:'Ajouter un objectif',
  moneySub:'Suivez vos revenus, dépenses et économies.',income:'Revenu',expense:'Dépenses',savingsRate:"Taux d'épargne",addTx:'Ajouter une transaction',
  whatWasPh:'Pour quoi',amountPh:'Montant',categoryPh:'Catégorie',monthlySummary:'Résumé mensuel',transactions:'Transactions',
  noEvents:'Rien de prévu ce jour.',noTasks:'Aucune tâche ici.',noGoals:'Aucun objectif.',noTx:'Aucune transaction.',
  noTasksToday:"Rien de prévu aujourd'hui.",firstGoal:'Ajoutez votre premier objectif.',noUpcoming:'Aucun événement à venir.',
  thisMonthIn:'Revenus ce mois-ci',thisMonthOut:'Dépenses ce mois-ci',net:'Net',dark:'Sombre',light:'Clair',dataNote:'Les données restent dans ce navigateur.',remaining:'Restant ce mois-ci'},
 ar:{navDash:'لوحة التحكم',navCal:'التقويم',navPlanner:'المخطط',navGoals:'الأهداف',navMoney:'المال',tag:'خطط · أهداف · مال',
  dashSub:'مكان واحد لخططك وأهدافك وأموالك.',tasksToday:'مهام اليوم',goalProgress:'تقدم الأهداف',balance:'الرصيد',upcoming:'القادم',
  todayTitle:'اليوم',goalsGlance:'ملخص الأهداف',upcomingEvents:'الأحداث القادمة',moneyMonth:'المال هذا الشهر',
  calSub:'الأحداث والمواعيد النهائية والتواريخ المهمة.',today:'اليوم',eventPh:'أضف حدثًا أو موعدًا نهائيًا',add:'إضافة',
  plannerSub:'حوّل أهدافك إلى خطوات يمكنك تنفيذها.',taskPh:'ما الذي يجب إنجازه؟',normal:'عادية',high:'مهمة',low:'منخفضة',
  fAll:'الكل',fToday:'اليوم',fWeek:'هذا الأسبوع',fDone:'مكتملة',addTask:'إضافة مهمة',
  goalsSub:'افصل بين وجهتك وما تحتاج إلى فعله الآن.',short:'قصيرة المدى',medium:'متوسطة المدى',long:'طويلة المدى',
  daysWeeks:'أيام وأسابيع',months:'أشهر',bigDir:'الاتجاه الكبير',addGoalH:'إضافة هدف',goalNamePh:'اسم الهدف',progressPh:'نسبة التقدم',addGoal:'إضافة هدف',
  moneySub:'تتبع الدخل والمصروفات والادخار.',income:'دخل',expense:'مصروفات',savingsRate:'معدل الادخار',addTx:'إضافة معاملة',
  whatWasPh:'ما الغرض منها؟',amountPh:'المبلغ',categoryPh:'الفئة',monthlySummary:'ملخص شهري',transactions:'المعاملات',
  noEvents:'لا يوجد شيء مخطط لهذا اليوم.',noTasks:'لا توجد مهام هنا.',noGoals:'لا توجد أهداف بعد.',noTx:'لا توجد معاملات بعد.',
  noTasksToday:'لا توجد مهام مخططة اليوم.',firstGoal:'أضف هدفك الأول.',noUpcoming:'لا توجد أحداث قادمة.',
  thisMonthIn:'الدخل هذا الشهر',thisMonthOut:'المصروفات هذا الشهر',net:'الصافي',dark:'داكن',light:'فاتح',dataNote:'يتم حفظ البيانات في هذا المتصفح.',remaining:'المتبقي هذا الشهر'}
};
let lang = localStorage.getItem('lifeos_lang') || 'en';
function tr(k){ return (T[lang] && T[lang][k]) || T.en[k] || k; }

function applyLanguage(){
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i]').forEach(el => el.textContent = tr(el.dataset.i));
  document.querySelectorAll('[data-i-ph]').forEach(el => el.placeholder = tr(el.dataset.iPh));
  $('tagText').textContent = tr('tag');
  $('dashSub').textContent = tr('dashSub');
  $('sideNote').textContent = tr('dataNote');
  document.title = lang==='fr' ? 'LifeOS — Plans, objectifs et argent' : lang==='ar' ? 'LifeOS — خطط وأهداف ومال' : 'LifeOS — Plan, Goals & Money';
  const dark = document.documentElement.dataset.theme === 'dark';
  $('themeBtn').innerHTML = (dark?'☀ ':'☾ ') + '<span id="themeLabel">' + (dark ? tr('light') : tr('dark')) + '</span>';
  renderAll();
}

function switchView(view){
  document.querySelectorAll('.navcol button').forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  $('v-'+view).classList.add('active');
  renderAll();
}
document.querySelectorAll('.navcol button').forEach(b => b.addEventListener('click', ()=>switchView(b.dataset.view)));

function renderDashboard(){
  $('todayText').textContent = today.toLocaleDateString(undefined,{weekday:'long', month:'long', day:'numeric', year:'numeric'});
  let td = iso(today);
  let tasks = data.tasks.filter(t=>t.date===td);
  let activeGoals = data.goals.filter(g=>!g.done);
  let avg = activeGoals.length ? Math.round(activeGoals.reduce((a,g)=>a+g.progress,0)/activeGoals.length) : 0;
  $('sTasks').textContent = tasks.filter(t=>!t.done).length;
  $('sGoals').textContent = avg+'%';
  let bal = data.txs.reduce((a,x)=>a+(x.type==='income'?x.amount:-x.amount),0);
  $('sBalance').textContent = money(bal);
  let upcomingCount = Object.keys(data.events).filter(k=>k>=td).reduce((a,k)=>a+data.events[k].length,0);
  $('sUpcoming').textContent = upcomingCount;

  $('dashTasks').innerHTML = tasks.length ? tasks.slice(0,6).map(t=>
    `<div class="item row"><label style="display:flex;gap:8px;align-items:center"><input class="check" type="checkbox" ${t.done?'checked':''} data-toggletask="${t.id}"><span class="${t.done?'donetext':''}">${esc(t.text)}</span></label></div>`
  ).join('') : `<div class="empty">${tr('noTasksToday')}</div>`;

  $('dashGoals').innerHTML = activeGoals.length ? activeGoals.slice(0,4).map(g=>
    `<div class="goal"><div class="row"><b>${esc(g.text)}</b><span>${g.progress}%</span></div><div class="progress"><i style="width:${g.progress}%"></i></div></div>`
  ).join('') : `<div class="empty">${tr('firstGoal')}</div>`;

  let ev=[]; Object.keys(data.events).sort().forEach(k=>{ if(k>=td && ev.length<5) data.events[k].forEach(e=>ev.push({date:k,...e})); });
  $('dashEvents').innerHTML = ev.length ? ev.map(e=>
    `<div class="item row"><span>${esc(e.text)}</span><span class="small muted">${fmtDate(e.date)}${e.time?' · '+e.time:''}</span></div>`
  ).join('') : `<div class="empty">${tr('noUpcoming')}</div>`;

  let m=today.getMonth(), y=today.getFullYear(), inc=0, out=0;
  data.txs.forEach(x=>{ let d=new Date(x.date); if(d.getMonth()===m && d.getFullYear()===y){ x.type==='income'?inc+=x.amount:out+=x.amount; } });
  let pct = inc ? Math.min(100, Math.max(0,(inc-out)/inc*100)) : 0;
  $('dashMoney').innerHTML = `<div class="row"><span>${tr('income')}</span><b class="green">${money(inc)}</b></div>
    <div class="row" style="margin-top:9px"><span>${tr('expense')}</span><b class="red">${money(out)}</b></div>
    <div class="progress" style="margin-top:10px"><i style="width:${pct}%"></i></div>
    <div class="small muted" style="margin-top:8px">${tr('remaining')}: ${money(inc-out)}</div>`;

  document.querySelectorAll('[data-toggletask]').forEach(el=>el.addEventListener('change', ()=>toggleTask(el.dataset.toggletask)));
}

function addDay(d, other){
  let k = iso(d), ev = data.events[k]||[];
  let c = document.createElement('div');
  c.className = 'day' + (other?' other':'') + (k===iso(today)?' today':'') + (k===selected?' selected':'');
  c.innerHTML = `<div class="daynum">${d.getDate()}</div>` + ev.slice(0,3).map(e=>`<div class="event">${esc(e.text)}</div>`).join('');
  c.addEventListener('click', ()=>{ selected=k; renderCalendar(); });
  $('calGrid').appendChild(c);
}
function renderCalendar(){
  let g = $('calGrid'); g.innerHTML = '';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(x=>{ let d=document.createElement('div'); d.className='dow'; d.textContent=x; g.appendChild(d); });
  let y=viewDate.getFullYear(), m=viewDate.getMonth();
  let first = new Date(y,m,1).getDay(), days = new Date(y,m+1,0).getDate(), prev = new Date(y,m,0).getDate();
  $('monthLabel').textContent = viewDate.toLocaleDateString(undefined,{month:'long', year:'numeric'});
  for(let i=first-1;i>=0;i--) addDay(new Date(y,m-1,prev-i), true);
  for(let d=1;d<=days;d++) addDay(new Date(y,m,d), false);
  let total = first+days, trailing=(7-total%7)%7;
  for(let d=1;d<=trailing;d++) addDay(new Date(y,m+1,d), true);

  $('selDateLabel').textContent = new Date(selected+'T00:00:00').toLocaleDateString(undefined,{weekday:'long', month:'long', day:'numeric'});
  let ev = data.events[selected]||[];
  $('selEvents').innerHTML = ev.length ? ev.map((e,i)=>
    `<div class="item row"><span>${e.time?`<span class="small muted">${e.time} · </span>`:''}${esc(e.text)}</span><button class="btn danger" data-delevent="${i}">×</button></div>`
  ).join('') : `<div class="empty">${tr('noEvents')}</div>`;
  document.querySelectorAll('[data-delevent]').forEach(el=>el.addEventListener('click', ()=>{ data.events[selected].splice(Number(el.dataset.delevent),1); save(); renderCalendar(); renderDashboard(); }));
}

function toggleTask(id){ let t=data.tasks.find(x=>x.id===id); if(t) t.done=!t.done; save(); renderAll(); }
function renderTasks(){
  let arr = data.tasks.filter(t => taskFilter==='all' || (taskFilter==='today'&&t.date===iso(today)) || (taskFilter==='week'&&inThisWeek(t.date)) || (taskFilter==='done'&&t.done))
    .sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  $('taskList').innerHTML = arr.length ? arr.map(t=>
    `<div class="item row"><label style="display:flex;gap:8px;align-items:center"><input class="check" type="checkbox" ${t.done?'checked':''} data-toggletask="${t.id}"><span class="${t.done?'donetext':''}">${esc(t.text)}</span></label>
      <div style="display:flex;align-items:center;gap:10px"><span class="small muted">${t.date?fmtDate(t.date):''} · ${tr(t.priority.toLowerCase())}</span><button class="btn danger" data-deltask="${t.id}">×</button></div></div>`
  ).join('') : `<div class="empty">${tr('noTasks')}</div>`;
  document.querySelectorAll('[data-toggletask]').forEach(el=>el.addEventListener('change', ()=>toggleTask(el.dataset.toggletask)));
  document.querySelectorAll('[data-deltask]').forEach(el=>el.addEventListener('click', ()=>{ data.tasks=data.tasks.filter(x=>x.id!==el.dataset.deltask); save(); renderAll(); }));
}
document.querySelectorAll('#taskTabs button').forEach(b=>b.addEventListener('click', ()=>{ document.querySelectorAll('#taskTabs button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); taskFilter=b.dataset.filter; renderTasks(); }));

function toggleGoal(id){ let g=data.goals.find(x=>x.id===id); if(g) g.done=!g.done; save(); renderAll(); }
function renderGoals(){
  ['short','medium','long'].forEach(type=>{
    let list = data.goals.filter(g=>g.type===type);
    $(type+'Goals').innerHTML = list.length ? list.map(g=>
      `<div class="goal"><div class="row"><label style="display:flex;gap:8px;align-items:center"><input class="check" type="checkbox" ${g.done?'checked':''} data-togglegoal="${g.id}"><b class="${g.done?'donetext':''}">${esc(g.text)}</b></label><button class="btn danger" data-delgoal="${g.id}">×</button></div>
        <div class="row small muted" style="margin-top:7px"><span>${g.deadline?fmtDate(g.deadline):''}</span><span>${g.progress}%</span></div>
        <div class="progress"><i style="width:${g.progress}%"></i></div></div>`
    ).join('') : `<div class="empty">${tr('noGoals')}</div>`;
  });
  document.querySelectorAll('[data-togglegoal]').forEach(el=>el.addEventListener('change', ()=>toggleGoal(el.dataset.togglegoal)));
  document.querySelectorAll('[data-delgoal]').forEach(el=>el.addEventListener('click', ()=>{ data.goals=data.goals.filter(x=>x.id!==el.dataset.delgoal); save(); renderAll(); }));
}

function renderMoney(){
  let inc=0, out=0;
  data.txs.forEach(x=> x.type==='income' ? inc+=x.amount : out+=x.amount);
  let bal = inc-out;
  $('balanceNum').textContent = money(bal);
  $('incomeNum').textContent = money(inc);
  $('expenseNum').textContent = money(out);
  $('savingRate').textContent = (inc ? Math.round((bal/inc)*100) : 0)+'%';
  let m=today.getMonth(), y=today.getFullYear(), mi=0, mo=0;
  data.txs.forEach(x=>{ let d=new Date(x.date); if(d.getMonth()===m && d.getFullYear()===y){ x.type==='income'?mi+=x.amount:mo+=x.amount; } });
  $('moneySummary').innerHTML = `<div class="row"><span>${tr('thisMonthIn')}</span><b class="green">${money(mi)}</b></div>
    <div class="row" style="margin-top:10px"><span>${tr('thisMonthOut')}</span><b class="red">${money(mo)}</b></div>
    <div class="row" style="margin-top:10px"><span>${tr('net')}</span><b>${money(mi-mo)}</b></div>`;
  $('txList').innerHTML = data.txs.length ? data.txs.map(x=>
    `<div class="tx"><div><b>${esc(x.label)}</b><div class="small muted">${esc(x.category||'—')} · ${fmtDate(x.date)}</div></div>
      <div style="display:flex;align-items:center;gap:10px"><span class="amt ${x.type}">${x.type==='income'?'+':'−'}${money(x.amount)}</span><button class="btn danger" data-deltx="${x.id}">×</button></div></div>`
  ).join('') : `<div class="empty">${tr('noTx')}</div>`;
  document.querySelectorAll('[data-deltx]').forEach(el=>el.addEventListener('click', ()=>{ data.txs=data.txs.filter(x=>x.id!==el.dataset.deltx); save(); renderAll(); }));
}

function renderAll(){ renderDashboard(); renderCalendar(); renderTasks(); renderGoals(); renderMoney(); }

$('langSelect').value = lang;
$('langSelect').addEventListener('change', e=>{ lang=e.target.value; localStorage.setItem('lifeos_lang', lang); applyLanguage(); });

let theme = localStorage.getItem('lifeos_theme') || 'light';
document.documentElement.dataset.theme = theme;
$('themeBtn').addEventListener('click', ()=>{
  theme = document.documentElement.dataset.theme==='dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('lifeos_theme', theme);
  applyLanguage();
});

$('prevM').addEventListener('click', ()=>{ viewDate.setMonth(viewDate.getMonth()-1); renderCalendar(); });
$('nextM').addEventListener('click', ()=>{ viewDate.setMonth(viewDate.getMonth()+1); renderCalendar(); });
$('todayBtn').addEventListener('click', ()=>{ viewDate=new Date(today.getFullYear(), today.getMonth(),1); selected=iso(today); renderCalendar(); });
$('addEvBtn').addEventListener('click', ()=>{
  let text=$('evText').value.trim(); if(!text) return;
  if(!data.events[selected]) data.events[selected]=[];
  data.events[selected].push({text, time:$('evTime').value});
  $('evText').value=''; $('evTime').value=''; save(); renderCalendar(); renderDashboard();
});
$('addTaskBtn').addEventListener('click', ()=>{
  let text=$('taskText').value.trim(); if(!text) return;
  data.tasks.push({id:Date.now().toString(), text, priority:$('taskPriority').value||'Normal', date:$('taskDate').value||iso(today), done:false});
  $('taskText').value=''; $('taskDate').value=''; save(); renderAll();
});
$('addGoalBtn').addEventListener('click', ()=>{
  let text=$('goalText').value.trim(); if(!text) return;
  let p = Math.max(0, Math.min(100, Number($('goalProgressInput').value)||0));
  data.goals.push({id:Date.now().toString(), text, type:$('goalType').value, progress:p, deadline:$('goalDeadline').value, done:p>=100});
  $('goalText').value=''; $('goalProgressInput').value=''; $('goalDeadline').value=''; save(); renderAll();
});
$('addTxBtn').addEventListener('click', ()=>{
  let label=$('txLabel').value.trim(), amount=Number($('txAmount').value);
  if(!label || !amount || amount<=0) return;
  data.txs.unshift({id:Date.now().toString(), type:$('txType').value, label, amount, category:$('txCategory').value, date:iso(today)});
  $('txLabel').value=''; $('txAmount').value=''; $('txCategory').value=''; save(); renderAll();
});

applyLanguage();
