// script.js - Upgraded site behavior with dummy API placeholders
// Replace API_BASE with your real API endpoint when ready
const API_BASE = 'https://api.smartloanadvisor.shop/v1'; // <-- dummy API - replace later

// Simple helpers for fetching (demo uses dummy endpoints)
async function postLead(payload){
  // Demo: save to localStorage and attempt to POST to dummy API
  const leads = JSON.parse(localStorage.getItem('sla_leads')||'[]');
  leads.unshift(payload);
  localStorage.setItem('sla_leads', JSON.stringify(leads.slice(0,500)));
  // Attempt to send to dummy API (will fail until you replace with real endpoint)
  try{
    const res = await fetch(API_BASE + '/leads', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    console.log('API response', res.status);
  }catch(err){ console.log('API post failed (expected for dummy):', err.message); }
}

// EMI calculation
function calculateEMIValues(P, annualRate, years){
  const r = annualRate/100/12;
  const n = years*12;
  const emi = (P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
  return {emi, total: emi*n};
}

// Handlers wired from HTML
function handleEMICalc(){
  const P = parseFloat(document.getElementById('emiP').value) || 0;
  const rate = parseFloat(document.getElementById('emiR').value) || 0;
  const years = parseFloat(document.getElementById('emiT').value) || 0;
  const out = document.getElementById('emiOut');
  if(!P || !rate || !years){ out.textContent='Fill all fields'; return; }
  const v = calculateEMIValues(P, rate, years);
  out.textContent = `EMI: ₹${Math.round(v.emi).toLocaleString()} • Total Payable: ₹${Math.round(v.total).toLocaleString()}`;
  postLead({tool:'emi', principal:P, rate, years, emi:Math.round(v.emi), ts:Date.now()});
}

function handleCreditCheck(){
  // collect minimal info and call dummy API
  const name = document.getElementById('cs_name').value.trim();
  const phone = document.getElementById('cs_phone').value.trim();
  const pan = document.getElementById('cs_pan').value.trim();
  const out = document.getElementById('cs_out');
  if(!name || !/^\d{10}$/.test(phone)){ out.textContent='Enter name & 10-digit phone'; return; }
  const mockScore = Math.min(900, Math.floor(650 + Math.random()*200) + (pan?10:0));
  out.textContent = `Estimated Credit Score (demo): ${mockScore}`;
  postLead({tool:'credit_check', name, phone, pan, score:mockScore, ts:Date.now()});
}

// Lead form submit
async function handleLeadSubmit(e){
  e.preventDefault();
  const name = document.getElementById('lead_name').value.trim();
  const phone = document.getElementById('lead_phone').value.trim();
  const loan = document.getElementById('lead_loan').value;
  const pan = document.getElementById('lead_pan').value.trim();
  if(!name || !/^\d{10}$/.test(phone)){ alert('Enter valid name & phone'); return; }
  const payload = {name, phone, loan, pan, ts:Date.now()};
  await postLead(payload);
  document.getElementById('lead_msg').innerHTML = 'Thanks! Your request is saved. <a href="tel:+91XXXXXXXXXX" class="btn-ghost">Request Call Now</a>';
  document.getElementById('lead_form').reset();
}

// attach events
document.addEventListener('DOMContentLoaded', ()=>{
  const ef = document.getElementById('emi_calc_btn');
  if(ef) ef.addEventListener('click', handleEMICalc);
  const cbtn = document.getElementById('cs_btn');
  if(cbtn) cbtn.addEventListener('click', handleCreditCheck);
  const lf = document.getElementById('lead_form');
  if(lf) lf.addEventListener('submit', handleLeadSubmit);
});
