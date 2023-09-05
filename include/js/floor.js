/******************************************
   name :  floor.js
   auth :  ELTOV
   date :  2021.09.01
   desc :  층별안내 자바스크립트
*******************************************/


var gl_main_conf = {
    lang: "KOR",
    name: "floor",
    curr_floor: "",
    map_load: ""
};

var gl_map_angle = 0;

var gl_floor_map = null;

var gl_conf_header = new Object();
var gl_jsop_lang_data = new Object();

var gl_arr_floor_list = new Array();
var gl_arr_store_list = new Array();

var gl_wayfind_bridge = [];
var gl_floor_addon = [
    {"type":"IMG","b_code":"IFC","floor":"2F","pos_x":"1721","pos_y":"1017","width":"252","height":"42","angle":"0","url":"images/addon/store_centre.png"},
    {"type":"IMG","b_code":"IFC","floor":"2F","pos_x":"2140","pos_y":"1078","width":"262","height":"42","angle":"0","url":"images/addon/store_fashion.png"},
    {"type":"IMG","b_code":"IFC","floor":"3F","pos_x":"1687","pos_y":"1119","width":"252","height":"42","angle":"0","url":"images/addon/store_centre.png"},
    {"type":"IMG","b_code":"IFC","floor":"3F","pos_x":"2088","pos_y":"1161","width":"262","height":"42","angle":"0","url":"images/addon/store_fashion.png"},
    {"type":"IMG","b_code":"IFC","floor":"3F","pos_x":"1237","pos_y":"1052","width":"230","height":"42","angle":"0","url":"images/addon/store_living.png"},
    {"type":"IMG","b_code":"IFC","floor":"3F","pos_x":"770","pos_y":"653","width":"160","height":"84","angle":"0","url":"images/addon/park_sun.png"},
    {"type":"IMG","b_code":"IFC","floor":"4F","pos_x":"1572","pos_y":"837","width":"252","height":"42","angle":"0","url":"images/addon/store_centre.png"},
    {"type":"IMG","b_code":"IFC","floor":"4F","pos_x":"1952","pos_y":"1056","width":"262","height":"42","angle":"0","url":"images/addon/store_fashion.png"},
    {"type":"IMG","b_code":"IFC","floor":"4F","pos_x":"1196","pos_y":"660","width":"230","height":"42","angle":"0","url":"images/addon/store_living.png"},
    {"type":"IMG","b_code":"IFC","floor":"4F","pos_x":"1911","pos_y":"173","width":"220","height":"42","angle":"0","url":"images/addon/store_taste.png"},
    {"type":"IMG","b_code":"IFC","floor":"4F","pos_x":"1603","pos_y":"520","width":"252","height":"42","angle":"0","url":"images/addon/store_garden.png"},
    {"type":"IMG","b_code":"IFC","floor":"4F","pos_x":"1527","pos_y":"1090","width":"252","height":"42","angle":"0","url":"images/addon/store_terrace.png"},
    {"type":"IMG","b_code":"IFC","floor":"4F","pos_x":"778","pos_y":"457","width":"160","height":"84","angle":"0","url":"images/addon/park_sun.png"},
    {"type":"IMG","b_code":"IFC","floor":"4F","pos_x":"2538","pos_y":"457","width":"160","height":"84","angle":"0","url":"images/addon/park_moon.png"},
    {"type":"IMG","b_code":"IFC","floor":"45F","pos_x":"794","pos_y":"700","width":"160","height":"84","angle":"0","url":"images/addon/park_sun.png"},
    {"type":"IMG","b_code":"IFC","floor":"45F","pos_x":"2538","pos_y":"700","width":"160","height":"84","angle":"0","url":"images/addon/park_moon.png"},
    {"type":"IMG","b_code":"IFC","floor":"5F","pos_x":"1721","pos_y":"826","width":"252","height":"42","angle":"0","url":"images/addon/store_centre.png"},
    {"type":"IMG","b_code":"IFC","floor":"5F","pos_x":"2062","pos_y":"945","width":"262","height":"42","angle":"0","url":"images/addon/store_fashion.png"},
    {"type":"IMG","b_code":"IFC","floor":"5F","pos_x":"1305","pos_y":"784","width":"230","height":"42","angle":"0","url":"images/addon/store_living.png"},
    {"type":"IMG","b_code":"IFC","floor":"5F","pos_x":"1693","pos_y":"227","width":"220","height":"42","angle":"0","url":"images/addon/store_taste.png"},
    {"type":"IMG","b_code":"IFC","floor":"5F","pos_x":"833","pos_y":"466","width":"160","height":"84","angle":"0","url":"images/addon/park_sun.png"},
    {"type":"IMG","b_code":"IFC","floor":"5F","pos_x":"2509","pos_y":"466","width":"160","height":"84","angle":"0","url":"images/addon/park_moon.png"},
    {"type":"IMG","b_code":"IFC","floor":"55F","pos_x":"802","pos_y":"704","width":"160","height":"84","angle":"0","url":"images/addon/park_sun.png"},
    {"type":"IMG","b_code":"IFC","floor":"55F","pos_x":"2489","pos_y":"704","width":"160","height":"84","angle":"0","url":"images/addon/park_moon.png"},
    {"type":"IMG","b_code":"IFC","floor":"6F","pos_x":"1715","pos_y":"907","width":"252","height":"42","angle":"0","url":"images/addon/store_centre.png"},
    {"type":"IMG","b_code":"IFC","floor":"6F","pos_x":"1972","pos_y":"1031","width":"262","height":"42","angle":"0","url":"images/addon/store_fashion.png"},
    {"type":"IMG","b_code":"IFC","floor":"6F","pos_x":"1245","pos_y":"721","width":"230","height":"42","angle":"0","url":"images/addon/store_living.png"},
    {"type":"IMG","b_code":"IFC","floor":"6F","pos_x":"1805","pos_y":"304","width":"220","height":"42","angle":"0","url":"images/addon/store_taste.png"},
    {"type":"IMG","b_code":"IFC","floor":"6F","pos_x":"1881","pos_y":"798","width":"160","height":"42","angle":"0","url":"images/addon/store_pick6.png"},
    {"type":"IMG","b_code":"IFC","floor":"7F","pos_x":"1720","pos_y":"1039","width":"252","height":"42","angle":"0","url":"images/addon/store_centre.png"},
    {"type":"IMG","b_code":"IFC","floor":"7F","pos_x":"1819","pos_y":"314","width":"220","height":"42","angle":"0","url":"images/addon/store_taste.png"},
    {"type":"IMG","b_code":"IFC","floor":"7F","pos_x":"1197","pos_y":"758","width":"215","height":"50","angle":"0","url":"images/addon/store_food_cinema.png"},
    {"type":"IMG","b_code":"IFC","floor":"7F","pos_x":"1729","pos_y":"894","width":"270","height":"42","angle":"0","url":"images/addon/store_rooftop.png"},
    {"type":"IMG","b_code":"IFC","floor":"8F","pos_x":"1221","pos_y":"821","width":"230","height":"42","angle":"0","url":"images/addon/store_living.png"},
];


