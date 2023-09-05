/******************************************
   name :  comm.js
   auth :  ELTOV
   date :  2020.11.08
   desc :  기본유틸과 구성정보들
*******************************************/

var kiosk_contents_url = "http://13.209.62.118/user/xml/kiosk_contents.jsp?kiosk_code=KIFCW001"
var kiosk_route_url = "http://13.209.62.118/zcommonfiles/route/IFC/kiosk_route_1.1.xml"

var gl_waiting_brn_code = "420";

var gl_arr_floors = new Array({
    "b_code": "IFC",
    "code": "GL",
    "name": "GL"
}, {
    "b_code": "IFC",
    "code": "L1",
    "name": "L1"
}, {
    "b_code": "IFC",
    "code": "L2",
    "name": "L2"
}, {
    "b_code": "IFC",
    "code": "IFC-Street-Shop",
    "name": "IFC Street Shop"
}, {
    "b_code": "IFC",
    "code": "L3",
    "name": "L3"
});

function getFloorName(p_floor, p_lang) {
    return p_floor;
}

function getCateName(p_cate, p_lang) {
    var lang=p_lang.toLowerCase();
    var arr_cate = new Array();
    arr_cate = p_cate.sub_cate.substring(0, 1) + p_cate.sub_cate.substring(3);
    if(p_cate.text =='S01'){
    var t_cate_name = gl_jsop_lang_data["store"]["STORE_CATE_MAIN_" + arr_cate][p_lang.toLowerCase()];

    }else if(p_cate.text =='S02'){
        var t_cate_name = gl_jsop_lang_data["food"]["STORE_CATE_MAIN_" + arr_cate][p_lang.toLowerCase()];

    }

//    for (var i = 0; i < arr_cate.length; i += 1) {
//        //console.log("arr_cate[i]",arr_cate[i])
//        if (arr_cate[i] == "") {
//            t_cate_name += "";
//        } else {
//            t_cate_name += gl_jsop_lang_data["store"]["STORE_CATE_MAIN_" + arr_cate[i]][p_lang.toLowerCase()];
//            if (i < arr_cate.length - 1) {
//                t_cate_name += ", ";
//            }
//        }
//    }
    //console.log(arr_cate);
    /*
    console.log("STORE_CATE_MAIN_"+p_cate);
    console.log(gl_jsop_lang_data["store"]["STORE_CATE_MAIN_"+p_cate][p_lang.toLowerCase()]);
    return gl_jsop_lang_data["store"]["STORE_CATE_MAIN_"+p_cate][p_lang.toLowerCase()];
    */
    return t_cate_name;
}

function getFnbCateName(p_cate, p_lang) {
    var arr_cate = new Array();
    arr_cate = p_cate.split(",");
    var t_cate_name = "";
    for (var i = 0; i < arr_cate.length; i += 1) {
        t_cate_name += gl_jsop_lang_data["food"]["FOOD_CATE_MAIN_" + arr_cate[i]][p_lang.toLowerCase()];
        if (i < arr_cate.length - 1) {
            t_cate_name += ", ";
        }
    }
    /*
    console.log("STORE_CATE_SUB_"+p_cate);
    console.log(gl_jsop_lang_data["store"]["STORE_CATE_SUB_"+p_cate][p_lang.toLowerCase()]);
    return gl_jsop_lang_data["store"]["STORE_CATE_SUB_"+p_cate][p_lang.toLowerCase()];
    */
    return t_cate_name;
}


// 널체크 
function getChkNull(p_src, p_default) {
    if (p_src == null || p_src == undefined) {
        return p_default;
    } else {
        return p_src + "";
    }
}

function getCvtXmlTag(p_src) {
    var p1 = /&amp;/gi;
    var p2 = /&lt;/gi;
    var p3 = /&gt;/gi;
    var p4 = /&quot;/gi;
    var p5 = /&apos;/gi;

    if (p_src == null || p_src == undefined) {
        return "";
    }

    p_src = p_src + "";
    p_src = p_src.replace(p1, "&");
    p_src = p_src.replace(p2, "<");
    p_src = p_src.replace(p3, ">");
    p_src = p_src.replace(p4, "\"");
    p_src = p_src.replace(p5, "\'");
    p_src = p_src.trim();
    return p_src;
}

