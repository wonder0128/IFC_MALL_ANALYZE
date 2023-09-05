var gl_arr_mnu_main_code = new Array("floor", "store", "food", "event", "nearby", "discount", "facility", "membership",  "pet");
var m_now_page_num = -1;
var gl_arr_mnu_statics_code = new Array("FLO", "STO", "FNB", "EVT", "NEA", "DIS", "FAC", "MEM", "PET");

var gl_arr_lang_code = new Array("KOR", "ENG", "CHN", "JPN");
var categoryData = {
  S0101: "패션",
  S0102: "패션액세서리",
  S0103: "뷰티",
  S0104: "생활/문화",
  S0105: "스포츠",
  S0106: "식음료",
  S0107: "기타",
  S0201: "한식",
  S0202: "아시안 퓨전",
  S0203: "카페/베이커리",
  S0204: "양식",
  S0205: "와인",
  S0206: "기타",
};
var gl_main_conf = {
    lang: "KOR",
    name: "index",
    debug_cnt: 0,
    is_load: 0,
    time_last: 0,
    system_last: 0,
    curr_cnt: 0,
    curr_screen: 1,
    screen_ptime: 0,
    screen_last: 0,
    way_type: "",
    pop_store_id: "",
    pop_target_floor: "",
    pop_target_x: "",
    pop_target_y: "",
    pop_pub_code: "",
    btn_type:"day"
};

var gl_jsop_lang_data = new Object();
var gl_load_data = new Object();
var gl_load_route = new Object();

var gl_arr_screen_list = new Array();
var setTimeoutID = null;

let m_customer_num = 0;

//setTimeout(setInitSetting,500);

// 최초 언어 세팅
function setInitSettingLang(p_load_data) {
    gl_jsop_lang_data = p_load_data;
    setLoadDataContents();

    $("#id_main_init_loading .progress_bar").css({
        "width": "10%"
    });
}

// 최초 세팅
function setInitSetting(p_result) {



    // $("#id_main_frame_intro").show();
    $("#id_main_frame_floor").show();

    if (p_result != "SUCC") {
        return;
    }

    // console.log("setInitSetting");


    gl_load_data = gl_xml_conf.xml_data;
    gl_load_route = gl_xml_conf.xml_route;





    $(".bottom_menu .lang_area .lang_btn .lang_txt").mousedown(function () {
        onClickLangBtn(this);
    });


    $(".bottom_menu .bottom_time_zone").mousedown(function () {
        onClickGoIntro(this);
    });

    $(".bottom_menu .bottom_btn_li .bottom_btn").mousedown(function () {
        onClickBottomMnu(this);
    });



    $(".bottom_menu .lang_area .lang_btn .lang_txt").bind("touchstart", function (e) {
        onClickLangBtn(this);
    });

    $(".bottom_menu .bottom_time_zone").bind("touchstart", function (e) {
        onClickGoIntro(this);
    });

    $(".bottom_menu .bottom_btn_li .bottom_btn").bind("touchstart", function (e) {
        onClickBottomMnu(this);
    });

    $(".list_main").bind("touchstart", function (e) {
        onClickScreenSaver();
    });


    $(".popup_store .popup_base .popup_box .btn_wayfind").bind("touchstart", function (e) {
        onClickPopUpWayFind('WAYFIND', 'STORE', 0);
    });

    $(".popup_store .popup_base .popup_box .btn_location").bind("touchstart", function (e) {
        onClickPopUpWayFind('LOCATION', 'STORE', 0);
    });

    $(".popup_store .popup_base .btn_close").bind("touchstart", function (e) {
        onClickPopupClose('STORE');
    });

    $(".popup_store .popup_close_cover").bind("touchstart", function (e) {
        onClickPopupClose('STORE');
    });


    $(".popup_way .popup_base .btn_close").bind("touchstart", function (e) {
        onClickPopupClose('WAYTYPE');
    });

    $(".popup_store .popup_base .pop_waytype_box .btn_esc").bind("touchstart", function (e) {
        onClickPopupWayType('ESC');
    });

    $(".popup_store .popup_base .pop_waytype_box .btn_ele").bind("touchstart", function (e) {
        onClickPopupWayType('ELE');
    });


    $(".popup_faci .popup_base .pop_fac_box .location").bind("touchstart", function (e) {
        onClickPopUpWayFind('LOCATION', 'FACILITY');
    });

    // 한글 세팅을 하자.
    var str_eng_reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

    for (i = 0; i < gl_load_data.arr_all_store_list.length; i++) {
        obj = gl_load_data.arr_all_store_list[i];
        var remove_kor = getCvtRemoveWhite(obj.STORE_NAME_KOR);
        var arr_dis = Hangul.disassemble(remove_kor, true);

        if (Array.isArray(arr_dis) == true) {
            var cho = arr_dis.reduce(function (prev, elem) {
                elem = elem[0] ? elem[0] : elem;
                return prev + elem;
            }, "");
            /*
            cho = cho.replace(/ㄲ/gi,"ㄱ");
            cho = cho.replace(/ㅉ/gi,"ㅈ");
            cho = cho.replace(/ㅃ/gi,"ㅂ");
            cho = cho.replace(/ㄸ/gi,"ㄷ");
            cho = cho.replace(/ㅆ/gi,"ㅅ");
            */
            cho = cho.toLowerCase();
            cho = cho.replace(str_eng_reg, "");
            //console.log(obj.STORE_NAME_KOR,cho);

            obj.STORE_NAME_CHO = cho;

            str_tmp = obj.STORE_NAME_ENG + "";
            str_tmp = str_tmp.toLowerCase();

            str_tmp = str_tmp.replace(str_eng_reg, "");
            str_tmp = str_tmp.replace(/ /gi, "");
            str_tmp = str_tmp.replace(/\r/gi, "");
            str_tmp = str_tmp.replace(/\n/gi, "");
            str_tmp = str_tmp.replace(/\t/gi, "");

            obj.STORE_SEARCH_ENG = str_tmp;
            //console.log("obj.STORE_NAME_CHO = " + obj.STORE_NAME_CHO);
        }
    }

    setTimeout(setInitSettingEnd, 500);
}

