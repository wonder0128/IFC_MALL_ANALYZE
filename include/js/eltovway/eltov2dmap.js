/******************************************
   name :  eltov2dmap.js
   auth :  ELTOV
   date :  2021.08.02
   desc :  엘토브 맵
*******************************************/

/*
translate position pivot

setCallWebToMap

sect      CMD / WAYFIND / 
type      LANG/FLOOR/SCALE/ROATE ,  STORE/PUB
id        STORE_ID,
code      PUB_CODE
way_type  WAYFIND,LOCATION
move_type ELE/ESC


RESULT

sect  INIT / WAYFIND
type         STORE/
result SUCC/FAIL,  NOWAY,NONE,   WAYTYPE, WAYSTART
mode = ONEWAY/TWOWAY
move_type ELE/ESC
start_floor,
target_floor
*/

const DRAG_MODE_NONE = 0;
const DRAG_MODE_START = 1;

const DRAG_TYPE_MOVE = 1;
const DRAG_TYPE_SCALE = 2;

class Eltov2DMap{

    constructor(p_main_disp,p_opt){  // 디스플레이, 설정, 루트

        this.m_conf = {};
        this.m_load_data;
        this.m_load_route;
        this.m_main_disp = p_main_disp;

        this.m_debug_txt1;
        this.m_debug_txt2;

        this.m_debug_cnt = 2;

        this.m_util;

        this.m_app_main;
        this.m_app_container;
        this.m_ct_debug;

        this.m_icon_arrow;
        this.m_txt_left;
        this.m_txt_right;

        this.m_app_floors = new Array();
        this.m_arr_wayfind = new Array();
        this.m_arr_pub_icons = new Array();
        this.m_arr_pub_cnt = new Array();  // 공용시설 찾을때 하는 작업

        // MOVE
        this.m_move_conf = {
            mode:0,
            type:0,
            angle:0,
            scale_len:0,
            scale_curr:0,
            curr:{x:0,y:0},
            orig:{x:0,y:0},
            start:{x:0,y:0},
            down:{x:0,y:0},
            move:{x:0,y:0}
        };

        // WAYFIND
        this.m_wayfind_conf = {
            mode:"",
            result:"",
            type:"",
            b_code:"",       // 목적지 빌딩
            floor:"",        // 목적지 층
            move_type:"",    // ELE,ESC
            move_step:"",
            move_cnt:0,      // 길안내할 층들을 배열에 넣어두고 이 카운트로 진행한다.
            action_type:"",  // MOVE 일 경우에는 현재위치로 맵이 움직인다.
            target_x:"",     // 목적지 x
            target_y:"",     // 목적지 y 
            gate_x:"",       // 실제 길찾기 위치 x  스토어 일경우에는 복수가 가능
            gate_y:"",       // 실제 길찾기 y  스토어 일경우에는 복수가 가능
            near_type:"",
            arr_floors: new Array(), // 길안내할 층들
            err_code:"",
            err_msg:""
        };

        this.setChkOpt(p_opt);
    }

    setInit(){
        console.log("setInit()");


        var m_this = this;

        this.m_main_disp.style.position = "absolute";
        this.m_main_disp.style.width = "100%";
        this.m_main_disp.style.height = "100%";
        this.m_main_disp.style.background = this.m_conf.disp_background;

        // KIOSK_CONTENTS LOADING
        var clsloader = new EltovLoader();
        clsloader.setLoadDataContents(this.m_conf.url_data,function(p_result,p_data){
            m_this.setLoadDataEnd(p_result,p_data);
        });
    }

    setLoadDataEnd(p_result,p_data){
        console.log("setLoadDataEnd()");


        var m_this = this;

        if(p_result == "SUCC"){
            this.m_load_data = p_data;
            // KIOSK_ROUTE LOADING
            var clsloader = new EltovLoader();
            clsloader.setLoadRouteContents(this.m_conf.url_route,function(p_result,p_data){
                m_this.setLoadRouteEnd(p_result,p_data);
            });
        }else{
            var evt = new CustomEvent("eltov_map",{detail:{"sect":"INIT","result":"FAIL"}});
            document.dispatchEvent(evt);
        }
    }

    setLoadRouteEnd(p_result,p_data){
        console.log("setLoadRouteEnd()");

        if(p_result == "SUCC"){
            this.m_load_route = p_data;
            this.setInitSetting();
        }else{
            var evt = new CustomEvent("eltov_map",{detail:{"sect":"INIT","result":"FAIL"}});
            document.dispatchEvent(evt);
        }
    }

    setInitSetting(){
        console.log("setInitSetting()");


        var i = 0, j = 0;
        var i_real_scale = 0;
        var obj;

        var m_this = this;

        this.m_util = new EltovWayUtil();

        // 내정보 세팅
        var crect = this.m_main_disp.getBoundingClientRect();

        this.m_conf.disp_left = crect.left + window.pageXOffset;
        this.m_conf.disp_top = crect.top + window.pageYOffset;
        this.m_conf.disp_width = crect.width;

        crect.height = 1000;
        this.m_conf.disp_height = crect.height;
        this.m_conf.map_width = Number(this.m_load_data.header.MAP_WIDTH);
        this.m_conf.map_height = Number(this.m_load_data.header.MAP_HEIGHT);

        this.m_conf.limit_left = 0;
        this.m_conf.limit_right = 0;
        this.m_conf.limit_top = 0;
        this.m_conf.limit_bottom = 0;
            //console.log("map_scale",this.m_conf.map_scale);
        if(this.m_conf.map_scale=="auto"){
            i_real_scale = this.m_util.getCalScale({w:this.m_conf.disp_width, h:this.m_conf.disp_height}, {w:(this.m_conf.map_width), h:(this.m_conf.map_height)});
        }else{
            i_real_scale = this.m_conf.map_scale;
        }

        this.m_conf.scale_real = i_real_scale;
        if(this.m_conf.scale_init == -1){
            if(this.m_conf.is_mobile == false){
                this.m_conf.scale_init = i_real_scale;
                // this.m_conf.scale_init = 0.25;
            }else{
                this.m_conf.scale_init = 0.4;
            }
        }else{

        }

        var chg_in_pos = {
            c_x:(this.m_conf.map_width / 2),
            c_y:(this.m_conf.map_height / 2),
            rad:(this.m_conf.map_angle) * Math.PI/180,
            p_x:0,
            p_y:0
        };

        for(var i=0;i<this.m_conf.wayfind_bridge.length;i+=1){
            var t_obj = this.m_conf.wayfind_bridge[i];

            var arr_t_x = t_obj.t_pos_x.split(',');
            var arr_t_y = t_obj.t_pos_y.split(',');
            var arr_p_x = t_obj.p_pos_x.split(',');
            var arr_p_y = t_obj.p_pos_y.split(',');
            for(var j=0;j<arr_t_x.length;j+=1){
                chg_in_pos.p_x = arr_t_x[j];
                chg_in_pos.p_y = arr_t_y[j];
                var t_pos = this.m_util.getChgAnglePos(chg_in_pos);
                arr_t_x[j] = t_pos.x;
                arr_t_y[j] = t_pos.y;

                chg_in_pos.p_x = arr_p_x[j];
                chg_in_pos.p_y = arr_p_y[j];
                t_pos = this.m_util.getChgAnglePos(chg_in_pos);
                arr_p_x[j] = t_pos.x;
                arr_p_y[j] = t_pos.y;
            }
            t_obj.t_pos_x = arr_t_x.toString();
            t_obj.t_pos_y = arr_t_y.toString();
            t_obj.p_pos_x = arr_p_x.toString();
            t_obj.p_pos_y = arr_p_y.toString();
        }

        // 이벤트 처리
        this.m_main_disp.addEventListener("touchstart",function(evt){ m_this.onMouseDownFloor(evt); },true );
        this.m_main_disp.addEventListener("touchend",function(evt){ m_this.onMouseUpFloor(evt); },true );
        this.m_main_disp.addEventListener("touchendoutside",function(evt){ m_this.onMouseUpFloor(evt); },true );

        this.m_main_disp.addEventListener("mousedown",function(evt){ m_this.onMouseDownFloor(evt); },true );
        this.m_main_disp.addEventListener("mouseup",function(evt){ m_this.onMouseUpFloor(evt); },true );
        //this.m_main_disp.addEventListener("mouseleave",function(evt){ m_this.onMouseBlurFloor(evt); },true );
        //this.m_main_disp.addEventListener("mouseout",function(evt){ m_this.onMouseUpFloor(evt); },true );

        this.m_main_disp.addEventListener("touchmove",function(evt){ m_this.onMouseMoveFloor(evt); },true );
        this.m_main_disp.addEventListener("mousemove",function(evt){ m_this.onMouseMoveFloor(evt); },true );

        this.m_main_disp.addEventListener("mousewheel",function(evt){ m_this.onMouseWheelFloor(evt); },true );

        this.setInitLoadFloor();
    }