function getCvtSearchName(p_src) {

    if (p_src == null || p_src == undefined) {
        return "";
    }
    //var p1 = / /gi;
    var p1 = /[^a-z^0-9]/gi;
    //var p1 = /[^a-z]/gi;
    p_src = p_src.toLowerCase();
    p_src = p_src.replace(p1, "");
    //p_src = p_src.trim();
    return p_src;
}

function getCvtXmlNum(p_src, p_default) {
    if (p_default == undefined) p_default = 0;
    if (p_src == null) return p_default;
    if (isNaN(p_src) == true) return p_default;
    return Number(p_src);
}

function getCvtRemoveWhite(p_src) {
    var p1 = / /gi;
    var p2 = /\t/gi;
    var p3 = /\n/gi;
    var p4 = /\r/gi;

    if (p_src == null || p_src == undefined) {
        return "";
    }

    p_src = p_src + "";
    p_src = p_src.replace(p1, "");
    p_src = p_src.replace(p2, "");
    p_src = p_src.replace(p3, "");
    p_src = p_src.replace(p4, "");
    p_src = p_src.trim();
    return p_src;
}


function getMapPosition(p_obj) {

    var ret_obj = {
        left: 0,
        top: 0
    };
    var left = p_obj.style.left;
    var top = p_obj.style.top;

    left = left.replace(/px/gi, "");
    top = top.replace(/px/gi, "");

    ret_obj.left = parseFloat(left);
    ret_obj.top = parseFloat(top);

    return ret_obj;
}


function getUrlParams(p_url) {
    var params = {};
    p_url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
        params[key] = value;
    });
    return params;
}


function getPosTransform(p_obj) {
    var i = 0;
    var ret_obj = {
        left: 0,
        top: 0,
        scale: 1,
        rotate: 0
    };
    var str_tmp = "";
    var arr_tmp = [];
    var arr_match = [];

    var str_trans = p_obj.style.transform;
    var regex = /(\w+)\((.+?)\)/g;
    var p1 = /px/gi;
    var p2 = /deg/gi;

    while (arr_match = regex.exec(str_trans)) {
        if (arr_match.length == 3) {
            if (arr_match[1] == "translate") {
                arr_tmp = arr_match[2].split(',');
                if (arr_tmp.length == 2) {
                    str_tmp = arr_tmp[0].replace(p1, "");
                    ret_obj.left = parseFloat(str_tmp);
                    str_tmp = arr_tmp[1].replace(p1, "");
                    ret_obj.top = parseFloat(str_tmp);
                }
            }
            /*
            }else if(arr_match[1] == "scale"){
                arr_tmp = arr_match[2].split(',');
                if(arr_tmp.length == 2){
                    ret_obj.scale = parseFloat(arr_tmp[0]);
                }
            }else if(arr_match[1] == "rotate"){
                str_tmp = arr_match[2].replace(p2,"");
                ret_obj.rotate = parseFloat(str_tmp);
            }
            */
        }
        i++;
        if (i >= 10) break;
    }

    return ret_obj;
}



////////////////////////////////////////////////////
// 연동

function setInitFsCommand() {
    if (window.chrome.webview) {
        window.chrome.webview.addEventListener('message', arg => {
            var str_tmp = "";
            var arr_tmp;
            if ("SENSOR" in arg.data) {
                str_tmp = arg.data.SENSOR + "";
                if (str_tmp == "ON") {
                    onClickScreenSaver();
                }
            }
        });
    }
}


function setCallWebToApp(p_cmd, p_val) {
    var str_cmd = "";
    // console.log("setCallWebToApp = " + p_cmd + " , " + p_val);
    if (window.chrome.webview) {
        str_cmd = p_cmd + " ${" + p_val + "}";
        window.chrome.webview.postMessage(str_cmd);
    }
}

function setCallWebToAppSock(p_cmd, p_val) {
    var str_cmd = "";

    //console.log("setCallWebToAppSock = " + p_cmd + " , " + p_val);

    str_cmd = p_cmd + "^" + p_val;

    var str_url = "ws://127.0.0.1:8008/echo";

    var web_sock = new WebSocket(str_url);

    web_sock.onopen = function (evt) {
        web_sock.send(str_cmd);
        web_sock.close();
    }
}


