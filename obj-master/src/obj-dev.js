(function(_){

    "use strict";

    //获取Dom元素（选择器）
    _.obj = function getDom(e){
        var element , obj_ ;
        "string" == typeof e ? element = document.querySelectorAll(e) : element = [e];
        obj_ = new Obj(element);
        obj_.length = element.length;
        return obj_;
    };
    function Obj(e){
        this._e = e;
    }
    //obj对象
    Obj.prototype = {
        click:function (a) {
            str.eve(this._e,'click',a);
            return this;
        },
        focus:function (a,b) {
            str.eve(this._e,'focus',a);
            str.eve(this._e,'blur',b);
            return this;
        },
        change:function (a) {
            str.eve(this._e,'change',a);
            return this;
        },
        input:function (a) {
            str.eve(this._e,'input',a);
            return this;
        },
        roll:function (a) {
            str.eve(this._e,'scroll',a);
            return this;
        },
        touch:function (a,b,c) {
            str.eve(this._e,'touchstart',a);
            str.eve(this._e,'touchmove',b);
            str.eve(this._e,'touchend',c);
            return this;
        },
        tap:function (a) {
            obj.each(this._e,function () {
                var str=!0;
                this.addEventListener('touchstart',function () {
                    str = !0;
                });
                this.addEventListener('touchmove',function () {
                    str = !1;
                });
                this.addEventListener('touchend',function () {
                    str&&a.call(this);
                });
            });
            return this;
        },
        bind:function (a,b,c) {
            str.eve(this._e,a,b,c || false);
            return this;
        },
        //子级选择器
        find:function (a) {
            var childObj = [],obj_;
            for(var i=0;i<this._e.length;i++){
                obj.each(this._e[i].childNodes,function (i) {
                    if(this.nodeName!="#text"){
                        if(a == undefined){
                            childObj.push(this);
                        }else if(a.substring(0,1) == "."){
                            obj(this).hasClass(a.substring(1,a.length)) && childObj.push(this);
                        }else {
                            a.toUpperCase() == this.tagName && childObj.push(this);
                        }
                    }
                });
            }
            obj_ = new Obj(childObj);
            obj_.length = childObj.length;
            return obj_;
        },
        //父级选择器
        parent:function (a) {
            var parentObj = new Array;
            obj.each(this._e,function () {
                if(a==undefined){
                    parentObj.push(this.parentNode)
                }else if(a.substring(0,1)=="."){ //选择所有带有参数class的父级元素
                    obj(this.parentNode).hasClass(a.substring(1,a.length)) && parentObj.push(this.parentNode)
                }else {
                    this.parentNode.tagName == a.toUpperCase() && parentObj.push(this.parentNode)
                }
            });
            return new Obj(parentObj)
        },
        //下一个选择器
        next:function (a) {
            return new Obj(str.prevNext(this._e,a,'nextSibling'));
        },
        //上一个选择器
        prev:function (a) {
            return new Obj(str.prevNext(this._e,a,'previousSibling'));
        },
        //eq选择器
        eq:function (a) {
            if(this.length > a && typeof a === "number" ){
                return new Obj([this._e[a]]);
            }
        },
        //筛选文字选择器
        hasTxt:function (txt) {
            var element = new Array();
            obj.each(this._e,function () {
                if(this.innerHTML.indexOf(txt)>=0) element.push(this);
            });
            var obj_ = new Obj(element);
            obj_.length = element.length;
            return obj_;
        },
        //有没有这个class
        hasClass:function (a) {
            if(this._e[0].className.match(new RegExp('(\\s|^)' + a + '(\\s|$)'))) return true;
            else return false;
        },
        //添加Class
        addClass:function (a) {
            obj.each(this._e,function () {
                if(!obj(this).hasClass(a))
                    (this.className=='')? this.className=a : this.className += " " + a;
            });
            return this;
        },
        //删除class
        deleteClass:function (a) {
            obj.each(this._e,function () {
                var cla = this.className.split(' ');
                for(var i=0,claNam = '';i<cla.length;i++){
                    "" != cla[i] && cla[i] != a && (claNam += cla[i]+" ");
                }
                this.className = claNam.substring(0,claNam.length-1);
            });
            return this;
        },
        //有就删除 没有就添加class
        toggleClass:function (a) {
            obj.each(this._e,function () {
                obj(this).hasClass(a) ? obj(this).deleteClass(a) : obj(this).addClass(a);
            });
            return this;
        },
        //删除元素
        delete:function () {
            obj.each(this._e,function () {
                if(this.parentNode) this.parentNode.removeChild(this);
            });
            return this;
        },
        //html
        html:function (a) {
            if(typeof a === "string"){
                str.htmlVal(this._e,'innerHTML',a);
                return this;
            }else {
                return str.htmlVal(this._e,'innerHTML');
            }
        },
        //val
        val:function (a) {
            if(typeof a === "string"){
                str.htmlVal(this._e,'value',a);
                return this;
            }else {
                return str.htmlVal(this._e,'value');
            }
        },
        //宽度
        width:function (a) {
            if(typeof a==="number"||typeof a==="string"){
                str.widHei(this._e,'width',a);
                return this;
            }else {
                return str.widHei(this._e,'width');
            }
        },
        //高度
        height:function (a) {
            if(typeof a==="number"||typeof a==="string"){
                str.widHei(this._e,'height',a);
                return this;
            }else {
                return str.widHei(this._e,'height');
            }
        },
        //css
        css:function (a,b) {
            if(typeof a==="string" && b == undefined){
                if(this._e.length==1){
                    return  window.getComputedStyle(this._e[0], null)[a];
                }else {
                    var styleList = [];
                    obj.each(this._e,function () {
                        styleList.push(window.getComputedStyle(this, null)[a])
                    });
                    return styleList;
                }
            }else {
                if(typeof a == "object"){
                    obj.each(this._e,function () {
                        for(var name in a) this.style[name]=a[name];
                    });
                }else if(typeof a == "string" && typeof b == "string"){
                    obj.each(this._e,function () {
                        this.style[a]=b;
                    });
                }
                return this;
            }
        },
        //删除内联样式
        deleteCss:function (a) {
            if(typeof a === "object"){
                obj.each(this._e,function () {
                    for (var i=0;i<a.length;i++){
                        this.style[a[i]] = '';
                    }
                });
            }else {
                for(var i=0;i<this.length;i++){
                    this._e[i].style[a]='';
                }
            }
            return this;
        },
        //标签属性
        attr:function (a,b) {
            if(typeof a == "object" && b == undefined){
                obj.each(this._e,function () {
                    for(var name in a){
                       this.setAttribute(name, a[name]);
                    }
                });
            }else if(typeof a === "string" && typeof b === "string"){
                obj.each(this._e,function () {
                    this.setAttribute(a,b);
                });
            }else {
                if(this.length==1){
                    return this._e[0].getAttribute(a);
                }else {
                    var attr = [];
                    obj.each(this._e,function () {
                        attr.push(this.getAttribute(a));
                    });
                    return attr;
                }
            }
            return this;
        },
        //遍历
        each:function (fun) {
            obj.each(this._e,function (i) {
                fun&&fun.call(this,i)
            })
            return this;
        },
        //删除标签属性
        deleteAttr:function (a) {
            obj.each(this._e,function () {
                this.removeAttribute(a);
            });
            return this;
        },
        //动画
        animation:function (a,b) {
            var _time = b || 0;
            obj.each(this._e,function () {
                var This = this;
                a["transition"] = "all "+_time/1000+"s linear";
                setTimeout(function () { obj(This).css(a); },0);
                setTimeout(function () {
                    obj(This).deleteCss("transition");
                },_time+100);
            });
            return this;
        },
        //隐藏元素
        hide:function () {
            str.hideShow(this._e,'none');
            return this;
        },
        //显示元素
        show:function () {
            str.hideShow(this._e,'block');
            return this;
        },
        //添加元素
        addHtml:function (a) {
            var tagNmae,elm = new Array;
            //返回标签名
            obj.each(this._e,function () {
                if(!/<[^>]+>/g.test(a)){
                    //纯文本 直接添加文本节点
                    this.appendChild(document.createTextNode(a));
                }else {
                    //创建标签节点
                    tagNmae = document.createElement(a.match(/<(\S*?)[^>]*>/i)[0].match(/[a-zA-Z]+/i)[0]);
                    tagNmae.innerHTML = a.match(/<([a-zA-Z\d]+)[\s\S]*?>([\s\S]*?)<\/\1>/)[2];
                    //获取到所有的标签属性
                    obj.each(a.substring(a.indexOf(' ')+1,a.indexOf('>')).split("' "),function () {
                        obj(tagNmae).attr(this.substring(0,this.indexOf('=')),this.substring(this.indexOf('=')+2,this.length).replace("'",''));
                    });
                    this.appendChild(tagNmae);
                    elm.push(tagNmae);
                }
            });
            return new Obj(elm);
        },
        //滚动条上方事件
        rollTop:function (a,b) {
            var el = this._e[0];
            if(a==undefined && b ==undefined){
                //输出滚动条高度
                if(el==document){
                    return document.body.scrollTop || document.documentElement.scrollTop;
                }else {
                    return el.scrollTop;
                }
            }else {
                if(typeof a === "number" || typeof a ==="string"){
                    if(b==undefined){
                        //设置滚动条
                        if(el==document){
                            setTimeout(function () {
                                document.body.scrollTop = parseInt(a);
                                document.documentElement.scrollTop = parseInt(a);
                            },0);
                        }else {
                            el.scrollTop = parseInt(a);
                        }
                    }
                }else{
                    var scroll,scrollTop;
                    if(typeof a== "function" && b == undefined){
                        scroll = 0;
                    }else if(typeof a == "function" && (typeof b == "number" || typeof b == "string")){
                        scroll = parseInt(b);
                    }
                    //滚动到顶部执行方法
                    obj(el).bind("scroll",function () {
                        if(el==document){
                            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                        }else {
                            scrollTop = el.scrollTop;
                        }
                        scroll >= scrollTop && a.call(this);
                    });
                }
                return this;
            }
        },
        //滚动到底部事件
        rollBottom:function (a,b) {
            var el = this._e[0],scrollTop,clientHeight,scrollHeight;
            rollInt();
            function rollInt() {
                if(el==document){
                    scrollTop = document.body.scrollTop;
                    clientHeight = document.documentElement.clientHeight;
                    scrollHeight = document.body.scrollHeight;
                }else {
                    scrollTop = el.scrollTop;
                    clientHeight = el.clientHeight;
                    scrollHeight = el.scrollHeight;
                }
            }
            if(a == undefined && b == undefined){
                //输出到底部的距离
                return scrollHeight - (clientHeight+scrollTop);
            }else {
                obj(el).roll(function () {
                    rollInt();
                    if(typeof a == "function" && b == undefined){
                        //到底部执行方法
                        if(scrollTop + clientHeight == scrollHeight){
                            a.call(this);
                        }
                    }else if(typeof a == "function" && (typeof b == "number" || typeof b == "string")){
                        //距离底部多久之后开始触发
                        if(scrollHeight - (clientHeight+scrollTop)<=parseInt(b)){
                            a.call(this);
                        }
                    }
                });
                return this;
            }
        },
        //滚动到可视区域
        rollVisual:function (fun,a) {
            var objArr = [] , objTop ,rollTop, winHei  = window.innerHeight;
            //先把集合换成一个普普通通的数组
            obj.each(this._e,function () {
                objArr.push(this);
            });
            //监听滚动事件
            obj(document).roll(function () {
                rollTop = obj(document).rollTop();  //滚动条高度
                for(var i = 0 ; i < objArr.length; i++){  //遍历集合元素
                    objTop  = objArr[i].offsetTop;              //元素高度
                    if (objTop >= rollTop && objTop < (rollTop + winHei)) {
                        fun.call(objArr[i]);//回调
                        a||objArr.splice(i,1); //如果是false 那么删除他 只执行一次
                    }
                }
            });
            //每次窗口大小改变的时候更新窗口大小
            window.addEventListener('resize',function () {
                winHei = window.innerHeight;
            },false);
        }
    };
    //复用方法
    var str = new Str();
    function Str() {
        //显示隐藏
        this.hideShow=function (This,txt) {
            for(var e=0;e < This.length;e++){
                This[e].style.display = txt;
            }
        };
        this.eve = function (This, eve, fun,stat) {
            for(var i=0;i< This.length; i++){
                This[i].addEventListener(eve,fun,stat || false);
            }
        };
        //上一个下一个选择器
        this.prevNext=function (This,a,Key) {
            var nextObjList = new Array;
            //循环所有已经获取到的元素
            for(var i=0;i<This.length;i++){
                var nodeLen = obj(This[i]).parent().find().length,next=This[i][Key];
                for(var x=0;x<nodeLen;x++){ //循环当前的元素
                    //循环总的节点数 如果下一个没找到 一直往下找
                    if(next.nodeName!="#text"){
                        if(a==undefined){
                            nextObjList.push(next);
                            break;
                        }else if(a.substring(0,1)=="."){
                            //选择下一个class为参数的元素
                            if(obj(next).hasClass(a.substring(1,a.length))){
                                nextObjList.push(next);
                                break;
                            }
                        }else {
                            //选择下一个标签
                            if(a.toUpperCase()==next.tagName){
                                nextObjList.push(next);
                                break;
                            }
                        }
                    }else {
                        next = next[Key];
                    }
                }
            }
            return nextObjList;
        };
        //宽高
        this.widHei=function (This,key,a) {
            if(a!=undefined){
                obj.each(This,function () {
                    this.style[key] = parseInt(a)+'px';
                });
            }else {
                if(This.length==1){
                    return parseInt(obj(This[0]).css(key));
                }else {
                    for(var i=0,widHeiList=[];i<This.length;i++){
                        widHeiList.push(parseInt(obj(This[i]).css(key)))
                    }
                    return widHeiList;
                }
            }
        };
        //html value
        this.htmlVal=function (This, key, a) {
            if(a!=undefined){
                obj.each(This,function () {
                    this[key]=a;
                });
            }else {
                if(This.length==1){
                    return This[0][key];
                }else {
                    for(var i=0,html=[];i<This.length;i++){
                        html.push(This[i][key])
                    }
                    return html;
                }
            }
        };
        //ajax返回
        this.ajaxBear=function (data,fun) {
            try {
                fun && fun(JSON.parse(data))
            }catch (e){
                fun && fun(data)
            }
        }
    }
    //Get请求
    obj.get = function (url,data,fun) {
        url += '?'
        for(var x in data) url += x+"="+data[x]+"&"
        //添加随机数
        url += Math.floor(Math.random() * (99999+1 - 11111) + 11111)
        var ajax = new XMLHttpRequest();
        ajax.open("GET",url,true);
        //请求完成
        ajax.onload = function () {
            str.ajaxBear(this.responseText,fun)
        }
        ajax.send();
    }
    //Post请求
    obj.post = function (url,data,fun) {
        var ajax = new XMLHttpRequest(),par = '';
        ajax.open("POST",url,true);
        ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        for(var x in data) par += x+"="+data[x]+"&"
        ajax.onload = function () {
            str.ajaxBear(this.responseText,fun)
        }
        ajax.send(par);
    }
    //遍历方法
    obj.each = function (el,fun) {
        for(var e=0,len = el.length;e<len;e++) fun&&fun.call(el[e],e)
    };
    //转换成base64编码
    obj.base64 = function (file,fun) {
        var reader = new FileReader();
        reader.onload = function(evt){
            fun&&fun(evt.target.result);
        };
        reader.readAsDataURL(file);
    };
})(window);