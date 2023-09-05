
var gl_main_conf = {
    lang:"KOR",
    name: "event"
};

var gl_list_conf = {
    box_list_width:1375,
    box_width:1290,
    box_height:630,
    slider_margin : 0,
    list_cnt : 0,
    curr_cnt : 0,
    auto_move: "NONE"    
};

var gl_move_conf = {
    drag_status:0,        // 드래그 여부 0 : 선택안함, 1: 선택함
    parent_x:0,
    parent_w:0,
    start_left:0,         // 드래그 스타트 X
    end_left:0,
    orig_left:0,          // 드래그 원래위치 X
};

var gl_conf_header = new Object();
var gl_jsop_lang_data = new Object();
var gl_arr_event_list = new Array();
var gl_arr_event_near = new Array();
var gl_arr_event_active = new Array();


/////////////////////////////////////////////////
// 초기화 함수들

function setInitSettingLang(p_load_data){
    gl_jsop_lang_data = p_load_data;``
}

function setInitSetting(p_result){
    var i = 0;

    if(p_result != "SUCC"){
        // console.log("FAIL LOAD DATA/ROUTE");
        return;
    }
    
    if(parent.MAINPARENTCUSTOMCODE){

    }else{
        setInitConfig(gl_xml_conf.xml_data);
    }
    
}

function setInitConfig(p_load_data,division){
var event_list
if (division === 'W') {
    event_list = p_load_data.arr_screen_list.SCREEN_INFO.filter((event) => event.WIDTH_HEIGHT_TYPE == 'W');
}else{
    event_list = p_load_data.arr_screen_list.SCREEN_INFO.filter((event) => event.WIDTH_HEIGHT_TYPE == 'H');

}

    for(let i = 0; i < event_list.length; i++){
        gl_arr_event_list.push(event_list);
    }
    
    setInitMakeEventList();

}

function setMainLang(p_type, p_lang){
    var i  = 0;
    var str_code = "";

    if(p_type != "INIT"){
        if(gl_main_conf.lang == p_lang) return;
    }

    gl_main_conf.lang = p_lang;

    var str_attr = "";
    var str_lang = gl_main_conf.lang.toLowerCase();

    $(".lang_code_names").each(function(i){
        str_attr = $(".lang_code_names").eq(i).attr("lang_code");
        try{
            $(this).html(gl_jsop_lang_data[gl_main_conf.name][str_attr][str_lang]);
        }catch(err){
            // console.log("ERROR LANG FOOD : " + str_attr);
        }
    });
}

function setInitConfigLang(p_lang){
    gl_jsop_lang_data = p_lang;
}


function setMainStart(p_obj){

    if(PAGEACTIVEYN == true ){
//        return;
    }
    PAGEACTIVEYN = true;
}

function setMainStop(){

    if(PAGEACTIVEYN == false ){
        return;
    }
    PAGEACTIVEYN = false;
}


function setInitMakeEventList(){

    let obj;
    let str_html = '';
    
    gl_list_conf.list_cnt = gl_arr_event_list.length;

    for(let i = 0; i < gl_arr_event_list.length; i++){
        obj = gl_arr_event_list[i];
        
        str_html += '<div id="evenet_box_' + obj[i].id + '" class="info_main swiper-slide">'
        str_html += '   <div class="img_main"><img src=' + obj[i].SCREEN_MAIN_URL + '></div>'
        str_html += '</div>'
    }

    $('#id_list_area').append(str_html);
}

/////////////////////////////////////////////////
// CLICK EVENT
/////////////////////////////////////////////////

function onClickEventCate(p_obj){
    $(".button_list span").removeClass("active");
    $(p_obj).find("span").addClass("active");

    var str_code = $(p_obj).attr("code");
    setEventSearch(str_code);
}



function onClickPagingNum(p_obj){
    var page_num = $(p_obj).attr("code");
    if(page_num == "NONE") return;
    setContentsDir(page_num);
}


///////////////////////////////////////////
// UTIL
function getCalPosEvent(p_num){

    var ret_obj = { page:0, left:0, top:0 };

    var i_left = 0;
    var i_top = 0;

    var i_page = p_num;
    var i_left = p_num * gl_paging_conf.box_width;

    ret_obj.page = i_page;
    ret_obj.left = i_left;
    ret_obj.top = i_top;

    return ret_obj;
}


/////////////////////////////////////////////////
// DEBUG

function onClickDebugInit(){
    setMainStart(null);
}

function onClickDebugLang(p_lang){
    setMainLang("CLICK",p_lang);
}

function onClickDebugSearch(p_type){
    setEventSearch(p_type);

}
function onClickDebugDir(p_type){
    setContentsDir(p_type);
}