/******************************************
 name :  xml.js
 auth :  ELTOV
 date :  2020.11.08
 desc :  xml파싱처리
 *******************************************/

 var gl_xml_conf = {
    url_data:"http://13.209.62.118/user/xml/kiosk_contents.jsp?kiosk_code=KIFCW001",
//    url_route:"xml/kiosk_route.xml",
    url_route:"http://13.209.62.118/zcommonfiles/route/IFC/kiosk_route_1.1.xml",
    xml_data:new Object(),
    xml_route:new Object()
}


//////////////////////////////////////////////////////////
// 리턴할 페이지 불러오기
function setLoadDataContents(){
    var xhr;
    var str_ret = "";
    var http;

    if (window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.onreadystatechange = function(){
        if (xhr.readyState != 4){ return; }
        // 성공을 했다.
        if(xhr.status == 200){

            var xml_doc = xhr.responseXML;
            // var xml_doc = xhr.responseXML;
            /*console.log('!!!!!!', JSON.parse(xhr.responseText));
            console.log( console.log('response', xhr.response));
            console.log('xml_doc', xml_doc);*/

            var XmlNode = new DOMParser().parseFromString(xml_doc, 'text/xml');
            // console.log(xmlToJson(XmlNode);
            // var obj = xmlToJson(XmlNode).kiosk;



            onReadXmlDataContents($.xml2json(xml_doc));
        }
    }

    console.log('gl_xml_conf.url_data', gl_xml_conf);
    xhr.open("GET",gl_xml_conf.url_data,true);
    xhr.send();
}

function xmlToJson(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) {
        // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        // text
        obj = xml.nodeValue;
    }

    // do children
    // If all text nodes inside, get concatenated text from them.
    var textNodes = [].slice.call(xml.childNodes).filter(function(node) {
        return node.nodeType === 3;
    });
    if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
        obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
            return text + node.nodeValue;
        }, "");
    } else if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof obj[nodeName] == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof obj[nodeName].push == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}


function onReadXmlDataContents(p_xml_doc){
    var ret_code = "FAIL";

    console.log('p_xml_doc', p_xml_doc);
    gl_xml_conf.xml_data.header = new Object();

    gl_xml_conf.xml_data.arr_intro_bg_list = new Array(); //
    gl_xml_conf.xml_data.arr_screen_list = new Array(); //
    gl_xml_conf.xml_data.arr_notice_list = new Array(); //
    // gl_xml_conf.xml_data.arr_order_list = new Array();
    gl_xml_conf.xml_data.arr_event_list = new Array();
    gl_xml_conf.xml_data.arr_store_list = new Array();
    gl_xml_conf.xml_data.arr_fnb_store_list = new Array();
    gl_xml_conf.xml_data.arr_all_store_list= new Array();
    gl_xml_conf.xml_data.arr_pub_list = new Array();
    gl_xml_conf.xml_data.arr_map_list = new Array();
    gl_xml_conf.xml_data.arr_guide_list = new Array();






    try{
        var root_node = p_xml_doc.HEADER.KIOSK_CODE;
        if(!root_node){
            setInitSetting("FAIL DATA");
            return;
        }

        gl_xml_conf.xml_data.header = p_xml_doc.HEADER;
        gl_xml_conf.xml_data.arr_screen_list = p_xml_doc.SCREEN_LIST;
        gl_xml_conf.xml_data.arr_store_list = p_xml_doc.STORE_LIST.STORE_INFO;
        gl_xml_conf.xml_data.arr_fnb_store_list = p_xml_doc.STORE_LIST.STORE_INFO;
        gl_xml_conf.xml_data.arr_all_store_list= p_xml_doc.STORE_LIST.STORE_INFO;
        gl_xml_conf.xml_data.arr_pub_list = p_xml_doc.PUB_INFO_LIST;
        gl_xml_conf.xml_data.arr_map_list = p_xml_doc.MAP_LIST;
        gl_xml_conf.xml_data.arr_guide_list = p_xml_doc.GUIDE_LIST.GUIDE_INFO;
        ret_code = "SUCC";

    }catch(err){
        ret_code = "FAIL XML Data Error : " + err;
        console.log("XML Parse Error : " + err);
    }

    if(ret_code == "SUCC"){
        setLoadRouteContents();
    }else{
        setInitSetting(ret_code);
    }
}

function setConvNoticeOrder(){
    var n_list = gl_xml_conf.xml_data.arr_notice_list;
    var o_list = gl_xml_conf.xml_data.arr_order_list;
    var t_list = [];

    for(var i=0;i<o_list.length;i+=1){
        for(var j=0;j<n_list.length;j+=1){
            if(o_list[i] == n_list[j].ID){
                //console.log(n_list[j].FILE_URL);
                t_list.push(n_list[j]);
            }
        }
    }
    gl_xml_conf.xml_data.arr_notice_list = t_list;
}

function setLoadRouteContents(){
    var xhr;
    var m_this = this;

    if (window.XMLHttpRequest){ xhr = new XMLHttpRequest();
    }else{ xhr = new ActiveXObject("Microsoft.XMLHTTP"); }

    xhr.onreadystatechange = function(){
        if (xhr.readyState != 4){ return; }
        // 성공을 했다.
        if(xhr.status == 200){
            var xml_doc = xhr.responseXML;
            onReadXmlRouteContents($.xml2json(xml_doc));
        }else{

        }
    };
    xhr.open("GET",gl_xml_conf.url_route,true);
    xhr.send();
}

function onReadXmlRouteContents(p_xml_doc){
    var ret_code = "FAIL";
    console.log('p_xml_doc', p_xml_doc);

    gl_xml_conf.xml_route.header = new Object();
    gl_xml_conf.xml_route.arr_node_list = new Array();
    gl_xml_conf.xml_route.arr_store_list = new Array();
    gl_xml_conf.xml_route.arr_pub_list = new Array();
    gl_xml_conf.xml_route.arr_shape_list = new Array();
    gl_xml_conf.xml_route.arr_park_list = new Array();

    try{

        var root_node = p_xml_doc.HEADER;

        if(!root_node){
            setInitSetting("FAIL ROUTE");
            return;
        }

        gl_xml_conf.xml_route.header


        ret_code ="SUCC";
    }catch(err){
        ret_code = "FAIL XML ROUTE ERROR : " + err;
    }

    setInitSetting(ret_code);
}

// function setLoadContents(p_url)
function setLoadLanguage(p_url){
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState != 4){
            return;
        }
        //데이터가 확실하게 들어왔을 때 데이터 바인딩 시작
        if(xhr.status == 200) {

            var xml_doc = JSON.parse(this.response);
            // var xml_doc = this.response;
            if(typeof gl_jsop_lang_data !== 'undefined'){
                // console.log("setLoadLanguage OK");
                var json_obj = xml_doc;

                if( typeof(setInitSettingLang) == 'function'){
                    setInitSettingLang(json_obj);
                }
            }
        }else{
            console.log("fail");
        }
    }
    xhr.open("GET", p_url,true);
    xhr.send();
}