function setInitSettingEnd() {

    setCallWebToApp("STATUS", "STATUS");

    $("#id_main_init_loading .progress_bar").css({
        "width": "40%"
    });
    var division = window.innerWidth > window.innerHeight ? 'W':'H';
    // if (typeof (document["frame_intro"].PAGEACTIVEYN) != 'undefined') {
    //     console.log("setInitConfig INTRO");
    //     document["frame_intro"].setInitConfigLang(gl_jsop_lang_data);
    //     document["frame_intro"].setInitConfig(gl_load_data);
    // }
    if (typeof (document["frame_floor"].PAGEACTIVEYN) != 'undefined') {
        console.log("setInitConfig FLOOR");
        document["frame_floor"].setInitConfigLang(gl_jsop_lang_data);
        document["frame_floor"].setInitConfig(gl_load_data);
    }

    // // if (typeof (document["frame_store"].PAGEACTIVEYN) != 'undefined') {
    // //     console.log("setInitConfig STORE");
    // //     document["frame_store"].setInitConfigLang(gl_jsop_lang_data);
    // //     document["frame_store"].setInitConfig(gl_load_data);
    // // }

    // if (typeof (document["frame_food"].PAGEACTIVEYN) != 'undefined') {
    //     console.log("setInitConfig FOOD");
    //     document["frame_food"].setInitConfigLang(gl_jsop_lang_data);
    //     document["frame_food"].setInitConfig(gl_load_data);
    // }

    // if (typeof (document["frame_event"].PAGEACTIVEYN) != 'undefined') {
    //     console.log("setInitConfig EVENT");
    //     document["frame_event"].setInitConfigLang(gl_jsop_lang_data);
    //     document["frame_event"].setInitConfig(gl_load_data,division);
    // }

    // if (typeof (document["frame_nearby"].PAGEACTIVEYN) != 'undefined') {
    //     console.log("setInitConfig NEARBY");
    //     document["frame_nearby"].setInitConfigLang(gl_jsop_lang_data);
    //     document["frame_nearby"].setInitConfig(gl_load_data);
    // }

    // if (typeof (document["frame_discount"].PAGEACTIVEYN) != 'undefined') {
    //     console.log("setInitConfig DISCOUNT");
    //     document["frame_discount"].setInitConfigLang(gl_jsop_lang_data);
    //     document["frame_discount"].setInitConfig(gl_load_data,division);
    // }

    // if (typeof (document["frame_facility"].PAGEACTIVEYN) != 'undefined') {
    //     console.log("setInitConfig FACILITY");
    //     document["frame_facility"].setInitConfigLang(gl_jsop_lang_data);
    //     document["frame_facility"].setInitConfig(gl_load_data);
    // }

    // if (typeof (document["frame_membership"].PAGEACTIVEYN) != 'undefined') {
    //     console.log("setInitConfig MEMBERSHIP");
    //     document["frame_membership"].setInitConfigLang(gl_jsop_lang_data);
    //     document["frame_membership"].setInitConfig(gl_load_data,division);
    // }

    // if (typeof (document["frame_pet"].PAGEACTIVEYN) != 'undefined') {
    //     console.log("setInitConfig PET");

    //     document["frame_pet"].setInitConfigLang(gl_jsop_lang_data);
    //     document["frame_pet"].setInitConfig(gl_load_data,division);
    // }

    document["frame_floor"].setMainStop();
    document["frame_floor"].setMainStart();
    // document["frame_floor"].setMainStop();
    // document["frame_floor"].setMainStart();

    setTimeout(setInitSettingEnd02, 500);
}

function setInitSettingEnd02() {
    console.log("setInitSettingEnd02");
    var division = window.innerWidth > window.innerHeight ? 'W':'H';

    if (typeof (document["frame_floor"].PAGEACTIVEYN) != 'undefined') {
        console.log("setInitConfig FLOOR");
        document["frame_floor"].setInitConfigLang(gl_jsop_lang_data);
        document["frame_floor"].setInitConfig(gl_load_data,division);
    }
    setTimeout(setInitSettingEnd03, 500);
}

