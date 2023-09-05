const isMobile = window.matchMedia("only screen and (max-width: 1500px)").matches;
function checkDevice(){

    if (isMobile) {
        // mobile only code
        console.log('mobile');
    }else{
        console.log('pc');
    }
}

$(document).on('resize', checkDevice);
    
var gl_main_conf = {
    lang:"KOR",
    name: "facility"
};

var gl_conf_header = new Object();
var gl_jsop_lang_data = new Object();
var gl_arr_pub_list = new Array();

/////////////////////////////////////////////////
// 초기화 함수들

function setInitSettingLang(p_load_data){
    gl_jsop_lang_data = p_load_data;
}

function setInitConfigLang(p_lang){
    gl_jsop_lang_data = p_lang;
}

function setInitSetting(p_result){

    if(p_result != "SUCC"){
        console.log("FAIL LOAD DATA/ROUTE");
        return;
    }

    $(".info_main").on("touchstart", function (e) {
        onClickFacility(this);
    });
    
    if(parent.MAINPARENTCUSTOMCODE){

    }else{
        console.log("LOCAL SETTING FACILITY");
        setInitConfig(gl_xml_conf.xml_data,gl_xml_conf.xml_route);
    }
}

function setInitConfig(p_load_data, p_load_route){
    gl_arr_fac_list = p_load_data.arr_pub_list.PUB_INFO;

    setInitfacilityList();
}
function setInitfacilityList(){
    var obj;
    let division = 12;
    var facility_list = gl_arr_fac_list;
    
    $('.list_area').html('');    
    var swiperIdx = 0;
    for(let i = 0; i < facility_list.length; i++){
        obj = facility_list[i];

        if(i % division == 0){
            swiperIdx ++;
            $('.list_area').append(
                `<div id="swiperSlide${swiperIdx}" class="swiper-slide">
                    <div class="slide_box"></div>
                </div>`
                );
        }

    var str_html = "";
        str_html += '<div id=id_fac_box_'+ obj.PUB_CODE  + ' class="info_main" onclick="onClickFacility(this)" code=' + obj.PUB_CODE + '>'
        str_html += '    <div class="img_main">'
        str_html += '        <div class="img_zone"><img src=' + obj.PUB_URL + '></div>'
        str_html += '    </div>'
        str_html += '    <div class="txt_main">'
        str_html += '        <div class="store_name" lang_code="#">' + obj.PUB_NAME_KOR + '</div>'
        str_html += '    </div>'
        str_html += '</div>'

        $(`#swiperSlide${swiperIdx}`).find('.slide_box').append(str_html);
    }

    var swiper = new Swiper(".facilitySwiper", {
        slidesPerView: 1,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
    });
    
}

function setMainLang(p_type, p_lang){
    var i  = 0;
    var str_code = "";

    console.log("MAIN LANG FACILITY");

    if(p_type != "INIT"){
        if(gl_main_conf.lang == p_lang) return;
    }

    gl_main_conf.lang = p_lang;
  for(i = 0; i < gl_arr_fac_list.length && i < 3000; i++){
        obj = gl_arr_fac_list[i];
//         console.log('obj', obj);
        try{
            $("#id_fac_box_" + obj.PUB_CODE + " .txt_main .store_name").html(obj["PUB_NAME_" + gl_main_conf.lang]);
        }catch(err){
            // console.log("ERROR LANG STORE NAME : " + obj.STORE_NAME_KOR);
        }
    }

    var str_attr = "";
    var str_lang = gl_main_conf.lang.toLowerCase();

    $(".lang_code_names").each(function(i){
        str_attr = $(".lang_code_names").eq(i).attr("lang_code");
        try{
            $(this).html(gl_jsop_lang_data[gl_main_conf.name][str_attr][str_lang]);
        }catch(err){
            //console.log("ERROR LANG FACILITY : " + str_attr);
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
// CLICK EVENT
/////////////////////////////////////////////////

function onClickFacility(p_obj){
    var i = 0;
    var str_floor = "";

    var str_code = $(p_obj).attr("code");
    var str_title = $(p_obj).find(".txt_main").html();
    var str_img = $(p_obj).find("img").attr("src");

    console.log(p_obj, 'p_obj###########');

    for(i = 0; i < gl_arr_pub_list.length; i++){
        if(str_code == gl_arr_pub_list[i].pub_code){
            str_floor = gl_arr_pub_list[i].floor;
        }
    }

    if(str_code != ""){
        if(parent.MAINPARENTCUSTOMCODE){
            var cmd_obj = { sect:"POPUP", type:"FACILITY_INFO", id:str_code, code:str_code, title:str_title,floor:str_floor, img_src:str_img };
            parent.setParentCmd(cmd_obj);
        }
    }
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
