"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[319],{7319:function(e,t,n){n.r(t);var a=n(7762),r=n(4942),s=n(1413),u=n(5671),l=n(3144),i=n(136),o=n(3668),c=n(2791),d=n(8970),h=n(6367),f=(n(4278),n(4373)),p=n(8472),m=n(8687),v=n(3513),y=n(8492),g=n.n(y),x=n(184),b=function(e){(0,i.Z)(n,e);var t=(0,o.Z)(n);function n(e){var a;(0,u.Z)(this,n),(a=t.call(this,e)).setDate=function(e,t){a.setState((0,s.Z)((0,s.Z)({},a.state),{},(0,r.Z)({},e,t.target.value)))},a.onChangeNurse=function(e){a.setState((0,s.Z)((0,s.Z)({},a.state),{},{selNurse:0,selNurseValue:e.target.value}))},a.OnSelectNurse=function(e,t){a.setState((0,s.Z)((0,s.Z)({},a.state),{},{selNurse:t.key,selNurseValue:e}))},a.onChangePatient=function(e){a.setState((0,s.Z)((0,s.Z)({},a.state),{},{selPatient:0,selPatientValue:e.target.value}))},a.onSelectPatient=function(e,t){a.setState((0,s.Z)((0,s.Z)({},a.state),{},{selPatient:t.key,selPatientValue:e}))};var l=new Date,i=l.getFullYear(),o=l.getMonth()+1>9?l.getMonth()+1:"0"+(l.getMonth()+1),c=new Date(i,o,0).getDate();return a.state={type:0,from:i+"-"+o+"-01",to:i+"-"+o+"-"+c,selNurse:0,selNurseValue:"",selPatient:0,selPatientValue:""},a}return(0,l.Z)(n,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this,t=this.props.basic,n=this.state,r=n.from,s=n.to,u=n.selNurse,l=n.selNurseValue,i=n.selPatient,o=n.selPatientValue,c=[],m=[];c.push({name:"Date",center:!0,wrap:!0,sortable:!0,selector:function(e){return e.date}},{name:"Patient",center:!0,wrap:!0,width:"20vw%",sortable:!0,selector:function(e){return e.patient}},{name:"Duty Start",center:!0,wrap:!0,width:"20vw",sortable:!0,selector:function(e){return e.duty_start}},{name:"Duty End",center:!0,wrap:!0,width:"20vw",sortable:!0,selector:function(e){return e.duty_end}},{name:"Hour",center:!0,wrap:!0,sortable:!0,selector:function(e){return e.hour}});for(var y=[],b=new Date(r);b<=new Date(s);b.setDate(b.getDate()+1)){var D=b.getFullYear()+"-"+(b.getMonth()+1>9?b.getMonth()+1:"0"+(b.getMonth()+1))+"-"+(b.getDate()>9?b.getDate():"0"+b.getDate());y.push(D)}var w=[],j=[];t.nurses.map((function(e){w[e._id]=e.name,e.name.includes(l)&&j.push({label:e.name,key:e._id})}));var k=[],Z=[];t.patients.map((function(e){k[e._id]=e.name,e.name.includes(o)&&Z.push({label:e.name,key:e._id})}));var S=[],_=0;if(t.nurses.map((function(e){if(e._id==u){var t,n=e.leave?e.leave:[],l=(0,a.Z)(n);try{for(l.s();!(t=l.n()).done;)for(var o=t.value,c=new Date(o.from),d=new Date(o.to),h=c;h<=d;){var f=h.toISOString().slice(0,10);f>=r&&f<=s&&S.push(f),h.setDate(h.getDate()+1)}}catch(p){l.e(p)}finally{l.f()}e.rota.map((function(e){if(e.date>=r&&e.date<=s)if(0==i){_+=e.hour;var t={date:e.date,patient:k[e.patient_id],duty_start:e.duty_start,duty_end:e.duty_end,hour:e.hour};m.push(t)}else if(e.patient_id==i){_+=e.hour;var n={date:e.date,patient:k[e.patient_id],duty_start:e.duty_start,duty_end:e.duty_end,hour:e.hour};m.push(n)}}))}})),0!=u){var C={date:"Total",hour:_};m.push(C)}return m.sort((function(e,t){return e.date>t.date?1:t.date>e.date?-1:0})),(0,x.jsxs)(h.L5,{children:[(0,x.jsx)("div",{className:"pt-5 text-center text-dark",children:(0,x.jsx)("h1",{className:"mt-3",children:"DAILY TIME RECORD (DTR)"})}),(0,x.jsx)(h.uZ,{children:(0,x.jsxs)(h.TK,{children:[(0,x.jsxs)("div",{className:"row lex align-items-center justify-content-center",children:[(0,x.jsx)(h.TK,{className:"autocomplete ncard",children:(0,x.jsx)(g(),{getItemValue:function(e){return e.label},items:j,inputProps:{placeholder:"Select Nurses"},renderItem:function(e,t){return(0,x.jsx)("div",{style:{background:t?"#2E86C1":"white",color:t?"white":"black",borderRadius:"1px",backgroundColor:"white",fontSize:"15px",fontFamily:"Arial"},children:e.label})},value:l,onChange:function(t){return e.onChangeNurse(t)},onSelect:function(t,n){return e.OnSelectNurse(t,n)}})}),(0,x.jsx)(h.TK,{className:"autocomplete ncard",children:(0,x.jsx)(g(),{getItemValue:function(e){return e.label},items:Z,inputProps:{placeholder:"Select Patients"},renderItem:function(e,t){return(0,x.jsx)("div",{style:{background:t?"#2E86C1":"white",color:t?"white":"black",borderRadius:"1px",backgroundColor:"white",fontSize:"15px",fontFamily:"Arial"},children:e.label})},value:o,onChange:function(t){return e.onChangePatient(t)},onSelect:function(t,n){return e.onSelectPatient(t,n)}})}),(0,x.jsx)(h.TK,{children:(0,x.jsx)(d.Z.Group,{children:(0,x.jsx)(d.Z.Control,{type:"date",value:r,max:s,onChange:function(t){return e.setDate("from",t)}})})}),(0,x.jsx)(h.TK,{children:(0,x.jsx)(d.Z.Group,{children:(0,x.jsx)(d.Z.Control,{type:"date",value:s,min:r,onChange:function(t){return e.setDate("to",t)}})})}),(0,x.jsx)(h.TK,{children:(0,x.jsxs)(p.CSVLink,{headers:[{label:"Date",key:"date"},{label:"Patient",key:"patient"},{label:"Duty Start",key:"duty_start"},{label:"Duty End",key:"duty_end"},{label:"Hour",key:"hour"}],data:m,filename:"dtr.csv",className:"btn btn-success ",target:"_blank",children:[(0,x.jsx)(f.Cb8,{}),"Export"]})})]}),(0,x.jsx)("div",{className:"p-2",children:(0,x.jsx)(v.ZP,{columns:c,data:m,striped:!0,fixedHeader:!0,fixedHeaderScrollHeight:"60vh"})})]})})]})}}]),n}(c.Component);t.default=(0,m.$j)((function(e){return{basic:e.BasicData}}),null)(b)}}]);
//# sourceMappingURL=319.b9f2a18b.chunk.js.map