    setInitLoadFloor(){
        console.log("setInitLoadFloor()");


        var i = 0, j = 0, k = 0;
        var i_top = 0, i_start = 0;
        var i_tmp = 0, i_tmp2 = 0;
        var i_found = 0;
        var obj_floor, obj_store, obj_route, obj_pub;
        var str_tmp = "";

        var m_this = this;

        var icon_ww = Number(this.m_load_data.header.PUB_ICON_WIDTH);
        var icon_hh = Number(this.m_load_data.header.PUB_ICON_HEIGHT);

        this.m_app_container = document.createElement("div");
        this.m_app_container.style.position = "absolute";
        this.m_app_container.style.zIndex = 5;

        this.m_app_container.style.width = this.m_conf.disp_width + "px";
        this.m_app_container.style.height = this.m_conf.disp_height + "px";

        this.m_app_container.style.left = this.m_conf.margin_left + "px";

        this.m_main_disp.appendChild(this.m_app_container);

        var etc_div = document.createElement("div");

        etc_div.style.position = "absolute";
        etc_div.style.zIndex = 5;

        this.m_app_container.appendChild(etc_div);

        // 아이콘 처리
        var arr_div = document.createElement("div");
        var img_arr = document.createElement("img");

        //img_arr.src = "images/wayfind/icon_arr_down.png";
        img_arr.style.width = "40px";
        img_arr.style.height = "40px";

        arr_div.style.position = "absolute";
        arr_div.style.left = (518) + "px";
        arr_div.style.top = (400) + "px";

        arr_div.appendChild(img_arr);

        this.m_icon_arrow = arr_div;

        etc_div.appendChild(this.m_icon_arrow);

        // 텍스트 처리
        this.m_txt_left = document.createElement("div");
        this.m_txt_right = document.createElement("div");

        this.m_txt_left.innerHTML = "L1";
        this.m_txt_right.innerHTML = "L1";

        this.m_txt_left.style.position = "absolute";
        this.m_txt_right.style.position = "absolute";

        this.m_txt_left.style.fontFamily = "roboto";
        this.m_txt_left.style.fontWeight = "300";
        this.m_txt_left.style.fontSize = "70px";

        this.m_txt_right.style.fontFamily = "roboto";
        this.m_txt_right.style.fontWeight = "300";
        this.m_txt_right.style.fontSize = "70px";

        this.m_txt_left.style.left = (this.m_conf.disp_width/4) + "px";
        this.m_txt_left.style.top = (100) + "px";
        this.m_txt_right.style.left = (this.m_conf.disp_width * 3/4 - 30) + "px";
        this.m_txt_right.style.top = (100) + "px";

        etc_div.appendChild(this.m_txt_left);
        etc_div.appendChild(this.m_txt_right);

        for(i = 0; i < this.m_load_data.arr_pub_icon_list.length; i++){
            obj_pub = this.m_load_data.arr_pub_icon_list[i];
            this.m_arr_pub_icons.push({"PUB_CODE":obj_pub.PUB_CODE,"PUB_URL":"" + obj_pub.PUB_IMG});
        }

        // 위치 변경
        var arr_tmp_x = [];
        var arr_tmp_y = [];
        var str_tmp_x = "";
        var str_tmp_y = "";

        var chg_ret_pos = {x:0,y:0};
        var chg_in_pos = {
            c_x:(this.m_conf.map_width / 2),
            c_y:(this.m_conf.map_height / 2),
            rad:(this.m_conf.map_angle) * Math.PI/180,
            p_x:0,
            p_y:0
        };

        chg_in_pos.p_x = Number(this.m_load_data.header.POS_X);
        chg_in_pos.p_y = Number(this.m_load_data.header.POS_Y);

        chg_ret_pos = this.m_util.getChgAnglePos(chg_in_pos);
        this.m_load_data.header.POS_X = chg_ret_pos.x;
        this.m_load_data.header.POS_Y = chg_ret_pos.y;

        // 상점 위치 변경
        for(i = 0; i < this.m_load_route.arr_store_list.length; i++){
            obj_route = this.m_load_route.arr_store_list[i];
            for(j = 0; j < this.m_load_data.arr_store_orig_list.length; j++){
                obj_store =  this.m_load_data.arr_store_orig_list[j];
                if(obj_route.ID == obj_store.ID){

                    obj_store.STORE_FLOOR = obj_route.STORE_FLOOR;

                    chg_in_pos.p_x = obj_route.POS_X;
                    chg_in_pos.p_y = obj_route.POS_Y;

                    chg_ret_pos = this.m_util.getChgAnglePos(chg_in_pos);
                    obj_store.POS_X = chg_ret_pos.x;
                    obj_store.POS_Y = chg_ret_pos.y;

                    str_tmp_x = "";
                    str_tmp_y = "";

                    arr_tmp_x = obj_route.GATE_POS_X.split(',');
                    arr_tmp_y = obj_route.GATE_POS_Y.split(',');

                    for(k = 0; k < arr_tmp_x.length; k++){
                        chg_in_pos.p_x = Number(arr_tmp_x[k]);
                        chg_in_pos.p_y = Number(arr_tmp_y[k]);
                        chg_ret_pos = this.m_util.getChgAnglePos(chg_in_pos);

                        if(str_tmp_x == ""){
                            str_tmp_x = chg_ret_pos.x + "";
                            str_tmp_y = chg_ret_pos.y + "";
                        }else{
                            str_tmp_x += "," + chg_ret_pos.x + "";
                            str_tmp_y += "," + chg_ret_pos.y + "";
                        }
                    }

                    obj_store.GATE_POS_X = str_tmp_x;
                    obj_store.GATE_POS_Y = str_tmp_y;

                    obj_store.FONT_SIZE = obj_route.FONT_SIZE;
                    obj_store.FONT_COLOR = obj_route.FONT_COLOR;

                    this.m_load_data.arr_store_list.push(obj_store);

                    break;
                }
            }
        }

        // 공용 시설 위치 변경
        for(i = 0; i < this.m_load_route.arr_pub_list.length; i++){
            obj_route = this.m_load_route.arr_pub_list[i];
            chg_in_pos.p_x = obj_route.POS_X;
            chg_in_pos.p_y = obj_route.POS_Y;
            chg_ret_pos = this.m_util.getChgAnglePos(chg_in_pos);
            obj_route.POS_X = chg_ret_pos.x;
            obj_route.POS_Y = chg_ret_pos.y;
        }

        // 노드 위치 변경
        for(i = 0; i < this.m_load_route.arr_node_list.length; i++){
            obj_route = this.m_load_route.arr_node_list[i];
            chg_in_pos.p_x = obj_route.POS_X1;
            chg_in_pos.p_y = obj_route.POS_Y1;
            chg_ret_pos = this.m_util.getChgAnglePos(chg_in_pos);
            obj_route.POS_X1 = chg_ret_pos.x;
            obj_route.POS_Y1 = chg_ret_pos.y;

            chg_in_pos.p_x = obj_route.POS_X2;
            chg_in_pos.p_y = obj_route.POS_Y2;
            chg_ret_pos = this.m_util.getChgAnglePos(chg_in_pos);
            obj_route.POS_X2 = chg_ret_pos.x;
            obj_route.POS_Y2 = chg_ret_pos.y;
        }

        // 주차 위치 변경
        for(i = 0; i < this.m_load_route.arr_park_list.length; i++){
            obj_route = this.m_load_route.arr_park_list[i];
            chg_in_pos.p_x = obj_route.POS_X;
            chg_in_pos.p_y = obj_route.POS_Y;
            chg_ret_pos = this.m_util.getChgAnglePos(chg_in_pos);
            obj_route.POS_X = chg_ret_pos.x;
            obj_route.POS_Y = chg_ret_pos.y;
        }

        // SHAPE 변경
        for(i = 0; i < this.m_load_route.arr_shape_list.length; i++){
            obj_route = this.m_load_route.arr_shape_list[i];

            obj_route.ANGLE = obj_route.ANGLE + this.m_conf.map_angle;

            chg_in_pos.p_x = obj_route.POS_X;
            chg_in_pos.p_y = obj_route.POS_Y;
            chg_ret_pos = this.m_util.getChgAnglePos(chg_in_pos);
            obj_route.POS_X = chg_ret_pos.x;
            obj_route.POS_Y = chg_ret_pos.y;

            str_tmp_x = "";
            str_tmp_y = "";

            arr_tmp_x = obj_route.POINTS_X.split(',');
            arr_tmp_y = obj_route.POINTS_Y.split(',');

            for(k = 0; k < arr_tmp_x.length; k++){
                chg_in_pos.p_x = Number(arr_tmp_x[k]);
                chg_in_pos.p_y = Number(arr_tmp_y[k]);
                chg_ret_pos = this.m_util.getChgAnglePos(chg_in_pos);

                if(str_tmp_x == ""){
                    str_tmp_x = chg_ret_pos.x + "";
                    str_tmp_y = chg_ret_pos.y + "";
                }else{
                    str_tmp_x += "," + chg_ret_pos.x + "";
                    str_tmp_y += "," + chg_ret_pos.y + "";
                }
            }
            obj_route.POINTS_X = str_tmp_x;
            obj_route.POINTS_Y = str_tmp_y;
        }

        // ADDON
        if(this.m_conf.addon_list != null){
            for(i = 0; i < this.m_conf.addon_list.length; i++){
                obj_route = this.m_conf.addon_list[i];
                chg_in_pos.p_x = obj_route.pos_x;
                chg_in_pos.p_y = obj_route.pos_y;
                chg_ret_pos = this.m_util.getChgAnglePos(chg_in_pos);
                obj_route.pos_x = chg_ret_pos.x;
                obj_route.pos_y = chg_ret_pos.y;
            }
        }

        // 건물당 층수를 찾자.
        for(i = 0; i < this.m_load_data.arr_map_list.length; i++){
            obj_floor = this.m_load_data.arr_map_list[i];
            i_found = 0;
            for(j = 0; j < this.m_conf.arr_b_code.length; j++){
                if(this.m_conf.arr_b_code[j].B_CODE == obj_floor.B_CODE){
                    i_tmp = this.m_conf.arr_b_code[j].cnt;
                    this.m_conf.arr_b_code[j].cnt++;
                    i_found = 1;
                    break;
                }
            }
            if(i_found == 0){
                this.m_conf.arr_b_code.push({"B_CODE":obj_floor.B_CODE, "START":0, "cnt":1});
                i_tmp = 0;
            }
            this.m_load_data.arr_map_list[i].SORT_NUM = i_tmp;
        }

        //console.log(this.m_load_data.arr_map_list);
        // 건물당 층수를 찾았으면 층위아래의 기준점을 찾자.
        // 층이 5개이면 1,2,3,4,5 층일 경우 3층의 y축이 0이다.  즉 -2 칸부터 시작
        // 층이 4개이면 1,2,3,4 층일경우 2층이 y축이 0기준  즉 -1칸부터 시작
        for(i = 0; i < this.m_conf.arr_b_code.length; i++){
            if(this.m_conf.arr_b_code[i].cnt == 1){ // 층이 1개이면
                this.m_conf.arr_b_code[i].START = 0;
            }else{
                this.m_conf.arr_b_code[i].START = Math.floor(this.m_conf.arr_b_code[i].cnt / 2) - this.m_conf.arr_b_code[i].cnt + 1;
            }
        }

        // 맵을 그리자.
        for(i = 0; i < this.m_load_data.arr_map_list.length; i++){
            // console.log('맵을 그리자.');
            obj_floor = this.m_load_data.arr_map_list[i];

            this.m_arr_pub_cnt.push({"floor_id":obj_floor.ID, "b_code":obj_floor.B_CODE, "floor":obj_floor.FLOOR, "cnt":0});

            var floor_div = document.createElement("div");

            i_start = 0;
            for(j = 0; j < this.m_conf.arr_b_code.length; j++){
                if(this.m_conf.arr_b_code[j].B_CODE == obj_floor.B_CODE){
                    i_start = this.m_conf.arr_b_code[j].START;
                    break;
                }
            }

            i_start = i_start + this.m_load_data.arr_map_list[i].SORT_NUM;
            i_top = - this.m_conf.disp_height * i_start + this.m_conf.margin_top;

            var option = {
                id:obj_floor.ID,
                b_code:obj_floor.B_CODE,
                floor:obj_floor.FLOOR,
                top:i_top,
                url_img:obj_floor.MAIN_MAP_URL
            };

            var cls_floor = new Eltov2DFloor(this);
            // console.log('option', option);
            // console.log('floor_div', floor_div);
            // console.log('this.m_conf', this.m_conf);
            // console.log('this.m_load_data', this.m_load_data);
            // console.log('this.m_load_route', this.m_load_route);
            // console.log('this.m_arr_pub_icons', this.m_arr_pub_icons);
            cls_floor.setInit(option,floor_div,this.m_conf,this.m_load_data,this.m_load_route,this.m_arr_pub_icons);
            cls_floor.setInitSetting();
            this.m_app_container.appendChild(floor_div);

            this.m_app_floors.push({
                b_code:obj_floor.B_CODE,
                floor:obj_floor.FLOOR,
                start_num:i_start,
                CLS_FLOOR:cls_floor
            });
        }

        this.setChgFloor("LOCATION",this.m_load_data.header.B_CODE,this.m_load_data.header.KIOSK_FLOOR);
        var evt = new CustomEvent("eltov_map",{detail:{"sect":"INIT","result":"SUCC"}});
        document.dispatchEvent(evt);



    }

