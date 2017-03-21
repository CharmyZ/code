
(function (w,fun) {

    if(document.querySelectorAll){
        //ok
        return fun(w)
    }else {
        //... Error
        throw new Error('Browser does not support')
    }

})(window , function (_) {

    'use strict';

    //get dom
    _.$ = function (el) {
        if(typeof el === "string" || typeof el === "object"){
            return new Obj(typeof el === "string" ? el = document.querySelectorAll(el) : el = [el])
        }else {
            throw new Error('The selected object is wrong')
        }
    }
    function Obj(obj) {
        this.el = obj           //all dom
        this.length = obj.length
    }

    //--全局对象扩展

    //遍历
    $.each = function (arr,fun) {
        if(arr !== undefined && typeof fun === 'function'){
           for(var i=0;i<arr.length;i++) fun && fun.call(arr[i],i,arr)
        }
        return arr
    }

    //内置复用方法
    var recur = {
        eveOn : function (name,obj,fun) {
            $.each(obj.el,function(){
                this.addEventListener(name,fun,false)
            })
            return obj
        },
        //循环当前对象的el 并返回当前对象
        forEach : function (obj,fun) {
            $.each(obj.el,function (i) {
                fun && fun.call(this,i,obj.el,obj)
            })
            return obj
        },
        //判断一个字符串是否包含特定的字符串
        hasStr : function (str,key) {
            return str.match(new RegExp('(\\s|^)' + key + '(\\s|$)'))
        },
        //判断一个字符串 是什么
        ifStr : function (str) {
            if(str === undefined){
                return 0
            }else if(str.indexOf('.')>=0){
                return 1
            }else {
                return 2
            }
        },
        //ajax返回结果
        xhrBear : function (data,fun) {
            try {
                fun && fun(JSON.parse(data))
            }catch (e){
                fun && fun(data)
            }
        }
    }

    //返回一个元素所有的同级元素 并且返回位置
    // function sameLevel(This,a,Key) {
    //     var elList = [];
    //     //循环所有已经获取到的元素
    //     for(var i=0;i<This.length;i++){
    //         var nodeLen = $(This[i]).parent().children().length,next=This[i][Key];
    //         for(var x=0;x<nodeLen;x++){ //循环当前的元素
    //             //循环总的节点数 如果下一个没找到 一直往下找
    //             if(next.nodeName!="#text"){
    //                 if(a==undefined){
    //                     elList.push(next);
    //                     break;
    //                 }else if(a.substring(0,1)=="."){
    //                     //选择下一个class为参数的元素
    //                     if($(next).hasClass(a.substring(1,a.length))){
    //                         elList.push(next);
    //                         break;
    //                     }
    //                 }else {
    //                     //选择下一个标签
    //                     if(a.toUpperCase()==next.tagName){
    //                         elList.push(next);
    //                         break;
    //                     }
    //                 }
    //             }else {
    //                 next = next[Key];
    //             }
    //         }
    //     }
    //     return elList;
    // }
    
    //function
    $.extend = Obj.prototype = {
        //单个选择器
        eq:function (num) {
            if(this.length>num && typeof num === "number") return new Obj([this.el[num]])
        },
        //文字选择器
        text:function (txt) {
            var elm = new Array()
            $.each(this.el,function () {
                if(this.innerText.indexOf(txt.toString())>=0) elm.push(this)
            })
            return new Obj(elm)
        },
        //父级选择器
        parent:function (a) {
            var elm = new Array()

            $.each(this.el,function () {
                switch (recur.ifStr(a)){
                    case 0 : //空
                        elm.push(this.parentNode)
                        break
                    case 1 : //class
                        recur.hasStr(this.parentNode.className,a.substring(1,a.length)) && elm.push(this.parentNode)
                        break
                    default : //tag
                        this.parentNode.tagName == a.toUpperCase() && elm.push(this.parentNode)
                }
            })
            return new Obj(elm)
        },
        //子级选择器
        children:function (a) {
            //push
            var elm = new Array()
            //循环所有节点
            recur.forEach(this,function () {
                $.each(this.childNodes,function () {

                    if(this.nodeName !="#text"){
                        switch (recur.ifStr(a)){
                            case 0 :
                                elm.push(this)
                                break
                            case 1 :
                                recur.hasStr(this.className,a.substring(1,a.length)) && elm.push(this)
                                break
                            default :
                                a.toUpperCase() == this.tagName && elm.push(this);
                        }
                    }
                })
            })
            return new Obj(elm)
        },
        //下一个选择器
        // next:function (el) {
        //     return new Obj(sameLevel(this.el,el,'nextSibling'));
        // },
        // //上一个选择器
        // prev:function (el) {
        //     return new Obj(sameLevel(this.el,el,'previousSibling'));
        // },
        //event
        click:function (fun) {
            return recur.eveOn('click',this,fun)
        },
        focus:function (a,b) {
            recur.eveOn('blur',this,b)
            return recur.eveOn('focus',this,a)
        },
        change:function (fun) {
            return recur.eveOn('change',this,fun)
        },
        input:function (fun) {
            return recur.eveOn('input',this,fun)
        },
        scroll:function (fun) {
            return recur.eveOn('scroll',this,fun)
        },
        touch:function (a,b,c) {
            recur.eveOn('touchstart',this,a)
            recur.eveOn('touchmove',this,b)
            return recur.eveOn('touchend',this,c)
        },
        tap:function (fun) {
            return recur.forEach(this,function (i,arr,This) {
                var str=!0;
                This.touch(function () {
                    str = !0;
                },function () {
                    str = !1;
                },function () {
                    str && fun.call(this);
                })
            })
        },
        //Bind Event
        on : function (name,fun) {
            if(typeof name === 'string' && typeof fun === 'function'){
                return recur.eveOn(name,this,fun)
            }else{
                return this
            }
        },
        // Map
        each:function (fun) {
            return recur.forEach(this,function (i,arr) {
                fun && fun.call(this,i,arr)
            })
        },
        //设置元素 display 为block
        show : function () {
            return recur.forEach(this,function () {
                this.style.display = 'block'
            })
        },
        //隐藏
        hide : function () {
            return recur.forEach(this,function () {
                this.style.display = 'none'
            })
        },
        //删除元素
        remove : function () {
            return recur.forEach(this,function () {
                if(this.parentNode) this.parentNode.removeChild(this)
            })
        },
        //有没有这个class
        hasClass : function (a) {
            if(recur.hasStr(this.el[0].className,a)) return true
            else return false;
        },
        //添加class
        addClass : function (a) {
            return recur.forEach(this,function () {
                if(!recur.hasStr(this.className,a)){
                    var s
                    s = "" === this.className ? "" : " "
                    this.className = this.className + s + a
                }
            })
        },
        //删除class
        removeClass : function (a) {
            return recur.forEach(this,function () {
                this.className = this.className.replace( new RegExp( "(\\s|^)" + a + "(\\s|$)"), " " );
            })
        },

        toggleClass : function (a) {
            return recur.forEach(this,function (i,arr,obj) {
                if($(this).hasClass(a)){
                    $(this).removeClass(a)
                }else {
                    $(this).addClass(a)
                }
            })
        },

        //html 标签属性
        attr : function (key,val) {
            if(key !== undefined && val !== undefined){
                //set attr
                return recur.forEach(this,function () {
                    this.setAttribute(key,val);
                })
            }else{
                //get
                return this.el[0].getAttribute(key)
            }
        },
        //删除attr
        removeAttr : function (key) {
            return recur.forEach(this,function () {
                this.removeAttribute(key)
            })
        },
        css : function (key,val) {
            // get
            if(typeof key === "string" && val === undefined){
                return  window.getComputedStyle(this.el[0], null)[key];
            }else {
                //set
                return recur.forEach(this,function () {
                    if(typeof key === "object"){
                        for(var x in key){
                            this.style[x] = key[x]
                        }
                    }else if(typeof key === "string"){
                        this.style[key] = val;
                    }
                })
            }
        },

        //删除内联样式
        removeCss : function (key) {
            return recur.forEach(this,function () {
                if(typeof key === "string"){
                    this.style[key] = ''
                }else if(typeof key === "object"){
                    for(var i = 0; i < key.length; i++){
                        this.style[key[i]] = ''
                    }
                }
            })
        },

        //html
        html : function (val) {
            if(val === undefined){
                //get
                return this.el[0].innerHTML
            }else {
                //set
                return recur.forEach(this,function () {
                    this.innerHTML = val
                })
            }
        },
        val : function (val) {
            if(val === undefined){
                return this.el[0].value
            }else {
                return recur.forEach(this,function () {
                    this.value = val
                })
            }
        },
        //动画
        animation : function (a,time) {
            time = time || 0
            return recur.forEach(this,function () {
                var el = this
                a["transition"] = "all "+ time/1000 +"s linear"
                setTimeout(function () {
                    $(el).css(a);
                },0)
                setTimeout(function () {
                    $(el).removeCss("transition");
                },time+100)
            })
        },

        // scrollTop : function () {
        //
        // },
        //
        // scrollBottom : function () {
        //
        // },
        // scrollVisual : function () {
        //
        // }
    }

    //缺少setHeader方法
    $.get = function (url,data,fun) {
        var xhr = new XMLHttpRequest()
        url += '?'
        for(var x in data) url += x+ "=" +data[x] + "&"
        url += Math.floor(Math.random() * (99999+1 - 11111) + 11111)
        xhr.open('GET',url)
        xhr.onload = function () {
            recur.xhrBear(this.response,fun)
        }
        xhr.send()
    }

    $.post = function (url,data,fun) {
        var xhr = new XMLHttpRequest()
        xhr.open("POST",url)
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
        var t = ''
        for(var x in data){
            t += x+'='+ data[x] + '&'
        }
        xhr.onload = function () {
            recur.xhrBear(this.response,fun)
        }
        //错误没有写
        xhr.send(t);

    }
    $.base64 = function(file,fun){
        var reader = new FileReader();
        reader.onload = function(evt){
            fun&&fun(evt.target.result);
        };
        reader.readAsDataURL(file);
    }
})

