var A=Object.defineProperty;var y=(i,a,t)=>a in i?A(i,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[a]=t;var c=(i,a,t)=>(y(i,typeof a!="symbol"?a+"":a,t),t);const b="pf2e-display-actions",l=b,r=`module.${l}`;class N extends FormApplication{constructor(t,e){super(t);c(this,"userNameList");c(this,"displayActionState");this.userNameList=t,this.displayActionState=e}static get defaultOptions(){const t=super.defaultOptions;return t.id="DisplayActions2e-selective-show",t.template=`modules/${l}/templates/selectiveshow.html`,t.classes.push("selective-show"),t.height=300,t.width=250,t.minimizable=!0,t.resizable=!0,t.title=game.i18n.localize("selectiveshow.SelectiveShow"),t}async getData(){let t=await super.getData();return t.users=game.users.filter(e=>e.active&&e.data.id!=game.user.id),t}activateListeners(t){super.activateListeners(t),t.find(".show").click(e=>{var s;e.preventDefault(),this._updateObject(),(s=game.socket)==null||s.emit(r,{operation:"showToSelection",state:this.displayActionState,user:game.userId,userList:this.userNameList}),this.close()}),t.find(".show-all").click(e=>{var s;e.preventDefault(),this._updateObject(),(s=game.socket)==null||s.emit(r,{operation:"showToAll",state:this.displayActionState,user:game.userId}),this.close()}),t.find(".show-permissions").click(e=>{var s;e.preventDefault(),this._updateObject(),this.displayActionState.userListPermissions=this.userNameList,(s=game.socket)==null||s.emit(r,{operation:"showWithPermission",state:this.displayActionState,user:game.userId,userList:this.userNameList}),this.close()})}_updateObject(){let t=Array.from(document.getElementsByClassName("selective-show-form")[0].children[0].children[0].children[0].children);this.userNameList=t.map(s=>s.selected?s.value:"");let e=game.userId;return e&&(this.userNameList.includes(e)||this.userNameList.push(e)),new Promise(()=>{})}_handleShowPlayers(t){this.render(!0),this.displayActionState=t}}var h;class d extends Application{constructor(t){super();c(this,"clickString","symbolClick");c(this,"actionImage","/systems/pf2e/icons/actions/OneAction.webp");c(this,"reactionImage","/systems/pf2e/icons/actions/Reaction.webp");c(this,"defaultNumOfActions",3);c(this,"defaultNumOfReactions",1);c(this,"state",{numOfActions:this.defaultNumOfActions,numOfReactions:this.defaultNumOfReactions,classNameListActions:Array.from({length:this.defaultNumOfActions},()=>"symbol"),classNameListReactions:Array.from({length:this.defaultNumOfReactions},()=>"symbol"),sentFromUserId:String(game.userId),userListPermissions:[String(game.userId)]});c(this,"showPlayerHandler",new N([String((h=game.user)==null?void 0:h.name)],this.state));t&&(this.state=t)}get title(){var s,n;let t=game.i18n.localize("DisplayActions2e.WindowTitle");if(this.state.sentFromUserId===game.userId)return t;let e=(n=(s=game.users)==null?void 0:s.find(o=>o.id===this.state.sentFromUserId))==null?void 0:n.name;return t.concat(" sent from ",String(e))}static get defaultOptions(){return foundry.utils.mergeObject(super.defaultOptions,{id:"DisplayActions2e",template:`modules/${l}/templates/result.hbs`,width:600,height:200,resizable:!0,title:"DisplayActions2e.WindowTitle"})}getData(){return this.updateState(),{numOfActions:this.state.numOfActions,numOfReactions:this.state.numOfReactions,actionImagePayload:this.buildHandlebarPayload(this.state.numOfActions,{actionImage:this.actionImage},this.state.classNameListActions),reactionImagePayload:this.buildHandlebarPayload(this.state.numOfReactions,{reactionImage:this.reactionImage},this.state.classNameListReactions)}}activateListeners(t){super.activateListeners(t),this.state.userListPermissions.includes(String(game.userId))&&(t.find("img.symbol").on("click",this._onClickSymbolImage.bind(this)),t.find("input.input-counter").on("change",this._onChangeCountNumber.bind(this)))}_onClickSymbolImage(t){t.preventDefault();const e=t.currentTarget;if(e==null)return;e.classList.toggle(this.clickString);const s=parseInt(e.id.slice(1));switch(e.id.charAt(0)){case"a":this.state.classNameListActions[s]=e.className;break;case"r":this.state.classNameListReactions[s]=e.className;break;default:console.error(`${l} handled Image onClicks wrong.`)}this.emitUpdate()}buildHandlebarPayload(t,e,s){let n=[];for(let o=0;o<t;o++)n.push(foundry.utils.mergeObject({number:o,cssClass:s[o]},e));return n}_onChangeCountNumber(t){t.preventDefault();const e=t.currentTarget,s=parseInt(e.value);if(!isNaN(s)&&s>=0){switch(e.id){case"count-action":this.state.numOfActions=s;break;case"count-reaction":this.state.numOfReactions=s;break;default:console.error(`${l} incorrectly handled number of actions!`)}this.render(),this.emitUpdate()}}_getHeaderButtons(){const t=super._getHeaderButtons(),e={label:"JOURNAL.ActionShow",class:"share-image",icon:"fas fa-eye",onclick:()=>this.showPlayerHandler._handleShowPlayers(this.state)};return t.unshift(e),t}updateState(){if(this.state.classNameListActions.length<this.state.numOfActions){const t=Array.from({length:this.state.numOfActions-this.state.classNameListActions.length},()=>"symbol");this.state.classNameListActions=this.state.classNameListActions.concat(t)}else if(this.state.classNameListActions.length>this.state.numOfActions){const t=this.state.classNameListActions.length-this.state.numOfActions;this.state.classNameListActions=this.state.classNameListActions.slice(0,t)}if(this.state.classNameListReactions.length<this.state.numOfReactions){const t=Array.from({length:this.state.numOfReactions-this.state.classNameListReactions.length},()=>"symbol");this.state.classNameListReactions=this.state.classNameListReactions.concat(t)}else if(this.state.classNameListReactions.length>this.state.numOfReactions){const t=this.state.classNameListReactions.length-this.state.numOfReactions;this.state.classNameListReactions=this.state.classNameListReactions.slice(0,t)}}emitUpdate(){var t;(t=game.socket)==null||t.emit(r,{operation:"update",state:this.state,user:game.userId})}setState(t){this.state=t}}function L(i){g(i).render(!0,{id:`DisplayActions2e${i.user}`})}function f(i){var a;(a=i.userList)!=null&&a.includes(String(game.userId))&&g(i).render(!0,{id:`DisplayActions2e${i.user}`})}function w(i){f(i)}function O(i){var e,s;let a=game.modules.get(l),t=(s=(e=game.users)==null?void 0:e.find(n=>n.id===i.state.sentFromUserId))==null?void 0:s.name;t&&a.displayActions2e.forEach(n=>{(n.title.includes(t)||i.state.sentFromUserId===game.userId)&&(n.setState(i.state),n.render(!1,{id:`DisplayActions2e${i.user}`}))})}function g(i){var s,n;let a=game.modules.get(l),t=(n=(s=game.users)==null?void 0:s.find(o=>o.id===i.state.sentFromUserId))==null?void 0:n.name,e=new d(i.state);if(t){let o=a.displayActions2e.find(p=>p.title.includes(t));o?e=o:a.displayActions2e.push(e)}return e}let m,u;Hooks.once("init",()=>{console.log(`Initializing ${l}`)});Hooks.on("getSceneControlButtons",i=>{let a=i.find(t=>t.name==="token");a==null||a.tools.push({name:"DisplayActions2e.ButtonName",title:"DisplayActions2e.ButtonHint",icon:"fa fa-angle-double-right",button:!0,onClick:async()=>{var t;u.render(!0),(t=game.socket)==null||t.emit("module.DisplayActions2e",{event:"DisplayActions2e"})}})});Hooks.on("ready",()=>{var i;m=game.modules.get(l),u=new d,m.displayActions2e=[u],(i=game.socket)==null||i.on(r,a=>{switch(a.operation){case"showToAll":L(a);break;case"showToSelection":f(a);break;case"showWithPermission":w(a);break;case"update":O(a);break;default:console.log(a);break}})});
//# sourceMappingURL=module.js.map
