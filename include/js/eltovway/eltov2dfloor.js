/******************************************
   name :  eltov2dfloor.js
   auth :  ELTOV
   date :  2021.08.02
   desc :  엘토브 맵
*******************************************/

class Eltov2DFloor{

    constructor(p_parent){  // 디스플레이, 설정, 루트
        this.m_parent = p_parent;

        this.m_mobile = false;
        this.m_main_disp;
        this.m_main_container;
        this.m_line_disp;
        this.m_gp_line;
        this.m_gp_shape;
        
        this.m_util;

        this.m_cls_way;
        this.m_arr_pub_tween = new Array();
        this.m_target_tween = null;

        this.m_my_conf = {
            id:"",
            b_code:"",
            floor:"",
            i_floor_num:0,
            kiosk_floor:"",
            kiosk_pos_x:0,
            kiosk_pos_y:0,
            mobile:false,
            scale_init:1,
            scale_real:1,
            top:0,
            disp_width:0,
            disp_height:0,
            map_angle:0,
            map_rad:0,
            map_width:0,
            map_height:0,
            icon_width:0,
            icon_height:0,
            debug_line:"",
            debug_wayfind:"",
            is_wayfind:false
        };

        this.m_app_stores = new Array();
        this.m_app_pubs = new Array();

        this.m_arr_pub_icons = new Array();
        this.m_arr_store_list = new Array();
        this.m_arr_fnb_store_list = new Array();
        this.m_arr_pub_list = new Array();
        this.m_arr_shape_list = new Array();
        this.m_arr_addon_list = new Array();

        this.m_icon_curr = null;
        this.m_icon_target;
        this.m_icon_move;
    }

    setInit(p_opt,p_floor_div,p_conf,p_load_data,p_load_route,p_pub_icons){
        // console.log("setInit()");
        // console.log('p_opt' , p_opt);
        // console.log('p_conf', p_conf);

        var i = 0,j = 0;
        var i_tmp = 0;
        var str_tmp = "";
        var obj,obj2;

        this.m_util = new EltovWayUtil();

        this.m_main_disp = p_floor_div;

        this.m_my_conf.id = p_opt.id;
        this.m_my_conf.b_code = p_opt.b_code;
        this.m_my_conf.floor = p_opt.floor;
        this.m_my_conf.is_mobile = p_conf.is_mobile;
        this.m_my_conf.scale_init = p_conf.scale_init;
        this.m_my_conf.scale_real = p_conf.scale_real;
        // console.log('m_my_conf', this.m_my_conf);
        // console.log('this.m_my_conf.disp_width = p_conf.disp_width;', this.m_my_conf.disp_width = p_conf.disp_width);
        this.m_my_conf.disp_width = p_conf.disp_width;
        this.m_my_conf.disp_height = p_conf.disp_height;
        this.m_my_conf.font_name = p_conf.font_name;
        this.m_my_conf.font_weight = p_conf.font_weight;
        this.m_my_conf.map_angle = p_conf.map_angle;
        this.m_my_conf.map_rad = (this.m_my_conf.map_angle) * Math.PI/180;

        this.m_my_conf.map_width = Number(p_load_data.header.MAP_WIDTH);
        console.log('this.m_my_conf.map_height', this.m_my_conf.map_height);
        this.m_my_conf.map_height = Number(p_load_data.header.MAP_HEIGHT);

        this.m_my_conf.icon_width = Number(p_load_data.header.PUB_ICON_WIDTH);
        this.m_my_conf.icon_height = Number(p_load_data.header.PUB_ICON_HEIGHT);

        this.m_my_conf.debug_line = p_conf.debug_line;
        this.m_my_conf.debug_wayfind = p_conf.debug_wayfind;
        this.m_my_conf.top = p_opt.top;

        if(this.m_my_conf.b_code == p_load_data.header.B_CODE && this.m_my_conf.floor == p_load_data.header.KIOSK_FLOOR){
            this.m_my_conf.kiosk_floor = this.m_my_conf.floor;
            this.m_my_conf.kiosk_pos_x = Number(p_load_data.header.POS_X);
            this.m_my_conf.kiosk_pos_y = Number(p_load_data.header.POS_Y);
        }
        
        this.m_my_conf.img_curr_type = p_conf.img_curr_type;
        this.m_my_conf.img_target_type = p_conf.img_target_type;
        this.m_my_conf.img_move_type = p_conf.img_move_type;
        this.m_my_conf.wayfind_speed = p_conf.wayfind_speed;
        

        this.m_main_disp.style.position = "absolute";
        this.m_main_disp.style.left = this.m_my_conf.disp_width/2 + "px";
        this.m_main_disp.style.top = this.m_my_conf.disp_height/2 + "px";

        // 이미지
        this.m_main_container = document.createElement("div");
        var img_div = document.createElement("div");
        var img_map = document.createElement('img');

        this.m_main_container.style.position = "absolute";
        this.m_main_container.style.transform = "translate(" + (0 - this.m_my_conf.map_width/2) + "px," + (0 - this.m_my_conf.map_height/2) + "px)";
        this.m_main_disp.appendChild(this.m_main_container);

        img_map.draggable = false;
        str_tmp = p_opt.url_img;
        str_tmp = str_tmp.replace(/\/\/z/gi,"/z");
        img_map.style.width = this.m_my_conf.map_width + "px";
        img_map.style.height = this.m_my_conf.map_height + "px";
        img_map.src = str_tmp;

        img_div.style.position = "absolute";
        img_div.style.zIndex = 1;
        img_div.style.width = this.m_my_conf.map_width + "px";
        img_div.style.height = this.m_my_conf.map_height + "px";
        img_div.style.transform = "rotate("+this.m_my_conf.map_angle+"deg)";
        img_div.appendChild(img_map);

        this.m_main_container.appendChild(img_div);

        this.m_arr_pub_icons = p_pub_icons;

        // 상점
        for(i = 0; i < p_load_data.arr_store_list.length; i++){
            obj = p_load_data.arr_store_list[i];
            if(obj.B_CODE == this.m_my_conf.b_code && obj.STORE_FLOOR == this.m_my_conf.floor){
                this.m_arr_store_list.push(obj);
                this.m_arr_fnb_store_list.push(obj);
            }
        }
        // 공용시설
        for(i = 0; i < p_load_route.arr_pub_list.length; i++){
            obj = p_load_route.arr_pub_list[i];
            if(obj.B_CODE == this.m_my_conf.b_code && obj.PUB_FLOOR == this.m_my_conf.floor){
                this.m_arr_pub_list.push(obj);
            }
        }

        // 추가
        if(p_conf.addon_list != null){
            try{
                for(i = 0; i < p_conf.addon_list.length; i++){
                    if(p_conf.addon_list[i].b_code == this.m_my_conf.b_code && p_conf.addon_list[i].floor == this.m_my_conf.floor){
                        this.m_arr_addon_list.push(p_conf.addon_list[i]);
                    }
                }
            }catch(e){
                // console.log("Addon Error");
            }
        }

        // 형태
        for(i = 0; i < p_load_route.arr_shape_list.length; i++){
            obj = p_load_route.arr_shape_list[i];
            if(obj.B_CODE == this.m_my_conf.b_code && obj.SHAPE_FLOOR == this.m_my_conf.floor){
                this.m_arr_shape_list.push(obj);
            }
        }

        var way_conf = {"b_code":this.m_my_conf.b_code,"floor":this.m_my_conf.floor};
        var clsway = new EltovWayfind(this,way_conf,p_load_route.arr_node_list);

        clsway.setInitXml();

        this.m_cls_way = clsway;

    }