function setInitSettingEnd03() {
    // console.log("setInitSettingEnd03");
    var i_load_err = 0;

    $("#id_main_init_loading .progress_bar").css({
        "width": "70%"
    });

    var str_iframe = $("iframe").contents();

    $("html").mousedown(function (evt) {
        gl_main_conf.time_last = new Date().getTime();
        //console.log("BODY HTML CLICK");
    });
    $("html").bind("touchstart", function (e) {
        gl_main_conf.time_last = new Date().getTime();
        //console.log("BODY HTML CLICK");
    });
    //IFRAME 클릭 감지
    $(str_iframe).mousedown(function (evt) {
        gl_main_conf.time_last = new Date().getTime();
        //console.log("BODY FRAME CLICK");
    });
    $(str_iframe).bind("touchstart", function (e) {
        gl_main_conf.time_last = new Date().getTime();
        //console.log("BODY FRAME TOUCH");
    });


    // if (typeof (document["frame_intro"].PAGEACTIVEYN) == 'undefined') {
    //     i_load_err++;
    // }

    // if (typeof (document["frame_store"].PAGEACTIVEYN) == 'undefined') {
    //     i_load_err++;
    // }

    // if (typeof (document["frame_food"].PAGEACTIVEYN) == 'undefined') {
    //     i_load_err++;
    // }

    // if (typeof (document["frame_event"].PAGEACTIVEYN) == 'undefined') {
    //     i_load_err++;
    // }

    // if (typeof (document["frame_nearby"].PAGEACTIVEYN) == 'undefined') {
    //     i_load_err++;
    // }

    // if (typeof (document["frame_discount"].PAGEACTIVEYN) == 'undefined') {
    //     i_load_err++;
    // }

    // if (typeof (document["frame_facility"].PAGEACTIVEYN) == 'undefined') {
    //     i_load_err++;
    // }

    // if (typeof (document["frame_membership"].PAGEACTIVEYN) == 'undefined') {
    //     i_load_err++;
    // }

    // if (typeof (document["frame_pet"].PAGEACTIVEYN) == 'undefined') {
    //     i_load_err++;
    // }

    //return;
}

function setInitSettingEnd04() {
    // console.log("setInitSettingEnd04");
    var i = 0;
    var str_sday = "";
    var str_eday = "";
    var str_date = "";

    var i_sday = 0,
        i_eday = 0,
        i_date = 0;

    var date = new Date();

    var str_days = date.getFullYear() + "";
    if ((date.getMonth() + 1) < 10) {
        str_days += "0" + (date.getMonth() + 1) + "";
    } else {
        str_days += "" + (date.getMonth() + 1) + "";
    }
    if (date.getDate() < 10) {
        str_days += "0" + date.getDate();
    } else {
        str_days += "" + date.getDate();
    }

    i_date = parseInt(str_days);

    var screen_list = gl_load_data.arr_screen_list;

    for (i = 0; i < screen_list.length; i++) {
        str_sday = screen_list[i].SDAY + "";
        str_eday = screen_list[i].EDAY + "";
        i_sday = parseInt(str_sday);
        i_eday = parseInt(str_eday);

        if (i_sday <= i_date && i_eday >= i_date) {
            gl_arr_screen_list.push(screen_list[i]);
        }
    }
    gl_main_conf.is_load = 1;

    $("#id_main_init_loading .progress_bar").css({
        "width": "100%"
    });
    var time_curr = new Date().getTime();
    gl_main_conf.time_last = time_curr;
    gl_main_conf.system_last = time_curr;
    setCallWebToApp("STATUS", "STATUS");
    setMainLang("INIT", "KOR");
    setInitFsCommand();
    setInterval(setMainInterval, 1000);
    setTimeout(setInitSettingEndDone, 300);
}

function setInitSettingEndDone() {
    $("#id_main_init_loading").remove();
    setMainTimeOut();
}

function setMainTimeOut() {

    if ($("#id_main_screen").css("display") == "none") {
        return;
    } else {
        setNoticeDrawInfo();
    }
}


function setNoticeDrawInfo() {

    var str_type = "";
    var str_show = "",
        str_hide = "";

    if (gl_arr_screen_list.length == 0) return;

    gl_main_conf.curr_cnt++;
    if (gl_main_conf.curr_cnt >= gl_arr_screen_list.length) gl_main_conf.curr_cnt = 0;

    var obj = gl_arr_screen_list[gl_main_conf.curr_cnt];

    //console.log("setScreenDrawInfo");
    //console.log(obj);

    if (gl_main_conf.curr_notice == 1) {
        gl_main_conf.curr_notice = 2;

        str_show = "id_notice_box_02";
        str_hide = "id_notice_box_01";

        $("#id_notice_box_01").css("zIndex", 10);
        $("#id_notice_box_02").css("zIndex", 9);

    } else {
        gl_main_conf.curr_notice = 1;

        str_show = "id_notice_box_01";
        str_hide = "id_notice_box_02";

        $("#id_notice_box_01").css("zIndex", 10);
        $("#id_notice_box_02").css("zIndex", 9);
    }

    if (obj.TYPE == "IMG") {
        $("#" + str_show + " > img").attr("src", obj.FILE_URL);
        $("#" + str_show + " > video").hide();
        $("#" + str_show).children("video")[0].pause();
        $("#" + str_show + " > img").show();
    } else {
        $("#" + str_show + " > video").attr("src", obj.FILE_URL);
        $("#" + str_show + " > video").show();
        $("#" + str_show + " > img").hide();
        $("#" + str_show).children("video")[0].play();
    }

    gl_main_conf.notice_ptime = obj.PTIME;
    if (gl_main_conf.notice_ptime < 5) gl_main_conf.notice_ptime = 5;

    gl_main_conf.notice_ptime = gl_main_conf.notice_ptime * 1000;

    setTimeoutID = setTimeout(setMainTimeOut, gl_main_conf.notice_ptime);
    setTimeout(setNoticeDrawInfoEnd, 500);
}


