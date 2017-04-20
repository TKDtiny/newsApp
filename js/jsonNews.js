/**
 * Created by TKD Tiny on 2017/3/10.
 */
var main = document.getElementsByTagName("article")[0];
var navList = document.getElementsByClassName("navList")[0];
var rMain = document.getElementsByClassName("rBox")[0],
    rContent = document.getElementsByClassName("articleContent")[0];
window.onload = function () {
    navListLoad();
    navListBtn();
    articleCilck();
    rBoxReturn();
    footerOnClick();
    loginHeadClick();
}
/*navList加载事件*/
function navListLoad(){
    getJSON("nav",function(category,content){
        var obj = {};
        var str = "";
        obj = content[category];
        for(var i = 0;i < 12;i++){
            str += obj[i];
        }
        navList.innerHTML = str;
        firstAClick();
        navBtnClick();
    });
}
/*导航条加载完成后再进行第一次的自动点击*/
function firstAClick(){
    var firstA = navList.getElementsByTagName("a")[0];
    firstA.click();
}

/*navList点击事件代理*/
function navListBtn() {
    navList.onclick = function (e) {
        var thisHash = e.target.hash;
        var aList= this.getElementsByTagName("a");
        for(var i = 0; i < aList.length;i++){
            if(aList[i].className == "selectedBtn"){
                aList[i].classList.remove("selectedBtn");
            }
        }
        e.target.classList.add("selectedBtn");
        var hash = thisHash.slice(1);
        getJSON(hash,function(category,content){
            var obj = {};
            var str = "";
            for(x in content){
                if (x == category){
                    if(x != "sunWideScreen" && x != "nav"){
                        obj = content[x];
                        for( y in obj){
                            str += "<div title='"+y+"'><h1>"+obj[y].title+"</h1>"+"<ul><li><img src='"+obj[y].imgList[0]+"'></li><li><img src='"+obj[y].imgList[1]+"'></li><li><img src='"+obj[y].imgList[2]+"'></li></ul>"+"</div>";
                        }
                    }else if(x == "sunWideScreen"){
                        obj = content[x];
                        for( y in obj){
                            str += "<div class='videoBox' title='"+y+"'><img src='"+obj[y].imgList+"'><span>"+obj[y].title+"</span><i class='playIcon'></i></div>"
                        }
                    }
                }
            }
            main.innerHTML = str;
            main.title = category;
        });
    }
}
/*article点击事件代理*/
function articleCilck() {
    main.onclick = function (e) {
        rContent.scrollTop = 0;
        var thisTitle = this.title;
        var thisNewsTitle = e.target;
        while(thisNewsTitle.tagName != "DIV"){
            thisNewsTitle = thisNewsTitle.parentElement;
        }
        thisNewsTitle = thisNewsTitle.title;
        getJSON(thisTitle,function(category,content){
            var obj = content[category],
                contentObj = obj.content;
            var str = "";
            if(/^video\d*$/.test(category) == false){
                str += "<div class='newsContent'><h1>"+obj.title+"</h1>"
                for(var i = 0;i < contentObj.length;i++){
                    str += "<img src='"+contentObj[i].imgUrl+"' title='"+obj.title+"'><p>"+contentObj[i].describe+"</p>";
                }
            }else if(/^video\d*$/.test(category) == true){
                str += "<h1>"+obj.title+"</h1><div><video src='"+obj.video+"'></video></div>"
            }
            str += "</div>"
            rMain.classList.add("showRBox");
            rContent.innerHTML = str;
            followLoad();
            contentMaskCilck();
        },thisNewsTitle);
    }
}
function getJSON(category,callBack,subscript) {
    subscript = subscript || "";
    var content = "";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange =  function () {
        if(xhr.readyState == 4){
            if (xhr.status == 200) {
                content = JSON.parse(xhr.responseText);
                if(subscript != ""){
                    content = content[category];
                    category = subscript;
                    callBack(category,content);
                }else{
                    callBack(category,content);
                }
            }
        }
    }
    xhr.open("GET","json/news.json",true);
    xhr.send(null);
}
/*文档加载完后 加载更多遮罩层以及评论区的加载*/
function followLoad(){
    var newsContent = document.getElementsByClassName("newsContent")[0];
    if(newsContent.offsetHeight > 680){
        newsContent.classList.add("newsContentMask");
        rContent.innerHTML += "<div class='contentMask'>点击查看更多内容<mark>&gt;</mark></div>"
    }
    rContent.innerHTML += "<div class='comment'><h3>热门评论</h3><p><i>某知名源</i><span>听说某源很厉害</span></p><p><i>某知名作</i><span>听说某作很厉害</span></p></div>"
}

/*返回按钮点击事件*/
function rBoxReturn(){
    var head = document.getElementsByClassName("head")[0],
        headI = head.getElementsByTagName("i")[0];
    headI.onclick = function(e){
        rMain.classList.remove("showRBox");
    }
}

