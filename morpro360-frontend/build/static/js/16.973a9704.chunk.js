(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{246:function(e,t){e.exports=function(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}},254:function(e,t,a){"use strict";var n=a(34),r=a(243),s=a(1),o=a.n(s),c=a(0),i=a.n(c),l=a(241),u=a.n(l),d=a(242),p={tag:d.q,noGutters:i.a.bool,className:i.a.string,cssModule:i.a.object,form:i.a.bool},b=function(e){var t=e.className,a=e.cssModule,s=e.noGutters,c=e.tag,i=e.form,l=Object(r.a)(e,["className","cssModule","noGutters","tag","form"]),p=Object(d.m)(u()(t,s?"no-gutters":null,i?"form-row":"row"),a);return o.a.createElement(c,Object(n.a)({},l,{className:p}))};b.propTypes=p,b.defaultProps={tag:"div"},t.a=b},255:function(e,t,a){"use strict";var n=a(34),r=a(243),s=a(246),o=a.n(s),c=a(1),i=a.n(c),l=a(0),u=a.n(l),d=a(241),p=a.n(d),b=a(242),f=u.a.oneOfType([u.a.number,u.a.string]),m=u.a.oneOfType([u.a.bool,u.a.number,u.a.string,u.a.shape({size:u.a.oneOfType([u.a.bool,u.a.number,u.a.string]),push:Object(b.h)(f,'Please use the prop "order"'),pull:Object(b.h)(f,'Please use the prop "order"'),order:f,offset:f})]),h={tag:b.q,xs:m,sm:m,md:m,lg:m,xl:m,className:u.a.string,cssModule:u.a.object,widths:u.a.array},g={tag:"div",widths:["xs","sm","md","lg","xl"]},v=function(e,t,a){return!0===a||""===a?e?"col":"col-"+t:"auto"===a?e?"col-auto":"col-"+t+"-auto":e?"col-"+a:"col-"+t+"-"+a},O=function(e){var t=e.className,a=e.cssModule,s=e.widths,c=e.tag,l=Object(r.a)(e,["className","cssModule","widths","tag"]),u=[];s.forEach(function(t,n){var r=e[t];if(delete l[t],r||""===r){var s=!n;if(o()(r)){var c,i=s?"-":"-"+t+"-",d=v(s,t,r.size);u.push(Object(b.m)(p()(((c={})[d]=r.size||""===r.size,c["order"+i+r.order]=r.order||0===r.order,c["offset"+i+r.offset]=r.offset||0===r.offset,c)),a))}else{var f=v(s,t,r);u.push(f)}}}),u.length||u.push("col");var d=Object(b.m)(p()(t,u),a);return i.a.createElement(c,Object(n.a)({},l,{className:d}))};O.propTypes=h,O.defaultProps=g,t.a=O},256:function(e,t,a){"use strict";t.a=function(e,t){var a={name:"Name cannot be blank",description:"Description cannot be blank",phone:"Phone number cannot be blank",firstName:"Fist name cannot be blank",lastName:"Last name cannot be blank",userName:"Username cannot be blank",email:"Email cannot be blank",password:"Password cannot be blank",distance:"Distance  cannot be blank",pickUpDate:"Pick Up Date cannot be blank",dropOffDate:"Drop Off Date cannot be blank",weight:"Weight cannot be blank",rate:"Rate cannot be blank",driverStatus:"Driver Status cannot be blank",productDetails:"Product Details cannot be blank",pickUpAddress:"Pick Up Address cannot be blank",pickUpCity:"Pick Up City cannot be blank",pickUpZipCode:"Pick Up Zip Code cannot be blank",pickUpState:"Pick Up State  cannot be blank",dropOffAddress:"Drop Off Address cannot be blank",dropOffCity:"Drop Off City cannot be blank",dropOffZipCode:"Drop Off Zip Code cannot be blank",dropOffState:"Drop Off State cannot be blank",status:"Status cannot be blank",offererCompanyId:"Offerer Company cannot be blank",brokerId:"Broker cannot be blank",assignedCompanyId:"Assigned Company cannot be blank",assignerUserId:"Assigned User cannot be blank",assignerDriverId:"Asigned Driver cannot be blank",state:"State cannot be blank",city:"City cannot be blank",license:"License cannot be blank",address:"Address cannot be blank",companyId:"Company cannnot be blank",driverId:"Driver cannot blank",note:"Note cannot be blank",loadId:"Load cannot be blank",MC:"MC cannot be blank",DOT:"DOT cannot be blank"},n=[],r=!0,s=!1,o=void 0;try{for(var c,i=t[Symbol.iterator]();!(r=(c=i.next()).done);r=!0){var l=c.value;e[l]||n.push(a[l])}}catch(u){s=!0,o=u}finally{try{r||null==i.return||i.return()}finally{if(s)throw o}}return 0!==n.length&&(console.log(n),n)}},260:function(e,t,a){"use strict";a.d(t,"a",function(){return m});var n=a(86),r=a(87),s=a(90),o=a(88),c=a(89),i=a(1),l=a.n(i),u=a(318),d=a(303),p=a(304),b=a(305),f=a(261),m=function(e){function t(){return Object(n.a)(this,t),Object(s.a)(this,Object(o.a)(t).apply(this,arguments))}return Object(c.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this;return l.a.createElement(u.a,{isOpen:this.props.isVisible,toggle:this.toggleSuccess,className:"modal-success "+this.props.className},l.a.createElement(d.a,{toggle:this.toggleSuccess},this.props.title),l.a.createElement(p.a,null,l.a.createElement("pre",null,this.props.errors)),l.a.createElement(b.a,null,l.a.createElement(f.a,{color:"success",onClick:function(){e.props.toggleModal(),e.props.goToDashboard()}},"OK")," "))}}]),t}(i.Component)},262:function(e,t,a){"use strict";a.d(t,"a",function(){return m});var n=a(86),r=a(87),s=a(90),o=a(88),c=a(89),i=a(1),l=a.n(i),u=a(318),d=a(303),p=a(304),b=a(305),f=a(261),m=function(e){function t(){return Object(n.a)(this,t),Object(s.a)(this,Object(o.a)(t).apply(this,arguments))}return Object(c.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return l.a.createElement(u.a,{isOpen:this.props.isVisible,toggle:this.toggleDanger,className:"modal-danger "+this.props.className},l.a.createElement(d.a,{toggle:this.toggleDanger},"Error"),l.a.createElement(p.a,null,l.a.createElement("pre",null,this.props.errors)),l.a.createElement(b.a,null,l.a.createElement(f.a,{color:"secondary",onClick:this.props.toggleModal},"CLOSE")))}}]),t}(i.Component)},269:function(e,t,a){"use strict";a.d(t,"a",function(){return u}),a.d(t,"b",function(){return p});var n=a(248),r=a.n(n),s=a(249),o=a(259),c=a.n(o),i=a(257),l=a(250);function u(e){return d.apply(this,arguments)}function d(){return(d=Object(s.a)(r.a.mark(function e(t){var a,n,s,o;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=new l.a,e.next=3,a.getUser();case 3:return n=e.sent,s=i.a.driverURL,e.next=7,c()({headers:{Authorization:n.token},method:"POST",url:s,data:t});case 7:return o=e.sent,e.abrupt("return",o);case 9:case"end":return e.stop()}},e)}))).apply(this,arguments)}function p(e){return b.apply(this,arguments)}function b(){return(b=Object(s.a)(r.a.mark(function e(t){var a,n,s,o;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=new l.a,e.next=3,a.getUser();case 3:return n=e.sent,s=i.a.companyDriversURL,s+="/"+t,e.next=8,c()({headers:{Authorization:n.token},method:"GET",url:s});case 8:return o=e.sent,e.abrupt("return",o);case 10:case"end":return e.stop()}},e)}))).apply(this,arguments)}},273:function(e,t,a){"use strict";a.d(t,"b",function(){return u}),a.d(t,"c",function(){return p}),a.d(t,"d",function(){return f}),a.d(t,"a",function(){return h});var n=a(248),r=a.n(n),s=a(249),o=a(259),c=a.n(o),i=a(257),l=a(250);function u(e){return d.apply(this,arguments)}function d(){return(d=Object(s.a)(r.a.mark(function e(t){var a,n,s,o;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=new l.a,e.next=3,a.getUser();case 3:return n=e.sent,s=i.a.bidURL,e.next=7,c()({headers:{Authorization:n.token},method:"POST",url:s,data:t});case 7:return o=e.sent,e.abrupt("return",o);case 9:case"end":return e.stop()}},e)}))).apply(this,arguments)}function p(){return b.apply(this,arguments)}function b(){return(b=Object(s.a)(r.a.mark(function e(){var t,a,n,s;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=new l.a,e.next=3,t.getUser();case 3:return a=e.sent,n=i.a.myBidsURL,e.next=7,c()({headers:{Authorization:a.token},method:"GET",url:n});case 7:return s=e.sent,e.abrupt("return",s);case 9:case"end":return e.stop()}},e)}))).apply(this,arguments)}function f(){return m.apply(this,arguments)}function m(){return(m=Object(s.a)(r.a.mark(function e(){var t,a,n,s;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=new l.a,e.next=3,t.getUser();case 3:return a=e.sent,n=i.a.winningBidsURL,e.next=7,c()({headers:{Authorization:a.token},method:"GET",url:n});case 7:return s=e.sent,e.abrupt("return",s);case 9:case"end":return e.stop()}},e)}))).apply(this,arguments)}function h(e,t){return g.apply(this,arguments)}function g(){return(g=Object(s.a)(r.a.mark(function e(t,a){var n,s,o,u;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=new l.a,e.next=3,n.getUser();case 3:return s=e.sent,o=i.a.assignBidURL,e.next=7,c()({headers:{Authorization:s.token},method:"POST",url:o,data:{bidId:t,loadId:a}});case 7:return u=e.sent,e.abrupt("return",u);case 9:case"end":return e.stop()}},e)}))).apply(this,arguments)}},276:function(e,t,a){"use strict";var n=a(34),r=a(243),s=a(245),o=a(247),c=a(1),i=a.n(c),l=a(0),u=a.n(l),d=a(241),p=a.n(d),b=a(242),f={children:u.a.node,type:u.a.string,size:u.a.string,bsSize:u.a.string,state:Object(b.h)(u.a.string,'Please use the props "valid" and "invalid" to indicate the state.'),valid:u.a.bool,invalid:u.a.bool,tag:b.q,innerRef:u.a.oneOfType([u.a.object,u.a.func,u.a.string]),static:Object(b.h)(u.a.bool,'Please use the prop "plaintext"'),plaintext:u.a.bool,addon:u.a.bool,className:u.a.string,cssModule:u.a.object},m=function(e){function t(t){var a;return(a=e.call(this,t)||this).getRef=a.getRef.bind(Object(o.a)(Object(o.a)(a))),a.focus=a.focus.bind(Object(o.a)(Object(o.a)(a))),a}Object(s.a)(t,e);var a=t.prototype;return a.getRef=function(e){this.props.innerRef&&this.props.innerRef(e),this.ref=e},a.focus=function(){this.ref&&this.ref.focus()},a.render=function(){var e=this.props,t=e.className,a=e.cssModule,s=e.type,o=e.bsSize,c=e.state,l=e.valid,u=e.invalid,d=e.tag,f=e.addon,m=e.static,h=e.plaintext,g=e.innerRef,v=Object(r.a)(e,["className","cssModule","type","bsSize","state","valid","invalid","tag","addon","static","plaintext","innerRef"]),O=["radio","checkbox"].indexOf(s)>-1,y=new RegExp("\\D","g"),k=d||("select"===s||"textarea"===s?s:"input"),j="form-control";h||m?(j+="-plaintext",k=d||"input"):"file"===s?j+="-file":O&&(j=f?null:"form-check-input"),c&&"undefined"===typeof l&&"undefined"===typeof u&&("danger"===c?u=!0:"success"===c&&(l=!0)),v.size&&y.test(v.size)&&(Object(b.s)('Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.'),o=v.size,delete v.size);var E=Object(b.m)(p()(t,u&&"is-invalid",l&&"is-valid",!!o&&"form-control-"+o,j),a);return("input"===k||d&&"function"===typeof d)&&(v.type=s),!v.children||h||m||"select"===s||"string"!==typeof k||"select"===k||(Object(b.s)('Input with a type of "'+s+'" cannot have children. Please use "value"/"defaultValue" instead.'),delete v.children),i.a.createElement(k,Object(n.a)({},v,{ref:g,className:E}))},t}(i.a.Component);m.propTypes=f,m.defaultProps={type:"text"},t.a=m},289:function(e,t){},290:function(e,t){},292:function(e,t){},293:function(e,t){},295:function(e,t,a){"use strict";a.d(t,"b",function(){return u}),a.d(t,"d",function(){return p}),a.d(t,"c",function(){return f}),a.d(t,"a",function(){return h});var n=a(248),r=a.n(n),s=a(249),o=a(259),c=a.n(o),i=a(257),l=a(250);function u(e){return d.apply(this,arguments)}function d(){return(d=Object(s.a)(r.a.mark(function e(t){var a,n;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=i.a.userURL,e.next=3,c()({method:"POST",url:a,data:t});case 3:return n=e.sent,e.abrupt("return",n);case 5:case"end":return e.stop()}},e)}))).apply(this,arguments)}function p(e){return b.apply(this,arguments)}function b(){return(b=Object(s.a)(r.a.mark(function e(t){var a,n,s,o;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=new l.a,e.next=3,a.getUser();case 3:return n=e.sent,s=i.a.userDetailsURL,s+="/"+t,console.log(s),e.next=9,c()({headers:{Authorization:n.token},method:"GET",url:s});case 9:return o=e.sent,e.abrupt("return",o);case 11:case"end":return e.stop()}},e)}))).apply(this,arguments)}function f(e){return m.apply(this,arguments)}function m(){return(m=Object(s.a)(r.a.mark(function e(t){var a,n,s,o;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=new l.a,e.next=3,a.getUser();case 3:return n=e.sent,s=i.a.allUsersURL,s+="?status="+t,e.next=8,c()({headers:{Authorization:n.token},method:"GET",url:s});case 8:return o=e.sent,console.log(o),e.abrupt("return",o);case 11:case"end":return e.stop()}},e)}))).apply(this,arguments)}function h(e){return g.apply(this,arguments)}function g(){return(g=Object(s.a)(r.a.mark(function e(t){var a,n,s,o;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=new l.a,e.next=3,a.getUser();case 3:return n=e.sent,s=i.a.activateUserURL,e.next=7,c()({headers:{Authorization:n.token},method:"POST",url:s,data:{id:t}});case 7:return o=e.sent,console.log(o),e.abrupt("return",o);case 10:case"end":return e.stop()}},e)}))).apply(this,arguments)}},296:function(e,t,a){"use strict";var n=a(34),r=a(243),s=a(1),o=a.n(s),c=a(0),i=a.n(c),l=a(241),u=a.n(l),d=a(242),p={tag:d.q,flush:i.a.bool,className:i.a.string,cssModule:i.a.object},b=function(e){var t=e.className,a=e.cssModule,s=e.tag,c=e.flush,i=Object(r.a)(e,["className","cssModule","tag","flush"]),l=Object(d.m)(u()(t,"list-group",!!c&&"list-group-flush"),a);return o.a.createElement(s,Object(n.a)({},i,{className:l}))};b.propTypes=p,b.defaultProps={tag:"ul"},t.a=b},297:function(e,t,a){"use strict";var n=a(34),r=a(243),s=a(1),o=a.n(s),c=a(0),i=a.n(c),l=a(241),u=a.n(l),d=a(242),p={tag:d.q,active:i.a.bool,disabled:i.a.bool,color:i.a.string,action:i.a.bool,className:i.a.any,cssModule:i.a.object},b=function(e){e.preventDefault()},f=function(e){var t=e.className,a=e.cssModule,s=e.tag,c=e.active,i=e.disabled,l=e.action,p=e.color,f=Object(r.a)(e,["className","cssModule","tag","active","disabled","action","color"]),m=Object(d.m)(u()(t,!!c&&"active",!!i&&"disabled",!!l&&"list-group-item-action",!!p&&"list-group-item-"+p,"list-group-item"),a);return i&&(f.onClick=b),o.a.createElement(s,Object(n.a)({},f,{className:m}))};f.propTypes=p,f.defaultProps={tag:"li"},t.a=f},313:function(e,t,a){"use strict";var n=a(34),r=a(243),s=a(1),o=a.n(s),c=a(0),i=a.n(c),l=a(241),u=a.n(l),d=a(242),p={tag:d.q,className:i.a.any,cssModule:i.a.object},b=function(e){var t=e.className,a=e.cssModule,s=e.tag,c=Object(r.a)(e,["className","cssModule","tag"]),i=Object(d.m)(u()(t,"list-group-item-heading"),a);return o.a.createElement(s,Object(n.a)({},c,{className:i}))};b.propTypes=p,b.defaultProps={tag:"h5"},t.a=b},314:function(e,t,a){"use strict";var n=a(34),r=a(243),s=a(1),o=a.n(s),c=a(0),i=a.n(c),l=a(241),u=a.n(l),d=a(242),p={tag:d.q,className:i.a.any,cssModule:i.a.object},b=function(e){var t=e.className,a=e.cssModule,s=e.tag,c=Object(r.a)(e,["className","cssModule","tag"]),i=Object(d.m)(u()(t,"list-group-item-text"),a);return o.a.createElement(s,Object(n.a)({},c,{className:i}))};b.propTypes=p,b.defaultProps={tag:"p"},t.a=b},375:function(e,t,a){"use strict";a.d(t,"a",function(){return E});var n=a(267),r=a(248),s=a.n(r),o=a(249),c=a(86),i=a(87),l=a(90),u=a(88),d=a(89),p=a(91),b=a(1),f=a.n(b),m=a(318),h=a(303),g=a(304),v=a(305),O=a(261),y=a(266),k=a.n(y),j=a(295),E=(a(256),a(273),a(269),a(286),a(260),function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).state={errors:"",isSuccessModalVisible:!1,successModalTitle:"Sucessful",modalSuccessMessage:"",loading:!1},a.handleSubmit=a.handleSubmit.bind(Object(p.a)(Object(p.a)(a))),a.toggleSuccessModal=a.toggleSuccessModal.bind(Object(p.a)(Object(p.a)(a))),a}return Object(d.a)(t,e),Object(i.a)(t,[{key:"componentWillMount",value:function(){}},{key:"toggleSuccessModal",value:function(){this.setState(function(e,t){return{isSuccessModalVisible:!e.isSuccessModalVisible}})}},{key:"handleSubmit",value:function(){var e=Object(o.a)(s.a.mark(function e(t,a){var n,r,o,c;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),this.setState({loading:!0}),e.prev=2,e.next=5,Object(j.a)(a);case 5:n=e.sent,console.log(n),r=n.data,console.log(r),this.setState({loading:!1}),r.status?(this.props.toggleModal(),"Successfully company activated",this.setState({modalSuccessMessage:"Successfully company activated",rate:"",isBidPressed:!1}),alert(this.state.modalSuccessMessage),this.props.reloadAllUsers()):(o=r.errors.join("\n"),this.setState({errors:o})),e.next=18;break;case 13:e.prev=13,e.t0=e.catch(2),console.log(e.t0),(c=e.t0.response)&&401===c.status?("Session expired, please login to continue",alert("Session expired, please login to continue"),this.userService.clearData(),this.props.history.push("/login")):("Something wrong, please try again later",alert("Something wrong, please try again later"));case 18:this.setState({loading:!1});case 19:case"end":return e.stop()}},e,this,[[2,13]])}));return function(t,a){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=this.props.userDetails,a=this.props.drivers;return console.log(t),f.a.createElement(m.a,{isOpen:this.props.isVisible,toggle:this.toggleSuccess,className:"modal-lg "+this.props.className},f.a.createElement(h.a,{toggle:this.toggleSuccess},"Name : ",t.name),f.a.createElement(g.a,null,f.a.createElement(k.a,{active:this.state.loading,styles:{spinner:function(e){return Object(n.a)({},e,{width:"250px",background:"rgba(0, 0, 0, 0.2)"})}},spinner:!0,text:""}),f.a.createElement("pre",null,"Phone : ",t.phone,f.a.createElement("br",null),"Email : ",t.email,f.a.createElement("br",null),"MC# : ",t.MC,f.a.createElement("br",null),"DOT# : ",t.DOT,f.a.createElement("br",null),"State : ",t.state,f.a.createElement("br",null),"City : ",t.city,f.a.createElement("br",null),"Address : ",t.address,f.a.createElement("br",null),"Description : ",t.description,f.a.createElement("br",null)),f.a.createElement("br",null),a.length>0?f.a.createElement("h3",null,"Drivers"):"No drivers added by this company",a.map(function(e){return f.a.createElement("div",{key:e.id},f.a.createElement("h4",null,"Name : ",e.name),f.a.createElement("p",null,"Phone : ",e.phone),f.a.createElement("p",null,"Email : ",e.email),f.a.createElement("p",null,"License Number : ",e.license),f.a.createElement("p",null,"State : ",e.state),f.a.createElement("p",null,"City : ",e.city),f.a.createElement("p",null,"Address : ",e.address))})),f.a.createElement(v.a,null,f.a.createElement(O.a,{color:"btn btn-danger",onClick:function(){e.props.toggleModal()}},"Close"),t.active?"":f.a.createElement(O.a,{color:"success",onClick:function(a){e.handleSubmit(a,t.id)}},"Activate this company")))}}]),t}(b.Component))},739:function(e,t,a){"use strict";a.r(t),a.d(t,"default",function(){return T});var n=a(267),r=a(271),s=a(248),o=a.n(s),c=a(249),i=a(86),l=a(87),u=a(90),d=a(88),p=a(89),b=a(91),f=a(1),m=a.n(f),h=a(276),g=a(254),v=a(255),O=a(264),y=a(258),k=a(265),j=a(296),E=a(297),S=a(313),x=a(314),M=a(261),w=a(266),D=a.n(w),N=a(295),U=a(250),C=(a(256),a(269)),P=(a(262),a(260),a(375)),T=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(u.a)(this,Object(d.a)(t).call(this,e))).state={users:[],isErrorModalVisible:!1,modalErrorMessage:"",isSuccessModalVisible:!1,successModalTitle:"Sucessful",modalSuccessMessage:"",isLoadDetailsModalVisible:!1,userDetails:{},drivers:[],userId:"",user:{},loading:!1,companyStatus:0},a.userService=new U.a,a.handleChange=a.handleChange.bind(Object(b.a)(Object(b.a)(a))),a.handleSubmit=a.handleSubmit.bind(Object(b.a)(Object(b.a)(a))),a.toggleDangerModal=a.toggleDangerModal.bind(Object(b.a)(Object(b.a)(a))),a.toggleSuccessModal=a.toggleSuccessModal.bind(Object(b.a)(Object(b.a)(a))),a.toggleLoadDetaildModal=a.toggleLoadDetaildModal.bind(Object(b.a)(Object(b.a)(a))),a.loadUserOrRedirect=a.loadUserOrRedirect.bind(Object(b.a)(Object(b.a)(a))),a.loadAllUsers=a.loadAllUsers.bind(Object(b.a)(Object(b.a)(a))),a.loadCompanyDrivers=a.loadCompanyDrivers.bind(Object(b.a)(Object(b.a)(a))),a}return Object(p.a)(t,e),Object(l.a)(t,[{key:"componentWillMount",value:function(){this.loadUserOrRedirect(),this.loadAllUsers()}},{key:"loadAllUsers",value:function(){var e=Object(c.a)(o.a.mark(function e(){var t,a,n;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.setState({loading:!0}),e.prev=1,e.next=4,Object(N.c)(this.state.companyStatus);case 4:t=e.sent,console.log("user data",t),a=t.data.data,this.setState({users:a}),e.next=15;break;case 10:e.prev=10,e.t0=e.catch(1),n=e.t0.response,console.log(e.t0.response),n&&401===n.status&&("Session expired, please login to continue",alert("Session expired, please login to continue"),this.userService.clearData(),this.props.history.push("/login"));case 15:this.setState({loading:!1});case 16:case"end":return e.stop()}},e,this,[[1,10]])}));return function(){return e.apply(this,arguments)}}()},{key:"loadCompanyDrivers",value:function(){var e=Object(c.a)(o.a.mark(function e(t){var a,n,r;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("id",t),this.setState({loading:!0}),e.prev=2,e.next=5,Object(C.b)(t);case 5:a=e.sent,n=a.data.data,console.log("driver data",a.data),this.setState({drivers:n,loading:!1}),e.next=16;break;case 11:e.prev=11,e.t0=e.catch(2),r=e.t0.response,console.log(e.t0.response),r&&401===r.status&&("Session expired, please login to continue",alert("Session expired, please login to continue"),this.userService.clearData(),this.props.history.push("/login"));case 16:case"end":return e.stop()}},e,this,[[2,11]])}));return function(t){return e.apply(this,arguments)}}()},{key:"loadUserOrRedirect",value:function(){var e=Object(c.a)(o.a.mark(function e(){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.userService.getUser();case 2:e.sent||this.props.history.push("/login");case 4:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"toggleDangerModal",value:function(){this.setState(function(e,t){return{isErrorModalVisible:!e.isErrorModalVisible}})}},{key:"toggleLoadDetaildModal",value:function(){this.setState(function(e,t){return{isLoadDetailsModalVisible:!e.isLoadDetailsModalVisible}})}},{key:"toggleSuccessModal",value:function(){this.setState(function(e,t){return{isSuccessModalVisible:!e.isSuccessModalVisible}})}},{key:"handleChange",value:function(e){this.setState(Object(r.a)({},e.target.name,e.target.value))}},{key:"handleSubmit",value:function(){var e=Object(c.a)(o.a.mark(function e(t){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.preventDefault();case 1:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this;return m.a.createElement("div",{className:"animated fadeIn"},m.a.createElement(D.a,{active:this.state.loading,styles:{spinner:function(e){return Object(n.a)({},e,{width:"250px",background:"rgba(0, 0, 0, 0.2)"})}},spinner:!0,text:""}),m.a.createElement(P.a,{isVisible:this.state.isLoadDetailsModalVisible,errors:this.state.loadDetailsInfo,toggleModal:this.toggleLoadDetaildModal,userDetails:this.state.user,reloadAllUsers:this.loadAllUsers,drivers:this.state.drivers}),m.a.createElement("div",{className:"row"},m.a.createElement("div",{className:"col-md-2"},m.a.createElement("h3",null,"Select status ")),m.a.createElement("div",{className:"col-md-2"},m.a.createElement(h.a,{type:"select",name:"companyStatus",id:"companyStatus",value:this.state.companyStatus,onChange:this.handleChange},m.a.createElement("option",{key:"0",value:"0"},"Inactive"),m.a.createElement("option",{key:"1",value:"1"},"Active"))),m.a.createElement("div",{className:"col-md-2"},m.a.createElement("button",{className:"btn btn-info",onClick:this.loadAllUsers},"Search companies"))),m.a.createElement("br",null),m.a.createElement(g.a,null,m.a.createElement(v.a,null,m.a.createElement(O.a,null,m.a.createElement(y.a,null,m.a.createElement("i",{className:"fa fa-align-justify"}),m.a.createElement("strong",null,"Pending Companies")),m.a.createElement(k.a,null,m.a.createElement(j.a,null,this.state.users.map(function(t){return m.a.createElement(E.a,{action:!0,key:t.id},m.a.createElement(S.a,null,t.name),m.a.createElement(x.a,{className:"row"},m.a.createElement("b",{className:"col-sm"},"Phone : ",t.phone),m.a.createElement("b",{className:"col-sm"},"Email : ",t.email),m.a.createElement("b",{className:"col-sm"},"MC# : ",t.MC),m.a.createElement("b",{className:"col-sm"},"DOT# : ",t.DOT),m.a.createElement(M.a,{className:"col-sm btn btn-info",onClick:function(){e.loadCompanyDrivers(t.id),e.toggleLoadDetaildModal(),e.setState({user:t})}},"See Details")))})))))))}}]),t}(f.Component)}}]);
//# sourceMappingURL=16.973a9704.chunk.js.map