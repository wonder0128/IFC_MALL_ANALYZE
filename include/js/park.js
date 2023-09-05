var gl_main_conf = {
    lang:"KOR",
    name: "park"
};

var gl_conf_header = new Object();
var gl_jsop_lang_data = new Object();

/////////////////////////////////////////////////
// 초기화 함수들

function setInitSettingLang(p_load_data){
    gl_jsop_lang_data = p_load_data;
}

function setInitConfigLang(p_lang){
    gl_jsop_lang_data = p_lang;
}

function setInitSetting(p_result) {

    if (p_result != "SUCC") {
        // console.log("FAIL LOAD DATA/ROUTE");
        return;
    }
    if (parent.MAINPARENTCUSTOMCODE) {

    } else {
        // console.log("LOCAL SETTING BUILDING");
        setInitConfig(gl_xml_conf.xml_data);
    }
}

function setMainLang(p_type, p_lang){
    var i  = 0;
    var str_code = "";


    gl_main_conf.lang = p_lang;


    var str_attr = "";
    var str_lang = gl_main_conf.lang.toLowerCase();

    $(".lang_code_names").each(function(i){
        str_attr = $(".lang_code_names").eq(i).attr("lang_code");
        try{
            $(this).html(gl_jsop_lang_data[gl_main_conf.name][str_attr][str_lang]);
        }catch(err){
            // console.log("ERROR LANG FACILITY : " + str_attr);
        }
    });
}

function setMainStart(p_obj){

    PAGEACTIVEYN = true;

}


function setMainStop(){

    if(PAGEACTIVEYN == false ){
        return;
    }
    
    PAGEACTIVEYN = false;
}

/////////////////////////////////////////////////
// DEBUG

function onClickDebugInit(){
    setMainStart(null);
}

function onClickDebugLang(p_type){
    setMainLang("CLICK",p_type);
}

function onClickDebugSearch(p_type){
    setEventSearch(p_type);

}
