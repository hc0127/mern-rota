"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[928],{2928:function(e,t,a){a.r(t);var n=a(2982),r=a(7762),o=a(1413),l=a(5671),s=a(3144),i=a(136),c=a(3668),u=a(2791),h=a(8687),d=a(3513),v=a(6367),m=a(4373),p=a(8472),g=a(4889),f=a(2576),y=a(8970),w=a(4845),k=a(184),b=function(e){(0,i.Z)(a,e);var t=(0,c.Z)(a);function a(e){var n;(0,l.Z)(this,a),(n=t.call(this,e)).onChangeYear=function(e){n.setState((0,o.Z)((0,o.Z)({},n.state),{},{selYear:e.target.value}))},n.onChangeMonth=function(e){n.setState((0,o.Z)((0,o.Z)({},n.state),{},{selMonth:e.target.value}))},n.onChangeDesignation=function(e){n.setState((0,o.Z)((0,o.Z)({},n.state),{},{selDesignation:e.target.value}))};var r=(new Date).getFullYear();return n.state={selYear:r,selMonth:"00",selDesignation:-1},n}return(0,s.Z)(a,[{key:"componentDidMount",value:function(){}},{key:"swap",value:function(e){var t=[];for(var a in e)t[e[a]]=a;return t}},{key:"getTotals",value:function(e,t){var a=0;return e.forEach((function(e){a+=e[t]})),a}},{key:"render",value:function(){var e=this,t=this.state,a=t.selYear,o=t.selMonth,l=t.selDesignation,s=this.props.basic,i=this.props.basic.user;i.role||0!==i.role||(w.Z.push("/"),w.Z.go("/"));var c=s.monthNames,u=this.swap(c),h=Object.keys(c),b=Object.values(c),x=h.map((function(e,t){return(0,k.jsx)("option",{value:b[t],children:e},t)})),D=[];if("00"!=o)D.push({name:"ID",center:!0,wrap:!0,width:"80px",selector:function(e){return e.code}},{name:"Name",center:!0,wrap:!0,width:"120px",selector:function(e){return e.name}},{name:"Designation",center:!0,wrap:!0,width:"120px",selector:function(e){return e.designation}},{name:"Month(d)",center:!0,wrap:!0,width:"80px",selector:function(e){return e.monthdays}},{name:"Worked(d)",center:!0,wrap:!0,width:"80px",selector:function(e){return e.workeddays}},{name:"Worked(h)",center:!0,wrap:!0,width:"80px",selector:function(e){return e.totalhoursworked}},{name:"NormalOver(h)",center:!0,wrap:!0,width:"120px",selector:function(e){return e.normalovertimehours}},{name:"HolidayOver(h)",center:!0,wrap:!0,width:"120px",selector:function(e){return e.holidayovertimehours}},{name:"GrossSalary",center:!0,wrap:!0,width:"120px",selector:function(e){return e.grosssalary}},{name:"NormalOvertime",center:!0,wrap:!0,width:"120px",selector:function(e){return e.normalovertime}},{name:"HolidayOvertime",center:!0,wrap:!0,width:"150px",selector:function(e){return e.holidayovertime}});else{D.push({name:"Nurse",center:!0,wrap:!0,selector:function(e){return e.nurse?e.nurse.toLocaleString("en"):0}}),D.push({name:"Designation",center:!0,wrap:!0,selector:function(e){return e.designation}});var j=function(e){D.push({name:e,center:!0,wrap:!0,width:"70px",cell:function(t){return(0,k.jsx)(g.Z,{placement:"top",overlay:(0,k.jsx)(f.Z,{className:"display-linebreak",style:{position:"fixed"},children:t[e+"comment"]}),children:(0,k.jsx)("p",{className:"payroll hover",children:t[e]?t[e].toLocaleString("en"):0})},t._id)}})};for(var Z in c)j(Z)}D.push({name:"Total",center:!0,wrap:!0,width:"80px",selector:function(e){return e.total}});var N=[],T=[],C=0,M=0,S=0,I=0,O=0,Y=0,F=0,_=s.holidays,A=[];_.map((function(e){var t=u[e.slice(0,2)];void 0==A[t]&&(A[t]=[]),A[t].push(a+"-"+e)}));var H=[];for(var J in u)for(var L=new Date(a,J,0).getDate(),R=new Date(a+"-"+J+"-01").getDay(),W=R=0==R?1:7-R+1;W<L;W+=7){var K=W>9?W:"0"+W,G=u[J];void 0==H[G]&&(H[G]=[]),H[G].push(a+"-"+J+"-"+K)}if(a<=(new Date).getFullYear()){s.nurses.map((function(e){var t,s=parseFloat(15*e.basic_allowances/365/8),i=parseFloat(18*e.basic_allowances/365/8);if("-1"==l||parseInt(e.level)==l){var h=e.basic_allowances+e.housing_allowances+e.other_allowances;t=parseFloat(12*h/365);var d,v="basic:"+e.basic_allowances+"\nhousing:"+e.housing_allowances+"\nother:"+e.other_allowances,m=e.leave?e.leave:[],p=[],g=(0,r.Z)(m);try{for(g.s();!(d=g.n()).done;)for(var f=d.value,y=new Date(f.from),w=new Date(f.to),k=y;k<=w;){var b=k.getFullYear(),x=k.getMonth()+1>9?k.getMonth()+1:"0"+(k.getMonth()+1),D=k.getDate()>9?k.getDate():"0"+k.getDate();if(b==a){var j=u[x];void 0==p[j]&&(p[j]=[]),p[j].push(b+"-"+x+"-"+D)}k.setDate(k.getDate()+1)}}catch(oe){g.e(oe)}finally{g.f()}var Z=e.rota,T=[],_=[],J=[],L=0;Z.map((function(e){if(e.date.startsWith(a)){var t=u[[e.date.slice(5,7)]];c[t]==o&&(J.push(e.date),L+=e.hour),void 0==T[t]?T[t]=e.hour:T[t]+=e.hour,A[t]&&A[t].includes(e.date)&&(void 0==_[t]?_[t]=e.hour:_[t]+=e.hour)}}));var R,W,K,G,E,P,B,V=[],$=[],q=[],z=[];for(var Q in c){var U=new Date(a,c[Q],0).getDate();if(c[Q]==o&&(R=U),void 0==p[Q]&&(p[Q]=[]),void 0==A[Q]&&(A[Q]=[]),void 0==H[Q]&&(H[Q]=[]),q[Q]=[].concat((0,n.Z)(p[Q]),(0,n.Z)(A[Q]),(0,n.Z)(H[Q])),q[Q]=(0,n.Z)(new Set(q[Q])),z[Q]=8*(U-q[Q].length),void 0==T[Q]&&(T[Q]=0),z[Q]<T[Q]){var X=T[Q]-z[Q],ee=0;void 0!=_[Q]&&(X<=_[Q]?(ee=X,X=0):(X-=_[Q],ee=_[Q])),V[Q]=h+parseInt(s*X+i*ee),$[Q]=v+"\novertime:"+X+"hours\nholiday overtime:"+ee+"hours",c[Q]==o&&(W=X,K=ee,E=s*X,P=i*ee,G=h,B=V[Q])}else{if(V[Q]=h,$[Q]=v,a==parseInt(e.date.slice(0,4))){var te=e.date;c[Q]<te.slice(5,7)?V[Q]=0:c[Q]==te.slice(5,7)&&(V[Q]=h-parseInt(t*parseInt(te.slice(8,10)-1)))}else a<parseInt(e.date.slice(0,4))&&(V[Q]=0);c[Q]==o&&(W=0,K=0,E=0,P=0,G=h,B=V[Q])}}var ae={};if(ae.nurse=e.name,ae.designation=0==e.level?"Registered":"Assistant","00"==o){var ne=0;for(var re in c)a==(new Date).getFullYear()?parseInt(c[re])<=(new Date).getMonth()+1?(ae[re]=V[re],ae[re+"comment"]=$[re],ne+=ae[re]):ae[re]=0:a<(new Date).getFullYear()&&(ae[re]=V[re],ae[re+"comment"]=$[re],ne+=ae[re]);ae.total=ne,N.push(ae)}else J=(0,n.Z)(new Set(J)),ae.code=e.code,ae.name=e.name,ae.designation=0==e.level?"Registered":"Assistant",ae.monthdays=R,ae.workeddays=J.length,ae.totalhoursworked=L,ae.normalovertimehours=W,ae.holidayovertimehours=K,ae.grosssalary=G,ae.normalovertime=parseInt(E),ae.holidayovertime=parseInt(P),ae.total=B,C+=J.length,M+=L,S+=W,I+=K,O+=G,Y+=parseInt(E),F+=parseInt(P),N.push(ae)}}));var E={nurse:"Total",code:"Total"};if("00"!=o)for(var P in T=[{label:"ID",key:"code"},{label:"Name",key:"name"},{label:"Designation",key:"designation"},{label:"Worked Days",key:"workeddays"},{label:"Worked Hours",key:"totalhoursworked"},{label:"NormalOver(h)",key:"normalovertimehours"},{label:"HolidayOver(h)",key:"holidayovertimehours"},{label:"GrossSalary",key:"grosssalary"},{label:"NormalOvertime",key:"normalovertime"},{label:"HolidayOvertime",key:"holidayovertime"},{label:"Total",key:"total"}],c);else for(var B in c)E[B]=this.getTotals(N,B),E.total=this.getTotals(N,"total"),T=[{label:"Nurse",key:"nurse"},{label:"Designation",key:"designation"},{label:"Jan",key:"Jan"},{label:"Feb",key:"Feb"},{label:"Mar",key:"Mar"},{label:"Apr",key:"Apr"},{label:"May",key:"May"},{label:"Jun",key:"Jun"},{label:"Jul",key:"Jul"},{label:"Aug",key:"Aug"},{label:"Sep",key:"Sep"},{label:"Oct",key:"Oct"},{label:"Nov",key:"Nov"},{label:"Dec",key:"Dec"},{label:"Total",key:"total"}]}var V={nurse:"Total",code:"Total",workeddays:C,totalhoursworked:M,normalovertimehours:S,holidayovertimehours:I,grosssalary:O,normalovertime:Y,holidayovertime:F};for(var $ in c)V[$]=this.getTotals(N,$);V.total=this.getTotals(N,"total"),N.push(V);return N.sort((function(e,t){return e.name>t.name?1:t.name>e.name?-1:0})),(0,k.jsxs)(v.L5,{children:[(0,k.jsx)("div",{className:"pt-5 text-center text-dark",children:(0,k.jsx)("h1",{className:"mt-3",children:"PAY ROLL"})}),(0,k.jsxs)(v.uZ,{className:" align-items-center justify-content-center",children:[(0,k.jsx)(v.TK,{md:"2",children:(0,k.jsxs)(y.Z.Select,{"aria-label":"select",value:l,onChange:function(t){return e.onChangeDesignation(t)},children:[(0,k.jsx)("option",{value:"-1",children:"All"}),(0,k.jsx)("option",{value:"0",children:"Registered"}),(0,k.jsx)("option",{value:"1",children:"Assistant"})]})}),(0,k.jsx)(v.TK,{md:"2",children:(0,k.jsx)(y.Z.Group,{children:(0,k.jsx)(y.Z.Control,{type:"number",value:a,placeholder:"Year",onChange:function(t){return e.onChangeYear(t)}})})}),(0,k.jsx)(v.TK,{md:"2",children:(0,k.jsxs)(y.Z.Select,{"aria-label":"select",value:o,onChange:function(t){return e.onChangeMonth(t)},children:[(0,k.jsx)("option",{value:"00",children:"Month"}),x]})}),(0,k.jsx)(v.TK,{md:"2",children:(0,k.jsxs)(p.CSVLink,{data:N,headers:T,filename:"payroll.csv",className:"btn btn-success ",target:"_blank",children:[(0,k.jsx)(m.Cb8,{}),"Export"]})})]}),(0,k.jsx)(v.uZ,{className:"mt-2",children:(0,k.jsx)(d.ZP,{columns:D,data:N,fixedHeader:!0,striped:!0,conditionalRowStyles:[{when:function(e){return"Total"==e.designation},style:function(e){return{backgroundColor:"rgb(160,160,160)"}}}],fixedHeaderScrollHeight:"60vh",pagination:!0})})]})}}]),a}(u.Component);t.default=(0,h.$j)((function(e){return{basic:e.BasicData}}),null)(b)}}]);
//# sourceMappingURL=928.f55b0ad2.chunk.js.map