    /////////////////////////////////////////
    // MOVE EVENT
    onMouseDownFloor(p_evt){
        console.log("onMouseDownFloor()");


        if(this.m_wayfind_conf.mode == "TWOWAY") return;
        if(this.m_wayfind_conf.mode == "THREEWAY") return;
        if(this.m_wayfind_conf.mode == "FOURWAY") return;
        if(this.m_wayfind_conf.move_step != "") return;

        var real_evt;
        if(p_evt.data != undefined){  real_evt = p_evt.data.originalEvent;
        }else{ real_evt = p_evt; }

        var obj_disp = this.m_app_floors[this.m_conf.curr_floor_num].CLS_FLOOR.getMainDisp();
        var obj_cont = this.m_app_floors[this.m_conf.curr_floor_num].CLS_FLOOR.getMainDispContainer();
        var pos_floor = this.m_util.getPosTransform(obj_disp);
        var pos_cont = this.m_util.getPosTransform(obj_cont);

        this.m_move_conf.orig.x = pos_cont.left * (pos_floor.scale);
        this.m_move_conf.orig.y = pos_cont.top * (pos_floor.scale);

        this.m_move_conf.mode = DRAG_MODE_START;

        var obj = real_evt.touches;

        if(obj != undefined){  // 터치 부분
            this.m_move_conf.down.x = real_evt.touches[0].clientX;
            this.m_move_conf.down.y = real_evt.touches[0].clientY;
            if(real_evt.touches.length == 1){
                this.m_move_conf.type = DRAG_TYPE_MOVE;
                this.m_move_conf.start.x = real_evt.touches[0].clientX;
                this.m_move_conf.start.y = real_evt.touches[0].clientY;
            }else{
                this.m_move_conf.type = DRAG_TYPE_SCALE;
                var xx = real_evt.touches[0].clientX - real_evt.touches[1].clientX;
                var yy = real_evt.touches[0].clientY - real_evt.touches[1].clientY;
                this.m_move_conf.angle = 0;

                this.m_move_conf.scale_len = Math.sqrt(xx * xx + yy * yy);
                this.m_move_conf.scale_curr = pos_floor.scale;
            }
        }else{
            this.m_move_conf.type = DRAG_TYPE_MOVE;
            this.m_move_conf.start.x = real_evt.clientX;
            this.m_move_conf.start.y = real_evt.clientY;

            this.m_move_conf.down.x = real_evt.clientX;
            this.m_move_conf.down.y = real_evt.clientY;
        }

        this.m_move_conf.down.x = this.m_move_conf.move.x;
        this.m_move_conf.down.y = this.m_move_conf.move.y;
    }


    onMouseUpFloor(p_evt){
        console.log("onMouseUpFloor()");

        this.m_move_conf.mode = DRAG_MODE_NONE;
        if(this.m_move_conf.type == DRAG_TYPE_SCALE){
            this.setChkLimit(-1);
        }
    }

    // onMouseBlurFloor(p_evt){
    //     console.log("onMouseBlurFloor()");

    //     this.m_move_conf.mode = DRAG_MODE_NONE;
    // }

    onMouseMoveFloor(p_evt){
        console.log("onMouseMoveFloor()");


        if(this.m_wayfind_conf.mode == "TWOWAY") return;
        if(this.m_wayfind_conf.mode == "THREEWAY") return;
        if(this.m_wayfind_conf.mode == "FOURWAY") return;
        if(this.m_wayfind_conf.move_step != "") return;

        var real_evt;
        if(p_evt.data != undefined){  real_evt = p_evt.data.originalEvent;
        }else{ real_evt = p_evt; }

        var obj = real_evt.touches;

        if(obj != undefined){  // 터치 부분
            this.m_move_conf.move.x = real_evt.touches[0].clientX;
            this.m_move_conf.move.y = real_evt.touches[0].clientY;
        }else{
            this.m_move_conf.move.x = real_evt.clientX;
            this.m_move_conf.move.y = real_evt.clientY;
        }

        if( this.m_move_conf.mode == DRAG_MODE_START){

            var pos_x = 0, pos_y = 0;
            var str_pos = "";

            var obj_disp = this.m_app_floors[this.m_conf.curr_floor_num].CLS_FLOOR.getMainDisp();
            var obj_cont = this.m_app_floors[this.m_conf.curr_floor_num].CLS_FLOOR.getMainDispContainer();

            var pos_floor = this.m_util.getPosTransform(obj_disp);
            var pos_cont = this.m_util.getPosTransform(obj_cont);

            if(obj != undefined){

                if(this.m_move_conf.type == DRAG_TYPE_MOVE){
                    pos_x = real_evt.touches[0].clientX;
                    pos_y = real_evt.touches[0].clientY;

                    pos_x = (pos_x - this.m_move_conf.start.x + this.m_move_conf.orig.x) / pos_floor.scale;
                    pos_y = (pos_y - this.m_move_conf.start.y + this.m_move_conf.orig.y) / pos_floor.scale;

                    if(this.m_conf.is_mobile == false){
                        if(pos_x > this.m_conf.limit_right) return;
                        if(pos_y > this.m_conf.limit_bottom) return;
                        if(pos_x < this.m_conf.limit_left) return;
                        if(pos_y < this.m_conf.limit_top) return;
                    }
                    str_pos = "translate(" + pos_x + "px," + pos_y + "px)";
                    obj_cont.style.transform = str_pos;

                }else{

                    pos_x = real_evt.touches[0].clientX - real_evt.touches[1].clientX;
                    pos_y = real_evt.touches[0].clientY - real_evt.touches[1].clientY;

                    var i_sqr = Math.sqrt(pos_x * pos_x + pos_y * pos_y);

                    var i_scale = 0;
                    if(i_sqr > 0 && this.m_move_conf.scale_len > 0){

                        var i_scale = (i_sqr / this.m_move_conf.scale_len) * this.m_move_conf.scale_curr;

                        if(i_scale > this.m_conf.scale_max) i_scale = this.m_conf.scale_max;
                        if(i_scale < this.m_conf.scale_min) i_scale = this.m_conf.scale_min;
                        str_pos = "translate(" + pos_floor.left + "px," + pos_floor.top + "px) scale(" + i_scale + "," + i_scale + ")";
                        obj_disp.style.transform = str_pos;
                    }
                }
            }else{
                pos_x = real_evt.clientX;
                pos_y = real_evt.clientY;

                pos_x = (pos_x - this.m_move_conf.start.x + this.m_move_conf.orig.x) / pos_floor.scale;
                pos_y = (pos_y - this.m_move_conf.start.y + this.m_move_conf.orig.y) / pos_floor.scale;


                if(this.m_conf.is_mobile == false){
                    if(pos_x > this.m_conf.limit_right) return;
                    if(pos_y > this.m_conf.limit_bottom) return;
                    if(pos_x < this.m_conf.limit_left) return;
                    if(pos_y < this.m_conf.limit_top) return;
                }
                str_pos = "translate(" + pos_x + "px," + pos_y + "px)";
                obj_cont.style.transform = str_pos;
            }
        }
    }


    onMouseWheelFloor(p_evt){

        console.log("onMouseWheelFloor()");

        var real_evt;
        if(p_evt.data != undefined){  real_evt = p_evt.data.originalEvent;
        }else{ real_evt = p_evt; }

        if(this.m_wayfind_conf.mode == "TWOWAY") return;
        if(this.m_wayfind_conf.mode == "THREEWAY") return;
        if(this.m_wayfind_conf.mode == "FOURWAY") return;
        if(this.m_wayfind_conf.move_step != "") return;


        if(real_evt.wheelDelta > 0){
            this.setChgScale("IN");
        }else{
            this.setChgScale("OUT");
        }
    }

    //////////////////////////////////////////////////////////////////////
    // MAIN FUNCTION

    setCallWebToMap(p_param){
        console.log("setCallWebToMap()");


        //console.log("setCallWebToMap >>>> ");
        //console.log(p_param);
        if(p_param.sect == "CMD"){
            if(p_param.type == "LANG"){
                this.setChgLang(p_param.code);
            }else if(p_param.type == "FLOOR"){
                if(p_param.move_type != "INIT"){
                    if(this.m_wayfind_conf.move_step != "") return;
                }
                this.setChgFloor(this.m_util.getChkNull(p_param.move_type,"LOCATION"),this.m_util.getChkNull(p_param.b_code,"IFC"),p_param.floor);
            }else if(p_param.type == "SCALE"){
                this.setChgScale(p_param.scale);
            }else if(p_param.type == "ROTATE"){
                this.setChgRoate(p_param.direction);
            }else if(p_param.type == "MOVE"){
                this.setChgMove(p_param.x,p_param.y,p_param.scale);
            }
        }else if(p_param.sect == "WAYFIND"){
            if(this.m_wayfind_conf.mode == "TWOWAY") return;
            if(this.m_wayfind_conf.mode == "THREEWAY") return;
            if(this.m_wayfind_conf.mode == "FOURWAY") return;
            if(this.m_wayfind_conf.move_step != "") return;

            if(p_param.type == "STORE"){
                this.setWayFindInfo("STORE",p_param);
            }else if(p_param.type == "PARK"){
                this.setWayFindInfo("PARK",p_param);
            }else if(p_param.type == "PUB"){
                this.setWayFindPub(p_param);
            }
        }else if(p_param.sect == "DEBUG"){
            if(p_param.type == "LINE"){
                //HANBAN29 디버그추가
                this.setDebugNodeLine();
            }
        }
    }

    setChgLang(p_lang){
        console.log("setChgLang()");

        var i = 0;
        for(i = 0; i < this.m_app_floors.length; i++){
            this.m_app_floors[i].CLS_FLOOR.setChgLang(p_lang);
        }
    }

    setChgFloor(p_type,p_b_code,p_floor){
        console.log("setChgFloor()");

        var i = 0, i_cnt = 0, i_start = 0;
        var obj;

        if(p_b_code == undefined || p_b_code == "") p_b_code = "IFC";

        if(p_type == "LOCATION" || p_type == "INIT"){
            this.m_icon_arrow.style.display = "none";
            this.m_txt_left.style.display = "none";
            this.m_txt_right.style.display = "none";
            this.m_wayfind_conf.mode = "";
            if(p_type == "INIT"){
                this.m_wayfind_conf.move_step = "";
            }
        }

        for(i = 0; i < this.m_app_floors.length; i++){
            obj = this.m_app_floors[i];
            if(obj.b_code == p_b_code){  // 같은 건물인지 확인하자.
                i_cnt++;
                if(obj.floor == p_floor){ // 같은 층인지 확인한다.
                    this.m_conf.curr_b_code = p_b_code;
                    this.m_conf.curr_floor_code = p_floor;
                    this.m_conf.curr_floor_num = i;
                    i_start = obj.start_num;
                    if(p_type == "WAYFIND"){
                        obj.CLS_FLOOR.setResetPosition("WAYFIND");
                    }else{
                        obj.CLS_FLOOR.setResetPosition("INIT");
                    }
                }else{
                    if(p_type == "WAYFIND"){
                        obj.CLS_FLOOR.setResetPosition("WAYFIND");
                    }else{
                        obj.CLS_FLOOR.setResetPosition("REAL");
                    }
                }
            }else{  // 같은 건물이 아니면 숨기자.
                if(p_type == "WAYFIND"){
                    obj.CLS_FLOOR.setResetPosition("HIDE_WAYFIND");
                }else{
                    obj.CLS_FLOOR.setResetPosition("HIDE");
                }
            }
        }

        if(p_type == "INIT"){
            this.m_app_container.style.transform = "translateY(" + ( (this.m_conf.disp_height + this.m_conf.margin_height ) * (i_start) + this.m_conf.margin_top) + "px)";
        }else{
            if(this.m_curr_b_code!=p_b_code){
                TweenLite.to(this.m_app_container, 0.0, { y:(this.m_conf.disp_height + this.m_conf.margin_height ) * (i_start) + this.m_conf.margin_top, ease:Back.easeOut.config(0.5) } );
            }else{
                TweenLite.to(this.m_app_container, 1, { y:(this.m_conf.disp_height + this.m_conf.margin_height ) * (i_start) + this.m_conf.margin_top, ease:Back.easeOut.config(0.5) } );
            }
        }
        this.setChkLimit(-1);
        this.m_curr_b_code = p_b_code;
    }

