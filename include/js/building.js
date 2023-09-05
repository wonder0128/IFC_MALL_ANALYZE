var gl_main_conf = {
    lang: "KOR",
    name: "building",
    search_num: "",
    img_url: "",
    search_url: "",
    is_block: false,
    xml_data: new Object()
};


var gl_conf_header = new Object();
var gl_jsop_lang_data = new Object();

var gl_arr_faci_list = new Array();
var gl_arr_faci_active = new Array();


/////////////////////////////////////////////////
// 초기화 함수들

function setInitSettingLang(p_load_data) {
    gl_jsop_lang_data = p_load_data;
}

function setInitSetting(p_result) {

    if (p_result != "SUCC") {
        console.log("FAIL LOAD DATA/ROUTE");
        return;
    }
    if (parent.MAINPARENTCUSTOMCODE) {

    } else {
        console.log("LOCAL SETTING BUILDING");
        setInitConfig(gl_xml_conf.xml_data);
    }
}

function setInitConfig(p_load_data) {
    gl_main_conf.xml_data = p_load_data;
}

function setInitConfigLang(p_lang) {
    gl_jsop_lang_data = p_lang;
}

function setMainLang(p_type, p_lang) {
    var i = 0;
    var str_code = "";

    // console.log("MAIN LANG BUILDING");

    if (p_type != "INIT") {
        if (gl_main_conf.lang == p_lang) return;
    }

    gl_main_conf.lang = p_lang;


    var str_attr = "";
    var str_lang = gl_main_conf.lang.toLowerCase();

    $(".lang_code_names").each(function (i) {
        str_attr = $(".lang_code_names").eq(i).attr("lang_code");
        try {
            //console.log(gl_jsop_lang_data[gl_main_conf.name][str_attr][str_lang]);
            $(this).html(gl_jsop_lang_data[gl_main_conf.name][str_attr][str_lang]);
        } catch (err) {
            console.log("ERROR LANG BUILDING : " + str_attr);
        }
    });
    if (p_lang == "KOR") {
        $("#id_img_building_desc").attr("src", gl_main_conf.xml_data.arr_building_list[1]);
    } else if (p_lang == "ENG") {
        $("#id_img_building_desc").attr("src", gl_main_conf.xml_data.arr_building_list[0]);
    }

}



function setMainStart(p_obj) {
    
    if (PAGEACTIVEYN == true) {
        return;
    }
    PAGEACTIVEYN = true;
}

function setMainStop() {
    
    if (PAGEACTIVEYN == false) {
        return;
    }
    PAGEACTIVEYN = false;
}


/////////////////////////////////////////////////
// DEBUG

function onClickDebugLang(p_lang) {
    setMainLang("CLICK", p_lang);
}

function onClickDebugInit(p_type) {
    if (p_type == "START") {
        setMainStart(null);
    } else {
        setMainStop();
    }
}