var gl_final_map_pos = {
    "TWOWAY_W": {
        "pos0": {
            "xx": 350,
            "yy": 50,
            "ss": 0.20
        },
        "pos1": {
            "xx": 1000,
            "yy": 50,
            "ss": 0.20
        }
    },
    "TWOWAY_H": {
       "pos0": {
          "xx": 700,
          "yy": 150,
          "ss": 0.20
        },
       "pos1": {
          "xx": 700,
          "yy": -300,
          "ss": 0.20
        }
    },
    "THREEWAY": {
        "pos0": {
            "xx": -225,
            "yy": -375,
            "ss": 0.2
        },
        "pos1": {
            "xx": 225,
            "yy": -375,
            "ss": 0.2
        },
        "pos2": {
            "xx": 0,
            "yy": 300,
            "ss": 0.2
        }
    },
    "FOURWAY": {
        "pos0": {
            "xx": -225,
            "yy": -375,
            "ss": 0.2
        },
        "pos1": {
            "xx": 225,
            "yy": -375,
            "ss": 0.2
        },
        "pos2": {
            "xx": -225,
            "yy": 300,
            "ss": 0.2
        },
        "pos3": {
            "xx": 225,
            "yy": 300,
            "ss": 0.2
        }
    }
};

/////////////////////////////////////////////////
// 초기화 함수들


function setInitSettingLang(p_load_data) {
    gl_jsop_lang_data = p_load_data;
}