function setNoticeDrawInfoEnd() {

    if (gl_arr_screen_list.length == 1) {
        if (gl_main_conf.curr_notice == 1) {
            $("#id_notice_box_01").show();
            $("#id_notice_box_02").hide();
        } else {
            $("#id_notice_box_01").hide();
            $("#id_notice_box_02").show();
        }
    } else {
        if (gl_main_conf.curr_notice == 1) {
            $("#id_notice_box_01").fadeIn();
            $("#id_notice_box_02").fadeOut();
        } else {
            $("#id_notice_box_01").fadeOut();
            $("#id_notice_box_02").fadeIn();
        }
    }
}

function setMainLang(p_type, p_lang) {
    var i = 0;
    var str_code = "";

    if (p_type === "INIT") {
        if (gl_main_conf.lang == p_lang) return;
    }
    //console.log(">>", p_lang);
    gl_main_conf.lang = p_lang;

    //console.log("setMainLangsetMainLang");

    //다국어 추가 부분
    var str_attr = "";
    //console.log("//", gl_main_conf.lang);
    var str_lang = gl_main_conf.lang.toLowerCase();
    var division=window.innerWidth > window.innerHeight ? 'W' : 'H';


    $(".lang_code_names").each(function (i) {
        str_attr = $(".lang_code_names").eq(i).attr("lang_code");
        try {
            $(this).html(gl_jsop_lang_data[gl_main_conf.name][str_attr][str_lang]);
        } catch (err) {
           //  console.log("ERROR LANG INDEX : " + str_attr);
        }
    });

    $(".bottom_btn_text").each(function (i) {
        if (p_lang == "KOR") {
            $(".bottom_btn_text").css({
                "font-size": "19px"
            });
        } else {
            $(".bottom_btn_text").css({
                "font-size": "19px"
            });
        }

    });

    try {} catch (err) {}


    try {
        if (typeof (document["frame_intro"].PAGEACTIVEYN) != 'undefined') {
            document["frame_intro"].setMainLang(p_type, p_lang);
        }
        if (typeof (document["frame_floor"].PAGEACTIVEYN) != 'undefined') {
            document["frame_floor"].setMainLang(p_type, p_lang);
        }
        if (typeof (document["frame_store"].PAGEACTIVEYN) != 'undefined') {
            document["frame_store"].setMainLang(p_type, p_lang);
        }
        if (typeof (document["frame_food"].PAGEACTIVEYN) != 'undefined') {
            document["frame_food"].setMainLang(p_type, p_lang);
        }
        if (typeof (document["frame_event"].PAGEACTIVEYN) != 'undefined') {
            document["frame_event"].setMainLang(p_type, p_lang);
        }
        if (typeof (document["frame_nearby"].PAGEACTIVEYN) != 'undefined') {
            document["frame_nearby"].setMainLang(p_type, p_lang);
        }
        if (typeof (document["frame_discount"].PAGEACTIVEYN) != 'undefined') {
            document["frame_discount"].setMainLang(p_type, p_lang,division);
        }
        if (typeof (document["frame_facility"].PAGEACTIVEYN) != 'undefined') {
            document["frame_facility"].setMainLang(p_type, p_lang);
        }
        if (typeof (document["frame_pet"].PAGEACTIVEYN) != 'undefined') {
            document["frame_pet"].setMainLang(p_type, p_lang,division);
        }
        if (typeof (document["frame_membership"].PAGEACTIVEYN) != 'undefined') {
            document["frame_membership"].setMainLang(p_type, p_lang,division);
        }
    } catch (err) {
        // console.log("ERROR ERROR MAIN LANG");
    }

}

///////////////////////////////////////////////
// 화면전환
function setMainViewOpen(p_mnu, p_obj) {
    var str_code = p_mnu;
    var t_num = gl_arr_mnu_main_code.indexOf(str_code);
    if (str_code == "floor") {
        $(".bottom_menu .bottom_btn_li .bottom_btn").removeClass("active");
        for (i = 0; i < gl_arr_mnu_main_code.length; i += 1) {
            $("#id_main_frame_" + gl_arr_mnu_main_code[i]).hide();
        }
        $("#id_main_frame_floor").fadeIn();

        if (typeof (document["frame_floor"].setMainStart) == 'function') {
            document["frame_floor"].setMainStart(p_obj);
            /*str_statics = "HOM";
            var statics_obj = {
                "sect": "MENU",
                "code": str_statics
            }
            setStatisSend(statics_obj);*/
        }
        m_now_page_num = -1;
    } else if (str_code == "") {
        $(".bottom_menu .bottom_btn_li .bottom_btn").removeClass("active");
        for (i = 0; i < gl_arr_mnu_main_code.length; i += 1) {
            $("#id_main_frame_" + gl_arr_mnu_main_code[i]).hide();
        }
    } else {
        $(".bottom_menu .bottom_btn_li .bottom_btn").removeClass("active");
        $($(".bottom_menu .bottom_btn_li .bottom_btn")[t_num]).addClass("active");

        if ($("#id_main_frame_floor").css("display") != "none") {
            // $("#id_main_frame_intro").fadeOut();
            // $("#id_main_frame_floor").fadeOut();
            if (typeof (document["frame_floor"].setMainStop) == 'function') {
                document["frame_floor"].setMainStop();
                str_statics = gl_arr_mnu_statics_code[i];
                var statics_obj = {
                    "sect": "MENU",
                    "code": str_statics
                }
                setStatisSend(statics_obj);
            }
        }
        for (i = 0; i < gl_arr_mnu_main_code.length; i += 1) {
            //console.log(i + "< " + t_num);
            if (i == t_num) {
                //if(m_now_page_num != t_num)
                //{
                //console.log(t_num+".."+str_code);
                //console.log(p_obj.page_type);
                if (typeof (document["frame_" + str_code].setMainStart) == 'function') {
                    document["frame_" + str_code].setMainStart(p_obj);
                    str_statics = gl_arr_mnu_statics_code[i];
                    var statics_obj = {
                        "sect": "MENU",
                        "code": str_statics
                    }
                    //console.log("p_obj.sect",p_obj.sect);
                    if (p_obj.sect == undefined || p_obj.sect == "MENU") {
                        setStatisSend(statics_obj);
                    }
                }

                $("#id_main_frame_" + str_code).fadeIn();
                m_now_page_num = t_num;
                //}
            } else {
                //console.log("frame_" + str_code);
                if (str_code == "") {

                } else {
                    if (typeof (document["frame_" + str_code].setMainStop) == 'function') {
                        document["frame_" + str_code].setMainStop();
                    }
                }
                $("#id_main_frame_" + gl_arr_mnu_main_code[i]).hide();
            }
        }
    }
}