    setInitSetting(){
        // console.log("setInitSetting()");

        var i = 0, j = 0, i_tmp = 0;
        var i_pos_x = 0, i_pos_y = 0, i_width = 0, i_height = 0;
        var i_angle = 0;
        var str_name = "",str_pos = "",str_tmp = "";
        var arr_x = [],arr_y = [];
        var chg_pos = {x:0,y:0};
        var obj;

        var m_this = this;

        this.m_line_disp = document.createElement("div");  // 그래픽
        var shape_div = document.createElement("div");  // 길등 그리기
        var store_div = document.createElement("div");  // 스토어
        var etc_div = document.createElement("div");  // 아이콘등

        var line_canvas = document.createElement("canvas");
        var shape_canvas = document.createElement("canvas");

        this.m_line_disp.style.position = "absolute";
        this.m_line_disp.style.transform = "rotate(" + this.m_my_conf.map_angle + "deg)";  // HANBAN29 칸바스 엔글변경

        etc_div.style.position = "absolute";
        store_div.style.position = "absolute";
        shape_div.style.position = "absolute";

        this.m_line_disp.style.zIndex = 8;
        etc_div.style.zIndex = 10;
        store_div.style.zIndex = 5;
        shape_div.style.zIndex = 2;

        line_canvas.width = this.m_my_conf.map_width;
        line_canvas.height = this.m_my_conf.map_height;

        this.m_line_disp.appendChild(line_canvas);
        this.m_line_disp.style.display = "none";
        this.m_gp_line = line_canvas.getContext("2d");

        shape_canvas.style.position = "absolute";
        shape_canvas.width = this.m_my_conf.map_width;
        shape_canvas.height = this.m_my_conf.map_height;
        shape_canvas.imageSmoothingEnabled = true;
        shape_div.appendChild(shape_canvas);

        this.m_gp_shape = shape_canvas.getContext("2d");

        this.m_main_container.appendChild(shape_div);   // 형태
        this.m_main_container.appendChild(store_div);   // 스토어
        this.m_main_container.appendChild(etc_div);     // 현재,타겟 등등의 아이콘
        this.m_main_container.appendChild(this.m_line_disp);  // 길그리기 div

        // 현재 위치 작업
        if(this.m_my_conf.kiosk_floor != ""){
            var img_curr = document.createElement("img");
            img_curr.className = "id_map_location";
            img_curr.style.position = "absolute";


            img_curr.src = this.m_my_conf.img_curr_type["url"];
            img_curr.style.width = this.m_my_conf.img_curr_type["width"]+"px";
            img_curr.style.height = this.m_my_conf.img_curr_type["height"]+"px";
            // console.log('img_curr.style.transform', img_curr.style.transform);
            //img_curr.style.transform = "translate(" + (this.m_my_conf.kiosk_pos_x - this.m_my_conf.img_curr_type["width"]/2) + "px," + (this.m_my_conf.kiosk_pos_y - this.m_my_conf.img_curr_type["height"]) + "px)";

            i_tmp = 50;
            img_curr.style.left = (this.m_my_conf.kiosk_pos_x - this.m_my_conf.img_curr_type["width"]/2) + "px";
            img_curr.style.top =  (this.m_my_conf.kiosk_pos_y - this.m_my_conf.img_curr_type["height"]/2 - i_tmp) + "px";


            etc_div.appendChild(img_curr);

            //if(this.m_my_conf.is_mobile == false){
                TweenMax.to(img_curr,0.5,{ y:i_tmp, yoyo:true, repeat:-1 } );
            //}
            
            this.m_icon_curr = img_curr;
        }else{
            this.m_icon_curr = null;
        }

        // 목적지
        var target_div = document.createElement("div");
        var img_target = document.createElement("img");

        img_target.src = this.m_my_conf.img_target_type["url"];
        img_target.style.width = this.m_my_conf.img_target_type["width"]+"px";
        img_target.style.height = this.m_my_conf.img_target_type["height"]+"px";
        img_target.style.transform = "translate(" + (this.m_my_conf.img_target_type["width"]/-2) + "px," + (this.m_my_conf.img_target_type["height"]/-2) + "px)";
        img_target.style.position = "absolute";

        target_div.style.position = "absolute";
        target_div.appendChild(img_target);

        this.m_icon_target = target_div;
        this.m_icon_target.style.display = "none";
        etc_div.appendChild(target_div);

        // 이동 사람
        var move_div = document.createElement("div");
        var img_move = document.createElement("img");
        
        img_move.src = this.m_my_conf.img_move_type["url"];
        img_move.style.width = this.m_my_conf.img_move_type["width"]+"px";
        img_move.style.height = this.m_my_conf.img_move_type["height"]+"px";
        img_move.style.transform = "translate(" + (this.m_my_conf.img_move_type["width"]/-2) + "px," + (this.m_my_conf.img_move_type["height"]/-2) + "px)";

        move_div.style.position = "absolute";
        move_div.appendChild(img_move);

        this.m_icon_move = move_div;
        this.m_icon_move.style.display = "none";
        etc_div.appendChild(move_div);

        // 상점
        for(i = 0; i < this.m_arr_store_list.length; i++){
            obj = this.m_arr_store_list[i];
            //console.log(obj.DP_TYPE);
            if(obj.DP_TYPE=="Y")
            {
                str_name = obj.STORE_NAME_KOR;
                if(str_name == "") str_tmp = "-";

                str_name = str_name.replace(/\n/gi,"<br>");

                var div_store = document.createElement("div");
                var txt_name = document.createElement("div");

                txt_name.className = "icon_info_store_txt";
                txt_name.style.fontFamily = this.m_my_conf.font_name;
                txt_name.style.fontWeight = this.m_my_conf.font_weight;
                txt_name.style.fontSize = obj.FONT_SIZE + "px";
                txt_name.style.lineHeight = (obj.FONT_SIZE+0) +"px";
                txt_name.style.color = obj.FONT_COLOR;
                txt_name.innerHTML = str_name;
                txt_name.CUSTOM_ID = obj.ID;
                txt_name.CUSTOM_NUM = i;

                i_pos_x = Number(obj.POS_X);
                i_pos_y = Number(obj.POS_Y);

                /*
                chg_pos = this.getChgPos(i_pos_x,i_pos_y);
                i_pos_x = chg_pos.x;
                i_pos_y = chg_pos.y;
                */

                div_store.className = "noselect";
                div_store.style.position = "absolute";
                str_pos = "translate(" + i_pos_x + "px," + i_pos_y + "px)";
                div_store.style.transform = str_pos;
                if(obj.CLICK=="Y"){
                    txt_name.addEventListener("click",function(evt){ m_this.onClickInfoStore(evt,this) }, true );
                }

                div_store.appendChild(txt_name);
                store_div.appendChild(div_store);

                this.m_app_stores.push({"ID":obj.id, CONTAINER:txt_name});
            }
        }

        // 공용시설
        for(i = 0; i < this.m_arr_pub_list.length; i++){
            obj = this.m_arr_pub_list[i];

            for(j = 0; j < this.m_arr_pub_icons.length; j++){
                if(obj.PUB_CODE == this.m_arr_pub_icons[j].PUB_CODE){

                    var div_pub = document.createElement("div");
                    var img_thumb = document.createElement("img");

                    i_pos_x = Number(obj.POS_X);
                    i_pos_y = Number(obj.POS_Y);
                    
                    /*
                    chg_pos = this.getChgPos(i_pos_x,i_pos_y);
                    i_pos_x = chg_pos.x;
                    i_pos_y = chg_pos.y;
                    */
                    str_pos = "translate(" + i_pos_x + "px," + i_pos_y + "px)"; 

                    div_pub.style.position = "absolute";
                    div_pub.style.transform = str_pos;
                    div_pub.CUSTOM_ID = obj.PUB_ID;

                    img_thumb.src = this.m_arr_pub_icons[j].PUB_URL;
                    //img_thumb.src = "images/pub/ico_fac_detail_02.svg";
                    img_thumb.draggable = false;
                    img_thumb.style.width = this.m_my_conf.icon_width + "px";
                    img_thumb.style.height = this.m_my_conf.icon_height + "px";
                    img_thumb.style.transform = "translate(" + (0-this.m_my_conf.icon_width/2) + "px, " + (0-this.m_my_conf.icon_height/2) + "px)";

                    div_pub.appendChild(img_thumb);
                    store_div.appendChild(div_pub);

                    this.m_app_pubs.push({"ID":obj.PUB_ID, "PUB_CODE":obj.PUB_CODE, CONTAINER:img_thumb});
                    break;
                }
            }
        }
        
        // ADDON 
        for(i = 0; i < this.m_arr_addon_list.length; i++){
            try{
                obj = this.m_arr_addon_list[i];

                if(obj.type == "IMG"){
                    var img = document.createElement("img");
                    img.draggable = false;
                    img.style.position = "absolute";
                    img.style.width = obj.width + "px";
                    img.style.height = obj.height + "px";
                    img.src = obj.url;
                    img.style.transform = "translate(" + (Number(obj.pos_x) - Number(obj.width)/2) + "px," + (Number(obj.pos_y) - Number(obj.height)/2) + "px)";
                    shape_div.appendChild(img);
                }
            }catch(e){
                // console.log("Addon Error Add");
            }
        }

        // 형태
        // SHAPE_CTX
        for(i = 0; i < this.m_arr_shape_list.length; i++){
            obj = this.m_arr_shape_list[i];
  
            if(obj.TYPE == "LINE"){

                this.m_gp_shape.save();
                this.m_gp_shape.beginPath();
                this.m_gp_shape.strokeStyle = obj.LINE_COLOR;
                this.m_gp_shape.lineWidth  = obj.LINE_THICK;

                arr_x = obj.POINTS_X.split(',');
                arr_y = obj.POINTS_Y.split(',');

                for(j = 0; j < arr_x.length; j++){
                    if(j == 0) this.m_gp_shape.moveTo(Number(arr_x[j]), Number(arr_y[j]));
                    else this.m_gp_shape.lineTo(Number(arr_x[j]), Number(arr_y[j]));
                }

                this.m_gp_shape.stroke();
                this.m_gp_shape.closePath();
                this.m_gp_shape.restore();

            }else if(obj.TYPE == "POLYGON"){

                this.m_gp_shape.save();
                this.m_gp_shape.beginPath();
                this.m_gp_shape.fillStyle = obj.FILL_COLOR;

                arr_x = obj.POINTS_X.split(',');
                arr_y = obj.POINTS_Y.split(',');

                for(j = 0; j < arr_x.length; j++){
                    if(j == 0) this.m_gp_shape.moveTo(Number(arr_x[j]), Number(arr_y[j]));
                    else this.m_gp_shape.lineTo(Number(arr_x[j]), Number(arr_y[j]));
                }
                if(arr_x.length > 2){
                    this.m_gp_shape.lineTo(arr_x[0], arr_y[0]);
                    this.m_gp_shape.fill();
                }

                if(obj.LINE_THICK > 0){
                    this.m_gp_shape.strokeStyle = obj.LINE_COLOR;
                    this.m_gp_shape.lineWidth  = obj.LINE_THICK;
                    this.m_gp_shape.stroke();
                }

                this.m_gp_shape.closePath();
                this.m_gp_shape.restore();


            }else if(obj.TYPE == "CIRCLE"){
                
                i_angle = Number(obj.ANGLE) * Math.PI/180;

                this.m_gp_shape.save();

                this.m_gp_shape.translate(Number(obj.POS_X),Number(obj.POS_Y));
                this.m_gp_shape.rotate(i_angle);
                this.m_gp_shape.translate(-Number(obj.POS_X),-Number(obj.POS_Y));

                this.m_gp_shape.beginPath();
                this.m_gp_shape.fillStyle = obj.FILL_COLOR;
                this.m_gp_shape.strokeStyle = obj.LINE_COLOR;

                this.m_gp_shape.ellipse(Number(obj.POS_X),Number(obj.POS_Y),Number(obj.WIDTH)/2,Number(obj.HEIGHT)/2, 0, 0, 2 * Math.PI);
                this.m_gp_shape.fill();

                if(obj.LINE_THICK > 0){
                    this.m_gp_shape.lineWidth  = obj.LINE_THICK;
                    this.m_gp_shape.stroke();
                }

                this.m_gp_shape.closePath();
                this.m_gp_shape.restore();

            }else if(obj.TYPE == "RECT"){

                i_angle = Number(obj.ANGLE) * Math.PI/180

                this.m_gp_shape.save();
                this.m_gp_shape.translate(Number(obj.POS_X), Number(obj.POS_Y));
                this.m_gp_shape.rotate(i_angle);
                this.m_gp_shape.translate(Number(-obj.POS_X),Number(-obj.POS_Y));

                this.m_gp_shape.fillStyle = obj.FILL_COLOR;

                i_pos_x = Number(obj.POS_X);
                i_pos_y = Number(obj.POS_Y);
                i_width = Number(obj.WIDTH);
                i_height = Number(obj.HEIGHT);

                this.m_gp_shape.fillRect(
                    i_pos_x - i_width/2,
                    i_pos_y - i_height/2,
                    i_width,
                    i_height);

                if(obj.LINE_COLOR > 0){
                    this.m_gp_shape.strokeStyle = obj.LINE_COLOR;
                    this.m_gp_shape.lineWidth  = obj.LINE_THICK;
                    this.m_gp_shape.strokeRect(
                        i_pos_x - i_width/2,
                        i_pos_y - i_height/2,
                        i_width,
                        i_height);
                }

                this.m_gp_shape.restore();

            }else if(obj.TYPE == "TEXT"){

                i_angle = Number(obj.ANGLE) * Math.PI/180

                this.m_gp_shape.save();

                this.m_gp_shape.translate(Number(obj.POS_X), Number(obj.POS_Y));
                this.m_gp_shape.rotate(i_angle);
                this.m_gp_shape.translate(Number(-obj.POS_X),Number(-obj.POS_Y));

                this.m_gp_shape.fillStyle = obj.LINE_COLOR;
                this.m_gp_shape.textAlign = obj.ALIGN;
                this.m_gp_shape.textBaseline = "top";
                this.m_gp_shape.font = "bold " + obj.FONT_SIZE + "px " + this.m_my_conf.font_name;

                var arr_text = obj.SHAPE_TEXT.split('\n');
 
                if(obj.ALIGN == "left"){
                    i_pos_x = Number(obj.POS_X) - Number(obj.WIDTH) / 2;
                }else if(obj.align == "right"){
                    i_pos_x = Number(obj.POS_X) + Number(obj.WIDTH) / 2;
                }else{
                    i_pos_x = Number(obj.POS_X);
                }

                for(j = 0; j < arr_text.length; j++){
                    this.m_gp_shape.fillText(arr_text[j],
                        i_pos_x,
                        Number(obj.POS_Y) - Number(obj.HEIGHT)/2 + ((Number(obj.FONT_SIZE) + Number(obj.LINE_THICK)) * j),
                        Number(obj.WIDTH),
                        Number(obj.HEIGHT));
                }
                this.m_gp_shape.restore();

            }else if(obj.TYPE == "IMG"){

                var shape_id = obj.ID;

                var img_thumb = document.createElement("img");
                img_thumb.addEventListener("load",function(){ m_this.onLoadShapeImgCompleteInit(this,shape_id); }, false );
                img_thumb.src = obj.IMG_URL;
            }
        }

        setTimeout(function () {
            //  m_this.setInitSettingEnd();
        }, 2000);
    }


