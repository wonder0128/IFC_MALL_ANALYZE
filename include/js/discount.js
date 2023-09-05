var gl_main_conf = {
    lang:"KOR",
    name: "discount"
};

var gl_conf_header = new Object();
var gl_jsop_lang_data = new Object();
var gl_arr_discount_list = new Array();

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
        console.log("FAIL LOAD DATA/ROUTE");
        return;
    }
    if (parent.MAINPARENTCUSTOMCODE) {

    } else {
        console.log("LOCAL SETTING BUILDING");
        setInitConfig(gl_xml_conf.xml_data);
    }
}

function setInitConfig(p_load_data,division){
    if (division === 'W') {
    gl_arr_discount_list = p_load_data.arr_guide_list.filter((dis) => (dis.GUIDE_CODE == 'PARK' && dis.KIOSK_TYPE == 'KIOSK' && dis.DIVISION == 'W'));
    }else{
        gl_arr_discount_list = p_load_data.arr_guide_list.filter((dis) => (dis.GUIDE_CODE == 'PARK' && dis.KIOSK_TYPE == 'KIOSK' && dis.DIVISION == 'H'));

    }
    setInitMakeDiscountList(gl_arr_discount_list,division);
}

function setInitMakeDiscountList(gl_arr_discount_list,division){
    let obj;
    let str_html = '';
    var discount_list = gl_arr_discount_list;
    if (division === 'W') {

    for(let i = 0; i < discount_list.length; i++){
        obj = discount_list[i];

        str_html += '<div class="info_main">'
        str_html += '   <div class="img_main">'
        str_html += '       <img src="commonfiles/guide/PARK_KIOSK_W_' + obj.langCode + '.png">'
        str_html += '   </div>'
        str_html += '</div>'
    }
    }else{
    for(let i = 0; i < discount_list.length; i++){
            obj = discount_list[i];

            str_html += '<div class="info_main">'
            str_html += '   <div class="img_main">'
            str_html += '       <img src="commonfiles/guide/PARK_KIOSK_H_' + obj.langCode + '.png">'
            str_html += '   </div>'
            str_html += '</div>'
        }
    }
    $('#id_list_area').append(str_html);
    $('.info_main:first-child').addClass('active');
}

function setMainLang(p_type, p_lang,division){



        var lang = p_lang.substring(0, p_lang.length - 1);

        // 클래스를 추가/제거할 요소들의 선택자를 정의합니다.
        var allImgMain = $(".info_main .img_main img");

        // 모든 요소에 'active' 클래스를 제거합니다.
        $(".info_main").removeClass("active");
        var imgMain;
        // langCode에 해당하는 이미지 요소에 'active' 클래스를 추가합니다.
       if(division=== 'W'){
        if(p_lang === 'KOR'){
        imgMain ='commonfiles/guide/PARK_KIOSK_W_' + lang + '.png';
         $('.info_main:first-child').addClass('active');
        }else{
        imgMain ='commonfiles/guide/PARK_KIOSK_W_' + lang + '.png';
        $('.info_main:nth-child(2)').addClass('active');
        }
       }else{
         if(p_lang === 'KOR'){
           imgMain ='commonfiles/guide/PARK_KIOSK_H_' + lang + '.png';
            $('.info_main:first-child').addClass('active');
           }else{
           imgMain ='commonfiles/guide/PARK_KIOSK_H_' + lang + '.png';
           $('.info_main:nth-child(2)').addClass('active');
           }
       }
           allImgMain.attr("src",imgMain);
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
