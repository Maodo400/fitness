let currentLang = 'fr';
let currentOffset = 0;
const limit = 20;
let activeFilters = {
  search: '',
  body_part: '',
  equipment: '',
  target: ''
};
let workoutPlan = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchFilters();
  loadExercises();
  loadSavedWorkout();
});

function changeLanguage() {
  currentLang = document.getElementById('lang-select').value;
  loadExercises(true);
}

async function fetchFilters() {
  try {
    const res = await fetch('/api/filters');
    const data = await res.json();
    
    populateSelect('filter-body-part', data.bodyParts);
    populateSelect('filter-equipment', data.equipments);
    populateSelect('filter-target', data.targets);
  } catch (err) {
    console.error("Failed to load filters", err);
  }
}

function populateSelect(id, options) {
  const sel = document.getElementById(id);
  options.forEach(opt => {
    const el = document.createElement('option');
    el.value = opt;
    el.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
    sel.appendChild(el);
  });
}

async function loadExercises(reset = false) {
  if (reset) {
    currentOffset = 0;
    document.getElementById('exercises-grid').innerHTML = '';
  }

  const query = new URLSearchParams({
    offset: currentOffset,
    limit: limit,
    ...activeFilters
  });

  try {
    const res = await fetch(`/api/exercises?${query.toString()}`);
    const result = await res.json();
    
    document.getElementById('results-count').textContent = `${result.total} exercice(s) trouvé(s)`;
    
    renderCards(result.data);

    const btnMore = document.getElementById('btn-load-more');
    if (currentOffset + limit < result.total) {
      btnMore.classList.remove('hidden');
    } else {
      btnMore.classList.add('hidden');
    }
  } catch (err) {
    console.error("Error fetching exercises", err);
  }
}