    // onLoadShapeImgCompleteInit(p_evt,p_id){
    //     console.log("onLoadShapeImgCompleteInit()");

    //     var i = 0;
    //     var obj;

    //     for(i = 0; i < this.m_arr_shape_list.length; i++){
    //         if(this.m_arr_shape_list[i].ID == p_id){
    //             obj = this.m_arr_shape_list[i];
    //             var i_angle = Number(obj.ANGLE) * Math.PI/180;

    //             this.m_gp_shape.save();
    //             this.m_gp_shape.translate(Number(obj.POS_X),Number(obj.POS_Y));
    //             this.m_gp_shape.rotate(i_angle);
    //             this.m_gp_shape.translate(-Number(obj.POS_X),-Number(obj.POS_Y));

    //             this.m_gp_shape.drawImage(p_evt,
    //                     Number(obj.POS_X) - Number(obj.WIDTH)/2, Number(obj.POS_Y) - Number(obj.HEIGHT)/2,
    //                     Number(obj.WIDTH),
    //                     Number(obj.HEIGHT));
    //             this.m_gp_shape.restore();

    //             break;
    //         }
    //     }
    // }

    // setInitSettingEnd(){

    // }

    getMainDisp(){
        // console.log("getMainDisp()");

        return this.m_main_disp;
    }

