// ==UserScript==
// @author          Oleg Valter <oleg.a.valter@gmail.com>
// @description     Adds a user activity indicator to posts
// @grant           none
// @homepage        https://github.com/userscripters/activity-indicator#readme
// @match           https://*.stackexchange.com/questions/*
// @match           https://askubuntu.com/questions/*
// @match           https://es.meta.stackoverflow.com/questions/*
// @match           https://es.stackoverflow.com/questions/*
// @match           https://ja.meta.stackoverflow.com/questions/*
// @match           https://ja.stackoverflow.com/questions/*
// @match           https://mathoverflow.net/questions/*
// @match           https://meta.askubuntu.com/questions/*
// @match           https://meta.mathoverflow.net/questions/*
// @match           https://meta.serverfault.com/questions/*
// @match           https://meta.stackoverflow.com/questions/*
// @match           https://meta.superuser.com/questions/*
// @match           https://pt.meta.stackoverflow.com/questions/*
// @match           https://pt.stackoverflow.com/questions/*
// @match           https://ru.meta.stackoverflow.com/questions/*
// @match           https://ru.stackoverflow.com/questions/*
// @match           https://serverfault.com/questions/*
// @match           https://stackapps.com/questions/*
// @match           https://stackoverflow.com/questions/*
// @match           https://superuser.com/questions/*
// @name            Activity Indicator
// @namespace       userscripters
// @run-at          document-start
// @source          git+https://github.com/userscripters/activity-indicator.git
// @supportURL      https://github.com/userscripters/activity-indicator/issues
// @version         1.2.2
// ==/UserScript==