function setScreenAuto() {
    $("#id_popup_error").hide();
    $("#id_page_block_white").hide();
    $("#id_pop_error").hide();
    $("#id_popup_store").hide();
    $("#id_popup_fnb").hide();
    $("#id_popup_fac").hide();
    $("#id_popup_waytype").hide();

    if ($("#id_main_screen").css("display") == "none") {
        setTimeoutID = setTimeout(setMainTimeOut, gl_main_conf.notice_ptime);
        $("#id_main_screen").fadeIn();
        if (typeof (document["frame_intro"].setMainStop) == 'function') {
            document["frame_intro"].setMainStop();
        }
        setMainViewOpen("", obj);
    }
    //console.log($("#id_lang_btn_kor"));
    onClickLangBtn($("#id_lang_btn_kor"))
    //setMainLang("INIT", "KOR");

}


///////////////////////////////////////////////
// CLICK EVENT

function onClickScreenSaver() {

    if ($("#id_main_screen").css("display") == "none") {
        return;
    }

    // try {
    //     $("#id_screen_area_01").children("video")[0].pause();
    // } catch (err) {}
    // try {
    //     $("#id_screen_area_02").children("video")[0].pause();
    // } catch (err) {}

    $("#id_popup_error").hide();
    $("#id_page_block_white").hide();
    $("#id_pop_error").hide();
    $("#id_popup_store").hide();
    $("#id_popup_fnb").hide();
    $("#id_popup_fac").hide();
    $("#id_popup_waytype").hide();

    $("#id_main_screen").fadeOut();

    var obj = {};
    if (typeof (document["frame_intro"].setMainStart) == 'function') {
        document["frame_intro"].setMainStart(obj);
    }

    $("#id_main_frame_intro").show();
    //setMainViewOpen("",obj);

    clearTimeout(setTimeoutID);
}


function setStatisSend(p_obj) {

    var str_statics = "";
    if (p_obj.code == undefined) {
        return;
    }

    if (p_obj.sect == "MENU") {
        str_statics = "MENU|" + p_obj.code;
    } else if (p_obj.sect == "STORE") {
        str_statics = "STORE|" + p_obj.code;
    } else if (p_obj.sect == "EVENT") {
        str_statics = "EVENT|" + p_obj.code;
    } else if (p_obj.sect == "PUBLIC") {
        str_statics = "PUBLIC|" + p_obj.code;
    }else if (p_obj.sect == "NEARBY") {
        str_statics = "NEARBY|" + p_obj.code;
    }
    //console.log("str_statics : "+str_statics);
    setCallWebToApp("BIG_DATA", str_statics);
}

function onClickLangBtn(p_obj) {
    var str_code = $(p_obj).attr("code");
    //console.log("code", str_code);

    for (i = 0; i < 4; i += 1) {
        //console.log($($(".lang_area .lang_btn .lang_txt")[i]));
        //console.log($($(".lang_area .lang_btn .lang_txt")[i]).attr("code"));
        if ($($(".lang_area .lang_btn .lang_txt")[i]).attr("code") != str_code) {
            $($(".lang_area .lang_btn .lang_txt")[i]).removeClass("active");
        } else {
            $($(".lang_area .lang_btn .lang_txt")[i]).addClass("active");
        }
    }
    setMainLang("CLICK", str_code);

}

function onClickGoIntro(p_obj) {
    setMainViewOpen("home", obj);
}

function onClickBottomMnu(p_obj) {
    //console.log(p_obj);
    var str_code = $(p_obj).attr("code");
    var obj = {};
    setMainViewOpen(str_code, obj);
}