    getMainDispContainer(){
        // console.log("getMainDispContainer()");

        return this.m_main_container;
    }

    setMainDispPos(p_x,p_y,p_scale){
        // console.log("setMainDispPos()");

        // console.log(p_scale, p_scale);
        if(p_scale > 0){
            this.m_main_disp.style.transform = "translate(0px," + (this.m_my_conf.top) + "px) scale(" + p_scale + "," + p_scale + ")";
            //this.m_main_disp.style.transform = "translate(0px," + (this.m_my_conf.top) + "px)";
        }
        this.m_main_container.style.transform = "translate(" + p_x + "px," + p_y + "px)";
        //console.log(p_x, p_y,p_scale);
        //TweenMax.to(this.m_main_disp, 0.5, {x:0, y:this.m_my_conf.top});
        //TweenMax.to(this.m_main_disp, 0.5, {scale:p_scale});
        //TweenMax.to(this.m_main_container, 0.5, {  x:p_x, y:p_y});
    }

    setCurrIconHidden(){
        // console.log("setCurrIconHidden()");

        if(this.m_icon_curr != null){
            this.m_icon_curr.style.display = "none";
        }
    }

    setResetPosition(p_type){
        // console.log("setResetPosition()");

        var str_pos = "";
        if(p_type == "HIDE"){
            if(this.m_main_disp.style.display != "none"){
                this.m_main_disp.style.display = "none";
                this.m_main_disp.style.transform = "translate(" + (0) + "px," + (0) + "px) scale(" + this.m_my_conf.scale_init + "," + this.m_my_conf.scale_init + ")";
                if(this.m_my_conf.is_wayfind == true){
                    this.m_my_conf.is_wayfind = false;
                    this.m_line_disp.style.display = "none";
                    this.m_gp_line.clearRect(0,0,this.m_my_conf.map_width,this.m_my_conf.map_height);
                }
            }
        }else if(p_type == "HIDE_WAYFIND"){
            if(this.m_icon_move.style.display != "none"){
                this.m_icon_move.style.display = "none";
            }
            if(this.m_main_disp.style.display != "none"){
                this.m_main_disp.style.display = "none";
                this.m_main_disp.style.transform = "translate(" + (0) + "px," + (0) + "px) scale(" + this.m_my_conf.scale_init + "," + this.m_my_conf.scale_init + ")";
            }
        }else{
            if(this.m_main_disp.style.display == "none"){
                this.m_main_disp.style.display = "block";
            }
            if(this.m_icon_curr != null){
                this.m_icon_curr.style.display = "block";
            }
            if(this.m_icon_target.style.display != "none"){
                this.m_icon_target.style.display = "none";
            }
            if(this.m_icon_move.style.display != "none"){
                this.m_icon_move.style.display = "none";
            }
            if(p_type != "WAYFIND"){
                if(this.m_my_conf.is_wayfind == true){
                    this.m_my_conf.is_wayfind = false;
                    this.m_line_disp.style.display = "none";
                    this.m_gp_line.clearRect(0,0,this.m_my_conf.map_width,this.m_my_conf.map_height);
                }
            }

            // 최초 화면이 더 크길 원할 경우
            // scale_real 가로세로 실제 계산해서 최적화된 크기
            // scale_init 최초 화면을 직접 배율을 넣을 경우
            if(this.m_my_conf.is_mobile == false){
                // console.log('m_main_disp', this.m_main_disp);
                // console.log('m_main_container', this.m_main_container);
                if(p_type == "INIT"){
                    this.m_main_disp.style.transform = "translate(" + (0) + "px," + (this.m_my_conf.top) + "px) scale(" + this.m_my_conf.scale_init + "," + this.m_my_conf.scale_init + ")";
                }else{  //
                    this.m_main_disp.style.transform = "translate(" + (0) + "px," + (this.m_my_conf.top) + "px) scale(" + this.m_my_conf.scale_init + "," + this.m_my_conf.scale_init + ")";
                }
                this.m_main_container.style.transform = "translate(" + (0- (this.m_my_conf.map_width)/2) + "px," + (0 - (this.m_my_conf.map_height)/2) + "px)";
            }else{
                if(p_type == "INIT"){
                    this.m_main_disp.style.transform = "translate(0px,0px) scale(" + this.m_my_conf.scale_init + "," + this.m_my_conf.scale_init + ")";
                }else{
                    this.m_main_disp.style.transform = "translate(0px,0px) scale(" + this.m_my_conf.scale_real + "," + this.m_my_conf.scale_real + ")";
                }
                this.m_main_container.style.transform = "translate(" + (0- (this.m_my_conf.map_width-480)/2) + "px," + (0 - (this.m_my_conf.map_height-480)/2) + "px)";
                this.m_main_container.style.transform = "translate(" + (0 - (this.m_my_conf.map_width)/2) + "px," + (0 - (this.m_my_conf.map_height)/2) + "px)";
            }
        }
    }