function setInitSetting(p_result) {

    if (p_result != "SUCC") {
        //console.log("FAIL LOAD DATA/ROUTE");
        return;
    }

    $(".floor_btn .floor_title").mousedown(function () {
        onClickFloorInfo(this);
    });

    $(".faci_btn").mousedown(function () {
        onClickPubInfo(this);
    });


    $(".btn_building").mousedown(function () {
        onClickBuildingInfo(this);
    });

    $(".btn_here").mousedown(function () {
        onClickHere(this);
    });




    $(".floor_btn .floor_title").bind("touchstart", function (e) {
        onClickFloorInfo(this);
    });


    $(".faci_btn").mousedown( function (e) {
        onClickPubInfo(this);
    });


    $(".btn_building").bind("touchstart", function (e) {
        onClickBuildingInfo(this);
    });

    $(".btn_here").bind("touchstart", function (e) {
        onClickHere(this);
    });






    if (parent.MAINPARENTCUSTOMCODE) {

    } else {
        // console.log("LOCAL SETTING FLOOR");
        setInitConfig(gl_xml_conf.xml_data);
    }
}

function setInitConfig(p_load_data,division) {
    var i = 0;
    var i_found = 0;

    gl_conf_header = p_load_data.header;
    var store_list = p_load_data.arr_store_list;

    var option = {
        url_data: "http://13.209.62.118/user/xml/kiosk_contents.jsp?kiosk_code=KIFCW001",
        url_route: "http://13.209.62.118/zcommonfiles/route/IFC/kiosk_route_1.1.xml",
        font_name: "NotoSansCJKLIGHT",
        font_weight: "700",
        map_angle: 0,
        scale_init: 0.38,
        margin_height: 0,
        margin_top: -50,
        margin_left:0,
        debug_line: "",
        debug_wayfind: "DEBUG",
        wayfind_bridge: gl_wayfind_bridge,
        addon_list: gl_floor_addon,

        map_main_height: 725,
        wayfind_speed: 5,
        final_map_type: gl_final_map_pos,
        map_scale: "auto",
        img_curr_type: {
            "url": "images/wayfind/ico_here.svg",
            "width": "50",
            height: "50"
        },
        img_target_type: {
            "url": "images/wayfind/ico_arrival.svg",
            "width": "50",
            height: "50"
        },
        img_move_type: {
            "url": "images/wayfind/ico_m_point_human.png",
            "width": "48",
            height: "48"
        },
        disp_background: ""
        //        disp_background:"#F1EFEF"
    };

    for (i = 0; i < gl_arr_floors.length; i++) {
        if (gl_arr_floors[i].code == gl_conf_header.KIOSK_FLOOR) {
            i_found = i;
            break;
        }
    }

    for (i = 0; i < store_list.length && i < 1000; i++) {
        gl_arr_store_list.push(store_list[i]);
    }

    //맵의 회전 값
    if (gl_conf_header.KIOSK_MAP == "N") {
        gl_map_angle = option.map_angle = 0;
    } else if (gl_conf_header.KIOSK_MAP == "W") {

    } else if (gl_conf_header.KIOSK_MAP == "S") {
        gl_map_angle = option.map_angle = 180;
    }
                console.log(division);

    var main = document.getElementById("id_map_main");
     if(division === 'H'){
                 option.scale_init=0.3;
                 option.margin_left=-200;
             }
        gl_floor_map = new Eltov2DMap(main, option);
    gl_floor_map.setInit();

    var t_floor_title = "";
    //현위치 층, 버튼에 표시
    for (i = 0; i < gl_arr_floors.length; i++) {
        if (gl_arr_floors[i].code == gl_conf_header.KIOSK_FLOOR) {
            obj = $("#id_floor_title_" + i);

            if(gl_arr_floors[i].name=="45F"){
                t_floor_title = "4.5F";
            }else if(gl_arr_floors[i].name=="55F"){
                t_floor_title = "5.5F";
            }else{
                t_floor_title = gl_arr_floors[i].name;
            }
            $("#id_floor_main_title").html(t_floor_title);
            //$(obj).css("border-radius","40px");
            //$(obj).addClass("active");
        }
    }

    // FLOOR 이벤트 리스너
    document.addEventListener("eltov_map", function (evt) {
        onCallBackElovMap(evt);
    });

}

function setInitConfigLang(p_lang) {
    gl_jsop_lang_data = p_lang;
}

