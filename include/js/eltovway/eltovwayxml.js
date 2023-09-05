/******************************************
   name :  editorxml.js
   auth :  ELTOV
   date :  2021.08.04
   desc :  설정데이터 처리
*******************************************/



class EltovLoader{

    constructor(){

    }

    //////////////////////////////////////////////////////////////
    // 리턴할 페이지 불러오기
    setLoadDataContents(p_url,p_fnc){
        console.log("setLoadDataContents()");

        var xml_http;

        var m_this = this;

        if (window.XMLHttpRequest){
            xml_http = new XMLHttpRequest();
        }else{
            xml_http = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xml_http.open("GET",p_url,true);
        xml_http.onreadystatechange = function(){
            m_this.onReadXmlDataContents(this,p_fnc);
        };
        xml_http.send();
    }

    onReadXmlDataContents(p_xml_http,p_fnc){
        console.log("onReadXmlDataContents()");

        
        var ret_code = "SUCC";

        var xml_obj = new Object();
        xml_obj.header = new Object();
        xml_obj.arr_store_orig_list = new Array();
        xml_obj.arr_store_list = new Array();
        xml_obj.arr_pub_icon_list = new Array();
        xml_obj.arr_map_list = new Array();

        if (p_xml_http.readyState != 4){
            return;
        }
        if(p_xml_http.status != 200){
            p_fnc("FAIL Load Data Url",xml_obj);
            return;
        }

        try{

            var xml_doc = p_xml_http.responseXML;
            var root_node = xml_doc.getElementsByTagName("KIOSK")[0];
            if(!root_node){
                p_fnc("FAIL Load Data Xml",xml_obj);
                return;
            }

            var i = 0;
            var str_tmp = "";
            var child1 = root_node.firstChild;
            var child2;
            var child3;

            while(child1 != null && child1.nodeType != 4){

                if(child1.nodeType == 1){

                    if(child1.nodeName == "HEADER"){

                        child2 = child1.firstChild;
                        while(child2 != null && child2.nodeType != 4){
                            if(child2.nodeName == "RET_CODE"){
                                //ret_code = this.getCvtXmlTag(child2.childNodes[0].nodeValue);
                            }
                            if(child2.nodeName == "KIOSK_FLOOR"){
                                if(child2.childNodes[0]) xml_obj.header[child2.nodeName] = child2.childNodes[0].nodeValue;
                                xml_obj.header.B_CODE = this.getCvtXmlTag(child2.getAttribute("b_code"));
                                xml_obj.header.POS_X = this.getCvtXmlNum(child2.getAttribute("pos_x"),0);
                                xml_obj.header.POS_Y = this.getCvtXmlNum(child2.getAttribute("pos_y"),0);
                            }
                            if(child2.nodeName == "MAP_RESOLUTION"){
                                xml_obj.header.MAP_WIDTH = this.getCvtXmlNum(child2.getAttribute("width"),1000);
                                xml_obj.header.MAP_HEIGHT = this.getCvtXmlNum(child2.getAttribute("height"),1000);
                            }
                            if(child2.nodeName == "PUB_ICON_RESOLUTION"){
                                xml_obj.header.PUB_ICON_WIDTH = this.getCvtXmlNum(child2.getAttribute("width"),50);
                                xml_obj.header.PUB_ICON_HEIGHT = this.getCvtXmlNum(child2.getAttribute("height"),50);
                            }

                            xml_obj.header.KIOSK_FLOOR = this.getCvtXmlTag(xml_obj.header.KIOSK_FLOOR);
                            xml_obj.header.B_CODE = this.getCvtXmlTag(xml_obj.header.B_CODE);
                            if(xml_obj.header.B_CODE == "") xml_obj.header.B_CODE = "IFC";
                            xml_obj.header.POS_X = this.getCvtXmlNum(xml_obj.header.POS_X,0);
                            xml_obj.header.POS_Y = this.getCvtXmlNum(xml_obj.header.POS_Y,0);

                            xml_obj.header.POS_ORIG_X = xml_obj.header.POS_X;
                            xml_obj.header.POS_ORIG_Y = xml_obj.header.POS_Y;


                            xml_obj.header.MAP_WIDTH = this.getCvtXmlNum(xml_obj.header.MAP_WIDTH,1000);
                            xml_obj.header.MAP_HEIGHT = this.getCvtXmlNum(xml_obj.header.MAP_HEIGHT,1000);

                            xml_obj.header.PUB_ICON_WIDTH = this.getCvtXmlNum(xml_obj.header.PUB_ICON_WIDTH,50);
                            xml_obj.header.PUB_ICON_HEIGHT = this.getCvtXmlNum(xml_obj.header.PUB_ICON_HEIGHT,50);

                            child2 = child2.nextSibling;
                        }

                    }else if(child1.nodeName == "STORE_LIST"){

                        child2 = child1.firstChild;

                        while(child2 != null && child2.nodeType != 4){
                            if(child2.nodeName == "STORE_INFO"){
                                child3 = child2.firstChild;

                                var CObj = new Object();
                                CObj.ID = this.getCvtXmlTag(child2.getAttribute("id"));
                                CObj.DP_TYPE = this.getCvtXmlTag(child2.getAttribute("dp_type"));
                                CObj.SEARCH_TYPE = this.getCvtXmlTag(child2.getAttribute("search_type"));
                                CObj.CLICK = this.getCvtXmlTag(child2.getAttribute("click"));

                                while(child3 != null && child3.nodeType != 4){

                                    if(child3.nodeName == "CATE_CODE"){
                                        if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                        CObj.SUB_CATE = this.getCvtXmlTag(child3.getAttribute("sub_cate"));
                                    }

                                    if(child3.nodeName == "STORE_NAME_KOR") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_NAME_ENG") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_NAME_CHN") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_NAME_JPN") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;

                                    if(child3.nodeName == "STORE_DESC_KOR") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_DESC_ENG") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_DESC_CHN") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_DESC_JPN") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;

                                    if(child3.nodeName == "STORE_SERVICETIME") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_PHONE") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;

                                    if(child3.nodeName == "STORE_LOGO_URL") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_SUB01_URL") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_SUB02_URL") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_SUB03_URL") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_THUMBNAIL_URL") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;

                                    if(child3.nodeName == "STORE_FLOOR"){
                                        if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                        CObj.B_CODE = this.getCvtXmlTag(child3.getAttribute("b_code"));
                                    }

                                    child3 = child3.nextSibling;
                                }

                                CObj.ID = this.getCvtXmlTag(CObj.ID);
                                CObj.DP_TYPE = this.getCvtXmlTag(CObj.DP_TYPE);
                                CObj.SEARCH_TYPE = this.getCvtXmlTag(CObj.SEARCH_TYPE);
                                CObj.CLICK = this.getCvtXmlTag(CObj.CLICK);

                                CObj.CATE_CODE = this.getCvtXmlTag(CObj.CATE_CODE);

                                CObj.STORE_NAME_KOR = this.getCvtXmlTag(CObj.STORE_NAME_KOR);
                                CObj.STORE_NAME_ENG = this.getCvtXmlTag(CObj.STORE_NAME_ENG);
                                CObj.STORE_NAME_CHN = this.getCvtXmlTag(CObj.STORE_NAME_CHN);
                                CObj.STORE_NAME_JPN = this.getCvtXmlTag(CObj.STORE_NAME_JPN);

                                CObj.STORE_NAME_KOR_POT = this.getCvtXmlTag(CObj.STORE_NAME_KOR_POT);
                                CObj.STORE_NAME_ENG_POT = this.getCvtXmlTag(CObj.STORE_NAME_ENG_POT);
                                CObj.STORE_NAME_CHN_POT = this.getCvtXmlTag(CObj.STORE_NAME_CHN_POT);
                                CObj.STORE_NAME_JPN_POT = this.getCvtXmlTag(CObj.STORE_NAME_JPN_POT);

                                if(CObj.STORE_NAME_KOR_POT == "") CObj.STORE_NAME_KOR_POT = CObj.STORE_NAME_KOR;
                                if(CObj.STORE_NAME_ENG_POT == "") CObj.STORE_NAME_ENG_POT = CObj.STORE_NAME_ENG;
                                if(CObj.STORE_NAME_CHN_POT == "") CObj.STORE_NAME_CHN_POT = CObj.STORE_NAME_CHN;
                                if(CObj.STORE_NAME_JPN_POT == "") CObj.STORE_NAME_JPN_POT = CObj.STORE_NAME_JPN;

                                CObj.STORE_DESC_KOR = this.getCvtXmlTag(CObj.STORE_DESC_KOR);
                                CObj.STORE_DESC_ENG = this.getCvtXmlTag(CObj.STORE_DESC_ENG);
                                CObj.STORE_DESC_CHN = this.getCvtXmlTag(CObj.STORE_DESC_CHN);
                                CObj.STORE_DESC_JPN = this.getCvtXmlTag(CObj.STORE_DESC_JPN);

                                CObj.STORE_PHONE = this.getCvtXmlTag(CObj.STORE_PHONE);
                                CObj.STORE_SERVICETIME = this.getCvtXmlTag(CObj.STORE_SERVICETIME);

                                CObj.STORE_FLOOR = this.getCvtXmlTag(CObj.STORE_FLOOR);
                                CObj.B_CODE = this.getCvtXmlTag(CObj.B_CODE);
                                if(CObj.B_CODE == "") CObj.B_CODE = "IFC";

                                CObj.STORE_LOGO_URL = this.getCvtXmlTag(CObj.STORE_LOGO_URL);
                                CObj.STORE_SUB01_URL = this.getCvtXmlTag(CObj.STORE_SUB01_URL);
                                CObj.STORE_SUB02_URL = this.getCvtXmlTag(CObj.STORE_SUB02_URL);
                                CObj.STORE_SUB03_URL = this.getCvtXmlTag(CObj.STORE_SUB03_URL);
                                CObj.STORE_THUMBNAIL_URL = this.getCvtXmlTag(CObj.STORE_THUMBNAIL_URL);
                                //CObj.ARR_GATES = arr_gates;


                                xml_obj.arr_store_orig_list.push(CObj);
                            }

                            child2 = child2.nextSibling;
                        }

                    }else if(child1.nodeName == "PUB_INFO_LIST"){

                        child2 = child1.firstChild;

                        while(child2 != null && child2.nodeType != 4){
                            if(child2.nodeName == "PUB_INFO"){
                                child3 = child2.firstChild;

                                var CObj = new Object();

                                while(child3 != null && child3.nodeType != 4){
                                    if(child3.nodeName == "PUB_ID") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "PUB_CODE") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "PUB_NAME") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "PUB_URL") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    child3 = child3.nextSibling;
                                }

                                CObj.PUB_ID = this.getCvtXmlTag(CObj.PUB_ID);
                                CObj.PUB_CODE = this.getCvtXmlTag(CObj.PUB_CODE);
                                CObj.PUB_NAME = this.getCvtXmlTag(CObj.PUB_NAME);
                                CObj.PUB_URL = this.getCvtXmlTag(CObj.PUB_URL);
                                CObj.PUB_IMG = this.getCvtXmlTag(CObj.PUB_URL);
                                //CObj.PUB_IMG = this.getParseUrl(CObj.PUB_URL);

                                xml_obj.arr_pub_icon_list.push(CObj);
                            }
                            child2 = child2.nextSibling;
                        }
                    }else if(child1.nodeName == "MAP_LIST"){
                        child2 = child1.firstChild;
                        while(child2 != null && child2.nodeType != 4){
                            if(child2.nodeName == "MAP_INFO"){
                                child3 = child2.firstChild;

                                var CObj = new Object();

                                CObj.B_CODE = this.getCvtXmlTag(child2.getAttribute("b_code"));
                                CObj.FLOOR = this.getCvtXmlTag(child2.getAttribute("floor"));
                                CObj.NAME = this.getCvtXmlTag(child2.getAttribute("name"));
                                CObj.SORT = this.getCvtXmlTag(child2.getAttribute("sort"));

                                while(child3 != null && child3.nodeType != 4){

                                    if(child3.nodeName == "MAIN_3DMAP_URL") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "MAIN_MAP_URL") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "MINI_MAP_URL") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;

                                    child3 = child3.nextSibling;
                                }

                                CObj.FLOOR = this.getCvtXmlTag(CObj.FLOOR);
                                if(CObj.B_CODE == "") CObj.B_CODE = "IFC";
                                CObj.NAME = this.getCvtXmlTag(CObj.NAME);
                                CObj.SORT = this.getCvtXmlNum(CObj.SORT,-1);

                                if(CObj.SORT == -1){
                                    CObj.SORT = xml_obj.arr_map_list.length + 1;
                                }

                                CObj.ID = CObj.B_CODE + "_" + CObj.FLOOR;

                                CObj.MAIN_3DMAP_URL = this.getCvtXmlTag(CObj.MAIN_3DMAP_URL);
                                CObj.MAIN_MAP_URL = this.getCvtXmlTag(CObj.MAIN_MAP_URL);
                                CObj.MINI_MAP_URL = this.getCvtXmlTag(CObj.MINI_MAP_URL);

                                xml_obj.arr_map_list.push(CObj);

                            }

                            child2 = child2.nextSibling;
                        }

                    }  // END LIST
                }

                child1 = child1.nextSibling;
            }
        }catch(err){
            // console.log("FAIL LOAD DATA =====");
            // console.log(err);
            p_fnc("FAIL Load Data " + err, xml_obj);
            return;
        }

        p_fnc(ret_code, xml_obj);
    }

    setLoadRouteContents(p_url,p_fnc){
        console.log("setLoadRouteContents()");

        var xml_http;
        var m_this = this;

        if (window.XMLHttpRequest){
            xml_http = new XMLHttpRequest();
        }else{
            xml_http = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xml_http.open("GET",p_url,true);
        xml_http.onreadystatechange = function(){
            m_this.onReadXmlRouteContents(this,p_fnc);
        };
        xml_http.send();
    }

    onReadXmlRouteContents(p_xml_http,p_fnc){
        console.log("onReadXmlRouteContents()");
        var ret_code = "SUCC";

        var xml_obj = new Object();
        xml_obj.header = new Object();
        xml_obj.arr_node_list = new Array();
        xml_obj.arr_store_list = new Array();
        xml_obj.arr_pub_list = new Array();
        xml_obj.arr_shape_list = new Array();
        xml_obj.arr_park_list = new Array();

        if (p_xml_http.readyState != 4){
            return;
        }
        if(p_xml_http.status != 200){
            p_fnc("SUCC", xml_obj);
            return;
        }

        try{
            var xml_doc = p_xml_http.responseXML;
            var root_node = xml_doc.getElementsByTagName("KIOSK")[0];
            if(!root_node){
                p_fnc("FAIL Load Route Xml", xml_obj);
                return;
            }

            var i = 0;
            var str_tmp = "";
            var child1 = root_node.firstChild;
            var child2;
            var child3;

            while(child1 != null && child1.nodeType != 4){

                if(child1.nodeType == 1){

                    if(child1.nodeName == "HEADER"){

                        child2 = child1.firstChild;
                        while(child2 != null && child2.nodeType != 4){
                            if(child2.nodeName == "RET_CODE"){
                                ret_code = this.getCvtXmlTag(child2.childNodes[0].nodeValue);
                            }
                            /*
                            xml_obj.header.KIOSK_FLOOR = this.getCvtXmlTag(xml_obj.header.KIOSK_FLOOR);
                            */
                            child2 = child2.nextSibling;
                        }

                    }else if(child1.nodeName == "STORE_LIST"){

                        child2 = child1.firstChild;

                        while(child2 != null && child2.nodeType != 4){
                            if(child2.nodeName == "STORE_INFO"){
                                child3 = child2.firstChild;

                                var CObj = new Object();
                                CObj.ID = this.getCvtXmlTag(child2.getAttribute("id"));
                                while(child3 != null && child3.nodeType != 4){

                                    if(child3.nodeName == "STORE_NAME_KOR") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_NAME_ENG") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_NAME_CHN") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "STORE_NAME_JPN") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;

                                    if(child3.nodeName == "FONT_COLOR") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "FONT_SIZE") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;

                                    if(child3.nodeName == "STORE_FLOOR"){
                                        if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                        CObj.POS_X = this.getCvtXmlTag(child3.getAttribute("pos_x"));
                                        CObj.POS_Y = this.getCvtXmlTag(child3.getAttribute("pos_y"));
                                        CObj.B_CODE = this.getCvtXmlTag(child3.getAttribute("b_code"));
                                    }
                                    if(child3.nodeName == "GATE_POS_X") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "GATE_POS_Y") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;

                                    child3 = child3.nextSibling;
                                }

                                CObj.ID = this.getCvtXmlTag(CObj.ID);

                                CObj.STORE_NAME_KOR = this.getCvtXmlTag(CObj.STORE_NAME_KOR);
                                CObj.STORE_NAME_ENG = this.getCvtXmlTag(CObj.STORE_NAME_ENG);
                                CObj.STORE_NAME_CHN = this.getCvtXmlTag(CObj.STORE_NAME_CHN);
                                CObj.STORE_NAME_JPN = this.getCvtXmlTag(CObj.STORE_NAME_JPN);

                                CObj.STORE_NAME_KOR_POT = "";
                                CObj.STORE_NAME_ENG_POT = "";
                                CObj.STORE_NAME_CHN_POT = "";
                                CObj.STORE_NAME_JPN_POT = "";

                                CObj.FONT_COLOR = this.getCvtXmlTag(CObj.FONT_COLOR);
                                CObj.FONT_SIZE = this.getCvtXmlNum(CObj.FONT_SIZE,30);
                                CObj.STORE_FLOOR = this.getCvtXmlTag(CObj.STORE_FLOOR);
                                CObj.POS_X = this.getCvtXmlNum(CObj.POS_X,0);
                                CObj.POS_Y = this.getCvtXmlNum(CObj.POS_Y,0);
                                CObj.GATE_POS_X = this.getCvtXmlTag(CObj.GATE_POS_X);
                                CObj.GATE_POS_Y = this.getCvtXmlTag(CObj.GATE_POS_Y);

                                CObj.B_CODE = this.getCvtXmlTag(CObj.B_CODE);
                                if(CObj.B_CODE == "") CObj.B_CODE = "IFC";

                                CObj.POS_ORIG_X = CObj.POS_X;
                                CObj.POS_ORIG_Y = CObj.POS_Y;
                                CObj.GATE_POS_ORIG_X = CObj.GATE_POS_X;
                                CObj.GATE_POS_ORIG_Y = CObj.GATE_POS_Y;


                                xml_obj.arr_store_list.push(CObj);
                            }

                            child2 = child2.nextSibling;
                        }

                    }else if(child1.nodeName == "PUB_LIST"){

                        child2 = child1.firstChild;

                        while(child2 != null && child2.nodeType != 4){
                            if(child2.nodeName == "PUB_INFO"){
                                child3 = child2.firstChild;

                                var CObj = new Object();

                                CObj.ID = this.getCvtXmlTag(child2.getAttribute("id"));
                                CObj.STATUS = this.getCvtXmlTag(child2.getAttribute("status"));
                                CObj.AREA = this.getCvtXmlTag(child2.getAttribute("area"));
                                CObj.SECT = this.getCvtXmlTag(child2.getAttribute("sect"));
                                CObj.MOVE_FLOOR = this.getCvtXmlTag(child2.getAttribute("floor"));

                                while(child3 != null && child3.nodeType != 4){
                                    if(child3.nodeName == "PUB_ID") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "PUB_CODE") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;

                                    if(child3.nodeName == "PUB_FLOOR"){
                                        if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                        CObj.POS_X = this.getCvtXmlTag(child3.getAttribute("pos_x"));
                                        CObj.POS_Y = this.getCvtXmlTag(child3.getAttribute("pos_y"));
                                        CObj.B_CODE = this.getCvtXmlTag(child3.getAttribute("b_code"));
                                    }
                                    child3 = child3.nextSibling;
                                }

                                CObj.ID = this.getCvtXmlTag(CObj.ID);
                                CObj.STATUS = this.getCvtXmlTag(CObj.STATUS);
                                CObj.AREA = this.getCvtXmlTag(CObj.AREA);
                                CObj.SECT = this.getCvtXmlTag(CObj.SECT);
                                CObj.MOVE_FLOOR = this.getCvtXmlTag(CObj.MOVE_FLOOR);

                                str_tmp = CObj.MOVE_FLOOR;
                                var arr_tmp = str_tmp.split(',');
                                CObj.ARR_MOVE_FLOORS = arr_tmp;

                                CObj.PUB_ID = this.getCvtXmlTag(CObj.PUB_ID);
                                CObj.PUB_FLOOR = this.getCvtXmlTag(CObj.PUB_FLOOR);
                                CObj.POS_X = this.getCvtXmlNum(CObj.POS_X,0);
                                CObj.POS_Y = this.getCvtXmlNum(CObj.POS_Y,0);

                                CObj.B_CODE = this.getCvtXmlTag(CObj.B_CODE);
                                if(CObj.B_CODE == "") CObj.B_CODE = "IFC";

                                CObj.POS_ORIG_X = CObj.POS_X;
                                CObj.POS_ORIG_Y = CObj.POS_Y;

                                if(CObj.POS_X != 0 && CObj.POS_Y != 0){
                                    xml_obj.arr_pub_list.push(CObj);
                                }
                            }

                            child2 = child2.nextSibling;
                        }

                    }else if(child1.nodeName == "SHAPE_LIST"){

                        child2 = child1.firstChild;

                        while(child2 != null && child2.nodeType != 4){
                            if(child2.nodeName == "SHAPE_INFO"){
                                child3 = child2.firstChild;

                                var CObj = new Object();

                                CObj.ID = this.getCvtXmlTag(child2.getAttribute("id"));
                                CObj.TYPE = this.getCvtXmlTag(child2.getAttribute("type"));

                                while(child3 != null && child3.nodeType != 4){
                                    if(child3.nodeName == "POINTS_X") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "POINTS_Y") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "IMG_URL") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "FILL_COLOR") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "LINE_COLOR") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                    if(child3.nodeName == "LINE_THICK") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;

                                    if(child3.nodeName == "SHAPE_TEXT"){
                                        if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                        CObj.ALIGN = this.getCvtXmlTag(child3.getAttribute("align"));
                                        CObj.FONT_SIZE = this.getCvtXmlTag(child3.getAttribute("font_size"));
                                    }

                                    if(child3.nodeName == "SHAPE_FLOOR"){
                                        if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                        CObj.B_CODE = this.getCvtXmlTag(child3.getAttribute("b_code"));
                                        CObj.POS_X = this.getCvtXmlTag(child3.getAttribute("pos_x"));
                                        CObj.POS_Y = this.getCvtXmlTag(child3.getAttribute("pos_y"));
                                        CObj.WIDTH = this.getCvtXmlTag(child3.getAttribute("width"));
                                        CObj.HEIGHT = this.getCvtXmlTag(child3.getAttribute("height"));
                                        CObj.ANGLE = this.getCvtXmlTag(child3.getAttribute("angle"));
                                    }
                                    child3 = child3.nextSibling;
                                }

                                CObj.ID = this.getCvtXmlTag(CObj.ID);
                                CObj.TYPE = this.getCvtXmlTag(CObj.TYPE);
                                CObj.POINTS_X = this.getCvtXmlTag(CObj.POINTS_X);
                                CObj.POINTS_Y = this.getCvtXmlTag(CObj.POINTS_Y);
                                CObj.IMG_URL = this.getCvtXmlTag(CObj.IMG_URL);

                                CObj.FILL_COLOR = this.getCvtXmlTag(CObj.FILL_COLOR);
                                CObj.LINE_COLOR = this.getCvtXmlTag(CObj.LINE_COLOR);
                                CObj.LINE_THICK = this.getCvtXmlTag(CObj.LINE_THICK);

                                CObj.SHAPE_TEXT = this.getCvtXmlTag(CObj.SHAPE_TEXT);
                                CObj.ALIGN = this.getCvtXmlTag(CObj.ALIGN);
                                CObj.FONT_SIZE = this.getCvtXmlTag(CObj.FONT_SIZE);

                                CObj.SHAPE_FLOOR = this.getCvtXmlTag(CObj.SHAPE_FLOOR);
                                CObj.POS_X = this.getCvtXmlNum(CObj.POS_X,0);
                                CObj.POS_Y = this.getCvtXmlNum(CObj.POS_Y,0);
                                CObj.WIDTH = this.getCvtXmlNum(CObj.WIDTH,0);
                                CObj.HEIGHT = this.getCvtXmlNum(CObj.HEIGHT,0);
                                CObj.ANGLE = this.getCvtXmlNum(CObj.ANGLE,0);

                                CObj.B_CODE = this.getCvtXmlTag(CObj.B_CODE);
                                if(CObj.B_CODE == "") CObj.B_CODE = "IFC";

                                xml_obj.arr_shape_list.push(CObj);
                            }

                            child2 = child2.nextSibling;
                        }

                    }else if(child1.nodeName == "NODE_LIST"){
                        child2 = child1.firstChild;
                        while(child2 != null && child2.nodeType != 4){
                            if(child2.nodeName == "NODE_INFO"){
                                child3 = child2.firstChild;
                                var CObj = new Object();
                                CObj.B_CODE = this.getCvtXmlTag(child2.getAttribute("b_code"));
                                CObj.FLOOR = this.getCvtXmlTag(child2.getAttribute("floor"));
                                CObj.POS_X1 = this.getCvtXmlNum(child2.getAttribute("x1"),0);
                                CObj.POS_X2 = this.getCvtXmlNum(child2.getAttribute("x2"),0);
                                CObj.POS_Y1 = this.getCvtXmlNum(child2.getAttribute("y1"),0);
                                CObj.POS_Y2 = this.getCvtXmlNum(child2.getAttribute("y2"),0);
                                CObj.DIRECTION = this.getCvtXmlTag(child2.getAttribute("direction"));
                                CObj.STIME0 = this.getCvtXmlTag(child2.getAttribute("stime0"));
                                CObj.ETIME0 = this.getCvtXmlTag(child2.getAttribute("etime0"));
                                CObj.STIME1 = this.getCvtXmlTag(child2.getAttribute("stime1"));
                                CObj.ETIME1 = this.getCvtXmlTag(child2.getAttribute("etime1"));
                                CObj.STIME2 = this.getCvtXmlTag(child2.getAttribute("stime2"));
                                CObj.ETIME2 = this.getCvtXmlTag(child2.getAttribute("etime2"));

                                CObj.POS_X1 = this.getCvtXmlNum(CObj.POS_X1,-1);
                                CObj.POS_X2 = this.getCvtXmlNum(CObj.POS_X2,-1);
                                CObj.POS_Y1 = this.getCvtXmlNum(CObj.POS_Y1,-1);
                                CObj.POS_Y2 = this.getCvtXmlNum(CObj.POS_Y2,-1);

                                if(CObj.B_CODE == "") CObj.B_CODE = "IFC";

                                CObj.POS_ORIG_X1 = CObj.POS_X1;
                                CObj.POS_ORIG_X2 = CObj.POS_X2;
                                CObj.POS_ORIG_Y1 = CObj.POS_Y1;
                                CObj.POS_ORIG_Y2 = CObj.POS_Y2;

                                xml_obj.arr_node_list.push(CObj);
                            }

                            child2 = child2.nextSibling;
                        }

                    }else if(child1.nodeName == "PARK_LIST"){
                        child2 = child1.firstChild;
                        while(child2 != null && child2.nodeType != 4){
                            if(child2.nodeName == "PARK_INFO"){

                                child3 = child2.firstChild;

                                var CObj = new Object();

                                CObj.ID = this.getCvtXmlTag(child2.getAttribute("id"));

                                while(child3 != null && child3.nodeType != 4){

                                    if(child3.nodeName == "PARK_CODE") if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;

                                    if(child3.nodeName == "PARK_FLOOR"){
                                        if(child3.childNodes[0]) CObj[child3.nodeName] = child3.childNodes[0].nodeValue;
                                        CObj.B_CODE = this.getCvtXmlTag(child3.getAttribute("b_code"));
                                        CObj.POS_X = this.getCvtXmlTag(child3.getAttribute("pos_x"));
                                        CObj.POS_Y = this.getCvtXmlTag(child3.getAttribute("pos_y"));
                                    }

                                    child3 = child3.nextSibling;
                                }

                                CObj.PARK_CODE = this.getCvtXmlTag(CObj.PARK_CODE);
                                CObj.PARK_FLOOR = this.getCvtXmlTag(CObj.PARK_FLOOR);

                                CObj.POS_X = this.getCvtXmlNum(CObj.POS_X,0);
                                CObj.POS_Y = this.getCvtXmlNum(CObj.POS_Y,0);
                                CObj.POS_ORIG_X = CObj.POS_X;
                                CObj.POS_ORIG_Y = CObj.POS_Y;

                                CObj.B_CODE = this.getCvtXmlTag(CObj.B_CODE);
                                if(CObj.B_CODE == "") CObj.B_CODE = "IFC";

                                xml_obj.arr_park_list.push(CObj);
                            }

                            child2 = child2.nextSibling;
                        }


                    }  // END LIST
                }

                child1 = child1.nextSibling;
            }
        }catch(err){
            // console.log("FAIL LOAD ROUTE =====");
            // console.log(err);
            p_fnc("FAIL Load Route " + err, xml_obj);
            return;
        }

        p_fnc(ret_code, xml_obj);
    }


    // setLoadJson(p_url, p_fnc){
    //     console.log("setLoadJson()");


    //     var json_data;
    //     var ret_code = "FAIL";

    //     var xml_http = new XMLHttpRequest();
    //     xml_http.onreadystatechange = function(){

    //         if(xml_http.readyState != 4){
    //             return;
    //         }

    //         try{
    //             //데이터가 확실하게 들어왔을 때 데이터 바인딩 시작
    //             if(xml_http.status == 200) {
    //                 var xml_doc = JSON.parse(this.response);
    //                 json_data = xml_doc;
    //                 ret_code = "SUCC";
    //             }else{
    //                 p_fnc("FAIL Load Json Url", json_data);
    //             }
    //         }catch(err){
    //             p_fnc("FAIL Load Json " + err, json_data);
    //             return;
    //         }
    //         p_fnc(ret_code, json_data);
    //     }
    //     xml_http.open("GET",p_url,true);
    //     xml_http.send();
    // }


    // getChkNull(p_src){
    //     console.log("getChkNull()");

    //     if(p_src == null || p_src == undefined){
    //         return "";
    //     }else{
    //         return p_src + "";
    //     }
    // }

    getCvtXmlTag(p_src){
        console.log("getCvtXmlTag()");

        if(p_src == null || p_src == undefined){
            return "";
        }
        var p1 = /<p>/gi;
        var p2 = /<\/p>/gi;
        var p3 = /&amp;/gi;
        var p4 = /&lt;/gi;
        var p5 = /&gt;/gi;
        var p6 = /&quot;/gi;
        var p7 = /&apos;/gi;

        p_src = p_src.replace(p1,"");
        p_src = p_src.replace(p2,"");
        p_src = p_src.replace(p3,"");
        p_src = p_src.replace(p4,"");
        p_src = p_src.replace(p5,"");
        p_src = p_src.replace(p6,"");
        p_src = p_src.replace(p7,"");

        p_src = p_src.trim();
        return p_src;
    }


    // getParseUrl(p_src){
    //     console.log("getParseUrl()");

    //     var arr_src = p_src.split("/");
    //     if(arr_src.length > 0){
    //         return arr_src[arr_src.length-1];
    //     }
    //     return "";
    // }


    getCvtXmlNum(p_src,p_default){
        console.log("getCvtXmlNum()");

        if(p_default == undefined) p_default = 0;
        if(p_src == null ) return p_default;
        if(isNaN(p_src) == true) return p_default;
        return Number(p_src);
    }
}

