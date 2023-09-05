var gl_arr_lang_code = new Array("KOR", "ENG", "CHN", "JPN");

var gl_main_conf = {
    lang: "KOR",
    name: "intro",
    curr_cnt: 0,
    curr_notice: 1,
    notice_ptime: 10
};

var gl_list_conf = {
    box_list_width: 720,
    box_width: 720,
    box_height: 1280,
    slider_margin: 30,
    list_cnt: 0,
    curr_cnt: 0,
    auto_move: "NONE"
};

var gl_conf_header = new Object();
var gl_jsop_lang_data = new Object();

var gl_arr_notice_list = new Array();
var gl_arr_notice_near = new Array();
var setTimeoutID = null;
/////////////////////////////////////////////////
// 초기화 함수들

function setInitSettingLang(p_load_data) {
    gl_jsop_lang_data = p_load_data;
}

function setInitSetting(p_result) {
    //console.log("setInitSettingsetInitSettingsetInitSettingsetInitSettingsetInitSetting");

    var i = 0;

    if (p_result != "SUCC") {
        console.log("FAIL LOAD DATA/ROUTE");
        return;
    }

    var ret_offset = $("#id_page_notice_list").offset();
    var ret_width = $("#id_page_notice_list").width();

    // gl_list_conf.parent_x = ret_offset.left;
    gl_list_conf.parent_w = ret_width;


    for (i = 0; i < 5; i++) {
        var obj = {
            idx: 0,
            left: 0
        };
        gl_arr_notice_near.push(obj);
    }

    if (parent.MAINPARENTCUSTOMCODE) {
        //console.log("SSSSSSSSSSSSSSSSSDDDDDDDDDDDDDDD");
    } else {
        console.log("LOCAL SETTING INTRO");
        setInitConfig(gl_xml_conf.xml_data);
    }

    $(".bottom_btn").click(function () {
        onClickSelectMenu(this);
    });

    //$("#id_list_bg > img").attr("src", "commonfiles/intro/MAIN0000010.jpg");
}



function onClickSelectMenu(p_obj) {

    $(".bottom_btn").removeClass("active");
    $(p_obj).addClass("active");

    var str_code = $(p_obj).attr("code");

    var cmd_obj = {
        sect: "MENU",
        type: "",
        id: "",
        code: str_code
    };
    if (parent.MAINPARENTCUSTOMCODE) {
        parent.setParentCmd(cmd_obj);
    }
}



function setInitConfig(p_load_data) {
    var intro_bg_list = p_load_data.arr_screen_list.SCREEN_INFO;
    var intro_list=[];
        var division = window.innerWidth > window.innerHeight ? 'W':'H';
        for (var i = 0; i < intro_bg_list.length; i++) {
        if(division == intro_bg_list[i].WIDTH_HEIGHT_TYPE){
            intro_list.push(intro_bg_list[i]);
        }
        }

            intro_list.sort(function (a, b) {
                return a.ORDER_NUM - b.ORDER_NUM;
            });

            var currentIndex = 0;
            var currentTime = 0;

            function switchImage() {
                $("#id_list_bg > img").attr("src", intro_list[currentIndex].SCREEN_MAIN_URL);
                currentTime = 0;
                currentIndex = (currentIndex + 1) % intro_list.length;
            }

            switchImage();

            setInterval(function () {
                currentTime++;
                if (currentTime >= intro_bg_list[currentIndex].PLAT_TIME) {
                    switchImage();
                }
            }, 1000);

}

function setInitConfigLang(p_lang) {
    gl_jsop_lang_data = p_lang;
}

function setMainInterval() {

    let today = new Date();

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1; // 월
    let date = today.getDate(); // 날짜
    let day = today.getDay(); // 요일
    //console.log(month,date,day);
    let t_list = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]
    let t_list_eng = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    if (gl_main_conf.lang=="KOR") {
        $("#id_day").html(t_list[day]);
    } else {
        $("#id_day").html(t_list_eng[day]);
    }

    $("#id_date").html(month.toString().padStart(2, "0") + "/" + date.toString().padStart(2, "0"));

    let t_ampm = "AM";
    let t_rour = today.getHours();
    let t_hour = -1;
    if (t_rour > 12) {
        t_ampm = "PM"
        t_hour = t_rour - 12;
    } else {
        t_hour = t_rour;
    }
    $("#id_ampm").html(t_ampm);
    $("#id_time").html(t_hour.toString().padStart(2, "0") + ":" + today.getMinutes().toString().padStart(2, "0"));

}

function setMainLang(p_type, p_lang) {
    var i = 0;
    var str_code = "";

    // console.log("MAIN LANG FLOOR");

    if (p_type != "INIT") {
        if (gl_main_conf.lang == p_lang) return;
    }

    gl_main_conf.lang = p_lang;

    var str_attr = "";
    var str_lang = gl_main_conf.lang.toLowerCase();

    $(".lang_code_names").each(function (i) {
        str_attr = $(".lang_code_names").eq(i).attr("lang_code");
        try {
            $(this).html(gl_jsop_lang_data[gl_main_conf.name][str_attr][str_lang]);
        } catch (err) {
            console.log("ERROR LANG INTRO : " + str_attr);
        }
    });

    for (i = 0; i < gl_arr_lang_code.length; i++) {
        str_code = gl_arr_lang_code[i].toLowerCase();
        if (str_lang == str_code) {
            $("#id_btn_lang_" + str_code).addClass("active");
        } else {
            $("#id_btn_lang_" + str_code).removeClass("active");
        }
    }
    setMainInterval();
}


function setMainStart(p_obj) {
    if (PAGEACTIVEYN == true) {
        return;
    }
    PAGEACTIVEYN = true;
    // console.log(gl_list_conf.auto_move);
    if (gl_list_conf.auto_move != "AUTO") {

        gl_list_conf.auto_move = "AUTO";
        setMainTimeOut();
    }

    $(".bottom_btn").removeClass("active");
}


function setMainStop() {

    clearTimeout(setTimeoutID);
    gl_list_conf.auto_move = "NONE";

    if (PAGEACTIVEYN == false) {
        return;
    }

    PAGEACTIVEYN = false;
}


/////////////////////////////////////////////////
// NOTICE
function setMainTimeOut() {
    if (gl_list_conf.auto_move != "AUTO") return;
    setNoticeDrawInfo();
}


function setNoticeDrawInfo() {

    var str_type = "";
    var str_show = "",
        str_hide = "";

    if (gl_arr_notice_list.length == 0) return;

    gl_main_conf.curr_cnt++;
    if (gl_main_conf.curr_cnt >= gl_arr_notice_list.length) gl_main_conf.curr_cnt = 0;

    var obj = gl_arr_notice_list[gl_main_conf.curr_cnt];

    //console.log("setNoticeDrawInfo");
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
        // $("#" + str_show).children("video")[0].pause();
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

    if (gl_arr_notice_list.length == 1) {
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

/////////////////////////////////////////////////
// DEBUT
/////////////////////////////////////////////////

function onClickDebug01() {
    console.log("onClickDebug01");
    setNextNotice();
}

function onClickDebugContents(p_dir) {
    setContentsDir(p_dir);
}

function onClickDebugStart(p_type) {
    if (p_type == "START") {
        setMainStart(null);
    } else {
        setMainStop();
    }
}

function onClickDebugLang(p_lang) {
    setMainLang("CLICK", p_lang);
}

function onClickDebugNetwork(p_type) {
    setNetworkChange(p_type);
}