    // setChgLang(p_lang){
    //     console.log("setChgLang()");
    //     var i = 0, i_store = 0;
    //     var store_spr,store_txt,obj_store;
    //     var str_txt = "";

    //     for(i = 0; i < this.m_app_stores.length; i++){
    //         store_spr = this.m_app_stores[i].CONTAINER;
    //         i_store = store_spr.CUSTOM_NUM;
    //         obj_store = this.m_arr_store_list[i_store];
    //         try{
    //             if(p_lang == "KOR"){
    //                 str_txt = obj_store.STORE_NAME_KOR;
    //             }else if(p_lang == "ENG"){
    //                 str_txt = obj_store.STORE_NAME_ENG;
    //             }else if(p_lang == "CHN"){
    //                 str_txt = obj_store.STORE_NAME_CHN;
    //             }else if(p_lang == "JPN"){
    //                 str_txt = obj_store.STORE_NAME_JPN;
    //             }
    //             if(str_txt == "") str_txt = "-";
    //             str_txt = str_txt.replace(/\n/gi,"<br>");
    //             store_spr.innerHTML = str_txt;
    //         }catch(e){
    //             // console.log("setChgLang Error");
    //         }finally{
    //         }
    //     }
    // }

    // setSearchPub(p_code){
    //     console.log("setSearchPub()");