// 메인인터벌
function setMainInterval() {
    //
    var time_gap = 0;
    var time_curr = new Date().getTime();

    gl_main_conf.debug_count = 0;

    time_gap = time_curr - gl_main_conf.time_last;
    time_gap = Math.floor(time_gap / 1000);

    // 인트로 체크
    if (time_gap > 60) {
        gl_main_conf.time_last = time_curr;
        setMainViewOpen("home");
    }

    // 시스템 체크
    time_gap = time_curr - gl_main_conf.system_last;
    time_gap = Math.floor(time_gap / 1000);
    //console.log("time_gap",time_gap);
    if (time_gap > 60) {
        gl_main_conf.system_last = time_curr;
        if (gl_main_conf.is_load == 1) {
            setCallWebToApp("STATUS", "STATUS");
        }
    }
    let today = new Date();
    let t_rour = today.getHours();
    let t_rmin = today.getMinutes();
    let t_time = parseInt(t_rour+""+t_rmin)
    //console.log(t_time, gl_main_conf.btn_type);

    /*
    if(t_time<1030 || t_time>=2100){
        if(gl_main_conf.btn_type=="day"){
            gl_main_conf.btn_type="night";
            console.log("모드 체크 : ",gl_main_conf.btn_type);
        }
    }else{
        if(gl_main_conf.btn_type=="night"){
            gl_main_conf.btn_type="day";
            console.log("모드 체크 : ",gl_main_conf.btn_type);
        }
    }
    */
    /*
    if(t_rour>=2100 && gl_main_conf.btn_type=="day"){
        gl_main_conf.btn_type="night";
        console.log("모드 체크 : ",gl_main_conf.btn_type);
    }else if(t_rour<1030 && gl_main_conf.btn_type=="day"){
        gl_main_conf.btn_type="night";
        console.log("모드 체크 : ",gl_main_conf.btn_type);
    }else if(t_rour<2100 && gl_main_conf.btn_type=="night"){
        gl_main_conf.btn_type="day";
        console.log("모드 체크 : ",gl_main_conf.btn_type);
    }
    */

}



/////////////////////////////////////////////////
// IFRAME과 통신
/////////////////////////////////////////////////

function setParentCmd(p_obj) {
    var str_html = "";

    if (p_obj.sect == "POPUP") {

        if (p_obj.type == "STORE_INFO") {
            setMakeInfoPopUpStore(p_obj);
        } else if (p_obj.type == "FACILITY_INFO") {
            setMakeInfoPopUpFacility(p_obj);
        } else if (p_obj.type == 'NEARBY_INFO'){
            setMakeInfoPopUpNearBy(p_obj);
        }else if (p_obj.type == "STORE_WAYTYPE") {
            gl_main_conf.way_type = "STORE";
            gl_main_conf.pop_store_id = p_obj.id + "";
            gl_main_conf.pop_target_floor = getChkNull(p_obj.target_floor, "");
            gl_main_conf.pop_target_x = getChkNull(p_obj.target_x, "");
            gl_main_conf.pop_target_y = getChkNull(p_obj.target_y, "");

            $("#id_popup_waytype").fadeIn(200);
        } else if (p_obj.type == "ERROR") {
            setMakeInfoPopUpError(p_obj);
        } else if (p_obj.type == "NOPARK") {
            setMakeNoparkPopUpError();
        }
    } else if (p_obj.sect == "FLOOR") {
        if (p_obj.type == "DONE") { // 지도 로딩 끝
            setTimeout(setInitSettingEnd04, 1000);
        }

    } else if (p_obj.sect == "WAYFIND" || p_obj.sect == "LOCATION") {
        var way_obj = {
            sect: p_obj.sect,
            type: p_obj.type,
            "id": p_obj.id,
            "code": getChkNull(p_obj.code, ""),
            "move_type": getChkNull(p_obj.move_type, ""),
            "target_floor": getChkNull(p_obj.target_floor, ""),
            "target_x": getChkNull(p_obj.target_x, ""),
            "target_y": getChkNull(p_obj.target_y, "")
        };
        setMainViewOpen("floor", way_obj);

    } else if (p_obj.sect == "STATICS") {
        setStatisSend(p_obj.obj);
    } else if (p_obj.sect == "HIDE") {
        str_html = p_obj.type;
        str_html = str_html.toLowerCase();
        $("#id_main_frame_" + str_html).hide();
    } else if (p_obj.sect == "MENU") {
        setMainViewOpen(p_obj.code, p_obj);
    }
}




function onClickPopWaitTerm(p_obj, p_type) {
    if (p_type == "CHECK") {
        var str_code = $(p_obj).parent().attr("code");
        var str_check = $(p_obj).parent().attr("check");
        if (str_code == "ALL") {
            if (str_check == "CHECK") {
                $(".pop_wait_input .terms .term_list").attr("check", "");
                $(".pop_wait_input .terms .term_list").find(".icon").removeClass("active");
            } else {
                $(".pop_wait_input .terms .term_list").attr("check", "CHECK");
                $(".pop_wait_input .terms .term_list").find(".icon").addClass("active");
            }
        } else {
            if (str_check == "CHECK") {
                $(p_obj).parent().attr("check", "");
                $(p_obj).parent().find(".icon").removeClass("active");
            } else {
                $(p_obj).parent().attr("check", "CHECK");
                $(p_obj).parent().find(".icon").addClass("active");
            }
        }
    } else if (p_type == "VIEW") {
        var str_code = $(p_obj).parent().attr("code");
        var str_id = "id_" + str_code + "_desc";

        if ($("#" + str_id).css("display") == "none") {
            $("#" + str_id).show();
            $(p_obj).find(".triangle").html("&#9650;");
            $(p_obj).find(".triangle").addClass("active");
        } else {
            $("#" + str_id).hide();
            $(p_obj).find(".triangle").html("&#9660;");
            $(p_obj).find(".triangle").removeClass("active");
        }
    }
}