// GET 방식처리
function setSendSocketGET(p_fnc, p_url, p_opt) {
    var xhr;
    var fnc;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (p_opt.timeout > 0) {
        xhr.timeout = p_opt.timeout;
    }

    fnc = p_fnc;

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) {
            return;
        }
        // 성공을 했다.
        if (xhr.status == 200) {
            //console.log("setSendSocketGET = " + xhr.status);
            // 받은 정보를 콜백하자.
            str_ret = xhr.responseText;
            str_ret = $.trim(str_ret);
            str_ret = str_ret.replace(/\n/g, "");
            fnc("SUCC", str_ret);
        } else { // 실패를 했다.
            fnc("FAIL", "");
        }
    }

    xhr.open("GET", p_url, true);
    xhr.send();
}


// POST 방식처리
function setSendSocketPOST(p_fnc, p_url, p_opt, p_form, p_body) {
    var str_ret = "";
    var xhr;
    var fnc;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (p_opt.timeout > 0) {
        xhr.timeout = p_opt.timeout;
    }

    fnc = p_fnc;

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) {
            return;
        }
        // 성공을 했다.
        if (xhr.status == 200) {
            // 받은 정보를 콜백하자.
            str_ret = xhr.responseText;
            str_ret = $.trim(str_ret);
            str_ret = str_ret.replace(/\n/g, "");
            fnc("SUCC", str_ret);
        } else { // 실패를 했다.
            fnc("FAIL", "");
        }
    }

    xhr.open("POST", p_url, true);
    if (p_opt.type == "JSON") {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(p_body);
    } else {
        xhr.send(p_form);
    }
}

// 결과를 받는다.
function onReadSockContents() {
    var str_ret = "";
    //console.log("gl_http = " + gl_http.status);
    if (gl_http.readyState != 4) {
        return;
    }
    // 성공을 했다.
    if (gl_http.status == 200) {
        //console.log("onReadSockContents = " + gl_http.status);
        // 받은 정보를 콜백하자.
        str_ret = gl_http.responseText;
        str_ret = $.trim(str_ret);
        str_ret = str_ret.replace(/\n/g, "");
        gl_fnc("SUCC", str_ret);
        //  gl_http.responseText;
    } else { // 실패를 했다.
        gl_fnc("FAIL", "");
    }
}




function setLoadStatics(p_obj) {

    var str_url = gl_conf_header.URL_REPORT + "?kiosk_id=" + gl_conf_header.KIOSK_ID + "&kiosk_code=" + gl_conf_header.KIOSK_CODE;

    str_url += "&main_code=" + p_obj.main_code;
    str_url += "&menu_code=" + p_obj.menu_code;
    str_url += "&store_id=" + p_obj.store_id;
    str_url += "&event_id=" + p_obj.event_id;

}



$.fn.elTOVModal = function (cmd, parameters, callback) {
    var settings;
    var fnc;
    if ($.isPlainObject(parameters)) {
        settings = $.extend(true, {}, $.fn.mymodal.settings, parameters);
    } else {
        settings = $.extend({}, $.fn.mymodal.settings);
    }

    if ($.isPlainObject(callback)) {
        fnc = callback;
    }

    if (cmd.toUpperCase() == "SHOW") {
        $(this).fadeIn(settings.speed);
        $(this).children('.popup_bg').show();
        $(this).children('.modal_nor_cts').addClass('showall');

        if (settings.backclose == true) {
            $(this).children('.popup_bg').click(function (e) {
                $(this).parent().fadeOut(settings.speed);
                $(this).unbind('click');
                $(this).parent().children('.modal_nor_cts').removeClass('showall');
                $(this).parent().children('.modal_nor_cts').unbind('click');
                if (settings.onHide) {
                    settings.onHide();
                }
            });
        }
    } else if (cmd.toUpperCase() == "HIDE") {
        $(this).fadeOut(settings.speed);
        $(this).unbind('click');
        $(this).children('.modal_nor_cts').removeClass('showall');
        $(this).children('.modal_nor_cts').unbind('click');
        $(this).children('.modal_nor_bg').unbind('click');
        if (settings.onHide) {
            settings.onHide();
        }
    }
}
$.fn.elTOVModal.settings = {
    backclose: true,
    speed: 300,
    onHide: function () {},
}