function setMainLang(p_type, p_lang) {
    var i = 0;
    var str_code = "";

    if (p_type === "INIT") {
        if (gl_main_conf.lang == p_lang) return;
    }

    gl_main_conf.lang = p_lang;

    var str_attr = "";
    var str_lang = gl_main_conf.lang.toLowerCase();
    //console.log('gl_jsop_lang_data', gl_jsop_lang_data);

    $(".lang_code_names").each(function (i) {
        str_attr = $(".lang_code_names").eq(i).attr("lang_code");
        try {
            $(this).html(gl_jsop_lang_data[gl_main_conf.name][str_attr][str_lang]);
        } catch (err) {
            // console.log("ERROR LANG FLOOR1 : " + str_attr);
        }
    });

    $(".lang_code_names_fac").each(function (i) {
        str_attr = $(".lang_code_names_fac").eq(i).attr("lang_code");
        try {
            $(this).html(gl_jsop_lang_data["facility"][str_attr][str_lang]);
        } catch (err) {
            // console.log("ERROR LANG FLOOR2 : " + str_attr);
        }
    });

    try {
        if (gl_main_conf.curr_floor != "") {
            $("#id_floor_sub_title").html(gl_jsop_lang_data[gl_main_conf.name]["FLOOR_LEVEL_" + gl_main_conf.curr_floor][str_lang]);
        }
    } catch (err) {
        // console.log("ERROR LANG SUB TITLE : ");
    }

    if (gl_main_conf.map_load == "SUCC") {
        var send_param = {
            "sect": "CMD",
            "type": "LANG",
            "code": gl_main_conf.lang
        };
        gl_floor_map.setCallWebToMap(send_param);
    }
}


function setMainStart(p_obj) {

    $(".faci_btn").removeClass("active");

    var str_tmp = "";

    var is_wayfind = false;

    // console.log("FLOOR ==== setMainStart", p_obj);

    $("#id_page_wayfind_left").hide();
    setFloorInfo("INIT", gl_conf_header.B_CODE, gl_conf_header.KIOSK_FLOOR);


    var send_param = {
        "sect": "CMD",
        "type": "PUB_RESET"
    };
    gl_floor_map.setCallWebToMap(send_param);

    if (p_obj != null && p_obj.sect != undefined) {

        if (p_obj.sect == "LOCATION") {
            if (p_obj.type == "STORE") {
                if (gl_main_conf.map_load == "SUCC") {
                    is_wayfind = true;
                    var send_param = {
                        "sect": "WAYFIND",
                        "type": "STORE",
                        "id": p_obj.id,
                        "way_type": "LOCATION"
                    };
                    gl_floor_map.setCallWebToMap(send_param);
                }
            }else if(p_obj.type == "NEARBY"){
            is_wayfind = true;
                                var send_param = {
                                    "sect": "WAYFIND",
                                    "type": "STORE",
                                    "id": p_obj.id,
                                    "way_type": "LOCATION"
                                };
                                gl_floor_map.setCallWebToMap(send_param);
            } else {
                is_wayfind = true;
                if (gl_main_conf.map_load == "SUCC") {
                    var send_param = {
                        "sect": "WAYFIND",
                        "type": "PUB",
                        "way_type": "NEARLOCATION",
                        "id": p_obj.id
                    };
                    gl_floor_map.setCallWebToMap(send_param);
                }
            }
        } else if (p_obj.sect == "WAYFIND") {
            if (p_obj.type == "STORE") {
                if (gl_main_conf.map_load == "SUCC") {
                    is_wayfind = true;
                    var send_param = {
                        "sect": "WAYFIND",
                        "type": "STORE",
                        "id": p_obj.id,
                        "way_type": "WAYFIND",
                        "move_type": getChkNull(p_obj.move_type, "")
                    };
                    gl_floor_map.setCallWebToMap(send_param);
                }
            }else if(p_obj.type == "NEARBY"){
            if (gl_main_conf.map_load == "SUCC") {
                                is_wayfind = true;
                                var send_param = {
                                    "sect": "WAYFIND",
                                    "type": "STORE",
                                    "id": p_obj.id,
                                    "way_type": "WAYFIND",
                                    "move_type": getChkNull(p_obj.move_type, "")
                                };
                                gl_floor_map.setCallWebToMap(send_param);
                            }
            } else if (p_obj.type == "PARK") {
                if (gl_main_conf.map_load == "SUCC") {
                    is_wayfind = true;
                    var send_param = {
                        "sect": "WAYFIND",
                        "type": "PARK",
                        "id": p_obj.id,
                        "way_type": "WAYFIND",
                        "near_type": "TARGET",
                        "move_type": getChkNull(p_obj.move_type, ""),
                        "target_floor": p_obj.target_floor
                    };
                    gl_floor_map.setCallWebToMap(send_param);
                }
            }
        }
    }

    if (is_wayfind == false) {
        $("#id_pop_floor_guide").show();

        this.m_util = new EltovWayUtil();
        var map_width = Number(gl_conf_header.MAP_WIDTH);
        var map_height = Number(gl_conf_header.MAP_HEIGHT);
        var chg_in_pos = {
            c_x: (map_width / 2),
            c_y: (map_height / 2),
            rad: (gl_map_angle) * Math.PI / 180,
            p_x: 0,
            p_y: 0
        };
        chg_in_pos.p_x = Number(gl_conf_header.POS_X);
        chg_in_pos.p_y = Number(gl_conf_header.POS_Y);
        var t_pos = this.m_util.getChgAnglePos(chg_in_pos);
        //var send_param = {"sect":"CMD","type":"MOVE","x":0-t_pos.x,"y":0-t_pos.y,"scale":0.6};
        //gl_floor_map.setCallWebToMap(send_param);
        setTimeout(setMainStartEnd, 4000);
    }

}

