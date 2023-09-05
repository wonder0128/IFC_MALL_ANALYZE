var gl_main_conf = {
    lang:"KOR",
    name: "nearby"
};

var gl_conf_header = new Object();
var gl_jsop_lang_data = new Object();



var gl_arr_facility_list = new Array();

/////////////////////////////////////////////////
// 초기화 함수들

function setInitSettingLang(p_load_data){
    gl_jsop_lang_data = p_load_data;
}

function setInitSetting(p_result){
    if(p_result != "SUCC"){
        console.log("FAIL LOAD DATA/ROUTE");
        return;
    }

    $(".info_main").on("click", function (e) {
        onClickNearBy(this);
    });
    
    if(parent.MAINPARENTCUSTOMCODE){

    }else{
        console.log("LOCAL SETTING FACILITY");
        setInitConfig(gl_xml_conf.xml_data,gl_xml_conf.xml_route);
    }
}

function setInitConfig(p_load_data,p_load_route){

    gl_arr_facility_list = p_load_data.arr_store_list.filter((store) => store.CATE_CODE == 'S03');

    $('.nearbySwiper > .list_area').html('');
    var swiperIdx = 0;
    for(var i = 0; i < gl_arr_facility_list.length; i++) {
        if(i % 10 == 0) {
            swiperIdx ++;
            $('.nearbySwiper > .swiper-wrapper').append('<div class="swiper-slide" id="slide' + swiperIdx + '"><div class="slide_box"></div>');
        }

        var str_html = ``;
        str_html = `
            <div id="id_fac_box_` + gl_arr_facility_list[i].id + `" code="` + gl_arr_facility_list[i].id + `" class="info_main" onclick="javascript:onClickNearBy(this);">
                <div class="txt_main">
                    <div class="txt_zone lang_code_names" lang_code="">` + gl_arr_facility_list[i].STORE_NAME_KOR + `</div>
                </div>
                <div class="txt_info">
                    <div class="txt_location" lang_code="">` + gl_arr_facility_list[i].BUILDING_NAME + `</div>
                    <div class="txt_floor" lang_code="">` + gl_arr_facility_list[i].FLOOR_NAME + `</div>
                </div>
                <div class='location_area'>
                    <img src='images/store_list_bt_location.svg'>
                </div>
            </div>
        `;

        $('#slide' + swiperIdx).find('.slide_box').append(str_html);
    }

    var swiper = new Swiper(".nearbySwiper", {
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

function setInitConfigLang(p_lang){
    gl_jsop_lang_data = p_lang;
}


function setMainLang(p_type, p_lang){
    var i  = 0;
    var str_code = "";

    // console.log("MAIN LANG FACILITY");

    if(p_type != "INIT"){
        if(gl_main_conf.lang == p_lang) return;
    }
    gl_main_conf.lang = p_lang;
     for(i = 0; i < gl_arr_facility_list.length && i < 3000; i++){
            obj = gl_arr_facility_list[i];
    //         console.log('obj', obj);
            try{
                $("#id_fac_box_" + obj.id + " .txt_zone").html(obj["STORE_NAME_" + gl_main_conf.lang]);
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
// CLICK EVENT
/////////////////////////////////////////////////

function onClickNearBy(p_obj){
    console.log(p_obj);
    var i = 0;
    var str_floor = "";

    var str_code = $(p_obj).attr("code");
    var str_title = $(p_obj).find(".txt_main").html();
    var str_img = $(p_obj).find("img").attr("src");

    // console.log(gl_arr_facility_list,'1239812u8549812u831928381298381928312983');

    for(i = 0; i < gl_arr_facility_list.length; i++){

        let currentLang = gl_main_conf.lang;

        if(str_code == gl_arr_facility_list[i].id){
            str_floor = gl_arr_facility_list[i].STORE_FLOOR.text;
            str_building = gl_arr_facility_list[i].BUILDING_NAME;

            str_desc = currentLang == "KOR" ? gl_arr_facility_list[i].STORE_DESC_KOR : gl_arr_facility_list[i].STORE_DESC_ENG;
            str_title = currentLang == "KOR" ? gl_arr_facility_list[i].STORE_NAME_KOR : gl_arr_facility_list[i].STORE_NAME_ENG;


            str_img = gl_arr_facility_list[i].STORE_MAIN_URL;
        }
    }

    if(str_code != ""){
        if(parent.MAINPARENTCUSTOMCODE){
            var cmd_obj = { sect:"POPUP", type:"NEARBY_INFO", id:str_code, code:str_code, title:str_title, floor:str_floor, building : str_building, desc: str_desc,  img_src:str_img };
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