function onClickPopWaitNum(p_obj) {
    var str_code = $(p_obj).attr("code");
    var i_num = Number($("#id_txt_popwait_num").val());
    if (str_code == "MINUS") {
        if (i_num <= 0) return;
        i_num--;
        $("#id_txt_popwait_num").val(i_num + "");
    } else if (str_code == "PLUS") {
        if (i_num >= 4) return;
        i_num++;
        $("#id_txt_popwait_num").val(i_num + "");
    }
}

function onClickPopWaitPhone(p_obj) {
    var str_code = $(p_obj).attr("code");
    var str_val = $("#id_txt_popwait_phone").val();

    str_val = str_val.replace(/-/gi, "");

    if (str_code == "ALLDEL") {
        str_val = "";
        $("#id_txt_popwait_phone").val("");
        return;
    } else if (str_code == "DEL") {
        //console.log("str_valstr_val = " + str_val);
        if (str_val.length >= 1) {
            str_val = str_val.substring(0, str_val.length - 1);
        }
    } else {
        if (str_val.length < 11) {
            str_val += str_code;
        }
    }

    str_val = str_val.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
    $("#id_txt_popwait_phone").val(str_val);

}


function onClickPopupClose(p_type) {
    if (p_type == "STORE") {
        $("#id_popup_store").fadeOut();
        $("#id_popup_fnb").fadeOut();
    } else if (p_type == "WAYTYPE") {
        $("#id_popup_waytype").fadeOut();
    } else if (p_type == 'NEARBY'){
        $("#id_popup_nearby").fadeOut();
    }else if (p_type == "FACILITY") {
        $("#id_popup_fac").fadeOut();
    } else if (p_type == "ERROR") {
        $("#id_popup_error").fadeOut();
    }else if (p_type == "NOPARK") {
        $("#id_popup_nopark").fadeOut();
    }
}



/////////////////////////////////////////////////////
// WAYFIND

function onClickPopupWayType(p_type) {

    if (gl_main_conf.way_type == "STORE") {
        var way_obj = {
            sect: "WAYFIND",
            type: "STORE",
            "id": gl_main_conf.pop_store_id,
            "move_type": p_type,
            "target_floor": gl_main_conf.pop_target_floor,
            "target_x": gl_main_conf.pop_target_x,
            "target_y": gl_main_conf.pop_target_y
        };
        setMainViewOpen("floor", way_obj);
    }
    onClickPopupClose("WAYTYPE");
}

// 길안내
function onClickPopUpWayFind(p_sect, p_type) {

    var way_obj = {
        sect: p_sect,
        type: p_type,
        id: "",
        move_type: "",
        floor: ""
    };

    if (p_type == "STORE") {
        way_obj.id = gl_main_conf.pop_store_id;
        onClickPopupClose("STORE");
    } else if (p_type == 'NEARBY') {
    way_obj.id = gl_main_conf.pop_store_id;
        onClickPopupClose('NEARBY');
    } else if (p_type == "FACILITY") {
        way_obj.id = gl_main_conf.pop_pub_code;
        onClickPopupClose("FACILITY");
    }

    setMainViewOpen("floor", way_obj);
}


///////////////////////////////////////////////
//  POPUP
function setMakeInfoPopUpStore(p_obj) {
    var i = 0,
        j = 0,
        i_found = 0;
    var i_cnt = 0;
    var obj;
    var str_img = "",
        str_menu_0 = "",
        str_menu_1 = "",
        str_menu_name_0 = "",
        str_menu_name_1 = "",
        str_name = "",
        str_desc = "";
    gl_main_conf.pop_store_id = "";

    for (i = 0; i < gl_load_data.arr_all_store_list.length && i < 3000; i++) {
        obj = gl_load_data.arr_all_store_list[i];
        if (p_obj.id == obj.id) {

            str_img = "";

            if (gl_main_conf.lang == "KOR") str_name = obj.STORE_NAME_KOR;
            if (gl_main_conf.lang == "ENG") str_name = obj.STORE_NAME_ENG;
            if (gl_main_conf.lang == "CHN") str_name = obj.STORE_NAME_CHN;
            if (gl_main_conf.lang == "JPN") str_name = obj.STORE_NAME_JPN;

            if (gl_main_conf.lang == "KOR") str_desc = obj.STORE_DESC_KOR;
            if (gl_main_conf.lang == "ENG") str_desc = obj.STORE_DESC_ENG;
            if (gl_main_conf.lang == "CHN") str_desc = obj.STORE_DESC_CHN;
            if (gl_main_conf.lang == "JPN") str_desc = obj.STORE_DESC_JPNG;

            if (gl_main_conf.lang == "KOR") str_menu_name_0 = obj.STORE_MENU_01_NAME_KOR;
            if (gl_main_conf.lang == "ENG") str_menu_name_0 = obj.STORE_MENU_01_NAME_ENG;
            if (gl_main_conf.lang == "CHN") str_menu_name_0 = obj.STORE_MENU_01_NAME_CHN;
            if (gl_main_conf.lang == "JPN") str_menu_name_0 = obj.STORE_MENU_01_NAME_JPN;

            if (gl_main_conf.lang == "KOR") str_menu_name_1 = obj.STORE_MENU_02_NAME_KOR;
            if (gl_main_conf.lang == "ENG") str_menu_name_1 = obj.STORE_MENU_02_NAME_ENG;
            if (gl_main_conf.lang == "CHN") str_menu_name_1 = obj.STORE_MENU_02_NAME_CHN;
            if (gl_main_conf.lang == "JPN") str_menu_name_1 = obj.STORE_MENU_02_NAME_JPN;




            let today = new Date();
            let t_rour = today.getHours();
            let t_rmin = today.getMinutes();
            str_rour = t_rour.toString().padStart(2, "0");
            str_rmin = t_rmin.toString().padStart(2, "0");
            let t_time = parseInt(str_rour+""+str_rmin)


            $("#id_btn_wayfind").show();

            str_img = obj.STORE_MAIN_URL;
            if (str_img == "" || str_img == undefined) {
                str_img = "<p class=\"lang_name_thumb\">" + str_name + "</p>";
            } else {
                str_img = "<img src=\"" + str_img + "\" draggable=false>";
            }
            console.log("str_img="+str_img);
            $("#id_pop_store_thumb").html(str_img);
            $("#id_pop_store_title").html(str_name);
            $("#id_pop_store_floor").html(getFloorName(obj.STORE_FLOOR, gl_main_conf.lang));
            console.log("cate_code ="+obj.CATE_CODE)
            $("#id_pop_store_category").html(getCateName(obj.CATE_CODE, gl_main_conf.lang));
            $("#id_pop_store_desc").html(str_desc);
//            $("#id_pop_store_category").attr("lang_code","STORE_CATE_MAIN_"+obj.CATE_CODE.sub_cate.substring(0, 1) + obj.CATE_CODE.sub_cate.substring(3));

//            if (obj.CATE_CODE.sub_cate in this.categoryData) {
//              $("#id_pop_store_category").html(categoryData[obj.CATE_CODE.sub_cate]);
//            }

            $("#id_pop_store_time").html(obj.STORE_SERVICETIME);
            $("#id_pop_store_phone").html(obj.STORE_PHONE);

            gl_main_conf.pop_store_id = p_obj.id + "";

            i_found = 1;
            break;
        }
    }

    if (i_found == 1) {

        var statics_obj = {
            "sect": "STORE",
            "code": p_obj.id
        }
        setStatisSend(statics_obj);

        if (obj.CATE_CODE == "S222210") {
            $("#id_popup_fnb").fadeIn();
        } else {
            $("#id_popup_store").fadeIn();
        }

    }
}

