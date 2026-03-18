var Ae=e=>{throw TypeError(e)};var ce=(e,t,s)=>t.has(e)||Ae("Cannot "+s);var n=(e,t,s)=>(ce(e,t,"read from private field"),s?s.call(e):t.get(e)),d=(e,t,s)=>t.has(e)?Ae("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),u=(e,t,s,r)=>(ce(e,t,"write to private field"),r?r.call(e,s):t.set(e,s),s),m=(e,t,s)=>(ce(e,t,"access private method"),s);var Xt=(e,t,s,r)=>({set _(i){u(e,t,i,s)},get _(){return n(e,t,r)}});function $s(e,t){for(var s=0;s<t.length;s++){const r=t[s];if(typeof r!="string"&&!Array.isArray(r)){for(const i in r)if(i!=="default"&&!(i in e)){const a=Object.getOwnPropertyDescriptor(r,i);a&&Object.defineProperty(e,i,a.get?a:{enumerable:!0,get:()=>r[i]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}var si=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function js(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var cs={exports:{}},oe={},us={exports:{}},b={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Wt=Symbol.for("react.element"),Ns=Symbol.for("react.portal"),As=Symbol.for("react.fragment"),Ts=Symbol.for("react.strict_mode"),Is=Symbol.for("react.profiler"),Ds=Symbol.for("react.provider"),Qs=Symbol.for("react.context"),qs=Symbol.for("react.forward_ref"),Us=Symbol.for("react.suspense"),Ls=Symbol.for("react.memo"),Hs=Symbol.for("react.lazy"),Te=Symbol.iterator;function zs(e){return e===null||typeof e!="object"?null:(e=Te&&e[Te]||e["@@iterator"],typeof e=="function"?e:null)}var hs={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ls=Object.assign,ds={};function qt(e,t,s){this.props=e,this.context=t,this.refs=ds,this.updater=s||hs}qt.prototype.isReactComponent={};qt.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};qt.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function fs(){}fs.prototype=qt.prototype;function Se(e,t,s){this.props=e,this.context=t,this.refs=ds,this.updater=s||hs}var xe=Se.prototype=new fs;xe.constructor=Se;ls(xe,qt.prototype);xe.isPureReactComponent=!0;var Ie=Array.isArray,ys=Object.prototype.hasOwnProperty,Oe={current:null},ps={key:!0,ref:!0,__self:!0,__source:!0};function vs(e,t,s){var r,i={},a=null,c=null;if(t!=null)for(r in t.ref!==void 0&&(c=t.ref),t.key!==void 0&&(a=""+t.key),t)ys.call(t,r)&&!ps.hasOwnProperty(r)&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=s;else if(1<o){for(var l=Array(o),f=0;f<o;f++)l[f]=arguments[f+2];i.children=l}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return{$$typeof:Wt,type:e,key:a,ref:c,props:i,_owner:Oe.current}}function Ks(e,t){return{$$typeof:Wt,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Pe(e){return typeof e=="object"&&e!==null&&e.$$typeof===Wt}function Vs(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(s){return t[s]})}var De=/\/+/g;function ue(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Vs(""+e.key):t.toString(36)}function se(e,t,s,r,i){var a=typeof e;(a==="undefined"||a==="boolean")&&(e=null);var c=!1;if(e===null)c=!0;else switch(a){case"string":case"number":c=!0;break;case"object":switch(e.$$typeof){case Wt:case Ns:c=!0}}if(c)return c=e,i=i(c),e=r===""?"."+ue(c,0):r,Ie(i)?(s="",e!=null&&(s=e.replace(De,"$&/")+"/"),se(i,t,s,"",function(f){return f})):i!=null&&(Pe(i)&&(i=Ks(i,s+(!i.key||c&&c.key===i.key?"":(""+i.key).replace(De,"$&/")+"/")+e)),t.push(i)),1;if(c=0,r=r===""?".":r+":",Ie(e))for(var o=0;o<e.length;o++){a=e[o];var l=r+ue(a,o);c+=se(a,t,s,l,i)}else if(l=zs(e),typeof l=="function")for(e=l.call(e),o=0;!(a=e.next()).done;)a=a.value,l=r+ue(a,o++),c+=se(a,t,s,l,i);else if(a==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return c}function te(e,t,s){if(e==null)return e;var r=[],i=0;return se(e,r,"","",function(a){return t.call(s,a,i++)}),r}function Bs(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(s){(e._status===0||e._status===-1)&&(e._status=1,e._result=s)},function(s){(e._status===0||e._status===-1)&&(e._status=2,e._result=s)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var q={current:null},re={transition:null},Gs={ReactCurrentDispatcher:q,ReactCurrentBatchConfig:re,ReactCurrentOwner:Oe};function ms(){throw Error("act(...) is not supported in production builds of React.")}b.Children={map:te,forEach:function(e,t,s){te(e,function(){t.apply(this,arguments)},s)},count:function(e){var t=0;return te(e,function(){t++}),t},toArray:function(e){return te(e,function(t){return t})||[]},only:function(e){if(!Pe(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};b.Component=qt;b.Fragment=As;b.Profiler=Is;b.PureComponent=Se;b.StrictMode=Ts;b.Suspense=Us;b.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Gs;b.act=ms;b.cloneElement=function(e,t,s){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=ls({},e.props),i=e.key,a=e.ref,c=e._owner;if(t!=null){if(t.ref!==void 0&&(a=t.ref,c=Oe.current),t.key!==void 0&&(i=""+t.key),e.type&&e.type.defaultProps)var o=e.type.defaultProps;for(l in t)ys.call(t,l)&&!ps.hasOwnProperty(l)&&(r[l]=t[l]===void 0&&o!==void 0?o[l]:t[l])}var l=arguments.length-2;if(l===1)r.children=s;else if(1<l){o=Array(l);for(var f=0;f<l;f++)o[f]=arguments[f+2];r.children=o}return{$$typeof:Wt,type:e.type,key:i,ref:a,props:r,_owner:c}};b.createContext=function(e){return e={$$typeof:Qs,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Ds,_context:e},e.Consumer=e};b.createElement=vs;b.createFactory=function(e){var t=vs.bind(null,e);return t.type=e,t};b.createRef=function(){return{current:null}};b.forwardRef=function(e){return{$$typeof:qs,render:e}};b.isValidElement=Pe;b.lazy=function(e){return{$$typeof:Hs,_payload:{_status:-1,_result:e},_init:Bs}};b.memo=function(e,t){return{$$typeof:Ls,type:e,compare:t===void 0?null:t}};b.startTransition=function(e){var t=re.transition;re.transition={};try{e()}finally{re.transition=t}};b.unstable_act=ms;b.useCallback=function(e,t){return q.current.useCallback(e,t)};b.useContext=function(e){return q.current.useContext(e)};b.useDebugValue=function(){};b.useDeferredValue=function(e){return q.current.useDeferredValue(e)};b.useEffect=function(e,t){return q.current.useEffect(e,t)};b.useId=function(){return q.current.useId()};b.useImperativeHandle=function(e,t,s){return q.current.useImperativeHandle(e,t,s)};b.useInsertionEffect=function(e,t){return q.current.useInsertionEffect(e,t)};b.useLayoutEffect=function(e,t){return q.current.useLayoutEffect(e,t)};b.useMemo=function(e,t){return q.current.useMemo(e,t)};b.useReducer=function(e,t,s){return q.current.useReducer(e,t,s)};b.useRef=function(e){return q.current.useRef(e)};b.useState=function(e){return q.current.useState(e)};b.useSyncExternalStore=function(e,t,s){return q.current.useSyncExternalStore(e,t,s)};b.useTransition=function(){return q.current.useTransition()};b.version="18.3.1";us.exports=b;var P=us.exports;const Ws=js(P),ri=$s({__proto__:null,default:Ws},[P]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Js=P,Ys=Symbol.for("react.element"),Zs=Symbol.for("react.fragment"),Xs=Object.prototype.hasOwnProperty,tr=Js.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,er={key:!0,ref:!0,__self:!0,__source:!0};function gs(e,t,s){var r,i={},a=null,c=null;s!==void 0&&(a=""+s),t.key!==void 0&&(a=""+t.key),t.ref!==void 0&&(c=t.ref);for(r in t)Xs.call(t,r)&&!er.hasOwnProperty(r)&&(i[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)i[r]===void 0&&(i[r]=t[r]);return{$$typeof:Ys,type:e,key:a,ref:c,props:i,_owner:tr.current}}oe.Fragment=Zs;oe.jsx=gs;oe.jsxs=gs;cs.exports=oe;var sr=cs.exports,Ut=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(e){return this.listeners.add(e),this.onSubscribe(),()=>{this.listeners.delete(e),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},rr={setTimeout:(e,t)=>setTimeout(e,t),clearTimeout:e=>clearTimeout(e),setInterval:(e,t)=>setInterval(e,t),clearInterval:e=>clearInterval(e)},at,Ce,Ye,nr=(Ye=class{constructor(){d(this,at,rr);d(this,Ce,!1)}setTimeoutProvider(e){u(this,at,e)}setTimeout(e,t){return n(this,at).setTimeout(e,t)}clearTimeout(e){n(this,at).clearTimeout(e)}setInterval(e,t){return n(this,at).setInterval(e,t)}clearInterval(e){n(this,at).clearInterval(e)}},at=new WeakMap,Ce=new WeakMap,Ye),vt=new nr;function ir(e){setTimeout(e,0)}var xt=typeof window>"u"||"Deno"in globalThis;function Q(){}function ar(e,t){return typeof e=="function"?e(t):e}function he(e){return typeof e=="number"&&e>=0&&e!==1/0}function bs(e,t){return Math.max(e+(t||0)-Date.now(),0)}function pt(e,t){return typeof e=="function"?e(t):e}function K(e,t){return typeof e=="function"?e(t):e}function Qe(e,t){const{type:s="all",exact:r,fetchStatus:i,predicate:a,queryKey:c,stale:o}=e;if(c){if(r){if(t.queryHash!==Re(c,t.options))return!1}else if(!Ht(t.queryKey,c))return!1}if(s!=="all"){const l=t.isActive();if(s==="active"&&!l||s==="inactive"&&l)return!1}return!(typeof o=="boolean"&&t.isStale()!==o||i&&i!==t.state.fetchStatus||a&&!a(t))}function qe(e,t){const{exact:s,status:r,predicate:i,mutationKey:a}=e;if(a){if(!t.options.mutationKey)return!1;if(s){if(Ot(t.options.mutationKey)!==Ot(a))return!1}else if(!Ht(t.options.mutationKey,a))return!1}return!(r&&t.state.status!==r||i&&!i(t))}function Re(e,t){return((t==null?void 0:t.queryKeyHashFn)||Ot)(e)}function Ot(e){return JSON.stringify(e,(t,s)=>le(s)?Object.keys(s).sort().reduce((r,i)=>(r[i]=s[i],r),{}):s)}function Ht(e,t){return e===t?!0:typeof e!=typeof t?!1:e&&t&&typeof e=="object"&&typeof t=="object"?Object.keys(t).every(s=>Ht(e[s],t[s])):!1}var or=Object.prototype.hasOwnProperty;function ks(e,t,s=0){if(e===t)return e;if(s>500)return t;const r=Ue(e)&&Ue(t);if(!r&&!(le(e)&&le(t)))return t;const a=(r?e:Object.keys(e)).length,c=r?t:Object.keys(t),o=c.length,l=r?new Array(o):{};let f=0;for(let g=0;g<o;g++){const v=r?g:c[g],_=e[v],p=t[v];if(_===p){l[v]=_,(r?g<a:or.call(e,v))&&f++;continue}if(_===null||p===null||typeof _!="object"||typeof p!="object"){l[v]=p;continue}const R=ks(_,p,s+1);l[v]=R,R===_&&f++}return a===o&&f===a?e:l}function ie(e,t){if(!t||Object.keys(e).length!==Object.keys(t).length)return!1;for(const s in e)if(e[s]!==t[s])return!1;return!0}function Ue(e){return Array.isArray(e)&&e.length===Object.keys(e).length}function le(e){if(!Le(e))return!1;const t=e.constructor;if(t===void 0)return!0;const s=t.prototype;return!(!Le(s)||!s.hasOwnProperty("isPrototypeOf")||Object.getPrototypeOf(e)!==Object.prototype)}function Le(e){return Object.prototype.toString.call(e)==="[object Object]"}function cr(e){return new Promise(t=>{vt.setTimeout(t,e)})}function de(e,t,s){return typeof s.structuralSharing=="function"?s.structuralSharing(e,t):s.structuralSharing!==!1?ks(e,t):t}function ur(e,t,s=0){const r=[...e,t];return s&&r.length>s?r.slice(1):r}function hr(e,t,s=0){const r=[t,...e];return s&&r.length>s?r.slice(0,-1):r}var Ee=Symbol();function _s(e,t){return!e.queryFn&&(t!=null&&t.initialPromise)?()=>t.initialPromise:!e.queryFn||e.queryFn===Ee?()=>Promise.reject(new Error(`Missing queryFn: '${e.queryHash}'`)):e.queryFn}function Fe(e,t){return typeof e=="function"?e(...t):!!e}function lr(e,t,s){let r=!1,i;return Object.defineProperty(e,"signal",{enumerable:!0,get:()=>(i??(i=t()),r||(r=!0,i.aborted?s():i.addEventListener("abort",s,{once:!0})),i)}),e}var mt,ot,Pt,Ze,dr=(Ze=class extends Ut{constructor(){super();d(this,mt);d(this,ot);d(this,Pt);u(this,Pt,t=>{if(!xt&&window.addEventListener){const s=()=>t();return window.addEventListener("visibilitychange",s,!1),()=>{window.removeEventListener("visibilitychange",s)}}})}onSubscribe(){n(this,ot)||this.setEventListener(n(this,Pt))}onUnsubscribe(){var t;this.hasListeners()||((t=n(this,ot))==null||t.call(this),u(this,ot,void 0))}setEventListener(t){var s;u(this,Pt,t),(s=n(this,ot))==null||s.call(this),u(this,ot,t(r=>{typeof r=="boolean"?this.setFocused(r):this.onFocus()}))}setFocused(t){n(this,mt)!==t&&(u(this,mt,t),this.onFocus())}onFocus(){const t=this.isFocused();this.listeners.forEach(s=>{s(t)})}isFocused(){var t;return typeof n(this,mt)=="boolean"?n(this,mt):((t=globalThis.document)==null?void 0:t.visibilityState)!=="hidden"}},mt=new WeakMap,ot=new WeakMap,Pt=new WeakMap,Ze),$e=new dr;function fe(){let e,t;const s=new Promise((i,a)=>{e=i,t=a});s.status="pending",s.catch(()=>{});function r(i){Object.assign(s,i),delete s.resolve,delete s.reject}return s.resolve=i=>{r({status:"fulfilled",value:i}),e(i)},s.reject=i=>{r({status:"rejected",reason:i}),t(i)},s}var fr=ir;function yr(){let e=[],t=0,s=o=>{o()},r=o=>{o()},i=fr;const a=o=>{t?e.push(o):i(()=>{s(o)})},c=()=>{const o=e;e=[],o.length&&i(()=>{r(()=>{o.forEach(l=>{s(l)})})})};return{batch:o=>{let l;t++;try{l=o()}finally{t--,t||c()}return l},batchCalls:o=>(...l)=>{a(()=>{o(...l)})},schedule:a,setNotifyFunction:o=>{s=o},setBatchNotifyFunction:o=>{r=o},setScheduler:o=>{i=o}}}var F=yr(),Rt,ct,Et,Xe,pr=(Xe=class extends Ut{constructor(){super();d(this,Rt,!0);d(this,ct);d(this,Et);u(this,Et,t=>{if(!xt&&window.addEventListener){const s=()=>t(!0),r=()=>t(!1);return window.addEventListener("online",s,!1),window.addEventListener("offline",r,!1),()=>{window.removeEventListener("online",s),window.removeEventListener("offline",r)}}})}onSubscribe(){n(this,ct)||this.setEventListener(n(this,Et))}onUnsubscribe(){var t;this.hasListeners()||((t=n(this,ct))==null||t.call(this),u(this,ct,void 0))}setEventListener(t){var s;u(this,Et,t),(s=n(this,ct))==null||s.call(this),u(this,ct,t(this.setOnline.bind(this)))}setOnline(t){n(this,Rt)!==t&&(u(this,Rt,t),this.listeners.forEach(r=>{r(t)}))}isOnline(){return n(this,Rt)}},Rt=new WeakMap,ct=new WeakMap,Et=new WeakMap,Xe),ae=new pr;function vr(e){return Math.min(1e3*2**e,3e4)}function ws(e){return(e??"online")==="online"?ae.isOnline():!0}var ye=class extends Error{constructor(e){super("CancelledError"),this.revert=e==null?void 0:e.revert,this.silent=e==null?void 0:e.silent}};function Ms(e){let t=!1,s=0,r;const i=fe(),a=()=>i.status!=="pending",c=w=>{var M;if(!a()){const x=new ye(w);_(x),(M=e.onCancel)==null||M.call(e,x)}},o=()=>{t=!0},l=()=>{t=!1},f=()=>$e.isFocused()&&(e.networkMode==="always"||ae.isOnline())&&e.canRun(),g=()=>ws(e.networkMode)&&e.canRun(),v=w=>{a()||(r==null||r(),i.resolve(w))},_=w=>{a()||(r==null||r(),i.reject(w))},p=()=>new Promise(w=>{var M;r=x=>{(a()||f())&&w(x)},(M=e.onPause)==null||M.call(e)}).then(()=>{var w;r=void 0,a()||(w=e.onContinue)==null||w.call(e)}),R=()=>{if(a())return;let w;const M=s===0?e.initialPromise:void 0;try{w=M??e.fn()}catch(x){w=Promise.reject(x)}Promise.resolve(w).then(v).catch(x=>{var U;if(a())return;const $=e.retry??(xt?0:3),O=e.retryDelay??vr,y=typeof O=="function"?O(s,x):O,j=$===!0||typeof $=="number"&&s<$||typeof $=="function"&&$(s,x);if(t||!j){_(x);return}s++,(U=e.onFail)==null||U.call(e,s,x),cr(y).then(()=>f()?void 0:p()).then(()=>{t?_(x):R()})})};return{promise:i,status:()=>i.status,cancel:c,continue:()=>(r==null||r(),i),cancelRetry:o,continueRetry:l,canStart:g,start:()=>(g()?R():p().then(R),i)}}var gt,ts,Cs=(ts=class{constructor(){d(this,gt)}destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),he(this.gcTime)&&u(this,gt,vt.setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(e){this.gcTime=Math.max(this.gcTime||0,e??(xt?1/0:5*60*1e3))}clearGcTimeout(){n(this,gt)&&(vt.clearTimeout(n(this,gt)),u(this,gt,void 0))}},gt=new WeakMap,ts),bt,Ft,z,kt,A,zt,_t,V,Y,es,mr=(es=class extends Cs{constructor(t){super();d(this,V);d(this,bt);d(this,Ft);d(this,z);d(this,kt);d(this,A);d(this,zt);d(this,_t);u(this,_t,!1),u(this,zt,t.defaultOptions),this.setOptions(t.options),this.observers=[],u(this,kt,t.client),u(this,z,n(this,kt).getQueryCache()),this.queryKey=t.queryKey,this.queryHash=t.queryHash,u(this,bt,ze(this.options)),this.state=t.state??n(this,bt),this.scheduleGc()}get meta(){return this.options.meta}get promise(){var t;return(t=n(this,A))==null?void 0:t.promise}setOptions(t){if(this.options={...n(this,zt),...t},this.updateGcTime(this.options.gcTime),this.state&&this.state.data===void 0){const s=ze(this.options);s.data!==void 0&&(this.setState(He(s.data,s.dataUpdatedAt)),u(this,bt,s))}}optionalRemove(){!this.observers.length&&this.state.fetchStatus==="idle"&&n(this,z).remove(this)}setData(t,s){const r=de(this.state.data,t,this.options);return m(this,V,Y).call(this,{data:r,type:"success",dataUpdatedAt:s==null?void 0:s.updatedAt,manual:s==null?void 0:s.manual}),r}setState(t,s){m(this,V,Y).call(this,{type:"setState",state:t,setStateOptions:s})}cancel(t){var r,i;const s=(r=n(this,A))==null?void 0:r.promise;return(i=n(this,A))==null||i.cancel(t),s?s.then(Q).catch(Q):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}reset(){this.destroy(),this.setState(n(this,bt))}isActive(){return this.observers.some(t=>K(t.options.enabled,this)!==!1)}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===Ee||this.state.dataUpdateCount+this.state.errorUpdateCount===0}isStatic(){return this.getObserversCount()>0?this.observers.some(t=>pt(t.options.staleTime,this)==="static"):!1}isStale(){return this.getObserversCount()>0?this.observers.some(t=>t.getCurrentResult().isStale):this.state.data===void 0||this.state.isInvalidated}isStaleByTime(t=0){return this.state.data===void 0?!0:t==="static"?!1:this.state.isInvalidated?!0:!bs(this.state.dataUpdatedAt,t)}onFocus(){var s;const t=this.observers.find(r=>r.shouldFetchOnWindowFocus());t==null||t.refetch({cancelRefetch:!1}),(s=n(this,A))==null||s.continue()}onOnline(){var s;const t=this.observers.find(r=>r.shouldFetchOnReconnect());t==null||t.refetch({cancelRefetch:!1}),(s=n(this,A))==null||s.continue()}addObserver(t){this.observers.includes(t)||(this.observers.push(t),this.clearGcTimeout(),n(this,z).notify({type:"observerAdded",query:this,observer:t}))}removeObserver(t){this.observers.includes(t)&&(this.observers=this.observers.filter(s=>s!==t),this.observers.length||(n(this,A)&&(n(this,_t)?n(this,A).cancel({revert:!0}):n(this,A).cancelRetry()),this.scheduleGc()),n(this,z).notify({type:"observerRemoved",query:this,observer:t}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||m(this,V,Y).call(this,{type:"invalidate"})}async fetch(t,s){var l,f,g,v,_,p,R,w,M,x,$,O;if(this.state.fetchStatus!=="idle"&&((l=n(this,A))==null?void 0:l.status())!=="rejected"){if(this.state.data!==void 0&&(s!=null&&s.cancelRefetch))this.cancel({silent:!0});else if(n(this,A))return n(this,A).continueRetry(),n(this,A).promise}if(t&&this.setOptions(t),!this.options.queryFn){const y=this.observers.find(j=>j.options.queryFn);y&&this.setOptions(y.options)}const r=new AbortController,i=y=>{Object.defineProperty(y,"signal",{enumerable:!0,get:()=>(u(this,_t,!0),r.signal)})},a=()=>{const y=_s(this.options,s),U=(()=>{const rt={client:n(this,kt),queryKey:this.queryKey,meta:this.meta};return i(rt),rt})();return u(this,_t,!1),this.options.persister?this.options.persister(y,U,this):y(U)},o=(()=>{const y={fetchOptions:s,options:this.options,queryKey:this.queryKey,client:n(this,kt),state:this.state,fetchFn:a};return i(y),y})();(f=this.options.behavior)==null||f.onFetch(o,this),u(this,Ft,this.state),(this.state.fetchStatus==="idle"||this.state.fetchMeta!==((g=o.fetchOptions)==null?void 0:g.meta))&&m(this,V,Y).call(this,{type:"fetch",meta:(v=o.fetchOptions)==null?void 0:v.meta}),u(this,A,Ms({initialPromise:s==null?void 0:s.initialPromise,fn:o.fetchFn,onCancel:y=>{y instanceof ye&&y.revert&&this.setState({...n(this,Ft),fetchStatus:"idle"}),r.abort()},onFail:(y,j)=>{m(this,V,Y).call(this,{type:"failed",failureCount:y,error:j})},onPause:()=>{m(this,V,Y).call(this,{type:"pause"})},onContinue:()=>{m(this,V,Y).call(this,{type:"continue"})},retry:o.options.retry,retryDelay:o.options.retryDelay,networkMode:o.options.networkMode,canRun:()=>!0}));try{const y=await n(this,A).start();if(y===void 0)throw new Error(`${this.queryHash} data is undefined`);return this.setData(y),(p=(_=n(this,z).config).onSuccess)==null||p.call(_,y,this),(w=(R=n(this,z).config).onSettled)==null||w.call(R,y,this.state.error,this),y}catch(y){if(y instanceof ye){if(y.silent)return n(this,A).promise;if(y.revert){if(this.state.data===void 0)throw y;return this.state.data}}throw m(this,V,Y).call(this,{type:"error",error:y}),(x=(M=n(this,z).config).onError)==null||x.call(M,y,this),(O=($=n(this,z).config).onSettled)==null||O.call($,this.state.data,y,this),y}finally{this.scheduleGc()}}},bt=new WeakMap,Ft=new WeakMap,z=new WeakMap,kt=new WeakMap,A=new WeakMap,zt=new WeakMap,_t=new WeakMap,V=new WeakSet,Y=function(t){const s=r=>{switch(t.type){case"failed":return{...r,fetchFailureCount:t.failureCount,fetchFailureReason:t.error};case"pause":return{...r,fetchStatus:"paused"};case"continue":return{...r,fetchStatus:"fetching"};case"fetch":return{...r,...Ss(r.data,this.options),fetchMeta:t.meta??null};case"success":const i={...r,...He(t.data,t.dataUpdatedAt),dataUpdateCount:r.dataUpdateCount+1,...!t.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return u(this,Ft,t.manual?i:void 0),i;case"error":const a=t.error;return{...r,error:a,errorUpdateCount:r.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:r.fetchFailureCount+1,fetchFailureReason:a,fetchStatus:"idle",status:"error",isInvalidated:!0};case"invalidate":return{...r,isInvalidated:!0};case"setState":return{...r,...t.state}}};this.state=s(this.state),F.batch(()=>{this.observers.forEach(r=>{r.onQueryUpdate()}),n(this,z).notify({query:this,type:"updated",action:t})})},es);function Ss(e,t){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:ws(t.networkMode)?"fetching":"paused",...e===void 0&&{error:null,status:"pending"}}}function He(e,t){return{data:e,dataUpdatedAt:t??Date.now(),error:null,isInvalidated:!1,status:"success"}}function ze(e){const t=typeof e.initialData=="function"?e.initialData():e.initialData,s=t!==void 0,r=s?typeof e.initialDataUpdatedAt=="function"?e.initialDataUpdatedAt():e.initialDataUpdatedAt:0;return{data:t,dataUpdateCount:0,dataUpdatedAt:s?r??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:s?"success":"pending",fetchStatus:"idle"}}var L,k,Kt,D,wt,$t,Z,ut,Vt,jt,Nt,Mt,Ct,ht,At,C,Lt,pe,ve,me,ge,be,ke,_e,xs,ss,gr=(ss=class extends Ut{constructor(t,s){super();d(this,C);d(this,L);d(this,k);d(this,Kt);d(this,D);d(this,wt);d(this,$t);d(this,Z);d(this,ut);d(this,Vt);d(this,jt);d(this,Nt);d(this,Mt);d(this,Ct);d(this,ht);d(this,At,new Set);this.options=s,u(this,L,t),u(this,ut,null),u(this,Z,fe()),this.bindMethods(),this.setOptions(s)}bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(n(this,k).addObserver(this),Ke(n(this,k),this.options)?m(this,C,Lt).call(this):this.updateResult(),m(this,C,ge).call(this))}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return we(n(this,k),this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return we(n(this,k),this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,m(this,C,be).call(this),m(this,C,ke).call(this),n(this,k).removeObserver(this)}setOptions(t){const s=this.options,r=n(this,k);if(this.options=n(this,L).defaultQueryOptions(t),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof K(this.options.enabled,n(this,k))!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");m(this,C,_e).call(this),n(this,k).setOptions(this.options),s._defaulted&&!ie(this.options,s)&&n(this,L).getQueryCache().notify({type:"observerOptionsUpdated",query:n(this,k),observer:this});const i=this.hasListeners();i&&Ve(n(this,k),r,this.options,s)&&m(this,C,Lt).call(this),this.updateResult(),i&&(n(this,k)!==r||K(this.options.enabled,n(this,k))!==K(s.enabled,n(this,k))||pt(this.options.staleTime,n(this,k))!==pt(s.staleTime,n(this,k)))&&m(this,C,pe).call(this);const a=m(this,C,ve).call(this);i&&(n(this,k)!==r||K(this.options.enabled,n(this,k))!==K(s.enabled,n(this,k))||a!==n(this,ht))&&m(this,C,me).call(this,a)}getOptimisticResult(t){const s=n(this,L).getQueryCache().build(n(this,L),t),r=this.createResult(s,t);return kr(this,r)&&(u(this,D,r),u(this,$t,this.options),u(this,wt,n(this,k).state)),r}getCurrentResult(){return n(this,D)}trackResult(t,s){return new Proxy(t,{get:(r,i)=>(this.trackProp(i),s==null||s(i),i==="promise"&&(this.trackProp("data"),!this.options.experimental_prefetchInRender&&n(this,Z).status==="pending"&&n(this,Z).reject(new Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(r,i))})}trackProp(t){n(this,At).add(t)}getCurrentQuery(){return n(this,k)}refetch({...t}={}){return this.fetch({...t})}fetchOptimistic(t){const s=n(this,L).defaultQueryOptions(t),r=n(this,L).getQueryCache().build(n(this,L),s);return r.fetch().then(()=>this.createResult(r,s))}fetch(t){return m(this,C,Lt).call(this,{...t,cancelRefetch:t.cancelRefetch??!0}).then(()=>(this.updateResult(),n(this,D)))}createResult(t,s){var N;const r=n(this,k),i=this.options,a=n(this,D),c=n(this,wt),o=n(this,$t),f=t!==r?t.state:n(this,Kt),{state:g}=t;let v={...g},_=!1,p;if(s._optimisticResults){const I=this.hasListeners(),nt=!I&&Ke(t,s),Jt=I&&Ve(t,r,s,i);(nt||Jt)&&(v={...v,...Ss(g.data,t.options)}),s._optimisticResults==="isRestoring"&&(v.fetchStatus="idle")}let{error:R,errorUpdatedAt:w,status:M}=v;p=v.data;let x=!1;if(s.placeholderData!==void 0&&p===void 0&&M==="pending"){let I;a!=null&&a.isPlaceholderData&&s.placeholderData===(o==null?void 0:o.placeholderData)?(I=a.data,x=!0):I=typeof s.placeholderData=="function"?s.placeholderData((N=n(this,Nt))==null?void 0:N.state.data,n(this,Nt)):s.placeholderData,I!==void 0&&(M="success",p=de(a==null?void 0:a.data,I,s),_=!0)}if(s.select&&p!==void 0&&!x)if(a&&p===(c==null?void 0:c.data)&&s.select===n(this,Vt))p=n(this,jt);else try{u(this,Vt,s.select),p=s.select(p),p=de(a==null?void 0:a.data,p,s),u(this,jt,p),u(this,ut,null)}catch(I){u(this,ut,I)}n(this,ut)&&(R=n(this,ut),p=n(this,jt),w=Date.now(),M="error");const $=v.fetchStatus==="fetching",O=M==="pending",y=M==="error",j=O&&$,U=p!==void 0,S={status:M,fetchStatus:v.fetchStatus,isPending:O,isSuccess:M==="success",isError:y,isInitialLoading:j,isLoading:j,data:p,dataUpdatedAt:v.dataUpdatedAt,error:R,errorUpdatedAt:w,failureCount:v.fetchFailureCount,failureReason:v.fetchFailureReason,errorUpdateCount:v.errorUpdateCount,isFetched:v.dataUpdateCount>0||v.errorUpdateCount>0,isFetchedAfterMount:v.dataUpdateCount>f.dataUpdateCount||v.errorUpdateCount>f.errorUpdateCount,isFetching:$,isRefetching:$&&!O,isLoadingError:y&&!U,isPaused:v.fetchStatus==="paused",isPlaceholderData:_,isRefetchError:y&&U,isStale:je(t,s),refetch:this.refetch,promise:n(this,Z),isEnabled:K(s.enabled,t)!==!1};if(this.options.experimental_prefetchInRender){const I=S.data!==void 0,nt=S.status==="error"&&!I,Jt=Zt=>{nt?Zt.reject(S.error):I&&Zt.resolve(S.data)},Ne=()=>{const Zt=u(this,Z,S.promise=fe());Jt(Zt)},Yt=n(this,Z);switch(Yt.status){case"pending":t.queryHash===r.queryHash&&Jt(Yt);break;case"fulfilled":(nt||S.data!==Yt.value)&&Ne();break;case"rejected":(!nt||S.error!==Yt.reason)&&Ne();break}}return S}updateResult(){const t=n(this,D),s=this.createResult(n(this,k),this.options);if(u(this,wt,n(this,k).state),u(this,$t,this.options),n(this,wt).data!==void 0&&u(this,Nt,n(this,k)),ie(s,t))return;u(this,D,s);const r=()=>{if(!t)return!0;const{notifyOnChangeProps:i}=this.options,a=typeof i=="function"?i():i;if(a==="all"||!a&&!n(this,At).size)return!0;const c=new Set(a??n(this,At));return this.options.throwOnError&&c.add("error"),Object.keys(n(this,D)).some(o=>{const l=o;return n(this,D)[l]!==t[l]&&c.has(l)})};m(this,C,xs).call(this,{listeners:r()})}onQueryUpdate(){this.updateResult(),this.hasListeners()&&m(this,C,ge).call(this)}},L=new WeakMap,k=new WeakMap,Kt=new WeakMap,D=new WeakMap,wt=new WeakMap,$t=new WeakMap,Z=new WeakMap,ut=new WeakMap,Vt=new WeakMap,jt=new WeakMap,Nt=new WeakMap,Mt=new WeakMap,Ct=new WeakMap,ht=new WeakMap,At=new WeakMap,C=new WeakSet,Lt=function(t){m(this,C,_e).call(this);let s=n(this,k).fetch(this.options,t);return t!=null&&t.throwOnError||(s=s.catch(Q)),s},pe=function(){m(this,C,be).call(this);const t=pt(this.options.staleTime,n(this,k));if(xt||n(this,D).isStale||!he(t))return;const r=bs(n(this,D).dataUpdatedAt,t)+1;u(this,Mt,vt.setTimeout(()=>{n(this,D).isStale||this.updateResult()},r))},ve=function(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(n(this,k)):this.options.refetchInterval)??!1},me=function(t){m(this,C,ke).call(this),u(this,ht,t),!(xt||K(this.options.enabled,n(this,k))===!1||!he(n(this,ht))||n(this,ht)===0)&&u(this,Ct,vt.setInterval(()=>{(this.options.refetchIntervalInBackground||$e.isFocused())&&m(this,C,Lt).call(this)},n(this,ht)))},ge=function(){m(this,C,pe).call(this),m(this,C,me).call(this,m(this,C,ve).call(this))},be=function(){n(this,Mt)&&(vt.clearTimeout(n(this,Mt)),u(this,Mt,void 0))},ke=function(){n(this,Ct)&&(vt.clearInterval(n(this,Ct)),u(this,Ct,void 0))},_e=function(){const t=n(this,L).getQueryCache().build(n(this,L),this.options);if(t===n(this,k))return;const s=n(this,k);u(this,k,t),u(this,Kt,t.state),this.hasListeners()&&(s==null||s.removeObserver(this),t.addObserver(this))},xs=function(t){F.batch(()=>{t.listeners&&this.listeners.forEach(s=>{s(n(this,D))}),n(this,L).getQueryCache().notify({query:n(this,k),type:"observerResultsUpdated"})})},ss);function br(e,t){return K(t.enabled,e)!==!1&&e.state.data===void 0&&!(e.state.status==="error"&&t.retryOnMount===!1)}function Ke(e,t){return br(e,t)||e.state.data!==void 0&&we(e,t,t.refetchOnMount)}function we(e,t,s){if(K(t.enabled,e)!==!1&&pt(t.staleTime,e)!=="static"){const r=typeof s=="function"?s(e):s;return r==="always"||r!==!1&&je(e,t)}return!1}function Ve(e,t,s,r){return(e!==t||K(r.enabled,e)===!1)&&(!s.suspense||e.state.status!=="error")&&je(e,s)}function je(e,t){return K(t.enabled,e)!==!1&&e.isStaleByTime(pt(t.staleTime,e))}function kr(e,t){return!ie(e.getCurrentResult(),t)}function Be(e){return{onFetch:(t,s)=>{var g,v,_,p,R;const r=t.options,i=(_=(v=(g=t.fetchOptions)==null?void 0:g.meta)==null?void 0:v.fetchMore)==null?void 0:_.direction,a=((p=t.state.data)==null?void 0:p.pages)||[],c=((R=t.state.data)==null?void 0:R.pageParams)||[];let o={pages:[],pageParams:[]},l=0;const f=async()=>{let w=!1;const M=O=>{lr(O,()=>t.signal,()=>w=!0)},x=_s(t.options,t.fetchOptions),$=async(O,y,j)=>{if(w)return Promise.reject();if(y==null&&O.pages.length)return Promise.resolve(O);const rt=(()=>{const nt={client:t.client,queryKey:t.queryKey,pageParam:y,direction:j?"backward":"forward",meta:t.options.meta};return M(nt),nt})(),S=await x(rt),{maxPages:N}=t.options,I=j?hr:ur;return{pages:I(O.pages,S,N),pageParams:I(O.pageParams,y,N)}};if(i&&a.length){const O=i==="backward",y=O?_r:Ge,j={pages:a,pageParams:c},U=y(r,j);o=await $(j,U,O)}else{const O=e??a.length;do{const y=l===0?c[0]??r.initialPageParam:Ge(r,o);if(l>0&&y==null)break;o=await $(o,y),l++}while(l<O)}return o};t.options.persister?t.fetchFn=()=>{var w,M;return(M=(w=t.options).persister)==null?void 0:M.call(w,f,{client:t.client,queryKey:t.queryKey,meta:t.options.meta,signal:t.signal},s)}:t.fetchFn=f}}}function Ge(e,{pages:t,pageParams:s}){const r=t.length-1;return t.length>0?e.getNextPageParam(t[r],t,s[r],s):void 0}function _r(e,{pages:t,pageParams:s}){var r;return t.length>0?(r=e.getPreviousPageParam)==null?void 0:r.call(e,t[0],t,s[0],s):void 0}var Bt,G,T,St,W,it,rs,wr=(rs=class extends Cs{constructor(t){super();d(this,W);d(this,Bt);d(this,G);d(this,T);d(this,St);u(this,Bt,t.client),this.mutationId=t.mutationId,u(this,T,t.mutationCache),u(this,G,[]),this.state=t.state||Os(),this.setOptions(t.options),this.scheduleGc()}setOptions(t){this.options=t,this.updateGcTime(this.options.gcTime)}get meta(){return this.options.meta}addObserver(t){n(this,G).includes(t)||(n(this,G).push(t),this.clearGcTimeout(),n(this,T).notify({type:"observerAdded",mutation:this,observer:t}))}removeObserver(t){u(this,G,n(this,G).filter(s=>s!==t)),this.scheduleGc(),n(this,T).notify({type:"observerRemoved",mutation:this,observer:t})}optionalRemove(){n(this,G).length||(this.state.status==="pending"?this.scheduleGc():n(this,T).remove(this))}continue(){var t;return((t=n(this,St))==null?void 0:t.continue())??this.execute(this.state.variables)}async execute(t){var c,o,l,f,g,v,_,p,R,w,M,x,$,O,y,j,U,rt;const s=()=>{m(this,W,it).call(this,{type:"continue"})},r={client:n(this,Bt),meta:this.options.meta,mutationKey:this.options.mutationKey};u(this,St,Ms({fn:()=>this.options.mutationFn?this.options.mutationFn(t,r):Promise.reject(new Error("No mutationFn found")),onFail:(S,N)=>{m(this,W,it).call(this,{type:"failed",failureCount:S,error:N})},onPause:()=>{m(this,W,it).call(this,{type:"pause"})},onContinue:s,retry:this.options.retry??0,retryDelay:this.options.retryDelay,networkMode:this.options.networkMode,canRun:()=>n(this,T).canRun(this)}));const i=this.state.status==="pending",a=!n(this,St).canStart();try{if(i)s();else{m(this,W,it).call(this,{type:"pending",variables:t,isPaused:a}),n(this,T).config.onMutate&&await n(this,T).config.onMutate(t,this,r);const N=await((o=(c=this.options).onMutate)==null?void 0:o.call(c,t,r));N!==this.state.context&&m(this,W,it).call(this,{type:"pending",context:N,variables:t,isPaused:a})}const S=await n(this,St).start();return await((f=(l=n(this,T).config).onSuccess)==null?void 0:f.call(l,S,t,this.state.context,this,r)),await((v=(g=this.options).onSuccess)==null?void 0:v.call(g,S,t,this.state.context,r)),await((p=(_=n(this,T).config).onSettled)==null?void 0:p.call(_,S,null,this.state.variables,this.state.context,this,r)),await((w=(R=this.options).onSettled)==null?void 0:w.call(R,S,null,t,this.state.context,r)),m(this,W,it).call(this,{type:"success",data:S}),S}catch(S){try{await((x=(M=n(this,T).config).onError)==null?void 0:x.call(M,S,t,this.state.context,this,r))}catch(N){Promise.reject(N)}try{await((O=($=this.options).onError)==null?void 0:O.call($,S,t,this.state.context,r))}catch(N){Promise.reject(N)}try{await((j=(y=n(this,T).config).onSettled)==null?void 0:j.call(y,void 0,S,this.state.variables,this.state.context,this,r))}catch(N){Promise.reject(N)}try{await((rt=(U=this.options).onSettled)==null?void 0:rt.call(U,void 0,S,t,this.state.context,r))}catch(N){Promise.reject(N)}throw m(this,W,it).call(this,{type:"error",error:S}),S}finally{n(this,T).runNext(this)}}},Bt=new WeakMap,G=new WeakMap,T=new WeakMap,St=new WeakMap,W=new WeakSet,it=function(t){const s=r=>{switch(t.type){case"failed":return{...r,failureCount:t.failureCount,failureReason:t.error};case"pause":return{...r,isPaused:!0};case"continue":return{...r,isPaused:!1};case"pending":return{...r,context:t.context,data:void 0,failureCount:0,failureReason:null,error:null,isPaused:t.isPaused,status:"pending",variables:t.variables,submittedAt:Date.now()};case"success":return{...r,data:t.data,failureCount:0,failureReason:null,error:null,status:"success",isPaused:!1};case"error":return{...r,data:void 0,error:t.error,failureCount:r.failureCount+1,failureReason:t.error,isPaused:!1,status:"error"}}};this.state=s(this.state),F.batch(()=>{n(this,G).forEach(r=>{r.onMutationUpdate(t)}),n(this,T).notify({mutation:this,type:"updated",action:t})})},rs);function Os(){return{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0}}var X,B,Gt,ns,Mr=(ns=class extends Ut{constructor(t={}){super();d(this,X);d(this,B);d(this,Gt);this.config=t,u(this,X,new Set),u(this,B,new Map),u(this,Gt,0)}build(t,s,r){const i=new wr({client:t,mutationCache:this,mutationId:++Xt(this,Gt)._,options:t.defaultMutationOptions(s),state:r});return this.add(i),i}add(t){n(this,X).add(t);const s=ee(t);if(typeof s=="string"){const r=n(this,B).get(s);r?r.push(t):n(this,B).set(s,[t])}this.notify({type:"added",mutation:t})}remove(t){if(n(this,X).delete(t)){const s=ee(t);if(typeof s=="string"){const r=n(this,B).get(s);if(r)if(r.length>1){const i=r.indexOf(t);i!==-1&&r.splice(i,1)}else r[0]===t&&n(this,B).delete(s)}}this.notify({type:"removed",mutation:t})}canRun(t){const s=ee(t);if(typeof s=="string"){const r=n(this,B).get(s),i=r==null?void 0:r.find(a=>a.state.status==="pending");return!i||i===t}else return!0}runNext(t){var r;const s=ee(t);if(typeof s=="string"){const i=(r=n(this,B).get(s))==null?void 0:r.find(a=>a!==t&&a.state.isPaused);return(i==null?void 0:i.continue())??Promise.resolve()}else return Promise.resolve()}clear(){F.batch(()=>{n(this,X).forEach(t=>{this.notify({type:"removed",mutation:t})}),n(this,X).clear(),n(this,B).clear()})}getAll(){return Array.from(n(this,X))}find(t){const s={exact:!0,...t};return this.getAll().find(r=>qe(s,r))}findAll(t={}){return this.getAll().filter(s=>qe(t,s))}notify(t){F.batch(()=>{this.listeners.forEach(s=>{s(t)})})}resumePausedMutations(){const t=this.getAll().filter(s=>s.state.isPaused);return F.batch(()=>Promise.all(t.map(s=>s.continue().catch(Q))))}},X=new WeakMap,B=new WeakMap,Gt=new WeakMap,ns);function ee(e){var t;return(t=e.options.scope)==null?void 0:t.id}var tt,lt,H,et,st,ne,Me,is,Cr=(is=class extends Ut{constructor(t,s){super();d(this,st);d(this,tt);d(this,lt);d(this,H);d(this,et);u(this,tt,t),this.setOptions(s),this.bindMethods(),m(this,st,ne).call(this)}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(t){var r;const s=this.options;this.options=n(this,tt).defaultMutationOptions(t),ie(this.options,s)||n(this,tt).getMutationCache().notify({type:"observerOptionsUpdated",mutation:n(this,H),observer:this}),s!=null&&s.mutationKey&&this.options.mutationKey&&Ot(s.mutationKey)!==Ot(this.options.mutationKey)?this.reset():((r=n(this,H))==null?void 0:r.state.status)==="pending"&&n(this,H).setOptions(this.options)}onUnsubscribe(){var t;this.hasListeners()||(t=n(this,H))==null||t.removeObserver(this)}onMutationUpdate(t){m(this,st,ne).call(this),m(this,st,Me).call(this,t)}getCurrentResult(){return n(this,lt)}reset(){var t;(t=n(this,H))==null||t.removeObserver(this),u(this,H,void 0),m(this,st,ne).call(this),m(this,st,Me).call(this)}mutate(t,s){var r;return u(this,et,s),(r=n(this,H))==null||r.removeObserver(this),u(this,H,n(this,tt).getMutationCache().build(n(this,tt),this.options)),n(this,H).addObserver(this),n(this,H).execute(t)}},tt=new WeakMap,lt=new WeakMap,H=new WeakMap,et=new WeakMap,st=new WeakSet,ne=function(){var s;const t=((s=n(this,H))==null?void 0:s.state)??Os();u(this,lt,{...t,isPending:t.status==="pending",isSuccess:t.status==="success",isError:t.status==="error",isIdle:t.status==="idle",mutate:this.mutate,reset:this.reset})},Me=function(t){F.batch(()=>{var s,r,i,a,c,o,l,f;if(n(this,et)&&this.hasListeners()){const g=n(this,lt).variables,v=n(this,lt).context,_={client:n(this,tt),meta:this.options.meta,mutationKey:this.options.mutationKey};if((t==null?void 0:t.type)==="success"){try{(r=(s=n(this,et)).onSuccess)==null||r.call(s,t.data,g,v,_)}catch(p){Promise.reject(p)}try{(a=(i=n(this,et)).onSettled)==null||a.call(i,t.data,null,g,v,_)}catch(p){Promise.reject(p)}}else if((t==null?void 0:t.type)==="error"){try{(o=(c=n(this,et)).onError)==null||o.call(c,t.error,g,v,_)}catch(p){Promise.reject(p)}try{(f=(l=n(this,et)).onSettled)==null||f.call(l,void 0,t.error,g,v,_)}catch(p){Promise.reject(p)}}}this.listeners.forEach(g=>{g(n(this,lt))})})},is),J,as,Sr=(as=class extends Ut{constructor(t={}){super();d(this,J);this.config=t,u(this,J,new Map)}build(t,s,r){const i=s.queryKey,a=s.queryHash??Re(i,s);let c=this.get(a);return c||(c=new mr({client:t,queryKey:i,queryHash:a,options:t.defaultQueryOptions(s),state:r,defaultOptions:t.getQueryDefaults(i)}),this.add(c)),c}add(t){n(this,J).has(t.queryHash)||(n(this,J).set(t.queryHash,t),this.notify({type:"added",query:t}))}remove(t){const s=n(this,J).get(t.queryHash);s&&(t.destroy(),s===t&&n(this,J).delete(t.queryHash),this.notify({type:"removed",query:t}))}clear(){F.batch(()=>{this.getAll().forEach(t=>{this.remove(t)})})}get(t){return n(this,J).get(t)}getAll(){return[...n(this,J).values()]}find(t){const s={exact:!0,...t};return this.getAll().find(r=>Qe(s,r))}findAll(t={}){const s=this.getAll();return Object.keys(t).length>0?s.filter(r=>Qe(t,r)):s}notify(t){F.batch(()=>{this.listeners.forEach(s=>{s(t)})})}onFocus(){F.batch(()=>{this.getAll().forEach(t=>{t.onFocus()})})}onOnline(){F.batch(()=>{this.getAll().forEach(t=>{t.onOnline()})})}},J=new WeakMap,as),E,dt,ft,Tt,It,yt,Dt,Qt,os,ni=(os=class{constructor(e={}){d(this,E);d(this,dt);d(this,ft);d(this,Tt);d(this,It);d(this,yt);d(this,Dt);d(this,Qt);u(this,E,e.queryCache||new Sr),u(this,dt,e.mutationCache||new Mr),u(this,ft,e.defaultOptions||{}),u(this,Tt,new Map),u(this,It,new Map),u(this,yt,0)}mount(){Xt(this,yt)._++,n(this,yt)===1&&(u(this,Dt,$e.subscribe(async e=>{e&&(await this.resumePausedMutations(),n(this,E).onFocus())})),u(this,Qt,ae.subscribe(async e=>{e&&(await this.resumePausedMutations(),n(this,E).onOnline())})))}unmount(){var e,t;Xt(this,yt)._--,n(this,yt)===0&&((e=n(this,Dt))==null||e.call(this),u(this,Dt,void 0),(t=n(this,Qt))==null||t.call(this),u(this,Qt,void 0))}isFetching(e){return n(this,E).findAll({...e,fetchStatus:"fetching"}).length}isMutating(e){return n(this,dt).findAll({...e,status:"pending"}).length}getQueryData(e){var s;const t=this.defaultQueryOptions({queryKey:e});return(s=n(this,E).get(t.queryHash))==null?void 0:s.state.data}ensureQueryData(e){const t=this.defaultQueryOptions(e),s=n(this,E).build(this,t),r=s.state.data;return r===void 0?this.fetchQuery(e):(e.revalidateIfStale&&s.isStaleByTime(pt(t.staleTime,s))&&this.prefetchQuery(t),Promise.resolve(r))}getQueriesData(e){return n(this,E).findAll(e).map(({queryKey:t,state:s})=>{const r=s.data;return[t,r]})}setQueryData(e,t,s){const r=this.defaultQueryOptions({queryKey:e}),i=n(this,E).get(r.queryHash),a=i==null?void 0:i.state.data,c=ar(t,a);if(c!==void 0)return n(this,E).build(this,r).setData(c,{...s,manual:!0})}setQueriesData(e,t,s){return F.batch(()=>n(this,E).findAll(e).map(({queryKey:r})=>[r,this.setQueryData(r,t,s)]))}getQueryState(e){var s;const t=this.defaultQueryOptions({queryKey:e});return(s=n(this,E).get(t.queryHash))==null?void 0:s.state}removeQueries(e){const t=n(this,E);F.batch(()=>{t.findAll(e).forEach(s=>{t.remove(s)})})}resetQueries(e,t){const s=n(this,E);return F.batch(()=>(s.findAll(e).forEach(r=>{r.reset()}),this.refetchQueries({type:"active",...e},t)))}cancelQueries(e,t={}){const s={revert:!0,...t},r=F.batch(()=>n(this,E).findAll(e).map(i=>i.cancel(s)));return Promise.all(r).then(Q).catch(Q)}invalidateQueries(e,t={}){return F.batch(()=>(n(this,E).findAll(e).forEach(s=>{s.invalidate()}),(e==null?void 0:e.refetchType)==="none"?Promise.resolve():this.refetchQueries({...e,type:(e==null?void 0:e.refetchType)??(e==null?void 0:e.type)??"active"},t)))}refetchQueries(e,t={}){const s={...t,cancelRefetch:t.cancelRefetch??!0},r=F.batch(()=>n(this,E).findAll(e).filter(i=>!i.isDisabled()&&!i.isStatic()).map(i=>{let a=i.fetch(void 0,s);return s.throwOnError||(a=a.catch(Q)),i.state.fetchStatus==="paused"?Promise.resolve():a}));return Promise.all(r).then(Q)}fetchQuery(e){const t=this.defaultQueryOptions(e);t.retry===void 0&&(t.retry=!1);const s=n(this,E).build(this,t);return s.isStaleByTime(pt(t.staleTime,s))?s.fetch(t):Promise.resolve(s.state.data)}prefetchQuery(e){return this.fetchQuery(e).then(Q).catch(Q)}fetchInfiniteQuery(e){return e.behavior=Be(e.pages),this.fetchQuery(e)}prefetchInfiniteQuery(e){return this.fetchInfiniteQuery(e).then(Q).catch(Q)}ensureInfiniteQueryData(e){return e.behavior=Be(e.pages),this.ensureQueryData(e)}resumePausedMutations(){return ae.isOnline()?n(this,dt).resumePausedMutations():Promise.resolve()}getQueryCache(){return n(this,E)}getMutationCache(){return n(this,dt)}getDefaultOptions(){return n(this,ft)}setDefaultOptions(e){u(this,ft,e)}setQueryDefaults(e,t){n(this,Tt).set(Ot(e),{queryKey:e,defaultOptions:t})}getQueryDefaults(e){const t=[...n(this,Tt).values()],s={};return t.forEach(r=>{Ht(e,r.queryKey)&&Object.assign(s,r.defaultOptions)}),s}setMutationDefaults(e,t){n(this,It).set(Ot(e),{mutationKey:e,defaultOptions:t})}getMutationDefaults(e){const t=[...n(this,It).values()],s={};return t.forEach(r=>{Ht(e,r.mutationKey)&&Object.assign(s,r.defaultOptions)}),s}defaultQueryOptions(e){if(e._defaulted)return e;const t={...n(this,ft).queries,...this.getQueryDefaults(e.queryKey),...e,_defaulted:!0};return t.queryHash||(t.queryHash=Re(t.queryKey,t)),t.refetchOnReconnect===void 0&&(t.refetchOnReconnect=t.networkMode!=="always"),t.throwOnError===void 0&&(t.throwOnError=!!t.suspense),!t.networkMode&&t.persister&&(t.networkMode="offlineFirst"),t.queryFn===Ee&&(t.enabled=!1),t}defaultMutationOptions(e){return e!=null&&e._defaulted?e:{...n(this,ft).mutations,...(e==null?void 0:e.mutationKey)&&this.getMutationDefaults(e.mutationKey),...e,_defaulted:!0}}clear(){n(this,E).clear(),n(this,dt).clear()}},E=new WeakMap,dt=new WeakMap,ft=new WeakMap,Tt=new WeakMap,It=new WeakMap,yt=new WeakMap,Dt=new WeakMap,Qt=new WeakMap,os),Ps=P.createContext(void 0),Rs=e=>{const t=P.useContext(Ps);if(!t)throw new Error("No QueryClient set, use QueryClientProvider to set one");return t},ii=({client:e,children:t})=>(P.useEffect(()=>(e.mount(),()=>{e.unmount()}),[e]),sr.jsx(Ps.Provider,{value:e,children:t})),Es=P.createContext(!1),xr=()=>P.useContext(Es);Es.Provider;function Or(){let e=!1;return{clearReset:()=>{e=!1},reset:()=>{e=!0},isReset:()=>e}}var Pr=P.createContext(Or()),Rr=()=>P.useContext(Pr),Er=(e,t,s)=>{const r=s!=null&&s.state.error&&typeof e.throwOnError=="function"?Fe(e.throwOnError,[s.state.error,s]):e.throwOnError;(e.suspense||e.experimental_prefetchInRender||r)&&(t.isReset()||(e.retryOnMount=!1))},Fr=e=>{P.useEffect(()=>{e.clearReset()},[e])},$r=({result:e,errorResetBoundary:t,throwOnError:s,query:r,suspense:i})=>e.isError&&!t.isReset()&&!e.isFetching&&r&&(i&&e.data===void 0||Fe(s,[e.error,r])),jr=e=>{if(e.suspense){const s=i=>i==="static"?i:Math.max(i??1e3,1e3),r=e.staleTime;e.staleTime=typeof r=="function"?(...i)=>s(r(...i)):s(r),typeof e.gcTime=="number"&&(e.gcTime=Math.max(e.gcTime,1e3))}},Nr=(e,t)=>e.isLoading&&e.isFetching&&!t,Ar=(e,t)=>(e==null?void 0:e.suspense)&&t.isPending,We=(e,t,s)=>t.fetchOptimistic(e).catch(()=>{s.clearReset()});function Tr(e,t,s){var _,p,R,w;const r=xr(),i=Rr(),a=Rs(),c=a.defaultQueryOptions(e);(p=(_=a.getDefaultOptions().queries)==null?void 0:_._experimental_beforeQuery)==null||p.call(_,c);const o=a.getQueryCache().get(c.queryHash);c._optimisticResults=r?"isRestoring":"optimistic",jr(c),Er(c,i,o),Fr(i);const l=!a.getQueryCache().get(c.queryHash),[f]=P.useState(()=>new t(a,c)),g=f.getOptimisticResult(c),v=!r&&e.subscribed!==!1;if(P.useSyncExternalStore(P.useCallback(M=>{const x=v?f.subscribe(F.batchCalls(M)):Q;return f.updateResult(),x},[f,v]),()=>f.getCurrentResult(),()=>f.getCurrentResult()),P.useEffect(()=>{f.setOptions(c)},[c,f]),Ar(c,g))throw We(c,f,i);if($r({result:g,errorResetBoundary:i,throwOnError:c.throwOnError,query:o,suspense:c.suspense}))throw g.error;if((w=(R=a.getDefaultOptions().queries)==null?void 0:R._experimental_afterQuery)==null||w.call(R,c,g),c.experimental_prefetchInRender&&!xt&&Nr(g,r)){const M=l?We(c,f,i):o==null?void 0:o.promise;M==null||M.catch(Q).finally(()=>{f.updateResult()})}return c.notifyOnChangeProps?g:f.trackResult(g)}function ai(e,t){return Tr(e,gr)}function oi(e,t){const s=Rs(),[r]=P.useState(()=>new Cr(s,e));P.useEffect(()=>{r.setOptions(e)},[r,e]);const i=P.useSyncExternalStore(P.useCallback(c=>r.subscribe(F.batchCalls(c)),[r]),()=>r.getCurrentResult(),()=>r.getCurrentResult()),a=P.useCallback((c,o)=>{r.mutate(c,o).catch(Q)},[r]);if(i.error&&Fe(r.options.throwOnError,[i.error]))throw i.error;return{...i,mutate:a,mutateAsync:i.mutate}}/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fs=(...e)=>e.filter((t,s,r)=>!!t&&t.trim()!==""&&r.indexOf(t)===s).join(" ").trim();/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ir=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dr=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,s,r)=>r?r.toUpperCase():s.toLowerCase());/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Je=e=>{const t=Dr(e);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Qr={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qr=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ur=P.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:s=2,absoluteStrokeWidth:r,className:i="",children:a,iconNode:c,...o},l)=>P.createElement("svg",{ref:l,...Qr,width:t,height:t,stroke:e,strokeWidth:r?Number(s)*24/Number(t):s,className:Fs("lucide",i),...!a&&!qr(o)&&{"aria-hidden":"true"},...o},[...c.map(([f,g])=>P.createElement(f,g)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=(e,t)=>{const s=P.forwardRef(({className:r,...i},a)=>P.createElement(Ur,{ref:a,iconNode:t,className:Fs(`lucide-${Ir(Je(e))}`,`lucide-${e}`,r),...i}));return s.displayName=Je(e),s};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lr=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]],ci=h("activity",Lr);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hr=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],ui=h("arrow-right",Hr);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zr=[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M6 12h.01M18 12h.01",key:"113zkx"}]],hi=h("banknote",zr);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kr=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],li=h("bell",Kr);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vr=[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]],di=h("building-2",Vr);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Br=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],fi=h("calendar",Br);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gr=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],yi=h("chart-column",Gr);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wr=[["path",{d:"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",key:"pzmjnu"}],["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}]],pi=h("chart-pie",Wr);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jr=[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]],vi=h("check-check",Jr);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yr=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],mi=h("check",Yr);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zr=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],gi=h("chevron-left",Zr);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xr=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],bi=h("chevron-right",Xr);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tn=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],ki=h("circle-alert",tn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const en=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],_i=h("circle-check-big",en);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sn=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]],wi=h("circle-plus",sn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rn=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],Mi=h("circle-x",rn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nn=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]],Ci=h("clock",nn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const an=[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]],Si=h("dollar-sign",an);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const on=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],xi=h("download",on);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cn=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],Oi=h("external-link",cn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const un=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],Pi=h("eye",un);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hn=[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]],Ri=h("facebook",hn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ln=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],Ei=h("file-text",ln);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dn=[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]],Fi=h("funnel",dn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fn=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],$i=h("globe",fn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yn=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]],ji=h("grid-3x3",yn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pn=[["path",{d:"M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762",key:"17lmqv"}]],Ni=h("heart-handshake",pn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vn=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]],Ai=h("house",vn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mn=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],Ti=h("info",mn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gn=[["rect",{width:"20",height:"20",x:"2",y:"2",rx:"5",ry:"5",key:"2e1cvw"}],["path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",key:"9exkf1"}],["line",{x1:"17.5",x2:"17.51",y1:"6.5",y2:"6.5",key:"r4j83e"}]],Ii=h("instagram",gn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bn=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],Di=h("layout-dashboard",bn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kn=[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]],Qi=h("link",kn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _n=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],qi=h("loader-circle",_n);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wn=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],Ui=h("lock",wn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mn=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],Li=h("log-out",Mn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cn=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],Hi=h("mail",Cn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sn=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],zi=h("map-pin",Sn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xn=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],Ki=h("menu",xn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const On=[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]],Vi=h("message-circle",On);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pn=[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}]],Bi=h("message-square",Pn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rn=[["path",{d:"M13 21h8",key:"1jsn5i"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]],Gi=h("pen-line",Rn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const En=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]],Wi=h("pen",En);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fn=[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]],Ji=h("phone",Fn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $n=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],Yi=h("plus",$n);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jn=[["path",{d:"M12 2v10",key:"mnfbl"}],["path",{d:"M18.4 6.6a9 9 0 1 1-12.77.04",key:"obofu9"}]],Zi=h("power",jn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nn=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],Xi=h("printer",Nn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const An=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],ta=h("refresh-cw",An);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tn=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],ea=h("save",Tn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const In=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],sa=h("search",In);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dn=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],ra=h("settings",Dn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qn=[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]],na=h("share-2",Qn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qn=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],ia=h("shield-check",qn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Un=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]],aa=h("shield",Un);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ln=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],oa=h("square-pen",Ln);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hn=[["path",{d:"M11 2v2",key:"1539x4"}],["path",{d:"M5 2v2",key:"1yf1q8"}],["path",{d:"M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1",key:"rb5t3r"}],["path",{d:"M8 15a6 6 0 0 0 12 0v-3",key:"x18d4x"}],["circle",{cx:"20",cy:"10",r:"2",key:"ts1r5v"}]],ca=h("stethoscope",Hn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zn=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],ua=h("trash-2",zn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kn=[["path",{d:"M16 17h6v-6",key:"t6n2it"}],["path",{d:"m22 17-8.5-8.5-5 5L2 7",key:"x473p"}]],ha=h("trending-down",Kn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vn=[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]],la=h("trending-up",Vn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bn=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],da=h("triangle-alert",Bn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gn=[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]],fa=h("twitter",Gn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wn=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]],ya=h("user-plus",Wn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jn=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],pa=h("user",Jn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yn=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],va=h("users",Yn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zn=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}],["path",{d:"M5 12.859a10 10 0 0 1 5.17-2.69",key:"1dl1wf"}],["path",{d:"M19 12.859a10 10 0 0 0-2.007-1.523",key:"4k23kn"}],["path",{d:"M2 8.82a15 15 0 0 1 4.177-2.643",key:"1grhjp"}],["path",{d:"M22 8.82a15 15 0 0 0-11.288-3.764",key:"z3jwby"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],ma=h("wifi-off",Zn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xn=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],ga=h("x",Xn);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ti=[["path",{d:"M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",key:"1q2vi4"}],["path",{d:"m10 15 5-3-5-3z",key:"1jp15x"}]],ba=h("youtube",ti);export{ca as $,ci as A,li as B,vi as C,la as D,Oi as E,Ei as F,Rs as G,Ai as H,Ti as I,qi as J,ui as K,Li as L,Ki as M,bi as N,sa as O,Ji as P,Si as Q,ri as R,ia as S,fa as T,va as U,da as V,ma as W,ga as X,ba as Y,fi as Z,pa as _,Ws as a,ha as a0,Yi as a1,Fi as a2,xi as a3,Wi as a4,ua as a5,oa as a6,Gi as a7,Zi as a8,aa as a9,ya as aa,Ui as ab,ea as ac,Mi as ad,ji as ae,Xi as af,ta as ag,Ni as ah,pi as ai,$i as aj,ni as ak,ii as al,si as am,ki as b,_i as c,wi as d,Hi as e,Ri as f,js as g,Ii as h,Di as i,sr as j,yi as k,ra as l,Vi as m,Bi as n,mi as o,Qi as p,Pi as q,P as r,di as s,zi as t,hi as u,na as v,gi as w,ai as x,oi as y,Ci as z};