    setChgScale(p_type){
        console.log("setChgScale()");


        var obj_disp = this.m_app_floors[this.m_conf.curr_floor_num].CLS_FLOOR.getMainDisp();
        var ret_pos = this.m_util.getPosTransform(obj_disp);
        var i_scale = ret_pos.scale;

        if(p_type == "IN" || p_type == "OUT"){
            if(p_type == "IN"){
                if(i_scale >= this.m_conf.scale_max) return;
                i_scale += 0.02;
            }else{
                if(i_scale <= this.m_conf.scale_min) return;
                i_scale -= 0.02;
            }
        }else{
            i_scale = Number(p_type);
        }

        var str_tmp = "translate(" + ret_pos.left + "px," + ret_pos.top + "px) scale(" + i_scale + "," + i_scale + ")";
        obj_disp.style.transform = str_tmp;

        this.setChkLimit(i_scale);
    }

    // setChgRoate(p_type){
    //     console.log("setChgRoate()");


    // }

    // setChgMove(p_x,p_y,p_scale){
    //     console.log("setChgMove()");

    //     var cls_floor = this.m_app_floors[this.m_conf.curr_floor_num].CLS_FLOOR;
    //     cls_floor.setMainDispPos(Number(p_x),Number(p_y),Number(p_scale));
    // }

    setStoreInfo(p_id){
        console.log("setStoreInfo()");

        if(this.m_wayfind_conf.mode == "TWOWAY") return;
        if(this.m_wayfind_conf.mode == "THREEWAY") return;
        if(this.m_wayfind_conf.mode == "FOURWAY") return;
        if(this.m_wayfind_conf.move_step != "") return;

        var xx = this.m_move_conf.move.x - this.m_move_conf.down.x;
        var yy = this.m_move_conf.move.y - this.m_move_conf.down.y;
        var i_sqrt = Math.sqrt(xx * xx + yy * yy);

        if(i_sqrt < 20){
            var evt = new CustomEvent("eltov_map",{detail:{"sect":"STORE","type":"INFO","id":p_id}});
            document.dispatchEvent(evt);
        }
    }