function setMakeInfoPopUpFacility(p_obj) {

    gl_main_conf.pop_pub_code = p_obj.id;
    $("#id_pop_fac_floor").html(p_obj.floor);
    $("#id_popup_fac .title").html(p_obj.title);
    $("#id_popup_fac .img_box > img").attr("src", p_obj.img_src);



    var statics_obj = {
        "sect": "PUBLIC",
        "code": p_obj.id
    }
    setStatisSend(statics_obj);

    /*
    var popup = document.getElementById("id_popup_fac");
    var crect = popup.getBoundingClientRect();
    popup.style.left = (1920-470)/2 + "px";
    */

    $("#id_popup_fac").fadeIn(200);
}

function setMakeInfoPopUpNearBy(p_obj) {

    console.log(p_obj, '###########################');

    gl_main_conf.pop_pub_code = p_obj.id;
    $("#id_popup_nearby .nearby_fac").html(p_obj.building);
    $("#id_popup_nearby .nearby_floor > strong").html(p_obj.floor);
    $("#id_popup_nearby .nearby_name").html(p_obj.title);

    if(p_obj.img_src != ''){
        $("#id_popup_nearby #id_pop_nearby_thumb > img").attr("src", p_obj.img_src);
    }else{
        $('#id_popup_nearby #id_pop_nearby_thumb').html('<p class="lang_code_names" style="font-size:32px;">' + p_obj.title + '</p>')
    }
    $('#id_popup_nearby .nearby_desc').html(p_obj.desc);

    console.log(p_obj.desc);
    gl_main_conf.pop_store_id = p_obj.id + "";

    var statics_obj = {
        "sect": "NEARBY",
        "code": p_obj.id
    }
    setStatisSend(statics_obj);

    /*
    var popup = document.getElementById("id_popup_fac");
    var crect = popup.getBoundingClientRect();
    popup.style.left = (1920-470)/2 + "px";
    */

    $("#id_popup_nearby").fadeIn(200);
}

function setMakeNoparkPopUpError(p_obj) {

    $("#id_popup_nopark").fadeIn(200);
}

function setMakeInfoPopUpError(p_obj) {

    $("#id_pop_error_msg").html(p_obj.msg);
    $("#id_popup_error").fadeIn(200);
}

window.onload = () => {
    let tabBtn = $('.bottom_btn_li');
    let locationTxt = ['PLEASE SELECT A GUIDE', 'FLOOR GUIDE', 'STORE SEARCH', 'F&B', 'EVENT', 'NEARBY FACILITIES', 'DISCOUNT OF PARKING FEE', 'FACILITIES GUIDE', 'MEMBERSHIP & GIFT CARD', 'PET GUIDE'];

    if($('#location h2').text('- PLEASE SELECT A GUIDE -')){
            $('#location h2').css('font-size', '18px');
        }else{
            $('#location h2').css('font-size', '28px');
        }

    tabBtn.click(function(){
        let thisPattern = $(this).attr('data-pattern');
        $('.location_bg').css("background-image", "url('./images/pattern/pattern_" + thisPattern + ".png')");
        $('#location h2').text(`${locationTxt[($(this).index()) + 1]}`)
        $('#location h2').css('font-size', '28px');
    })
}

///////////////////////////////////////////////
// UTIL