function renderCards(exercises) {
  const grid = document.getElementById('exercises-grid');
  
  exercises.forEach(ex => {
    const card = document.createElement('div');
    card.className = "bg-slate-800 border border-slate-700/70 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-lg transition group flex flex-col";
    
    const cdnBaseUrl = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/";
    const mediaUrl = ex.gif_url ? `${cdnBaseUrl}${ex.gif_url}` : `${cdnBaseUrl}${ex.image}`;
    
    card.innerHTML = `
      <div class="relative bg-slate-900 aspect-square p-4 flex items-center justify-center overflow-hidden">
        <img src="${mediaUrl}" alt="${ex.name}" class="object-contain max-h-full max-w-full group-hover:scale-105 transition duration-300" loading="lazy">
        <span class="absolute top-2 right-2 bg-slate-900/80 backdrop-blur text-slate-300 text-[10px] uppercase font-bold px-2 py-1 rounded-md border border-slate-700">
          ${ex.equipment}
        </span>
      </div>
      <div class="p-4 flex flex-col flex-grow justify-between space-y-3">
        <div>
          <h3 class="font-bold text-slate-100 text-sm capitalize line-clamp-1">${ex.name}</h3>
          <p class="text-xs text-blue-400 capitalize mt-0.5"><i class="fa-solid fa-bullseye text-[10px] mr-1"></i>${ex.target}</p>
        </div>
        
        <div class="flex gap-2 pt-2 border-t border-slate-700/50">
          <button onclick="openModal('${ex.id}')" class="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs py-2 rounded-xl font-medium transition">
            Détails
          </button>
          <button onclick="addToWorkout('${ex.id}', '${ex.name.replace(/'/g, "\'")}')" class="bg-brand-600 hover:bg-brand-700 text-white text-xs px-3 py-2 rounded-xl font-medium transition flex items-center justify-center">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

let debounceTimer;
function debounceSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    activeFilters.search = document.getElementById('search-input').value;
    loadExercises(true);
  }, 300);
}

function applyFilters() {
  activeFilters.body_part = document.getElementById('filter-body-part').value;
  activeFilters.equipment = document.getElementById('filter-equipment').value;
  activeFilters.target = document.getElementById('filter-target').value;
  loadExercises(true);
}

function toggleBodyweight() {
  const eqSelect = document.getElementById('filter-equipment');
  if (eqSelect.value === 'body weight') {
    eqSelect.value = '';
  } else {
    eqSelect.value = 'body weight';
  }
  applyFilters();
}

function resetFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('filter-body-part').value = '';
  document.getElementById('filter-equipment').value = '';
  document.getElementById('filter-target').value = '';
  activeFilters = { search: '', body_part: '', equipment: '', target: '' };
  loadExercises(true);
}

function loadMore() {
  currentOffset += limit;
  loadExercises(false);
}

async function openModal(id) {
  try {
    const res = await fetch(`/api/exercises/${id}`);
    const ex = await res.json();
    
    // 1. Reconstitution de l'URL CDN complète
    const cdnBaseUrl = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/";
    const rawPath = ex.gif_url || ex.image || '';
    const mediaUrl = rawPath.startsWith('http') ? rawPath : `${cdnBaseUrl}${rawPath}`;

    const instructionsText = ex.instructions?.[currentLang] || ex.instructions?.en || "No instruction available.";
    const stepsList = ex.instruction_steps?.[currentLang] || ex.instruction_steps?.en || [];

    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
      <div class="flex flex-col md:flex-row gap-6">
        <div class="md:w-1/2 flex flex-col items-center">
          <img src="${mediaUrl}" alt="${ex.name}" class="rounded-xl bg-slate-900 border border-slate-700 p-2 w-full max-w-[240px]">
          <p class="text-[10px] text-slate-500 mt-2">${ex.attribution || '© Gym visual'}</p>
        </div>
        <div class="md:w-1/2 space-y-3">
          <h2 class="text-xl font-bold text-white capitalize">${ex.name}</h2>
          <div class="flex flex-wrap gap-2 text-xs">
            <span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg">Cible: ${ex.target}</span>
            <span class="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-lg">Équipement: ${ex.equipment}</span>
          </div>
          <div class="text-xs text-slate-300 space-y-1">
            <p><strong>Partie du corps:</strong> <span class="capitalize">${ex.body_part}</span></p>
            <p><strong>Muscles secondaires:</strong> ${(ex.secondary_muscles || []).join(', ')}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-700">
        <h3 class="font-bold text-sm text-slate-200 mb-2">Instructions étape par étape (${currentLang.toUpperCase()}) :</h3>
        ${stepsList.length > 0 ? `
          <ol class="list-decimal list-inside space-y-1 text-xs text-slate-300">
            ${stepsList.map(s => `<li class="leading-relaxed">${s}</li>`).join('')}
          </ol>
        ` : `
          <p class="text-xs text-slate-300 leading-relaxed">${instructionsText}</p>
        `}
      </div>
    `;

    document.getElementById('modal-detail').classList.remove('hidden');
  } catch (err) {
    console.error("Error displaying detail", err);
  }
}

function closeModal() {
  document.getElementById('modal-detail').classList.add('hidden');
}

function showTab(tab) {
  if (tab === 'catalog') {
    document.getElementById('tab-catalog').classList.remove('hidden');
    document.getElementById('tab-workout').classList.add('hidden');
    document.getElementById('nav-catalog').className = "px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 text-white transition";
    document.getElementById('nav-workout').className = "relative px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition";
  } else {
    document.getElementById('tab-catalog').classList.add('hidden');
    document.getElementById('tab-workout').classList.remove('hidden');
    document.getElementById('nav-catalog').className = "px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition";
    document.getElementById('nav-workout').className = "relative px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 text-white transition";
    renderWorkout();
  }
}

function addToWorkout(id, name) {
  if (!workoutPlan.some(item => item.id === id)) {
    workoutPlan.push({ id, name, sets: 4, reps: 10, rest: 60 });
    saveWorkout();
    updateWorkoutBadge();
  }
}

function removeFromWorkout(id) {
  workoutPlan = workoutPlan.filter(item => item.id !== id);
  saveWorkout();
  renderWorkout();
  updateWorkoutBadge();
}

function clearWorkout() {
  workoutPlan = [];
  saveWorkout();
  renderWorkout();
  updateWorkoutBadge();
}

function saveWorkout() {
  localStorage.setItem('fitapp_workout', JSON.stringify(workoutPlan));
}

function loadSavedWorkout() {
  const saved = localStorage.getItem('fitapp_workout');
  if (saved) {
    try { workoutPlan = JSON.parse(saved); } catch(e){}
  }
  updateWorkoutBadge();
}

function updateWorkoutBadge() {
  const badge = document.getElementById('workout-badge');
  badge.textContent = workoutPlan.length;
  if (workoutPlan.length > 0) {
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function renderWorkout() {
  const list = document.getElementById('workout-list');
  const empty = document.getElementById('workout-empty');

  if (workoutPlan.length === 0) {
    empty.classList.remove('hidden');
    list.innerHTML = '';
    list.appendChild(empty);
    return;
  }

  empty.classList.add('hidden');
  list.innerHTML = '';

  workoutPlan.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = "bg-slate-800 border border-slate-700/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4";
    el.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="bg-slate-700 text-slate-300 w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center">${idx + 1}</span>
        <h4 class="font-bold text-sm text-white capitalize">${item.name}</h4>
      </div>

      <div class="flex items-center gap-4 text-xs">
        <div>
          <label class="text-slate-400 block text-[10px]">Séries</label>
          <input type="number" value="${item.sets}" min="1" max="20" class="w-14 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-white" onchange="updateWorkoutItem('${item.id}', 'sets', this.value)">
        </div>
        <div>
          <label class="text-slate-400 block text-[10px]">Répétitions</label>
          <input type="number" value="${item.reps}" min="1" max="100" class="w-16 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-white" onchange="updateWorkoutItem('${item.id}', 'reps', this.value)">
        </div>
        <div>
          <label class="text-slate-400 block text-[10px]">Repos (s)</label>
          <input type="number" value="${item.rest}" min="0" max="300" step="5" class="w-16 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-white" onchange="updateWorkoutItem('${item.id}', 'rest', this.value)">
        </div>
        <button onclick="removeFromWorkout('${item.id}')" class="text-red-400 hover:text-red-300 p-2 ml-2">
          <i class="fa-solid fa-xmark text-base"></i>
        </button>
      </div>
    `;
    list.appendChild(el);
  });
}

function updateWorkoutItem(id, field, val) {
  const item = workoutPlan.find(i => i.id === id);
  if (item) {
    item[field] = parseInt(val) || 0;
    saveWorkout();
  }
}

/* ===== UI REDESIGN ===== */
const originalShowTab = showTab;
function toggleSidebar(){
  const s=document.getElementById('sidebar'), o=document.getElementById('sidebar-overlay');
  s.classList.toggle('-translate-x-full'); o.classList.toggle('hidden');
}
function setActiveSide(tab){
  document.querySelectorAll('[id^="side-"]').forEach(x=>x.classList.remove('active','text-slate-100'));
  const el=document.getElementById('side-'+tab); if(el) el.classList.add('active','text-slate-100');
}
function showTab(tab){
  ['home','catalog','workout','progress'].forEach(t=>{const el=document.getElementById('tab-'+t); if(el) el.classList.toggle('hidden',t!==tab);});
  setActiveSide(tab);
  const titles={home:'Accueil',catalog:'Exercices',workout:'Ma séance',progress:'Ma progression'};
  const title=document.getElementById('page-title'); if(title) title.textContent=titles[tab]||'FitApp';
  if(tab==='workout') renderWorkout();
  if(tab==='progress') renderProgress();
  if(window.innerWidth<1024){const s=document.getElementById('sidebar'),o=document.getElementById('sidebar-overlay');s.classList.add('-translate-x-full');o.classList.add('hidden');}
  updateHomeStats();
}
function openCategory(type){ showTab('catalog'); const map={body_part:'filter-body-part',equipment:'filter-equipment',target:'filter-target'}; const id=map[type]; if(id){document.getElementById('filter-body-part').value='';document.getElementById('filter-equipment').value='';document.getElementById('filter-target').value=''; document.getElementById(id).focus();} }
function updateHomeStats(){
  const s=JSON.parse(localStorage.getItem('fitapp_sessions')||'[]');
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  set('home-workout',workoutPlan.length);set('home-sessions',s.length);set('home-streak',calculateStreak(s)+' 🔥');
  const count=document.getElementById('home-exercises'); if(count&&document.getElementById('results-count')){const txt=document.getElementById('results-count').textContent;count.textContent=(txt.match(/\d[\d ]*/)?.[0]||'1 324');}
}
function calculateStreak(sessions){
  const days=new Set(sessions.map(s=>new Date(s.date).toISOString().slice(0,10))); let n=0,d=new Date();
  while(days.has(d.toISOString().slice(0,10))){n++;d.setDate(d.getDate()-1);} return n;
}
function finishWorkout(){
  if(!workoutPlan.length){alert('Ajoute au moins un exercice à ta séance.');return;}
  const sessions=JSON.parse(localStorage.getItem('fitapp_sessions')||'[]');
  sessions.unshift({date:new Date().toISOString(), exercises:workoutPlan.length, sets:workoutPlan.reduce((a,x)=>a+(+x.sets||0),0), reps:workoutPlan.reduce((a,x)=>a+((+x.sets||0)*(+x.reps||0)),0)});
  localStorage.setItem('fitapp_sessions',JSON.stringify(sessions.slice(0,100)));
  alert('Séance enregistrée !'); showTab('progress');
}
function renderProgress(){
  const s=JSON.parse(localStorage.getItem('fitapp_sessions')||'[]');
  const totalSets=s.reduce((a,x)=>a+(+x.sets||0),0), totalReps=s.reduce((a,x)=>a+(+x.reps||0),0);
  [['progress-sessions',s.length],['progress-sets',totalSets],['progress-reps',totalReps],['progress-streak',calculateStreak(s)+' 🔥']].forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.textContent=v});
  const chart=document.getElementById('progress-chart'); if(chart){chart.innerHTML='';for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const key=d.toISOString().slice(0,10);const n=s.filter(x=>x.date.slice(0,10)===key).length;const col=document.createElement('div');col.className='flex flex-col items-center justify-end h-full gap-2';col.innerHTML=`<div class="w-full max-w-10 rounded-t-lg bg-green-500/70" style="height:${Math.max(8,Math.min(100,n*45))}%"></div><span class="text-[10px] text-slate-600">${d.toLocaleDateString('fr-FR',{weekday:'short'}).slice(0,2)}</span>`;chart.appendChild(col);}}
  const hist=document.getElementById('progress-history'); if(hist){hist.innerHTML=s.length?s.slice(0,12).map(x=>`<div class="flex items-center justify-between p-3 rounded-xl bg-white/[.03]"><div><div class="text-sm font-semibold">Séance terminée</div><div class="text-[10px] text-slate-500">${new Date(x.date).toLocaleString('fr-FR')}</div></div><div class="text-right text-xs"><b>${x.exercises}</b> exercices · <b>${x.sets}</b> séries</div></div>`).join(''):'<div class="text-center py-8 text-sm text-slate-600">Aucune séance enregistrée.</div>';}
}
function clearProgress(){if(confirm('Effacer tout l’historique ?')){localStorage.removeItem('fitapp_sessions');renderProgress();updateHomeStats();}}
updateHomeStats();