function setMainStartEnd() {
    $("#id_pop_floor_guide").fadeOut();
}

function setMainStop() {

    if (PAGEACTIVEYN == false) {
        return;
    }

    PAGEACTIVEYN = false;
}

/////////////////////////////////////////////////
// FUNCTION

function setFloorInfo(p_type, p_b_code, p_floor) {
    console.log('p_type', p_type);
    console.log('p_b_code', p_b_code);
    console.log('p_floor', p_floor);
    if (p_type != "") {
        $("#id_bottom_main").show();
    }

    $("#id_floor_name_area").show();
    $("#id_page_wayfind_left").hide();
    $("#id_page_wayfind_left2").hide();
    var i = 0;
    var obj, obj_floor;

    if (p_b_code == undefined) {

        p_b_code = "IFC";
    }
    var t_floor_title = "";

    for (i = 0; i < gl_arr_floors.length; i++) {
        console.log('gl_arr_floors', gl_arr_floors[i]);
        obj = $("#id_floor_title_" + i);
        t_floor_title = gl_arr_floors[i].name;
        /*
        if(gl_arr_floors[i].code == gl_conf_header.KIOSK_FLOOR){
            $(obj).css("background","#C8C8C8");
        }else{
        }
        */
        if (gl_arr_floors[i].b_code == p_b_code && gl_arr_floors[i].code == p_floor) {
            if(t_floor_title === 'IFC STREET SHOP'){
                $('#id_floor_main_title').css('font-size', '50px');
            }else{
                $('#id_floor_main_title').css('font-size', '100px');
            }
            $("#id_floor_main_title").html(t_floor_title);
            $(obj).addClass("active");
            /*
            if(gl_arr_floors[i].code == gl_conf_header.KIOSK_FLOOR){
                $(obj).css("background","#2F4E3F");
            }else{
            }
            */
            gl_main_conf.curr_floor = p_floor;

            if (p_type == "INIT" || p_type == "LOCATION") {
                $(".fac_box .list_fac li").removeClass("active");
                if (gl_main_conf.map_load == "SUCC") {
                    var send_param = {
                        "sect": "CMD",
                        "type": "FLOOR",
                        "b_code": p_b_code,
                        "floor": p_floor,
                        "move_type": p_type
                    };
                    console.log('send_param', send_param);
                    gl_floor_map.setCallWebToMap(send_param);

                }
            }
        } else {
            $(obj).removeClass("active");
        }
    }

    try {
        var str_lang = gl_main_conf.lang.toLowerCase();
        $("#id_floor_sub_title").html(gl_jsop_lang_data[gl_main_conf.name]["FLOOR_LEVEL_" + p_floor][str_lang]);
    } catch (err) {
        console.log("ERROR LANG FLOOR23 : " + str_lang);
    }

}

/////////////////////////////////////////////////
// CALL BACK