    //     var ret_arr = [];
    //     var i = 0;
    //     var obj_pub;

    //     for(i = 0; i < this.m_arr_pub_list.length; i++){
    //         obj_pub = this.m_arr_pub_list[i];
    //         if(obj_pub.PUB_CODE == p_code){
    //             ret_arr.push(obj_pub);
    //         }
    //     }
    //     return ret_arr;
    // }

    // setWayFindPub(p_id, p_code){  // 공용시설을 보여준다.   id 가 있으면 해당 공용시설만 보여주고  code가 있으면 모든 code를 보여준다.
    //     console.log("setWayFindPub()");

    //     var i = 0, i_num = 0, i_cnt = 0;
    //     var obj_pub;

    //     var xx = (0-this.m_my_conf.icon_width/2);
    //     var yy = (0-this.m_my_conf.icon_height/2);

    //     // console.log("setWayFindPub");

    //     this.setWayFindTweenStop();

    //     for(i = 0; i < this.m_app_pubs.length; i++){
    //         obj_pub = this.m_app_pubs[i];
    //         if(p_id != ""){
    //             if(obj_pub.ID == p_id){
    //                 var tw = TweenMax.fromTo(obj_pub.CONTAINER, 0.5, { x:xx,y:yy,scale:2},{ x:xx,y:yy,scale:1,  yoyo:true, repeat:8 } );
    //                 this.m_arr_pub_tween.push({"num":i,"tween":tw});
    //                 obj_pub.CONTAINER.parentElement.style.zIndex = 10;
    //                 i_cnt++;
    //             }else{
    //                 obj_pub.CONTAINER.parentElement.style.zIndex = 1;
    //             }
    //         }else{
    //             if(obj_pub.PUB_CODE == p_code){
    //                 var tw = TweenMax.fromTo(obj_pub.CONTAINER, 0.5, { x:xx,y:yy,scale:2},{ x:xx,y:yy,scale:1,  yoyo:true, repeat:8 } );
    //                 this.m_arr_pub_tween.push({"num":i,"tween":tw});
    //                 obj_pub.CONTAINER.parentElement.style.zIndex = 10;
    //                 i_cnt++;
    //             }else{
    //                 obj_pub.CONTAINER.parentElement.style.zIndex = 1;
    //             }
    //         }
    //     }
    //     return i_cnt;
    // }

