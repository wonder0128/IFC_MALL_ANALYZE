var gl_main_conf = {
    lang:"KOR",
    name: "membership"
};

var gl_conf_header = new Object();
var gl_jsop_lang_data = new Object();
var gl_arr_membership_list = new Array();

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
    gl_arr_membership_list = p_load_data.arr_guide_list.filter((guide) => (guide.GUIDE_CODE == 'MB-GIFT' && guide.KIOSK_TYPE == 'KIOSK' && guide.DIVISION == 'W') || (guide.GUIDE_CODE == 'MB-SERVICE' && guide.KIOSK_TYPE == 'KIOSK' && guide.DIVISION == 'W'));

    }else{
    gl_arr_membership_list = p_load_data.arr_guide_list.filter((guide) => (guide.GUIDE_CODE == 'MB-GIFT' && guide.KIOSK_TYPE == 'KIOSK' && guide.DIVISION == 'H') || (guide.GUIDE_CODE == 'MB-SERVICE' && guide.KIOSK_TYPE == 'KIOSK' && guide.DIVISION == 'H'));

    }
    setInitMakeMembershipList(gl_arr_membership_list,division);
}

function setInitMakeMembershipList(gl_arr_membership_list,division){
    var gift_list = gl_arr_membership_list.filter((gift) => (gift.GUIDE_CODE == 'MB-GIFT'))
    var membership_list = gl_arr_membership_list.filter((gift) => (gift.GUIDE_CODE == 'MB-SERVICE'))
    var gift_html;
    var membership_html;
    if(division === 'W'){
    var gift_obj = gift_list[0];
             gift_html = '';
            gift_html += '<div class="info_main">'
            gift_html += '   <div class="img_main">'
            gift_html += '       <img id="gift" src="commonfiles/guide/MB-SERVICE_KIOSK_W_' + gift_obj.langCode + '.png">'
            gift_html += '   </div>'
            gift_html += '</div>'
    var membership_obj = membership_list[0];
        membership_html = '';
        membership_html += '<div class="info_main">'
        membership_html += '   <div class="img_main">'
        membership_html += '       <img id="membership"  src="commonfiles/guide/MB-GIFT_KIOSK_W_' + membership_obj.langCode + '.png">'
        membership_html += '   </div>'
        membership_html += '</div>'
    }else{

    var gift_obj = gift_list[0];
                gift_html = '';
                gift_html += '<div class="info_main">'
                gift_html += '   <div class="img_main">'
                gift_html += '       <img id="gift"  src="commonfiles/guide/MB-SERVICE_KIOSK_H_' + gift_obj.langCode + '.png">'
                gift_html += '   </div>'
                gift_html += '</div>'

        var membership_obj = membership_list[0];
            membership_html = '';
            membership_html += '<div class="info_main">'
            membership_html += '   <div class="img_main">'
            membership_html += '       <img id="membership" src="commonfiles/guide/MB-GIFT_KIOSK_H_' + membership_obj.langCode + '.png">'
            membership_html += '   </div>'
            membership_html += '</div>'


    }

            $('#id_list_area').append(gift_html,membership_html);
    $('.info_main:first-child').addClass('active');
}

function setMainLang(p_type, p_lang,division){
     var str_lang = p_lang.toLowerCase();
    $(".lang_code_names").each(function(i){
            str_attr = $(".lang_code_names").eq(i).attr("lang_code");
            try{
                $(this).html(gl_jsop_lang_data[gl_main_conf.name][str_attr][str_lang]);
            }catch(err){
                // console.log("ERROR LANG STORE : " + str_attr);
            }
        });



        var lang = p_lang.substring(0, p_lang.length - 1);

        // 클래스를 추가/제거할 요소들의 선택자를 정의합니다.
        var giftImgMain = $(".info_main .img_main #gift");
        var membershipImgMain = $(".info_main .img_main #membership");
        var giftUrl;
        var membershipUrl;
        // 모든 요소에 'active' 클래스를 제거합니다.
        $(".info_main").removeClass("active");
        var imgMain;
        // langCode에 해당하는 이미지 요소에 'active' 클래스를 추가합니다.


       if(division=== 'W'){
        if(p_lang === 'KOR'){
        giftUrl ='commonfiles/guide/MB-SERVICE_KIOSK_W_' + lang + '.png';
        membershipUrl ='commonfiles/guide/MB-GIFT_KIOSK_W_' + lang + '.png';
        }else{
        giftUrl ='commonfiles/guide/MB-SERVICE_KIOSK_W_' + lang + '.png';
        membershipUrl ='commonfiles/guide/MB-GIFT_KIOSK_W_' + lang + '.png';
        }

       }else{
         if(p_lang === 'KOR'){
          giftUrl ='commonfiles/guide/MB-SERVICE_KIOSK_H_' + lang + '.png';
         membershipUrl ='commonfiles/guide/MB-GIFT_KIOSK_H_' + lang + '.png';
         }else{
          giftUrl ='commonfiles/guide/MB-SERVICE_KIOSK_H_' + lang + '.png';
         membershipUrl ='commonfiles/guide/MB-GIFT_KIOSK_H_' + lang + '.png';
         }

       }

        $('.info_main:first-child').addClass('active');
       giftImgMain.attr("src",giftUrl);
       membershipImgMain.attr("src",membershipUrl);
       $('#gift_btn').removeClass("active");
       $('#member_btn').addClass("active");


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