function onCallBackElovMap(p_evt) {
    var i = 0;
    var detail = p_evt.detail;

    // console.log("<<< onCallBackElovMap");
    // console.log(detail, "<<<");


    if (detail.sect == "INIT") {

        if (detail.result == "SUCC") {
            gl_main_conf.map_load = "SUCC";
            var cmd_obj = {
                sect: "FLOOR",
                type: "DONE"
            };
            if (parent.MAINPARENTCUSTOMCODE) {
                parent.setParentCmd(cmd_obj);
            }
        } else {
            var cmd_obj = {
                sect: "FLOOR",
                type: "DONE"
            };
            if (parent.MAINPARENTCUSTOMCODE) {
                parent.setParentCmd(cmd_obj);
            }
            $("#id_pop_floor_error").show();
        }
    } else if (detail.sect == "STORE") {

        var cmd_obj = {
            sect: "POPUP",
            type: "STORE_INFO",
            id: detail.id,
            code: ""
        };
        if (parent.MAINPARENTCUSTOMCODE) {
            parent.setParentCmd(cmd_obj);
        }
    } else if (detail.sect == "PUB") {


    } else if (detail.sect == "WAYFIND") {

        if (detail.result == "NOWAY") { // 길이 없음
            var cmd_obj = {
                sect: "POPUP",
                type: "ERROR",
                msg: "길을 찾을 수가 없습니다"
            };
            if (parent.MAINPARENTCUSTOMCODE) {
                parent.setParentCmd(cmd_obj);
            }
        } else if (detail.result == "NONE") { // 정보를 찾을수 없음
            var cmd_obj = {
                sect: "POPUP",
                type: "ERROR",
                msg: "정보가 없습니다."
            };
            if (parent.MAINPARENTCUSTOMCODE) {
                parent.setParentCmd(cmd_obj);
            }

        } else if (detail.result == "WAYTYPE") { // 길안내 선택
            if (detail.type == "STORE") {
                var cmd_obj = {
                    sect: "POPUP",
                    type: "STORE_WAYTYPE",
                    id: detail.id,
                    target_floor: detail.target_floor,
                    target_x: detail.target_x,
                    target_y: detail.target_y
                };
                if (parent.MAINPARENTCUSTOMCODE) {
                    parent.setParentCmd(cmd_obj);
                }
            } else if (detail.type == "PARK") {
                var cmd_obj = {
                    sect: "POPUP",
                    type: "PARK_WAYTYPE",
                    id: detail.id,
                    target_floor: detail.target_floor,
                    target_x: detail.target_x,
                    target_y: detail.target_y
                };
                if (parent.MAINPARENTCUSTOMCODE) {
                    parent.setParentCmd(cmd_obj);
                }
            }
        } else if (detail.result == "WAYFLOOR") { // 층이동

            setFloorInfo("WAYFIND", detail.b_code, detail.floor);

        } else if (detail.result == "WAYFLOORCHANGE") { // 길안내시 층이동 재혁추가
            console.log("두번째 길시작")
            setFloorInfo("", detail.b_code, detail.floor);

        } else if (detail.result == "WAYSTART") { // 길안내 시작
            if (detail.mode == "TWOWAY") {
                var i_my = 0;
                var i_target = 0;
                var str_updown = "";

                for (i = 0; i < gl_arr_floors.length; i++) {
                    if (gl_arr_floors[i].code == detail.start_floor) i_my = i;
                    if (gl_arr_floors[i].code == detail.target_floor) i_target = i;
                }

                var str_lang = gl_main_conf.lang.toLowerCase();
                var str_start_title = gl_jsop_lang_data.floor["FLOOR_LEVEL_" + detail.start_floor][str_lang];
                var str_target_title = gl_jsop_lang_data.floor["FLOOR_LEVEL_" + detail.target_floor][str_lang];

                $("#id_page_wayfind_left .start_floor").html(getFloorName(detail.start_floor, gl_main_conf.lang));
                $("#id_page_wayfind_left .target_floor").html(getFloorName(detail.target_floor, gl_main_conf.lang));

                console.log("detail.move_type", detail.move_type);
                if (detail.move_type == "ELE") {
                    $("#id_page_wayfind_left .move_type img").attr("src", "images/wayfinding_elevator.svg");
                } else {
                    $("#id_page_wayfind_left .move_type img").attr("src", "images/wayfinding_escalator.svg");
                }

                $("#id_bottom_main").hide();
            } else if (detail.mode == "THREEWAY") {

                var i_my = 0;
                var i_target = 0;
                var str_updown = "";

                for (i = 0; i < gl_arr_floors.length; i++) {
                    if (gl_arr_floors[i].code == detail.start_floor) i_my = i;
                    if (gl_arr_floors[i].code == detail.target_floor) i_target = i;
                }

                var str_lang = gl_main_conf.lang.toLowerCase();
                var str_start_title = gl_jsop_lang_data.floor["FLOOR_LEVEL_" + detail.start_floor][str_lang];
                var str_mid_title = gl_jsop_lang_data.floor["FLOOR_LEVEL_6F"][str_lang];
                var str_target_title = gl_jsop_lang_data.floor["FLOOR_LEVEL_" + detail.target_floor][str_lang];

                $("#id_page_wayfind_left2 .sub_start_title").html(str_start_title);
                $("#id_page_wayfind_left2 .sub_mid_title").html(str_mid_title);
                $("#id_page_wayfind_left2 .sub_target_title").html(str_target_title);

                $("#id_page_wayfind_left2 .start_floor").html(getFloorName(detail.start_floor, gl_main_conf.lang));
                $("#id_page_wayfind_left2 .mid_floor").html(getFloorName("6F", gl_main_conf.lang));
                $("#id_page_wayfind_left2 .target_floor").html(getFloorName(detail.target_floor, gl_main_conf.lang));

                $("#id_bottom_main").hide();
            }

        } else if (detail.result == "WAYEND") { // 길안내 종료
            console.log(detail.mode);
            if (detail.mode == "TWOWAY") {
                //다른층 길찾기시 설명창 활성화
                $("#id_floor_name_area").hide();
                $("#id_page_wayfind_left").fadeIn();
            } else if (detail.mode == "THREEWAY") {
                $("#id_floor_name_area").hide();
                $("#id_page_wayfind_left2").fadeIn();
            }

            var xx = (0 - $(".here_btn").width / 2);
            var yy = (0 - $(".here_btn").height / 2);
            //var tw = TweenMax.fromTo($(".here_btn"), 0.5, { x:xx,y:yy,scale:1},{ x:xx,y:yy,scale:1.5,  yoyo:true, repeat:9 } );

        }
    }
}