    setWayFindTweenStop(){
        // console.log("setWayFindTweenStop()");

        var i = 0, i_num = 0;
        var obj_pub;

        if(this.m_arr_pub_tween.length > 0){
            for(i = 0; i < this.m_arr_pub_tween.length; i++){
                this.m_arr_pub_tween[i].tween.kill();
                i_num = this.m_arr_pub_tween[i].num;
                obj_pub = this.m_app_pubs[i_num];
                obj_pub.CONTAINER.style.transform = "translate(" + (0-this.m_my_conf.icon_width/2) + "px," + (0-this.m_my_conf.icon_height/2) + "px) scale(1,1)";
            }
        }

        this.m_arr_pub_tween = [];
        if(this.m_target_tween != null){
             console.log("TARGET TWEEN");
            this.m_target_tween.kill();
        }
    }

    setTargetIcon(p_pos_x,p_pos_y){
        // console.log("setTargetIcon()");

        this.setWayFindTweenStop();

        this.m_icon_target.style.display = "block";
        //this.m_icon_target.style.transform = "translate(" + (Number(p_pos_x) - 20) + "px," + (Number(p_pos_y) - 60) + "px)";

        this.m_icon_target.style.left = Number(p_pos_x) + "px";
        this.m_icon_target.style.top = (Number(p_pos_y) - 80) + "px";

        var i_tmp = Number(p_pos_y) - 50;
        this.m_target_tween = TweenMax.to(this.m_icon_target,0.5,{ top:i_tmp, yoyo:true, ease:Linear.easeNone, repeat:10 } );
    }


    // WAYFIND
    setWayFindStart(p_opt,p_pos_s,p_target_x,p_target_y){
        // console.log("setWayFindStart()");

        var str_ret = "";
        var i = 0, j = 0, k = 0;
        var i_len = 0,i_min_len = -1, i_min_gate = -1;

        p_target_x = p_target_x + "";
        p_target_y = p_target_y + "";

        var arr_gate_x = p_target_x.split(',');
        var arr_gate_y = p_target_y.split(',');

        var t_pos = {x:0, y:0};

        for(i = 0; i < arr_gate_x.length; i++){
            t_pos.x = Number(arr_gate_x[i]);
            t_pos.y = Number(arr_gate_y[i]);
            str_ret = this.m_cls_way.setWayFindStart(p_opt,p_pos_s,t_pos);
            if(str_ret == "SUCC"){
                if(arr_gate_x.length == 1){
                    i_min_gate = i;
                }else{
                    i_len = this.m_cls_way.getTotalLength();
                    if(i_min_len == -1 || i_len < i_min_len){
                        i_min_len = i_len;
                        i_min_gate = i;
                    }
                }
            }
        }
        if(i_min_gate >= 0){
            if(arr_gate_x.length > 1){
                console.log("2 MAX GATE = " + i_min_gate);
                t_pos.x = Number(arr_gate_x[i_min_gate]);
                t_pos.y = Number(arr_gate_y[i_min_gate]);
                this.m_cls_way.setWayFindStart(p_opt,p_pos_s,t_pos);
            }
        }
        return i_min_gate;
    }


    // setWayFindStartBridge(p_opt,p_start_x,p_start_y,p_target_x,p_target_y){
    //     console.log("setWayFindStartBridge()");

    //     var str_ret = "";
    //     var i = 0, j = 0, k = 0;
    //     var i_len = 0,i_min_len = -1, i_min_start = -1, i_min_gate = -1;

    //     var arr_start_x = p_start_x.split(',');
    //     var arr_start_y = p_start_y.split(',');
    //     var arr_gate_x = p_target_x.split(',');
    //     var arr_gate_y = p_target_y.split(',');

    //     var s_pos = {x:0, y:0};
    //     var t_pos = {x:0, y:0};

    //     for(i = 0; i < arr_start_x.length; i++){
    //         s_pos.x = Number(arr_start_x[i]);
    //         s_pos.y = Number(arr_start_y[i]);
    //         for(j = 0; j < arr_gate_x.length; j++){
    //             t_pos.x = Number(arr_gate_x[j]);
    //             t_pos.y = Number(arr_gate_y[j]);
    //             str_ret = this.m_cls_way.setWayFindStart(p_opt,s_pos,t_pos);
    //             if(str_ret == "SUCC"){
    //                 i_len = this.m_cls_way.getTotalLength();
    //                 if(i_min_len == -1 || i_len < i_min_len){
    //                     i_min_len = i_len;
    //                     i_min_gate = j;
    //                     i_min_start = i;
    //                 }
    //             }
    //         }
    //     }

    //     if(i_min_start >= 0){
    //         console.log("i_min_start = " + i_min_start);
    //         if(arr_gate_x.length > 1){
    //             s_pos.x = Number(arr_start_x[i_min_start]);
    //             s_pos.y = Number(arr_start_y[i_min_start]);
    //             t_pos.x = Number(arr_gate_x[i_min_gate]);
    //             t_pos.y = Number(arr_gate_y[i_min_gate]);
    //             this.m_cls_way.setWayFindStart(p_opt,s_pos,t_pos);
    //         }
    //     }
    //     return i_min_start;
    // }