    // 공용시설 찾기
    setWayFindPub(p_param){
        console.log("setWayFindPub()");
        var i = 0, j = 0, i_cnt = 0;
        var i_floor = 0, i_down = 0, i_up = 0;
        var i_len = 0, i_min_len = -1;
        var i_ret = -1;
        var str_b_code = "", str_floor = "", str_ret = "", str_pub_id = "";
        var curr_floor;
        var arr_pubs = [];
        var s_pos = {x:Number(this.m_load_data.header.POS_X), y:Number(this.m_load_data.header.POS_Y)};
        var t_pos = {x:0, y:0};
        var obj;

        var way_type = this.m_util.getChkNull(p_param.way_type,"LOCATION");
        var pub_code = p_param.id;

        // 현재 위치에 있는지 확인을 하자.
        for(i = 0; i < this.m_app_floors.length; i++){
            obj = this.m_app_floors[i];
            if(obj.floor == this.m_conf.curr_floor_code){
                i_floor = i;
                curr_floor = obj;
                if(way_type == "LOCATION"){  // 현재위치가 로케이션이면 같은공용시설을 보여준다.
                    i_cnt = obj.CLS_FLOOR.setWayFindPub("",pub_code);
                }else{
                    arr_pubs = obj.CLS_FLOOR.setSearchPub(pub_code);
                    i_cnt = arr_pubs.length;
                }
                break;
            }
        }

        if(i_cnt > 0){  // 현재 위치에 있을 경우
            var evt = new CustomEvent("eltov_map",{detail:{"sect":"WAYFIND","type":"" + this.m_wayfind_conf.type + "","result":"WAYFLOOR","floor":this.m_conf.curr_floor_code}});
            document.dispatchEvent(evt);
            if(way_type == "NEARLOCATION"){  // 현재위치에서 가장 가까운 한개를 찾는다.
                for(i = 0; i < arr_pubs.length; i++){
                    t_pos.x = Number(arr_pubs[i].POS_X);
                    t_pos.y = Number(arr_pubs[i].POS_Y);
                    i_ret = curr_floor.CLS_FLOOR.setWayFindStart({},s_pos,t_pos.x,t_pos.y);
                    if(i_ret >= 0){
                        i_len = curr_floor.CLS_FLOOR.getWayFindTotalLength();
                        if(i_min_len == -1 || i_len < i_min_len){
                            i_min_len = i_len;
                            str_pub_id = arr_pubs[i].PUB_ID;
                        }
                    }
                }
                if(str_pub_id != ""){
                    curr_floor.CLS_FLOOR.setWayFindPub(str_pub_id,"");
                }
            }
        }else{
            //console.log("다른층에 있다.");
            for(i = 0; i < this.m_arr_pub_cnt.length; i++){  // 클리어 해주고
                this.m_arr_pub_cnt[i].cnt = 0;
            }
            for(i = 0; i < this.m_load_route.arr_pub_list.length; i++){
                obj = this.m_load_route.arr_pub_list[i];
                if(obj.PUB_CODE == pub_code){  // 공용시설 코드가 같고 같은 건물에 있다면 카운트를 세자
                    for(j = 0; j < this.m_arr_pub_cnt.length; j++){
                        if(obj.B_CODE == this.m_arr_pub_cnt[j].b_code && obj.PUB_FLOOR == this.m_arr_pub_cnt[j].floor){
                            this.m_arr_pub_cnt[j].cnt++;
                            break;
                        }
                    }
                }
            }
            if(i_floor==0 && this.m_conf.curr_b_code=="B02"){
                i_floor=9;
            }
            // 현재 위치에서 위아래로 가까운 공용시설을 찾자.
            i_down = i_floor;
            i_up = i_floor;
            for(i = 0; i < this.m_arr_pub_cnt.length; i++){
                i_up++;
                if(i_up < this.m_arr_pub_cnt.length){
                    if(this.m_arr_pub_cnt[i_up].cnt > 0){
                        this.m_app_floors[i_up].CLS_FLOOR.setWayFindPub("",pub_code);
                        str_b_code = this.m_app_floors[i_up].b_code;
                        str_floor = this.m_app_floors[i_up].floor;
                        break;
                    }
                }
                i_down--;
                if(i_down >= 0){
                    if(this.m_arr_pub_cnt[i_down].cnt > 0){
                        this.m_app_floors[i_down].CLS_FLOOR.setWayFindPub("",pub_code);
                        str_b_code = this.m_app_floors[i_down].b_code;
                        str_floor = this.m_app_floors[i_down].floor;
                        break;
                    }
                }
            }

            if(str_floor != ""){
                this.setChgFloor("WAYFIND",str_b_code,str_floor);
                var evt = new CustomEvent("eltov_map",{detail:{"sect":"WAYFIND","type":"" + this.m_wayfind_conf.type + "","result":"WAYFLOOR","b_code":str_b_code,"floor":str_floor }});
                document.dispatchEvent(evt);
            }else{ // 공용시설을 못찾았다.
                // console.log("공용시설을 못찾았다");
            }
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    // WAYFIND STORE
    setWayFindInfo(p_sect,p_param){
        console.log("setWayFindInfo()");

        var i = 0, j = 0,k = 0;
        var i_way_start = 0;
        var str_tmp = "";
        var obj, obj_info;
        var str_p_floor = "",str_t_floor = "";  // 다른건물일 때 경로 및 목적지

        var info_id = p_param.id;
        var way_type = p_param.way_type;
        var move_type = this.m_util.getChkNull(p_param.move_type,"");;

        this.m_wayfind_conf.type = "";
        this.m_wayfind_conf.b_code = "";
        this.m_wayfind_conf.floor = "";
        this.m_wayfind_conf.action_type = "";
        this.m_wayfind_conf.near_type = "";
        this.m_wayfind_conf.target_x = "";
        this.m_wayfind_conf.target_y = "";
        this.m_wayfind_conf.gate_x = "";
        this.m_wayfind_conf.gate_y = "";

        if(p_sect == "STORE"){
            for(i = 0; i < this.m_load_data.arr_store_list.length; i++){
                obj_info = this.m_load_data.arr_store_list[i];
                if(obj_info.ID == info_id){
                    this.m_wayfind_conf.type = "STORE";
                    this.m_wayfind_conf.b_code = obj_info.B_CODE;
                    this.m_wayfind_conf.floor = obj_info.STORE_FLOOR;
                    this.m_wayfind_conf.action_type = this.m_util.getChkNull(p_param.action_type,"NONE");
                    this.m_wayfind_conf.near_type = this.m_util.getChkNull(p_param.near_type,"TARGET");

                    this.m_wayfind_conf.target_x = obj_info.POS_X;
                    this.m_wayfind_conf.target_y = obj_info.POS_Y;
                    this.m_wayfind_conf.gate_x = obj_info.GATE_POS_X;
                    this.m_wayfind_conf.gate_y = obj_info.GATE_POS_Y;
                    break;
                }
            }
        }else if(p_sect == "PARK"){
            for(i = 0; i < this.m_load_route.arr_park_list.length; i++){
                obj_info = this.m_load_route.arr_park_list[i];
                if(obj_info.PARK_CODE == info_id){
                    this.m_wayfind_conf.type = "PARK";
                    this.m_wayfind_conf.b_code = obj_info.B_CODE;
                    this.m_wayfind_conf.floor = obj_info.PARK_FLOOR;
                    this.m_wayfind_conf.action_type = this.m_util.getChkNull(p_param.action_type,"NONE");
                    this.m_wayfind_conf.near_type = this.m_util.getChkNull(p_param.near_type,"ALL");
                    this.m_wayfind_conf.target_x = obj_info.POS_X;
                    this.m_wayfind_conf.target_y = obj_info.POS_Y;
                    this.m_wayfind_conf.gate_x = obj_info.POS_X;
                    this.m_wayfind_conf.gate_y = obj_info.POS_Y;
                    break;
                }
            }
        }

        if(this.m_wayfind_conf.type == ""){
            var evt = new CustomEvent("eltov_map",{detail:{"sect":"WAYFIND","type":"" + this.m_wayfind_conf.type + "","result":"NONE"}});
            document.dispatchEvent(evt);
            return;
        }

        if(way_type == "LOCATION"){  // 상점의 위치만 보여 준다.

            for(i = 0; i < this.m_app_floors.length; i++){
                if(this.m_app_floors[i].b_code == this.m_wayfind_conf.b_code && this.m_app_floors[i].floor == this.m_wayfind_conf.floor){
                    if(this.m_conf.curr_floor_code != this.m_app_floors[i].floor){  // 같은 층이 아니면 이동한다.
                        this.setChgFloor("LOCATION",this.m_wayfind_conf.b_code,this.m_wayfind_conf.floor);
                    }

                    this.m_app_floors[this.m_conf.curr_floor_num].CLS_FLOOR.setCurrIconHidden();
                    this.m_app_floors[i].CLS_FLOOR.setTargetIcon(this.m_wayfind_conf.target_x,this.m_wayfind_conf.target_y);
                    var evt = new CustomEvent("eltov_map",{detail:{"sect":"WAYFIND","type":"" + this.m_wayfind_conf.type + "","result":"WAYFLOOR","floor":this.m_conf.curr_floor_code}});
                    document.dispatchEvent(evt);

                    if(this.m_conf.is_mobile == true){
                        this.m_app_floors[this.m_conf.curr_floor_num].CLS_FLOOR.setMainDispPos(0-Number(this.m_wayfind_conf.target_x),Number(0-this.m_wayfind_conf.target_y));
                    }
                    break;
                }
            }
        }else{

            var pub_param = {};

            // 현재위치에서 같은빌딩 인지 확인을 한다.
            if(this.m_load_data.header.B_CODE == this.m_wayfind_conf.b_code){ // 같은 건물이다.
                if(this.m_load_data.header.KIOSK_FLOOR == this.m_wayfind_conf.floor){ // 같은 층이면
                    i_way_start = 1;
                }else{
                    if(move_type != ""){ // 이동수단이 결정이 되면 바로 길안내를 시작한다.
                        i_way_start = 1;
                    }else{
                        pub_param = {"b_code":this.m_load_data.header.B_CODE,"s_floor":this.m_load_data.header.KIOSK_FLOOR,"t_floor":this.m_wayfind_conf.floor};
                    }
                }
            }else{  // 다른 건물이다.
                if(this.m_conf.wayfind_bridge != null){
                    // 내 위치에서 목적지 빌딩까지 경로가 있는지 확인
                    for(i = 0; i < this.m_conf.wayfind_bridge.length; i++){
                        obj = this.m_conf.wayfind_bridge[i];
                        if(obj.s_b_code == this.m_load_data.header.B_CODE && obj.s_floor == this.m_load_data.header.KIOSK_FLOOR){
                            str_p_floor = obj.p_floor;
                            str_t_floor = obj.t_floor;
                            break;
                        }
                    }
                }
                if(str_p_floor != ""){ // 경로가 있다.
                    if(move_type != ""){ // 이동수단이 결정이 되면 바로 길안내를 시작한다.
                        i_way_start = 1;
                    }else{
                        pub_param = {"b_code":this.m_load_data.header.B_CODE,"s_floor":this.m_load_data.header.KIOSK_FLOOR,"t_floor":str_p_floor};
                    }
                }else{
                    i_way_start = -1;
                }
            }

            if(i_way_start == 1){
                this.setWayFindStart(move_type);
            }else if(i_way_start == 0){
                // 목적지까지 갈수 있는 이동수단이 있는지 확인하자.
                var ret_pub = this.getFindMovePubCnt(pub_param);  //
                if(ret_pub.ele_cnt > 0 && ret_pub.esc_cnt > 0){  // 이동수단을 결정하지 않았으면 물어 본다.
                    var evt = new CustomEvent("eltov_map",{
                        detail:{
                            "sect":"WAYFIND",
                            "result":"WAYTYPE",
                            "type":"" + this.m_wayfind_conf.type + "",
                            "id":info_id,
                            "target_b_code":this.m_wayfind_conf.b_code,
                            "target_floor":this.m_wayfind_conf.floor,
                            "target_x":this.m_wayfind_conf.target_x,
                            "target_y":this.m_wayfind_conf.target_y
                        }
                    });
                    document.dispatchEvent(evt);
                }else if(ret_pub.ele_cnt == 0 && ret_pub.esc_cnt == 0){
                    var evt = new CustomEvent("eltov_map",{detail:{"sect":"WAYFIND","type":"" + this.m_wayfind_conf.type + "","result":"NOWAY"}});
                    document.dispatchEvent(evt);
                }else{
                    if(ret_pub.ele_cnt > 0){
                        this.setWayFindStart("ELE");
                    }else{
                        this.setWayFindStart("ESC");
                    }
                }
            }else{
                var evt = new CustomEvent("eltov_map",{detail:{"sect":"WAYFIND","type":"" + this.m_wayfind_conf.type + "","result":"NOWAY"}});
                document.dispatchEvent(evt);
            }
        }
    }


    /////////////////////////////////////////////////////////
    // WAYFIND
    setWayFindStart(p_move_type){
        console.log("setWayFindStart()");

        var i = 0, j = 0, k = 0;
        var i_len = 0,i_min_len = -1, i_min_gate = -1;
        var i_ret = -1, i_err = 0;
        var str_ret = "", str_start = "", str_target = "";
        var str_p_floor = "", str_t_floor = "";

        var obj;
        var floor_s_obj = null, floor_t_obj = null;

        var m_this = this;
        var way_param = {};
        var way_opt = {};
        var s_pos = {x:Number(this.m_load_data.header.POS_X), y:Number(this.m_load_data.header.POS_Y)};
        var t_pos = {x:0, y:0};

        this.m_wayfind_conf.move_cnt = 0;
        this.m_wayfind_conf.arr_floors.length = 0;

        var chg_in_pos = {
            c_x:(this.m_conf.map_width / 2),
            c_y:(this.m_conf.map_height / 2),
            rad:(this.m_conf.map_angle) * Math.PI/180,
            p_x:0,
            p_y:0
        };

        // 시작하는 층을 넣자.
        way_param = {b_code:this.m_load_data.header.B_CODE,floor:this.m_load_data.header.KIOSK_FLOOR};
        floor_s_obj = this.getFindFloorObj(way_param);

        this.m_wayfind_conf.arr_floors.push({
            floor_obj:floor_s_obj,b_code:this.m_load_data.header.B_CODE,floor:this.m_load_data.header.KIOSK_FLOOR
        });

        if(this.m_load_data.header.B_CODE == this.m_wayfind_conf.b_code){  // 같은 건물
            if(this.m_load_data.header.KIOSK_FLOOR == this.m_wayfind_conf.floor){  // 같은층일 경우 이동 길안내는 1개
                console.log("같은건물 같은층");
                i_ret = floor_s_obj.CLS_FLOOR.setWayFindStart(way_opt,s_pos,this.m_wayfind_conf.gate_x, this.m_wayfind_conf.gate_y);
                if(i_ret < 0){
                    // console.log("setWayFindStart ERR SAME BUILD SAME FLOOR");
                    i_err++;
                }
            }else{ // 같은건물 다른층일 경우 길안내 2개  ex) B01/1F 에서 B01/2F로 이동시
                console.log("같은건물 다른층");
                way_param = {
                    move_type:p_move_type, b_code:this.m_load_data.header.B_CODE, s_floor:this.m_load_data.header.KIOSK_FLOOR,t_floor:this.m_wayfind_conf.floor,
                    s_pos_x:this.m_load_data.header.POS_X, s_pos_y:this.m_load_data.header.POS_Y,
                    t_pos_x:this.m_wayfind_conf.gate_x, t_pos_y:this.m_wayfind_conf.gate_y
                };
                if(this.getFindMovePubInfo(way_param) >= 0){
                    way_param = {b_code:this.m_load_data.header.B_CODE,floor:this.m_wayfind_conf.floor};
                    floor_t_obj = this.getFindFloorObj(way_param);
                    this.m_wayfind_conf.arr_floors.push({
                        floor_obj:floor_t_obj,b_code:this.m_load_data.header.B_CODE,floor:this.m_wayfind_conf.floor
                    });
                }else{
                    // console.log("setWayFindStart ERR SAME BUILD DIFF FLOOR");
                    i_err++;
                }
            }
        }else{  // 건물이 다를경우에는 길안내 경우가 2개부터 ~ 4개이다.
            // 내 위치에서 목적지 빌딩까지 경로가 있는지 확인
            console.log("다른건물");
            var i_target_ret = -1;
            var str_pass_p_x = "";
            var str_pass_p_y = "";
            var str_pass_t_x = "";
            var str_pass_t_y = "";
            for(i = 0; i < this.m_conf.wayfind_bridge.length; i++){
                obj = this.m_conf.wayfind_bridge[i];
                if(obj.s_b_code == this.m_load_data.header.B_CODE && obj.s_floor == this.m_load_data.header.KIOSK_FLOOR){
                    str_p_floor = obj.p_floor;   // 내  빌딩에서 이동경로
                    str_t_floor = obj.t_floor;   // 이동 빌딩에서 이동경로
                    str_pass_p_x = obj.p_pos_x;
                    str_pass_p_y = obj.p_pos_y;
                    str_pass_t_x = obj.t_pos_x;
                    str_pass_t_y = obj.t_pos_y;
                    break;
                }
            }
            if(str_p_floor != ""){ // 경로가 있다.
                if(this.m_load_data.header.KIOSK_FLOOR == str_p_floor){  //  브릿지가 내위치와 층이 같다.  내가 1F인데 브릿지도 1F에 있다.
                    // console.log("WAY BRIDGE 001");

                    i_ret = floor_s_obj.CLS_FLOOR.setWayFindStart(way_opt,s_pos,str_pass_p_x,str_pass_p_y);  // 목적지 번호가 리턴된다. 브릿지 길이 2개 이상일 경우에는 리턴된 번호가 브릿지 중에서 가까운것이다.
                    if(i_ret >= 0){
                        i_target_ret = i_ret;
                    }else{
                        i_err++;
                    }
                }else{ //  이동 경로가 내위치와 층이 다르다.  이동경로 이동할 이동수단을 찾자.  내가 2F인데 브릿지는 1F에 있다. 2층에서 1층으로 이동하자.
                    // console.log("ABC BRIDGE 002");

                    var arr_start_x = str_pass_p_x.split(',');
                    var arr_start_y = str_pass_p_y.split(',');

                    if(arr_start_x.length > 1 && this.m_wayfind_conf.floor == str_t_floor || this.m_wayfind_conf.near_type == "TARGET"){
                        way_param = {b_code:this.m_wayfind_conf.b_code,floor:str_t_floor};
                        floor_t_obj = this.getFindFloorObj(way_param);
                        i_ret = floor_t_obj.CLS_FLOOR.setWayFindStartBridge(way_opt,str_pass_p_x,str_pass_p_y,this.m_wayfind_conf.gate_x,this.m_wayfind_conf.gate_y);
                        if(i_ret >= 0){
                            way_param = {
                                move_type:p_move_type, b_code:this.m_load_data.header.B_CODE, s_floor:this.m_load_data.header.KIOSK_FLOOR,t_floor:str_p_floor,
                                s_pos_x:this.m_load_data.header.POS_X, s_pos_y:this.m_load_data.header.POS_Y,
                                t_pos_x:arr_start_x[i_ret], t_pos_y:arr_start_y[i_ret]
                            };
                            i_target_ret = i_ret;
                            this.getFindMovePubInfo(way_param);
                        }else{
                            i_err++;
                        }
                    }else{
                        way_param = {
                            move_type:p_move_type, b_code:this.m_load_data.header.B_CODE, s_floor:this.m_load_data.header.KIOSK_FLOOR,t_floor:str_p_floor,
                            s_pos_x:this.m_load_data.header.POS_X, s_pos_y:this.m_load_data.header.POS_Y,
                            t_pos_x:str_pass_p_x, t_pos_y:str_pass_p_y
                        };
                        i_target_ret = this.getFindMovePubInfo(way_param);
                    }
                    if(i_err == 0){

                        if(i_target_ret >= 0){  // 이동수단을 찾자.
                            way_param = {b_code:this.m_load_data.header.B_CODE, floor:str_p_floor};
                            floor_t_obj = this.getFindFloorObj(way_param);
                            this.m_wayfind_conf.arr_floors.push({
                                floor_obj:floor_t_obj, b_code:this.m_load_data.header.B_CODE, floor:str_p_floor
                            });
                        }else{
                            i_err++;
                        }
                    }
                }

                if(i_err == 0 && this.m_wayfind_conf.floor == str_t_floor){  // 다른 빌딩의 목적지가 이동 경로 층과 같다면  ex) 브릿지가 1층이고 목적지도 1층이다.
                    // console.log("ABC BRIDGE 003");

                    way_param = {b_code:this.m_wayfind_conf.b_code,floor:str_t_floor};
                    floor_t_obj = this.getFindFloorObj(way_param);

                    var arr_start_x = str_pass_t_x.split(',');
                    var arr_start_y = str_pass_t_y.split(',');

                    if(arr_start_x.length == 1){
                        s_pos = {x:Number(str_pass_t_x), y:Number(str_pass_t_y)};
                    }else{  // 브릿지 경로가 2개 이상이다.
                        s_pos = {x:Number(arr_start_x[i_target_ret]), y:Number(arr_start_y[i_target_ret])};
                    }
                    i_ret = floor_t_obj.CLS_FLOOR.setWayFindStart(way_opt,s_pos,this.m_wayfind_conf.gate_x,this.m_wayfind_conf.gate_y);
                    if(i_ret >= 0){
                        this.m_wayfind_conf.arr_floors.push({
                            floor_obj:floor_t_obj,b_code:this.m_wayfind_conf.b_code,floor:this.m_wayfind_conf.floor
                        });
                    }else{
                        i_err++;
                    }
                }else{  // 다른 빌딩의 목적지가 이동 경로 층과 같다면  ex) 브릿지가 1층이고 목적지가 2층이다.
                    // console.log("ABC BRIDGE 003-1");
                    if(i_err == 0){
                        var str_tmp_x = "", str_tmp_y = "";
                        var arr_start_x = str_pass_t_x.split(',');
                        var arr_start_y = str_pass_t_y.split(',');
                        if(arr_start_x.length == 1){
                            str_tmp_x = str_pass_t_x;
                            str_tmp_y = str_pass_t_y;
                        }else{  // 브릿지 경로가 2개 이상이다.
                            // console.log("I_BRIDGE_RET = " + i_target_ret);
                            str_tmp_x = arr_start_x[i_target_ret];
                            str_tmp_y = arr_start_y[i_target_ret];
                        }
                        way_param = {
                            move_type:p_move_type, b_code:this.m_wayfind_conf.b_code, s_floor:str_t_floor,t_floor:this.m_wayfind_conf.floor,
                            s_pos_x:str_tmp_x, s_pos_y:str_tmp_y,
                            t_pos_x:this.m_wayfind_conf.gate_x, t_pos_y:this.m_wayfind_conf.gate_y
                        };
                        // console.log("ABC BRIDGE 004");

                        if(this.getFindMovePubInfo(way_param) >= 0){  // 이동경로에서 목적지까지 이동수단을 찾자.
                            way_param = {b_code:this.m_wayfind_conf.b_code,floor:str_t_floor};
                            var floor_t_obj2 = this.getFindFloorObj(way_param);
                            this.m_wayfind_conf.arr_floors.push({
                                floor_obj:floor_t_obj2, b_code:this.m_wayfind_conf.b_code, floor:str_t_floor
                            });

                            way_param = {b_code:this.m_wayfind_conf.b_code,floor:this.m_wayfind_conf.floor};
                            floor_t_obj = this.getFindFloorObj(way_param);
                            this.m_wayfind_conf.arr_floors.push({
                                floor_obj:floor_t_obj,b_code:this.m_wayfind_conf.b_code,floor:this.m_wayfind_conf.floor
                            });
                        }else{
                            i_err++;
                        }
                    }
                }
            }
        }

        if(i_err == 0){ // 길안내를 시작하자.
            if(this.m_wayfind_conf.arr_floors.length == 1){
                this.m_wayfind_conf.mode = "ONEWAY";
            }else if(this.m_wayfind_conf.arr_floors.length == 2){
                this.m_wayfind_conf.mode = "TWOWAY";
            }else if(this.m_wayfind_conf.arr_floors.length == 3){
                this.m_wayfind_conf.mode = "THREEWAY";
            }else{
                this.m_wayfind_conf.mode = "FOURWAY";
            }
            this.setWayFindDrawEnd();

            var arr_tmp_floors = new Array();

            for(i = 0; i < this.m_wayfind_conf.arr_floors.length; i++){
                obj = this.m_wayfind_conf.arr_floors[i];
                arr_tmp_floors.push({"b_code":obj.b_code,"floor":obj.floor});
            }

            var evt = new CustomEvent("eltov_map",
                {
                    detail:{
                        "sect":"WAYFIND",
                        "type":this.m_wayfind_conf.type,
                        "result":"WAYSTART",
                        "mode":this.m_wayfind_conf.mode,
                        "move_type":this.m_wayfind_conf.move_type,
                        "start_floor":this.m_load_data.header.KIOSK_FLOOR,
                        "target_floor":this.m_wayfind_conf.floor,
                        "floors":arr_tmp_floors
                    }
                }
            );
            document.dispatchEvent(evt);
        }else{
            var evt = new CustomEvent("eltov_map",{detail:{"sect":"WAYFIND","type":this.m_wayfind_conf.type,"result":"NOWAY" }});
            document.dispatchEvent(evt);
        }
    }


    /////////////////////////////////////////////
    // WAYFIND UTIL
    // 이동가능수단 개수 찾기
    getFindMovePubCnt(p_param){
        console.log("getFindMovePubCnt()");

        var i = 0, j = 0, k = 0;
        var i_start = 0, i_target = 0;
        var str_move_updown = "";
        var obj;
        var arr_ele_pub = [];
        var arr_esc_pub = [];

        var ret_pub = {"ele_cnt":0,"esc_cnt":0};

        str_move_updown = this.getMoveUpDown(p_param.b_code,p_param.s_floor,p_param.t_floor);

        for(i = 0; i < this.m_load_route.arr_pub_list.length; i++){  // 목적지 층으로 갈수 있는 이동수단을 찾자.
            obj = this.m_load_route.arr_pub_list[i];
            if(obj.B_CODE == p_param.b_code && obj.PUB_FLOOR == p_param.s_floor){
                if(obj.PUB_CODE == "P01"){ arr_ele_pub.push(obj); }
                if(obj.PUB_CODE == "P02"){
                    if(obj.STATUS == "ALL"){
                        arr_esc_pub.push(obj);
                    }else if(obj.STATUS == "DOWN" && str_move_updown == "DOWN"){
                        arr_esc_pub.push(obj);
                    }else if(obj.STATUS == "UP" && str_move_updown == "UP"){
                        arr_esc_pub.push(obj);
                    }
                }

            }
        }

        for(i = 0; i < arr_ele_pub.length; i++){  // 목적지 층으로 갈수 있는 엘리베이터를 찾자
            for(j = 0; j < this.m_load_route.arr_pub_list.length; j++){
                obj = this.m_load_route.arr_pub_list[j];
                if(obj.AREA != "" && arr_ele_pub[i].AREA == obj.AREA && obj.PUB_CODE == "P01" && obj.PUB_FLOOR == p_param.t_floor){
                    for(k = 0; k < obj.ARR_MOVE_FLOORS.length; k++){
                        if(p_param.s_floor == obj.ARR_MOVE_FLOORS[k]){
                            ret_pub.ele_cnt++;
                            break;
                        }
                    }
                }
                if(ret_pub.ele_cnt > 0) break;
            }
            if(ret_pub.ele_cnt > 0) break;
        }

        for(i = 0; i < arr_esc_pub.length; i++){  // 목적지 층으로 갈수 있는 에스컬레이터를 찾자.
            for(j = 0; j < this.m_load_route.arr_pub_list.length; j++){
                obj = this.m_load_route.arr_pub_list[j];
                if(obj.AREA != "" && arr_esc_pub[i].AREA == obj.AREA && obj.PUB_CODE == "P02" && obj.PUB_FLOOR == p_param.t_floor){
                    for(k = 0; k < obj.ARR_MOVE_FLOORS.length; k++){
                        if(p_param.s_floor == obj.ARR_MOVE_FLOORS[k]){
                            ret_pub.esc_cnt++;
                            break;
                        }
                    }
                }
                if(ret_pub.esc_cnt > 0) break;
            }
            if(ret_pub.esc_cnt > 0) break;
        }
        return ret_pub;
    }

    // 이동가능수단 정보 리턴 및 길찾기 완료
    // 리턴이 Gate번호를 리턴한다. 만일 Gate가 1개 일경우에는 0을 반환하고  2개 이상일 경우에는 가장 짧은 번호를 리턴한다.
    // ex) Gate가 2개일경우 0,1 중리턴, Gate가 3개 일경우 0,1,2리턴
    getFindMovePubInfo(p_param){
        console.log("getFindMovePubInfo()");
        var i = 0, j = 0, k = 0;
        var i_err = 0, i_ret = 0;
        var i_len = 0,i_min_len = -1, i_target_ret = -1;
        var str_ret = "";
        var str_move_updown = "", str_pub_code = "", str_area = "";
        var way_opt = {};
        var way_param = {};
        var floor_s_obj = null, floor_t_obj = null;
        var obj;
        var ret_pub;

        var arr_my_pub = [];
        var arr_sa_pub = [];
        var arr_ta_pub = [];

        var s_pos = {x:Number(p_param.s_pos_x), y:Number(p_param.s_pos_y)};
        var t_pos = {x:0, y:0};

        way_param = {b_code:p_param.b_code,floor:p_param.s_floor};
        var floor_s_obj = this.getFindFloorObj(way_param);
        way_param = {b_code:p_param.b_code,floor:p_param.t_floor};
        var floor_t_obj = this.getFindFloorObj(way_param);

        if(p_param.move_type == "ELE"){
            str_pub_code = "P01";
        }else{  // 에스컬레이터라면 UP/DOWN 확인
            str_move_updown = this.getMoveUpDown(p_param.b_code,p_param.s_floor,p_param.t_floor);
            str_pub_code = "P02";
        }

        for(i = 0; i < this.m_load_route.arr_pub_list.length; i++){  // 목적지 층으로 갈수 있는 이동수단을 찾자.
            obj = this.m_load_route.arr_pub_list[i];
            if(obj.PUB_CODE == str_pub_code && obj.B_CODE == p_param.b_code && obj.PUB_FLOOR == p_param.s_floor){
                if(str_pub_code == "P01"){
                    arr_my_pub.push(obj);
                }else{
                    if(obj.STATUS == "ALL"){
                        arr_my_pub.push(obj);
                    }else if(obj.STATUS == "DOWN" && str_move_updown == "DOWN"){
                        arr_my_pub.push(obj);
                    }else if(obj.STATUS == "UP" && str_move_updown == "UP"){
                        arr_my_pub.push(obj);
                    }
                }
            }
        }

        for(i = 0; i < arr_my_pub.length; i++){  // 목적지 층으로 갈수 있는 이동수단을 찾자.
            for(j = 0; j < this.m_load_route.arr_pub_list.length; j++){
                obj = this.m_load_route.arr_pub_list[j];
                if(obj.AREA != "" && arr_my_pub[i].AREA == obj.AREA && obj.PUB_CODE == str_pub_code && obj.B_CODE == p_param.b_code && obj.PUB_FLOOR == p_param.t_floor){
                    for(k = 0; k < obj.ARR_MOVE_FLOORS.length; k++){
                        if(p_param.t_floor == obj.ARR_MOVE_FLOORS[k]){
                            arr_sa_pub.push(arr_my_pub[i]);
                            arr_ta_pub.push(obj);
                            break;
                        }
                    }
                }
            }
        }

        // 모두 찾았으면 가장 가까운 이동수단을 찾자.
        str_area = "";
        if(arr_sa_pub.length > 0  && arr_sa_pub.length == arr_ta_pub.length){
            i_min_len = - 1;  // 가장 가까운길
            i_target_ret = -1;  // 가장 가까운 길을 선택했을때 타겟을 번호 만일 Gate가 2개라면 0,1 둘중하나를 리턴한다.
            //내위치에서 가장가까운 이동수단
            if( this.m_wayfind_conf.near_type == "ALL" || this.m_wayfind_conf.near_type == "START" ){
                for(i = 0; i < arr_sa_pub.length; i++){
                    t_pos.x = Number(arr_sa_pub[i].POS_X);
                    t_pos.y = Number(arr_sa_pub[i].POS_Y);
                    i_ret = floor_s_obj.CLS_FLOOR.setWayFindStart(way_opt,s_pos,t_pos.x,t_pos.y);
                    if(i_ret >= 0){
                        i_len = floor_s_obj.CLS_FLOOR.getWayFindTotalLength();
                        if(i_min_len == -1 || i_len < i_min_len){
                            i_min_len = i_len;
                            str_area = arr_sa_pub[i].AREA;
                        }
                    }
                }
            }

            //목표위치에서 가장 가까운 수단
            if( this.m_wayfind_conf.near_type == "ALL" || this.m_wayfind_conf.near_type == "TARGET" ){
                for(i = 0; i < arr_ta_pub.length; i++){
                    s_pos.x = Number(arr_ta_pub[i].POS_X);
                    s_pos.y = Number(arr_ta_pub[i].POS_Y);
                    floor_t_obj.CLS_FLOOR.setWayFindStart(way_opt, s_pos, p_param.t_pos_x, p_param.t_pos_y);
                    i_len = floor_t_obj.CLS_FLOOR.getWayFindTotalLength();
                    if(i_min_len == -1 || i_len < i_min_len){
                        i_min_len = i_len;
                        str_area = arr_ta_pub[i].AREA;
                    }
                }
            }

            // 목표 위치를 찾았으면 마지막 길안내를 다시 한다.
            if(str_area != ""){
                for(i = 0; i < arr_sa_pub.length; i++){
                    if(arr_sa_pub[i].AREA == str_area){
                        s_pos.x = Number(p_param.s_pos_x);
                        s_pos.y = Number(p_param.s_pos_y);
                        floor_s_obj.CLS_FLOOR.setWayFindStart(way_opt,s_pos,Number(arr_sa_pub[i].POS_X), Number(arr_sa_pub[i].POS_Y));
                        break;
                    }
                }

                for(i = 0; i < arr_ta_pub.length; i++){
                    if(arr_ta_pub[i].AREA == str_area){
                        s_pos.x = Number(arr_ta_pub[i].POS_X);
                        s_pos.y = Number(arr_ta_pub[i].POS_Y);
                        i_target_ret = floor_t_obj.CLS_FLOOR.setWayFindStart(way_opt,s_pos,p_param.t_pos_x,p_param.t_pos_y);
                        break;
                    }
                }
            }else{
                i_err++;
            }
        }else{
            i_err++;
        }

        if(i_err == 0 && i_target_ret >= 0){
            return i_target_ret;
        }else{
            return -1;
        }
    }

    getFindFloorObj(p_param){
        console.log("getFindFloorObj()");

        var i = 0;
        var obj;
        var ret_obj = null;
        for(i = 0; i < this.m_app_floors.length; i++){
            obj = this.m_app_floors[i];
            if(obj.b_code == p_param.b_code && obj.floor == p_param.floor){
                ret_obj = obj;
                break;
            }
        }
        return ret_obj;
    }

    // 에스컬레이트를 위하여 위아래 찾기
    getMoveUpDown(p_b_code,p_s_floor,p_t_floor){
        console.log("getMoveUpDown()");

        var i = 0;
        var i_start = 0, i_target = 0;
        var str_move_updown = "";
        var obj;

        for(i = 0; i < this.m_load_data.arr_map_list.length; i++){
            obj = this.m_load_data.arr_map_list[i];
            if(obj.B_CODE == p_b_code){
                if(obj.FLOOR == p_s_floor) i_start = i;
                if(obj.FLOOR == p_t_floor) i_target = i;
            }
        }

        if(i_start > i_target) str_move_updown = "DOWN";
        else str_move_updown = "UP";
        return str_move_updown;
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    // 길안내 시작
    setWayFindDrawEnd(){
        console.log("setWayFindDrawEnd()");

        var m_this = this;
        var obj;

        if(this.m_wayfind_conf.move_cnt < this.m_wayfind_conf.arr_floors.length){
            obj = this.m_wayfind_conf.arr_floors[this.m_wayfind_conf.move_cnt];
            if(this.m_conf.curr_b_code != obj.b_code || this.m_conf.curr_floor_code != obj.floor){  // 지금 보는 층이 같은 빌딩과 같은 층이 아닐경우 이동하자.
                this.setChgFloor("WAYFIND",obj.b_code, obj.floor);

                var evt = new CustomEvent("eltov_map",{detail:{"sect":"WAYFIND","type":this.m_wayfind_conf.type,"result":"WAYFLOORCHANGE","mode":this.m_wayfind_conf.mode,"move_type":this.m_wayfind_conf.move_type,"b_code":obj.b_code, "floor":obj.floor}});
                document.dispatchEvent(evt);


                setTimeout(function () {
                     m_this.setWayFindDrawEnd();
                }, 1000);
            }else{
                obj.floor_obj.CLS_FLOOR.setWayFindDrawLine(this.m_wayfind_conf.action_type);
                this.m_wayfind_conf.move_cnt++;
                if(this.m_wayfind_conf.move_cnt == this.m_wayfind_conf.arr_floors.length){
                    obj.floor_obj.CLS_FLOOR.setTargetIcon(Number(this.m_wayfind_conf.target_x),Number(this.m_wayfind_conf.target_y)); // 목적지 아이콘 띄우고
                }
            }
        }else{
            if(this.m_wayfind_conf.mode == "ONEWAY"){
                // 재혁추가 > 길찾기가 한개인 경우 완료 디스패치 이벤트
                var evt = new CustomEvent("eltov_map",{detail:{"sect":"WAYFIND","type":this.m_wayfind_conf.type,"result":"WAYEND","mode":this.m_wayfind_conf.mode,"move_type":this.m_wayfind_conf.move_type }});
                document.dispatchEvent(evt);
            }else if(this.m_wayfind_conf.mode == "TWOWAY"){
                var i = 0, j = 0;
                var i_found = 0, i_cnt = 0;
                var xx = 0, yy = 0, ss = 1;
                var ret_pos = {};
                var obj_floor;

                // 길안내가 없는것은 안보이게 하고
                for(i = 0; i < this.m_app_floors.length; i++){
                    this.m_app_floors[i].CLS_FLOOR.getMainDisp().style.transform = "translateY(0)";
                    i_found = 0;
                    for(j = 0; j < this.m_wayfind_conf.arr_floors.length; j++){
                        obj = this.m_wayfind_conf.arr_floors[j];
                        if(obj.b_code == this.m_app_floors[i].b_code && obj.floor == this.m_app_floors[i].floor){
                            i_found = 1;
                            break;
                        }
                    }
                    if(i_found == 0){
                        this.m_app_floors[i].CLS_FLOOR.getMainDisp().style.display = "none";
                    }else{
                        this.m_app_floors[i].CLS_FLOOR.getMainDisp().style.display = "block";
                    }
                }

                this.m_app_container.style.transform = "translateY(0)";

                 var division = window.innerWidth > window.innerHeight ? 'W':'H';

                if(this.m_wayfind_conf.arr_floors.length == 2){  // 길안내가 2개 일 경우

                    //console.log("길안내가 2개");

                    obj_floor =  this.m_wayfind_conf.arr_floors[0].floor_obj.CLS_FLOOR;
                    //xx = -this.m_conf.disp_width * (1/4);
                    //yy = 0;
                    xx = this.m_conf.final_map_type["TWOWAY_"+division]["pos0"].xx;
                    yy = this.m_conf.final_map_type["TWOWAY_"+division]["pos0"].yy;
                    ss = this.m_conf.final_map_type["TWOWAY_"+division]["pos0"].ss;
                    //xx = 100;
                    //yy = -350;
                    ret_pos = this.m_util.getPosTransform(obj_floor.getMainDisp());
                    // console.log('scale', this.m_conf.scale_real*2/3);
                    obj_floor.setMainDispPos((0 - this.m_conf.map_width/2),(0 - this.m_conf.map_height/2),-1);
                    // TweenMax.fromTo(obj_floor.getMainDisp(), 0.5, {  x:ret_pos.left, y:ret_pos.top, scale:ss}, { x:xx, y:yy, scale:this.m_conf.scale_real*2/3} );
                    TweenMax.fromTo(obj_floor.getMainDisp(), 0.5, {  x:ret_pos.left, y:ret_pos.top, scale:0}, { x:xx, y:yy, scale:0.20} );

                    obj_floor =  this.m_wayfind_conf.arr_floors[1].floor_obj.CLS_FLOOR;
                    //xx = this.m_conf.disp_width * (1/4);
                    //yy = 0;
                    xx = this.m_conf.final_map_type["TWOWAY_"+division]["pos1"].xx;
                    yy = this.m_conf.final_map_type["TWOWAY_"+division]["pos1"].yy;
                    ss = this.m_conf.final_map_type["TWOWAY_"+division]["pos1"].ss;
                    //xx = 100;
                    //yy = 170;
                    ret_pos = this.m_util.getPosTransform(obj_floor.getMainDisp());
                    obj_floor.setMainDispPos((0 - this.m_conf.map_width/2),(0 - this.m_conf.map_height/2),-1);
                    // TweenMax.fromTo(obj_floor.getMainDisp(), 0.5, {  x:ret_pos.left, y:ret_pos.top, scale:ss}, { x:xx, y:yy, scale:this.m_conf.scale_real*2/3} );
                    TweenMax.fromTo(obj_floor.getMainDisp(), 0.5, {  x:ret_pos.left, y:ret_pos.top, scale:0}, { x:xx, y:yy, scale:0.20} );
                    
                 
                    // 재혁추가 > 길찾기가 두개인 경우 완료 디스패치 이벤트
                    var evt = new CustomEvent("eltov_map",{detail:{"sect":"WAYFIND","type":this.m_wayfind_conf.type,"result":"WAYEND","mode":this.m_wayfind_conf.mode,"move_type":this.m_wayfind_conf.move_type }});
                    document.dispatchEvent(evt);   
                }
                // 재혁추가 > 길찾기가 세개인 경우
            }else if(this.m_wayfind_conf.mode == "THREEWAY"){
                var i = 0, j = 0;
                var i_found = 0, i_cnt = 0;
                var xx = 0, yy = 0;
                var ret_pos = {};
                var obj_floor;

                // 길안내가 없는것은 안보이게 하고
                for(i = 0; i < this.m_app_floors.length; i++){
                    this.m_app_floors[i].CLS_FLOOR.getMainDisp().style.transform = "translateY(0)";
                    i_found = 0;
                    for(j = 0; j < this.m_wayfind_conf.arr_floors.length; j++){
                        obj = this.m_wayfind_conf.arr_floors[j];
                        if(obj.b_code == this.m_app_floors[i].b_code && obj.floor == this.m_app_floors[i].floor){
                            i_found = 1;
                            break;
                        }
                    }
                    if(i_found == 0){
                        this.m_app_floors[i].CLS_FLOOR.getMainDisp().style.display = "none";
                    }else{
                        this.m_app_floors[i].CLS_FLOOR.getMainDisp().style.display = "block";
                    }
                }

                this.m_app_container.style.transform = "translateY(0)";

                if(this.m_wayfind_conf.arr_floors.length == 3){  // 길안내가 3개 일 경우  내위치 이동이 2번 이동빌딩이 1번, 내위치 이동이 1번 이동빌딩이 2번
                    for(j = 0; j < this.m_wayfind_conf.arr_floors.length; j++){
                        obj = this.m_wayfind_conf.arr_floors[j];
                        if(obj.b_code == this.m_load_data.header.B_CODE){
                            i_cnt++;
                        }
                    }
                    obj_floor =  this.m_wayfind_conf.arr_floors[0].floor_obj.CLS_FLOOR;
                    xx = this.m_conf.final_map_type["THREEWAY"]["pos0"].xx;
                    yy = this.m_conf.final_map_type["THREEWAY"]["pos0"].yy;
                    ss = this.m_conf.final_map_type["THREEWAY"]["pos0"].ss;

                    ret_pos = this.m_util.getPosTransform(obj_floor.getMainDisp());
                    obj_floor.setMainDispPos((0 - this.m_conf.map_width/2),(0 - this.m_conf.map_height/2),-1);
                    TweenMax.fromTo(obj_floor.getMainDisp(), 0.5, {  x:ret_pos.left, y:ret_pos.top, scale:ss}, { x:xx, y:yy, scale:this.m_conf.scale_real*2/4} );

                    obj_floor =  this.m_wayfind_conf.arr_floors[1].floor_obj.CLS_FLOOR;
                    xx = this.m_conf.final_map_type["THREEWAY"]["pos1"].xx;
                    yy = this.m_conf.final_map_type["THREEWAY"]["pos1"].yy;
                    ss = this.m_conf.final_map_type["THREEWAY"]["pos1"].ss;

                    ret_pos = this.m_util.getPosTransform(obj_floor.getMainDisp());
                    obj_floor.setMainDispPos((0 - this.m_conf.map_width/2),(0 - this.m_conf.map_height/2),-1);
                    TweenMax.fromTo(obj_floor.getMainDisp(), 0.5, {  x:ret_pos.left, y:ret_pos.top, scale:ss}, { x:xx, y:yy, scale:this.m_conf.scale_real*2/4} );

                    obj_floor =  this.m_wayfind_conf.arr_floors[2].floor_obj.CLS_FLOOR;
                    xx = this.m_conf.final_map_type["THREEWAY"]["pos2"].xx;
                    yy = this.m_conf.final_map_type["THREEWAY"]["pos2"].yy;
                    ss = this.m_conf.final_map_type["THREEWAY"]["pos2"].ss;

                    ret_pos = this.m_util.getPosTransform(obj_floor.getMainDisp());
                    obj_floor.setMainDispPos((0 - this.m_conf.map_width/2),(0 - this.m_conf.map_height/2),-1);
                    TweenMax.fromTo(obj_floor.getMainDisp(), 0.5, {  x:ret_pos.left, y:ret_pos.top, scale:ss}, { x:xx, y:yy, scale:this.m_conf.scale_real*2/4} );

                    // 재혁추가 > 길찾기가 세개인 경우 완료 디스패치 이벤트
                    var evt = new CustomEvent("eltov_map",{detail:{"sect":"WAYFIND","type":this.m_wayfind_conf.type,"result":"WAYEND","mode":"THREEWAY","move_type":this.m_wayfind_conf.move_type }});
                    document.dispatchEvent(evt); 

                }
            }else if(this.m_wayfind_conf.mode == "FOURWAY"){
                var i = 0, j = 0;
                var i_found = 0, i_cnt = 0;
                var xx = 0, yy = 0;
                var ret_pos = {};
                var obj_floor;

                // 길안내가 없는것은 안보이게 하고
                for(i = 0; i < this.m_app_floors.length; i++){
                    this.m_app_floors[i].CLS_FLOOR.getMainDisp().style.transform = "translateY(0)";
                    i_found = 0;
                    for(j = 0; j < this.m_wayfind_conf.arr_floors.length; j++){
                        obj = this.m_wayfind_conf.arr_floors[j];
                        if(obj.b_code == this.m_app_floors[i].b_code && obj.floor == this.m_app_floors[i].floor){
                            i_found = 1;
                            break;
                        }
                    }
                    if(i_found == 0){
                        this.m_app_floors[i].CLS_FLOOR.getMainDisp().style.display = "none";
                    }else{
                        this.m_app_floors[i].CLS_FLOOR.getMainDisp().style.display = "block";
                    }
                }

                this.m_app_container.style.transform = "translateY(0)";

                if(this.m_wayfind_conf.arr_floors.length == 4){  // 길안내가 4개 일 경우
                    obj_floor =  this.m_wayfind_conf.arr_floors[0].floor_obj.CLS_FLOOR;
                    xx = this.m_conf.final_map_type["FOURWAY"]["pos0"].xx;
                    yy = this.m_conf.final_map_type["FOURWAY"]["pos0"].yy;
                    ss = this.m_conf.final_map_type["FOURWAY"]["pos0"].ss;
                    ret_pos = this.m_util.getPosTransform(obj_floor.getMainDisp());
                    obj_floor.setMainDispPos((0 - this.m_conf.map_width/2),(0 - this.m_conf.map_height/2),-1);
                    TweenMax.fromTo(obj_floor.getMainDisp(), 0.5, {  x:ret_pos.left, y:ret_pos.top, scale:ss}, { x:xx, y:yy, scale:this.m_conf.scale_real/2} );

                    obj_floor =  this.m_wayfind_conf.arr_floors[1].floor_obj.CLS_FLOOR;
                    xx = this.m_conf.final_map_type["FOURWAY"]["pos1"].xx;
                    yy = this.m_conf.final_map_type["FOURWAY"]["pos1"].yy;
                    ss = this.m_conf.final_map_type["FOURWAY"]["pos1"].ss;
                    ret_pos = this.m_util.getPosTransform(obj_floor.getMainDisp());
                    obj_floor.setMainDispPos((0 - this.m_conf.map_width/2),(0 - this.m_conf.map_height/2),-1);
                    TweenMax.fromTo(obj_floor.getMainDisp(), 0.5, {  x:ret_pos.left, y:ret_pos.top, scale:ss}, { x:xx, y:yy, scale:this.m_conf.scale_real/2} );

                    obj_floor =  this.m_wayfind_conf.arr_floors[2].floor_obj.CLS_FLOOR;
                    xx = this.m_conf.final_map_type["FOURWAY"]["pos2"].xx;
                    yy = this.m_conf.final_map_type["FOURWAY"]["pos2"].yy;
                    ss = this.m_conf.final_map_type["FOURWAY"]["pos2"].ss;
                    ret_pos = this.m_util.getPosTransform(obj_floor.getMainDisp());
                    obj_floor.setMainDispPos((0 - this.m_conf.map_width/2),(0 - this.m_conf.map_height/2),-1);
                    TweenMax.fromTo(obj_floor.getMainDisp(), 0.5, {  x:ret_pos.left, y:ret_pos.top, scale:ss}, { x:xx, y:yy, scale:this.m_conf.scale_real/2} );

                    obj_floor =  this.m_wayfind_conf.arr_floors[3].floor_obj.CLS_FLOOR;
                    xx = this.m_conf.final_map_type["FOURWAY"]["pos3"].xx;
                    yy = this.m_conf.final_map_type["FOURWAY"]["pos3"].yy;
                    ss = this.m_conf.final_map_type["FOURWAY"]["pos3"].ss;
                    ret_pos = this.m_util.getPosTransform(obj_floor.getMainDisp());
                    obj_floor.setMainDispPos((0 - this.m_conf.map_width/2),(0 - this.m_conf.map_height/2),-1);
                    TweenMax.fromTo(obj_floor.getMainDisp(), 0.5, {  x:ret_pos.left, y:ret_pos.top, scale:ss}, { x:xx, y:yy, scale:this.m_conf.scale_real/2} );
                }
                // 재혁추가 > 길찾기가 세개인 경우 완료 디스패치 이벤트
                var evt = new CustomEvent("eltov_map",{detail:{"sect":"WAYFIND","type":this.m_wayfind_conf.type,"result":"WAYEND","mode":"FOURWAY","move_type":this.m_wayfind_conf.move_type }});
                document.dispatchEvent(evt); 
            }
        }
    }


    // setWayFindDrawMove(p_x,p_y){
    //     console.log("setWayFindDrawMove()");

    //     var obj_floor = this.m_app_floors[this.m_conf.curr_floor_num].CLS_FLOOR.getMainDisp();
    //     obj_floor.setMainDispPos((0-p_x),(0-p_y),-1);
    // }


    //////////////////////////////////////
    // OPTIONS 

    setChkLimit(p_scale){
        console.log("setChkLimit()");

        var i_scale = 0;
        if(p_scale <= 0){
            var obj_cont = this.m_app_floors[this.m_conf.curr_floor_num].CLS_FLOOR.getMainDisp();
            var ret_pos = this.m_util.getPosTransform(obj_cont);
            i_scale = ret_pos.scale;
        }else{
            i_scale = p_scale;
        }

        var ret_obj = this.m_util.getCalLimit(this.m_conf.disp_width,this.m_conf.disp_height,this.m_conf.map_width,this.m_conf.map_height,i_scale);

        this.m_conf.limit_left = ret_obj.left;
        this.m_conf.limit_right = ret_obj.right;
        this.m_conf.limit_top = ret_obj.top;
        this.m_conf.limit_bottom = ret_obj.bottom;
    }

    // setDebugNodeLine(){
    //     console.log("setDebugNodeLine()");

    //     var i = 0;
    //     for(i = 0; i < this.m_app_floors.length; i++){
    //         this.m_app_floors[i].CLS_FLOOR.setDebugNodeLine();
    //     }
    // }

    setChkOpt(p_opt){
        console.log("setChkOpt()");

        // console.log(p_opt);

        this.m_conf.url_data =  p_opt.url_data || "xml/kiosk_contents.xml";
        this.m_conf.url_route =  p_opt.url_route || "xml/kiosk_route.xml";
        this.m_conf.map_angle =  Number(p_opt.map_angle) || 0;
        this.m_conf.margin_top =  Number(p_opt.margin_top) || 0;
        this.m_conf.margin_left =  Number(p_opt.margin_left) || 0;
        this.m_conf.margin_height =  Number(p_opt.margin_height) || 0;
        this.m_conf.font_name =  p_opt.font_name || "Arial";
        this.m_conf.font_weight =  p_opt.font_weight || "700";
        this.m_conf.debug_line =  p_opt.debug_line || "";
        this.m_conf.debug_wayfind =  p_opt.debug_wayfind || "";
        this.m_conf.scale_max =  Number(p_opt.scale_max) || 1.5;
        this.m_conf.scale_min =  Number(p_opt.scale_min) || 0.25;
        this.m_conf.scale_init =  Number(p_opt.scale_init) || -1;
        this.m_conf.is_mobile =  Number(p_opt.is_mobile) || false;

        this.m_conf.addon_list =  p_opt.addon_list || null;
        this.m_conf.wayfind_bridge =  p_opt.wayfind_bridge || null;

        
        this.m_conf.wayfind_speed =  p_opt.wayfind_speed || 3;
        this.m_conf.final_map_type =  p_opt.final_map_type || null;
        this.m_conf.map_scale =  p_opt.map_scale || "auto";
        this.m_conf.img_curr_type =  p_opt.img_curr_type || {"url":"images/wayfind/floor_minimap_start.svg", "width":"40", height:"56"};
        this.m_conf.img_target_type =  p_opt.img_target_type || {"url":"images/wayfind/floor_minimap_arrival.svg", "width":"60", height:"60"};
        this.m_conf.img_move_type =  p_opt.img_move_type || {"url":"images/wayfind/ico_m_point_human.png", "width":"48", height:"48"};
        this.m_conf.disp_background =  p_opt. disp_background || "rgba(239, 239, 246, 0)";

        
        
        this.m_conf.curr_floor_num = 0;  // 현재 층 배열 번호
        this.m_conf.curr_b_code = "";
        this.m_conf.curr_floor_code = "";
        this.m_conf.arr_b_code = new Array();
    }
}