/////////////////////////////////////////////////
// CLICK EVENT
/////////////////////////////////////////////////

function onClickFloorInfo(p_obj) {
    $(".btn_building").removeClass("active");
    var str_code = $(p_obj).attr("code");
    var b_code = $(p_obj).attr("b_code");
    $("#id_page_wayfind_left").hide();
    $("#id_page_wayfind_left2").hide();
    $("#id_floor_name_area").show();
    //console.log(b_code,str_code);
    setFloorInfo("LOCATION", b_code, str_code);
}

function onClickHere(p_obj) {
    onClickCurrLocation();
}

function onClickBuildingInfo(p_obj) {
    var str_code = $(p_obj).attr("code");
    $(".btn_building").removeClass("active");
    $(p_obj).addClass("active");


    $("#id_page_wayfind_left").hide();

    this.m_util = new EltovWayUtil();
    var map_width = Number(gl_conf_header.MAP_WIDTH);
    var map_height = Number(gl_conf_header.MAP_HEIGHT);
    var chg_in_pos = {
        c_x: (map_width / 2),
        c_y: (map_height / 2),
        rad: (gl_map_angle) * Math.PI / 180,
        p_x: 0,
        p_y: 0
    };
    if (str_code == "0") {
        chg_in_pos.p_x = 700;
        chg_in_pos.p_y = 900;

    } else if (str_code == "1") {
        chg_in_pos.p_x = 1600;
        chg_in_pos.p_y = 650;

    } else if (str_code == "2") {
        chg_in_pos.p_x = 2700;
        chg_in_pos.p_y = 600;

    } else if (str_code == "3") {
        chg_in_pos.p_x = 900;
        chg_in_pos.p_y = 650;
    }
    var t_pos = this.m_util.getChgAnglePos(chg_in_pos);

    var send_param = {
        "sect": "CMD",
        "type": "MOVE",
        "x": 0 - t_pos.x,
        "y": 0 - t_pos.y,
        "scale": 0.8
    };
    gl_floor_map.setCallWebToMap(send_param);
}

function onClickPubInfo(p_obj) {

    setFloorInfo("LOCATION", gl_conf_header.B_CODE, gl_conf_header.KIOSK_FLOOR);

    var str_code = $(p_obj).attr("code");
    $(".faci_btn").removeClass("active");
    $(p_obj).addClass("active");

    //if(gl_main_conf.map_load == "SUCC"){
    var send_param = {
        "sect": "WAYFIND",
        "type": "PUB",
//        "way_type": "NEARLOCATION",
        "id": str_code
    };
    gl_floor_map.setCallWebToMap(send_param);
    //}


    var statics_obj = {
        "sect": "PUBLIC",
        "code": str_code
    };
    var cmd_obj = {
        sect: "STATICS",
        type: "",
        id: "",
        code: statics_obj.code,
        obj: {
            sect: "PUBLIC",
            code: statics_obj.code
        }
    };
    parent.setParentCmd(cmd_obj);
}