    setWayFindDrawLine(p_action_type){
        // console.log("setWayFindDrawLine()");

        var i = 0;

        var option = {"action_type":p_action_type};
        var arr_lines = this.m_cls_way.m_arr_wayfind;
        this.m_line_disp.style.display = "block";
        this.m_icon_move.style.display = "block";

        this.m_my_conf.is_wayfind = true;

        this.m_gp_line.clearRect(0,0,this.m_my_conf.map_width,this.m_my_conf.map_height);
        this.m_gp_line.strokeStyle = "#ff0080";
        this.m_gp_line.lineWidth = 7;
        this.m_gp_line.lineCap = "round";
        this.m_gp_line.lineJoin = "round";

        // HANBAN29 캔버스에 그릴때 다시 보정을 해준다.
        // 앵글이 변하면 캔버스의 위치가 변경이 된다. 이때 캔버스의 위치 변경으로 -좌표및 크기 변경에 대한 부분이 그려지지 않는다. 따라서 결과치에 대한 다시 앵글 보정을 한다.
        var chg_ret_pos = {x:0,y:0};
        var chg_in_pos = {
            c_x:(this.m_my_conf.map_width / 2),
            c_y:(this.m_my_conf.map_height / 2),
            rad:(0-this.m_my_conf.map_angle) * Math.PI/180,
            p_x:0,
            p_y:0
        };

        this.m_gp_line.beginPath();
        for(i = 0; i < arr_lines.length; i++){
            chg_in_pos.p_x = arr_lines[i].x;
            chg_in_pos.p_y = arr_lines[i].y;
            chg_ret_pos = this.m_util.getChgAnglePos(chg_in_pos);
            if(i == 0){
                this.m_gp_line.moveTo(chg_ret_pos.x, chg_ret_pos.y);
            }else{
                this.m_gp_line.lineTo(chg_ret_pos.x, chg_ret_pos.y);
            }
        }
        this.m_gp_line.stroke();
        this.m_gp_line.closePath();

        this.m_cls_way.setDraw2DWayLine(option, arr_lines,this.m_icon_move,this.setWayFindDrawEnd);
    }

    setWayFindDrawEnd(){
        // console.log("setWayFindDrawEnd()");

        //this.m_my_conf.is_wayfind = true;
        this.m_parent.setWayFindDrawEnd();
    }

    // setWayFindDrawMove(p_x,p_y){
    //     console.log("setWayFindDrawMove()");

    //     this.m_main_container.style.transform = "translate(" + (0-p_x) + "px," + (0-p_y) + "px)";
    // }

    // getWayFindLines(){
    //     console.log("getWayFindLines()");

    //     return this.m_cls_way.m_arr_wayfind;
    // }
    getWayFindTotalLength(){
        // console.log("getWayFindTotalLength()");

        return this.m_cls_way.getTotalLength();
    }

    // HANBAN29 디버그 추가
    // setDebugNodeLine(){
    //     console.log("setDebugNodeLine()");

    //     var i = 0;

    //     this.m_line_disp.style.display = "block";
    //     this.m_gp_line.clearRect(0,0,this.m_my_conf.map_width,this.m_my_conf.map_height);
    //     this.m_gp_line.strokeStyle = "#47C83E";
    //     this.m_gp_line.lineWidth = 7;
    //     this.m_gp_line.lineCap = "round";
    //     this.m_gp_line.lineJoin = "round";
    //     var nodes = this.m_cls_way.m_arr_lines;

    //     var chg_ret_pos = {x:0,y:0};
    //     var chg_in_pos = {
    //         c_x:(this.m_my_conf.map_width / 2),
    //         c_y:(this.m_my_conf.map_height / 2),
    //         rad:(0-this.m_my_conf.map_angle) * Math.PI/180,
    //         p_x:0,
    //         p_y:0
    //     };

    //     this.m_gp_line.beginPath();
    //     for(i = 0; i < nodes.length; i++){
    //         chg_in_pos.p_x = nodes[i].pos1.x;
    //         chg_in_pos.p_y = nodes[i].pos1.y;
    //         chg_ret_pos = this.m_util.getChgAnglePos(chg_in_pos);
    //         this.m_gp_line.moveTo(chg_ret_pos.x, chg_ret_pos.y);

    //         chg_in_pos.p_x = nodes[i].pos2.x;
    //         chg_in_pos.p_y = nodes[i].pos2.y;
    //         chg_ret_pos = this.m_util.getChgAnglePos(chg_in_pos);
    //         this.m_gp_line.lineTo(chg_ret_pos.x, chg_ret_pos.y);
    //     }
    //     this.m_gp_line.stroke();
    //     this.m_gp_line.closePath();
    // }


    /////////////////////////////////////////////
    // UTILS
    // getChgPos(p_x,p_y){
    //     console.log("getChgPos()");

    //     var ret_pos = {x:0,y:0};
    //     var c_x = this.m_my_conf.map_width / 2;
    //     var c_y = this.m_my_conf.map_height / 2;

    //     var x1 = p_x - c_x;
    //     var y1 = p_y - c_y;

    //     var i_len = Math.sqrt( (c_x - p_x) * (c_x - p_x) + (c_y - p_y) * (c_y - p_y) );

    //     var rad = Math.atan2(y1,x1);

    //     var new_angle = (rad*180)/Math.PI;
    //     // console.log(new_angle);
    //     //return (rad*180)/Math.PI;

    //     ret_pos.x = Math.cos(rad + this.m_my_conf.map_rad) * i_len + c_x;
    //     ret_pos.y = Math.sin(rad + this.m_my_conf.map_rad) * i_len + c_y;

    //     return ret_pos;
    // }


    /////////////////////////////////////////////
    // CLICK EVENT
    onClickInfoStore(p_evt,p_obj){
        // console.log("onClickInfoStore()");

        var real_evt;
        if(p_evt.data != undefined){  real_evt = p_evt.data.originalEvent;
        }else{ real_evt = p_evt; }

        if(this.m_my_conf.debug_wayfind && real_evt.ctrlKey == true){

        }else{
            this.m_parent.setStoreInfo(p_obj.CUSTOM_ID + "");
        }
    }

    // onClickInfoPub(p_evt,p_obj){
    //     console.log("onClickInfoPub()");

    //     var real_evt;
    //     if(p_evt.data != undefined){  real_evt = p_evt.data.originalEvent;
    //     }else{ real_evt = p_evt; }
    
    // }

}