"use strict";((Q,_,E)=>{const d="https://api.stackexchange.com",c=(t=100)=>new Promise(e=>setTimeout(e,t)),y=async(e,{site:t="stackoverflow",page:s=1,...n})=>{const i=new URL(d+`/2.3/questions/${e}/comments`),a=(i.search=new URLSearchParams({site:t,page:s.toString(),...n}).toString(),await fetch(i.toString()));if(!a.ok)return[];const{items:r=[],has_more:o=!1,backoff:u}=await a.json();return u?(await c(1e3*u),y(e,{site:t,page:s,...n})):(o&&r.push(...await y(e,{site:t,page:s+1,...n})),r)},S=async(e,{site:t="stackoverflow",page:s=1,...n})=>{const i=new URL(d+`/2.3/answers/${e}/comments`),a=(i.search=new URLSearchParams({site:t,page:s.toString(),...n}).toString(),await fetch(i.toString()));if(!a.ok)return[];const{items:r=[],has_more:o=!1,backoff:u}=await a.json();return u?(await c(1e3*u),S(e,{site:t,page:s,...n})):(o&&r.push(...await S(e,{site:t,page:s+1,...n})),r)},C=async(e,{site:t="stackoverflow",page:s=1,...n})=>{const i=new URL(d+"/2.3/questions/"+e),a=(i.search=new URLSearchParams({site:t,page:s.toString(),...n}).toString(),await fetch(i.toString()));if(!a.ok)return[];const{items:r=[],has_more:o=!1,backoff:u}=await a.json();return u?(await c(1e3*u),C(e,{site:t,page:s,...n})):(o&&r.push(...await C(e,{site:t,page:s+1,...n})),r)},q=async(e,{site:t="stackoverflow",page:s=1,...n})=>{const i=new URL(d+`/2.3/questions/${e}/answers`),a=(i.search=new URLSearchParams({site:t,page:s.toString(),...n}).toString(),await fetch(i.toString()));if(!a.ok)return[];const{items:r=[],has_more:o=!1,backoff:u}=await a.json();return u?(await c(1e3*u),q(e,{site:t,page:s,...n})):(o&&r.push(...await q(e,{site:t,page:s+1,...n})),r)},t=(e,t)=>{let s;return e.forEach(e=>((null===s||void 0===s?void 0:s[t])||0)<e[t]&&(s=e)),(null===s||void 0===s?void 0:s.link)||""};class U{constructor(e,t,s,n,i){this.userId=e,this.questionComments=t,this.answerComments=s,this.answers=n,this.questions=i}get lastEditedAnswerLink(){var e=this["editedAnswers"];return t(e,"last_activity_date")}get lastEditedQuestionLink(){var e=this["editedQuestions"];return t(e,"last_activity_date")}get lastAnswerLink(){var e=this["myAnswers"];return t(e,"creation_date")}get lastQuestionLink(){var e=this["myQuestions"];return t(e,"creation_date")}get lastAnswerComment(){var e=this["answerComments"];return t(e,"creation_date")}get lastQuestionComment(){var e=this["questionComments"];return t(e,"creation_date")}get myAnswers(){const{answers:e,userId:t}=this;return e.filter(({owner:e})=>(null==e?void 0:e.user_id)===t)}get myQuestions(){const{questions:e,userId:t}=this;return e.filter(({owner:e})=>(null==e?void 0:e.user_id)===t)}get editedAnswers(){const{answers:e,userId:t}=this;return e.filter(({last_editor:e})=>(null==e?void 0:e.user_id)===t)}get editedQuestions(){const{questions:e,userId:t}=this;return e.filter(({last_editor:e})=>(null==e?void 0:e.user_id)===t)}get hasAnswers(){var e=this["myAnswers"];return!!e.length}get hasQuestions(){var e=this["myQuestions"];return!!e.length}get hasEditedAnswers(){var e=this["editedAnswers"];return!!e.length}get hasEditedQuestions(){var e=this["editedQuestions"];return!!e.length}get hasQuestionComments(){var e=this["questionComments"];return!!e.length}get hasAnswerComments(){var e=this["answerComments"];return!!e.length}}Q.addEventListener("load",async()=>{try{const c=("undefined"!=typeof unsafeWindow?unsafeWindow:Q)["StackExchange"],l=c.options.user["userId"];var e=c.question.getQuestionId();if(!e||!l)return;d=[E["hostname"]][0];const m={site:d.slice(0,d.lastIndexOf(".")),key:"UKKfmybQ9USA0N80jdnU8w(("},w=await y(e,{...m,filter:"!4(lY7*xuE9Z8LL)8k"});var t=await C(e,{...m,filter:"!LaSREm6B5Ji4nnR50YM1t4"});const h=await q(e,{...m,filter:"!)qTDdy3rflMDTMhEvVdZ"});var s=h.map(({answer_id:e})=>S(e,{...m,filter:"!4(lY7*xuE9Z8LL)8k"}));const g=await Promise.all(s);var n=({owner:e,reply_to_user:t})=>[null==e?void 0:e.user_id,null==t?void 0:t.user_id].includes(l),i=w.filter(n),a=g.flat().filter(n),r=new U(l,i,a,h,t);console.debug(U.name,r);{var o=r;const f=_.querySelector("#question-header + div");if(f){var u="Participated";const v=[[o.hasAnswers,"A","Answered",o.lastAnswerLink],[o.hasQuestions,"Q","Asked",o.lastQuestionLink],[o.hasEditedAnswers,"EA","Edited an Answer",o.lastEditedAnswerLink],[o.hasEditedQuestions,"EQ","Edited the Question",o.lastEditedQuestionLink],[o.hasAnswerComments,"AC","Commented on an Answer",o.lastAnswerComment],[o.hasQuestionComments,"QC","Commented on the Question",o.lastQuestionComment]],p=v.filter(([e])=>e),k=p.map(([,e,t,s])=>{const n=_.createElement("a");return n.title=t,n.textContent=e,n.classList.add("mr4"),n.href=s||"#!",n});o=p.map(([,e])=>e).join(" ")||"no";k.length||k.push(_.createTextNode("no"));const A=_.createElement("div"),L=(A.classList.add("flex--item","ws-nowrap","mb8","ml16"),A.title=u+": "+o,_.createElement("span"));L.classList.add("fc-light","mr4"),L.textContent=u,A.append(L),L.after(...k),f.append(A)}}}catch(e){console.debug(`Activity Indicator error:
`+e)}var d})})(window,document,(localStorage,location));