function onClickCurrLocation() {

    setFloorInfo("LOCATION", gl_conf_header.B_CODE, gl_conf_header.KIOSK_FLOOR);


    $("#id_page_wayfind_left").hide();

    this.m_util = new EltovWayUtil();
    var map_width = Number(gl_conf_header.MAP_WIDTH);
    var map_height = Number(gl_conf_header.MAP_HEIGHT);
    var chg_in_pos = {
        c_x: (map_width / 2),
        c_y: (map_height / 2),
        rad: (gl_map_angle) * Math.PI / 180,
        p_x: 0,
        p_y: 0
    };
    chg_in_pos.p_x = Number(gl_conf_header.POS_X);
    chg_in_pos.p_y = Number(gl_conf_header.POS_Y);
    var t_pos = this.m_util.getChgAnglePos(chg_in_pos);
    setFloorInfo("INIT", gl_conf_header.B_CODE, gl_conf_header.KIOSK_FLOOR);
    //var send_param = {"sect":"CMD","type":"MOVE","x":0-t_pos.x,"y":0-t_pos.y,"scale":0.6};
    //gl_floor_map.setCallWebToMap(send_param);

}


/////////////////////////////////////////////////
// DEBUG
function onClickDebugLang(p_lang) {
    setMainLang("CLICK", p_lang);
}

function onClickDebug01(p_type) {
    setStoreSearch("");
}

function onClickDebugInit(p_type) {
    if (p_type == "START") {
        setMainStart(null);
    } else {
        setMainStop();
    }
}

function onClickDebugWay(p_id) {
    var i = 0;
    var obj;

    if (gl_main_conf.map_load == "SUCC") {
        for (i = 0; i < gl_arr_store_list.length; i++) {
            obj = gl_arr_store_list[i];
            if (obj.id == p_id) {
                var send_param = {
                    "sect": "WAYFIND",
                    "type": "STORE",
                    "id": p_id,
                    "way_type": "WAYFIND",
                    "move_type": "ELE"
                };
                gl_floor_map.setCallWebToMap(send_param);
                break;
            }
        }
    }
}

function onClickDebugPark(p_id) {
    if (gl_main_conf.map_load == "SUCC") {
        var send_param = {
            "sect": "WAYFIND",
            "type": "PARK",
            "id": p_id,
            "way_type": "WAYFIND",
            "move_type": "ELE"
        };
        gl_floor_map.setCallWebToMap(send_param);
    }
}

function onClickDebugLoc(p_id) {
    if (gl_main_conf.map_load == "SUCC") {
        var send_param = {
            "sect": "WAYFIND",
            "type": "STORE",
            "store_id": p_id,
            "way_type": "LOCATION",
            "move_type": "ELE"
        };
        gl_floor_map.setCallWebToMap(send_param);
    }
}

function onClickDebugPub(p_code) {
    if (gl_main_conf.map_load == "SUCC") {
        if (p_code == "P24") {
            var send_param = {
                "sect": "WAYFIND",
                "type": "PUB",
                "way_type": "NEARLOCATION",
                "id": p_code
            };
            gl_floor_map.setCallWebToMap(send_param);
        } else {
            var send_param = {
                "sect": "WAYFIND",
                "type": "PUB",
                "way_type": "NEARLOCATION",
                "id": p_code
            };
            gl_floor_map.setCallWebToMap(send_param);
        }
    }
}

function onClickDebugTwoWay() {
    if (gl_main_conf.map_load == "SUCC") {
        var send_param = {
            "sect": "DEBUG",
            "type": "TWOWAY"
        };
        gl_floor_map.setCallWebToMap(send_param);
    }
}

function onClickDebugMove(p_type) {
    if (gl_main_conf.map_load == "SUCC") {
        if (p_type == "A") {
            var xx = (0 - 340);
            var yy = (0 - 1140);
            var send_param = {
                "sect": "CMD",
                "type": "MOVE",
                "x": xx,
                "y": yy
            };
            gl_floor_map.setCallWebToMap(send_param);
        } else {
            var send_param = {
                "sect": "CMD",
                "type": "MOVE",
                "x": 1300,
                "y": 700
            };
            gl_floor_map.setCallWebToMap(send_param);
        }
    }
}

function onClickDebugScale(p_type) {
    if (gl_main_conf.map_load == "SUCC") {
        if (p_type == "PLUS") {
            var send_param = {
                "sect": "CMD",
                "type": "SCALE",
                "scale": "IN"
            };
            gl_floor_map.setCallWebToMap(send_param);
        } else {
            var send_param = {
                "sect": "CMD",
                "type": "SCALE",
                "scale": "OUT"
            };
            gl_floor_map.setCallWebToMap(send_param);
        }
    }
}

function onClickDebugLine() {
    var send_param = {
        "sect": "DEBUG",
        "type": "LINE"
    };
    gl_floor_map.setCallWebToMap(send_param);
}
