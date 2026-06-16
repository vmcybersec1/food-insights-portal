const categories = ['Breakfast','Lunchbox','Snacks','Drinks','Dinner','Treats'];
const categoryIcons = {Breakfast:'🥣', Lunchbox:'🎒', Snacks:'🍱', Drinks:'🥤', Dinner:'🍽️', Treats:'🍬'};

function getFoods(){ return window.FOOD_DATA || []; }
function byConcern(a,b){ return b.concernScore - a.concernScore || a.name.localeCompare(b.name); }
function scoreClass(score){ return score >= 8 ? 'score-high' : score >= 5 ? 'score-med' : 'score-low'; }
function chipClass(v){ const t = String(v).toLowerCase(); return t.includes('high') ? 'bad' : t.includes('medium') || t.includes('possible') ? 'warn' : 'good'; }
function iconFor(f){ return f.icon || f.emoji || '🍽️'; }
function safeText(x){ return String(x ?? ''); }

function card(f){
  return `<a class="food-card" href="food.html?id=${f.id}" aria-label="View ${safeText(f.name)}">
    <div class="food-top">
      <div class="food-emoji">${iconFor(f)}</div>
      <div><h3>${safeText(f.name)}</h3><p class="meta">${safeText(f.category)} • ${safeText(f.processingLevel)}</p></div>
    </div>
    <div class="score-line"><div class="score-bar ${scoreClass(f.concernScore)}" style="width:${f.concernScore*10}%"></div></div>
    <div class="card-bottom"><strong>${f.concernScore}/10 concern</strong><span class="mini-badge">${safeText(f.badge)}</span></div>
    <p>${safeText(f.swapTitle)}: ${safeText(f.betterAlternative)}</p>
    <div class="chips"><span class="chip ${chipClass(f.sugarRating)}">Sugar ${f.sugarRating}</span><span class="chip ${chipClass(f.additiveRating)}">Additives ${f.additiveRating}</span></div>
  </a>`;
}

function renderCategoryButtons(target, selected, onClick){
  target.innerHTML = categories.map(c => {
    const count = getFoods().filter(f => f.category === c).length;
    return `<button class="cat-btn ${selected===c?'active':''}" data-cat="${c}"><span>${categoryIcons[c]}</span>${c}<small>${count} foods</small></button>`;
  }).join('');
  target.onclick = e => { const b = e.target.closest('button[data-cat]'); if(b) onClick(b.dataset.cat); };
}

function initHome(){
  const stats = document.getElementById('homeStats');
  if(!stats) return;
  const foods = getFoods();
  stats.innerHTML = `<strong>${foods.length}</strong> everyday foods • <strong>${categories.length}</strong> categories • no login or data collection`;
}

function initDemo(){
  const cats = document.getElementById('demoCats');
  const grid = document.getElementById('demoFoods');
  const title = document.getElementById('demoTitle');
  if(!cats || !grid) return;
  let selected = 'Breakfast';
  function select(cat){
    selected = cat;
    renderCategoryButtons(cats, selected, select);
    const list = getFoods().filter(f => f.category === selected).sort(byConcern);
    title.textContent = `Choose a ${selected.toLowerCase()} food`;
    grid.innerHTML = list.map(card).join('');
  }
  select(selected);
}

function initExplore(){
  const grid = document.getElementById('foodGrid');
  if(!grid) return;
  const search = document.getElementById('searchBox');
  const filter = document.getElementById('categoryFilter');
  const sort = document.getElementById('sortSelect');
  filter.innerHTML = '<option value="All">All categories</option>' + categories.map(c=>`<option value="${c}">${c}</option>`).join('');
  function render(){
    const q = (search.value || '').toLowerCase();
    const cat = filter.value;
    let foods = getFoods().filter(f => (cat === 'All' || f.category === cat) && (f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.processingLevel.toLowerCase().includes(q)));
    if(sort.value === 'low') foods.sort((a,b)=>a.concernScore-b.concernScore || a.name.localeCompare(b.name));
    else if(sort.value === 'az') foods.sort((a,b)=>a.name.localeCompare(b.name));
    else foods.sort(byConcern);
    grid.innerHTML = foods.length ? foods.map(card).join('') : '<div class="empty-state">No foods found. Try another search or category.</div>';
  }
  [search,filter,sort].forEach(el => el.addEventListener('input', render));
  render();
}

function initDetail(){
  const wrap = document.getElementById('foodDetail');
  if(!wrap) return;
  const foods = getFoods();
  const id = new URLSearchParams(location.search).get('id');
  const f = foods.find(x => x.id === id) || foods[0];
  document.title = `${f.name} | Food Insights Portal`;
  wrap.innerHTML = `<section class="detail-hero">
    <div class="detail-visual"><div><div class="big-emoji">${iconFor(f)}</div><p class="eyebrow">${f.category}</p><div class="score-circle ${scoreClass(f.concernScore)}" style="--score:${f.concernScore}"><div class="score-inner">${f.concernScore}/10</div></div><p><strong>${f.badge}</strong></p></div></div>
    <div class="detail-content"><p class="eyebrow">Food detective card</p><h1>${f.name}</h1><p class="lead">Processing level: <strong>${f.processingLevel}</strong></p>
      <div class="rating-grid"><div class="rating"><b>Sugar</b><span class="chip ${chipClass(f.sugarRating)}">${f.sugarRating}</span></div><div class="rating"><b>Salt</b><span class="chip ${chipClass(f.saltRating)}">${f.saltRating}</span></div><div class="rating"><b>Fat</b><span class="chip ${chipClass(f.fatRating)}">${f.fatRating}</span></div><div class="rating"><b>Additives</b><span class="chip ${chipClass(f.additiveRating)}">${f.additiveRating}</span></div></div>
      <div class="swap-card"><p class="eyebrow">Better alternative</p><h2>${f.swapTitle}</h2><p>${f.betterAlternative}</p></div>
    </div></section>
    <section class="info-grid"><article class="info-card"><h2>What may be hidden inside?</h2><p>${f.hiddenIngredients}</p></article><article class="info-card"><h2>Shock fact</h2><p>${f.shockFact}</p></article><article class="info-card"><h2>Why it matters</h2><p>${f.healthNotes}</p></article><article class="info-card"><h2>Brain, energy and behaviour</h2><p>${f.behaviourNotes}</p></article><article class="info-card"><h2>Child-friendly explanation</h2><p>${f.childExplanation}</p></article><article class="info-card"><h2>Parent note</h2><p>${f.parentNote}</p></article><article class="info-card"><h2>Planet and packaging</h2><p>Palm oil concern: <strong>${f.palmOilConcern}</strong>. Planet score: <strong>${f.planetScore}/10</strong>. Packaging score: <strong>${f.packagingScore}/10</strong>.</p></article><article class="info-card"><h2>Demo question</h2><p>Would you eat this every day, sometimes, or as a treat? What swap would you try?</p></article></section>`;
}

function initAlternatives(){
  const list = document.getElementById('alternativesList');
  if(!list) return;
  list.innerHTML = getFoods().sort(byConcern).map(f => `<a class="swap-row" href="food.html?id=${f.id}"><div><h3>${iconFor(f)} ${f.name}</h3><p>${f.category} • concern ${f.concernScore}/10 • ${f.badge}</p></div><div><strong>${f.swapTitle}</strong><p>${f.betterAlternative}</p></div></a>`).join('');
}

initHome(); initDemo(); initExplore(); initDetail(); initAlternatives();