/*显示跟多按钮事件*/
function contentMaskCilck(){
    var contentMask = document.getElementsByClassName("contentMask")[0];
    var newsContent = document.getElementsByClassName("newsContent")[0];
    contentMask.onclick = function(){
        newsContent.classList.remove("newsContentMask");
        contentMask.style.display = "none";
    }
}
/*navBtn点击事件*/
function navBtnClick(){
    var navBtn = document.getElementsByClassName("navBtn")[0];
    navBtn.onclick = function(){
    var liList = navList.getElementsByTagName("li"),
        liList_len = liList.length;
        var str = "<span class='delChannel'>点击添加以下频道</span><div class='navBottomA'>",
            str1 = "<span class='delChannel'>点击删除以下频道</span><div class='navTopA'>"+navList.innerHTML+"</div>";
        getJSON("nav",function(category,content){
            var navTotal = content[category];
            var arr = navTotal;
            for(var i = 0; i < liList_len;i++){
                for(var j = 0;j < navTotal.length;j++){
                    if(navTotal[j].replace(/[^\u3000-\u9FFF]*/g,'') == liList[i].textContent.toString()){
                        arr.splice(j,1);
                    }
                }
            }
            for(var x = 0; x < arr.length;x++){
                str += arr[x];
            }
            str += "</div>"
            rMain.classList.add("showRBox");
            rContent.innerHTML = str1+str;
            var aList = document.getElementsByClassName("navTopA")[0].getElementsByTagName("a");
            for(var k = 0;k < aList.length;k++){
                aList[k].removeAttribute("class");
            }
            delChannelClick();
        });
    }
}

/*导航条的删减操作*/
function delChannelClick(){
    var navTop = document.getElementsByClassName("navTopA")[0],
        navBottom = document.getElementsByClassName("navBottomA")[0];
    navTop.onclick = function(e){
        var eName = e.target;
        while(eName.tagName != "LI"){
            eName = eName.parentElement;
        }
        navTop.removeChild(eName);
        navBottom.appendChild(eName);
        navList.innerHTML = navTop.innerHTML;
    }
    navBottom.onclick = function(e){
        var eName = e.target;
        while(eName.tagName != "LI"){
            eName = eName.parentElement;
        }
        navBottom.removeChild(eName);
        navTop.appendChild(eName);
        navList.innerHTML = navTop.innerHTML;
    }
}

/*footer的点击事件*/
function footerOnClick(){
    var footer = document.getElementsByTagName("footer")[0],
        ftDiv = footer.getElementsByTagName("div");
    var followContent = document.getElementsByClassName("followContent")[0],
        loginContent = document.getElementsByClassName("loginContent")[0];
    footer.onclick = function(e){
        for(var i = 0;i < ftDiv.length;i++){
            if(/imgBottom/g.test(ftDiv[i].getElementsByTagName("i")[0].className)){
                ftDiv[i].getElementsByTagName("i")[0].classList.remove("imgBottom");
                ftDiv[i].style.color = "black";
            }
        }
        var etarName = e.target;
        while(etarName.tagName != "DIV"){
            etarName = etarName.parentElement;
        }
        if(etarName.className == "home"){
            etarName.getElementsByTagName("i")[0].classList.add("imgBottom");
            etarName.style.color = "#d43d3d";
            
            loginContent.style.display = "none";
            followContent.style.display = "none";
        }else if(etarName.className == "follow"){
            etarName.getElementsByTagName("i")[0].classList.add("imgBottom");
            etarName.style.color = "#d43d3d";
            
            followContent.style.display = "block";
            loginContent.style.display = "none";
        }else if(etarName.className == "login"){
            etarName.getElementsByTagName("i")[0].classList.add("imgBottom");
            etarName.style.color = "#d43d3d";
            
            loginContent.style.display = "block";
            followContent.style.display = "none";
        }
    }
}

/*登录层弹出事件*/
function loginHeadClick(){
    var loginHead = document.getElementsByClassName("loginHead")[0],
        tBox = document.getElementsByClassName("tBox")[0],
        closeBtn = document.getElementsByClassName("closeBtn")[0];
    loginHead.onclick = function(){
        tBox.classList.add("showTBox");
        loginOnCilck();
    }
    closeBtn.onclick = function(){
        tBox.classList.remove("showTBox");
    }
}


function loginOnCilck(){
    var lrBtn = document.getElementsByClassName("lrBtn")[0],
        tBox = document.getElementsByClassName("tBox")[0],
        userName = document.getElementsByClassName("userName")[0],
        userPwd = document.getElementsByClassName("userPwd")[0];
    var closeBtn = document.getElementsByClassName("closeBtn")[0];
    var login = document.getElementsByClassName("login")[0];
    lrBtn.onclick = function(){
        var info = {
            name:userName.value,
            pwd:userPwd.value
        };
        var user = JSON.parse(localStorage.getItem("userInfo"));
        if(/^\d{11}$/g.test(userName.value)){
            if(user == null){
                var userInfo = [];
                userInfo.push(info);
                localStorage.setItem("userInfo",JSON.stringify(userInfo));
            }else{
                var user_len = user.length;
                for(let i = 0;i<user_len;i++){
                    if(user[i].name == info.name){
                        if(user[i].pwd == info.pwd){
                            closeBtn.click();
                            login.innerHTML = "我的<i class='loginImg imgBottom'></i>";
                        }else{
                            tBox.getElementsByTagName("span")[1].textContent = "手机号或密码不正确";
                        }
                    }else{
                        user.push(info);
                        localStorage.setItem("userInfo",JSON.stringify(user));
                        closeBtn.click();
                        login.innerHTML = "我的<i class='loginImg imgBottom'></i>";
                    }
                }
            }
        }else{
            tBox.getElementsByTagName("span")[0].textContent = "请输入正确的手机号";
        } 
    }
}