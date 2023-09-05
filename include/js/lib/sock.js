/******************************************
   name :  sock.js
   auth :  ELTOV
   date :  2020.11.08
   desc :  POST/GET
*******************************************/

// GET 방식처리
function setSendSocketGET(p_fnc,p_url,p_opt){
    var xhr;
    var fnc;
    if (window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if(p_opt.timeout > 0){
        xhr.timeout = p_opt.timeout;
    }

    fnc = p_fnc;

    xhr.onreadystatechange = function(){
        if (xhr.readyState != 4){
            return;
        }
        // 성공을 했다.
        if(xhr.status == 200){
            //console.log("setSendSocketGET = " + xhr.status);
            // 받은 정보를 콜백하자.
            str_ret = xhr.responseText;
            str_ret = $.trim(str_ret);
            str_ret = str_ret.replace(/\n/g,"");
            fnc("SUCC",str_ret);
        }else{  // 실패를 했다.
            fnc("FAIL","");
        }
    }

    xhr.open("GET",p_url,true);
    xhr.send();
}

// POST 방식처리
function setSendSocketPOST(p_fnc,p_url,p_opt,p_form){
    var str_ret = "";
    var xhr;
    var fnc;
    if (window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if(p_opt.timeout > 0){
        xhr.timeout = p_opt.timeout;
    }

    fnc = p_fnc;

    xhr.onreadystatechange = function(){
        if (xhr.readyState != 4){
            return;
        }
        // 성공을 했다.
        if(xhr.status == 200){
            console.log("setSendSocketPOST = " + xhr.status);
            // 받은 정보를 콜백하자.
            str_ret = xhr.responseText;
            str_ret = $.trim(str_ret);
            str_ret = str_ret.replace(/\n/g,"");
            fnc("SUCC",str_ret);
        }else{  // 실패를 했다.
            fnc("FAIL","");
        }
    }

    xhr.open("POST",p_url,true);
    xhr.send(p_form);

}

// 결과를 받는다.
function onReadSockContents(){
    var str_ret = "";
    //console.log("gl_http = " + gl_http.status);
    if (gl_http.readyState != 4){
        return;
    }
    // 성공을 했다.
    if(gl_http.status == 200){
        //console.log("onReadSockContents = " + gl_http.status);
        // 받은 정보를 콜백하자.
        str_ret = gl_http.responseText;
        str_ret = $.trim(str_ret);
        str_ret = str_ret.replace(/\n/g,"");
        gl_fnc("SUCC",str_ret);
        //  gl_http.responseText;
    }else{  // 실패를 했다.
        gl_fnc("FAIL","");
    }
}

/*
function setPostLogMsg(log_key,log_sect,log_type,log_desc){

    var formdata = new FormData();
    formdata.append("mode","INSERT");
    formdata.append("log_key",log_key);
    formdata.append("log_sect",log_sect);
    formdata.append("log_type",log_type);
    formdata.append("log_desc",log_desc);

    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.onreadystatechange = function(){
        if(xhr.readyState != 4){
            return;
        }
        if(xhr.status == 200){
            var str_ret = xhr.responseText;
            console.log("setPostLogMsg : " + str_ret);
        }
    }
    xhr.open("POST","/system/log_action.php");
    xhr.send(formdata);
}
*/