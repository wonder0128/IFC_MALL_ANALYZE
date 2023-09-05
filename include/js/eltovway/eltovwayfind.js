/******************************************
   name :  eltov2dwayfind.js
   auth :  ELTOV
   date :  2021.08.02
   desc :  길찾기 메인 모듈
*******************************************/



class EltovWayfind{

    constructor(p_parent,p_conf,p_conf_route){
        this.m_parent = p_parent;
        this.m_conf = p_conf;
        this.m_route = p_conf_route;

        this.m_util;

        this.m_node_cnt = 0;
        this.m_line_cnt = 0;

        this.m_line_draw = false;

        this.m_value_max_dis = 1000000000;

        this.m_arr_nodes = new Array();  // 전체 노드들
        this.m_arr_lines = new Array();  // 전체 라인들

        // 길찾기
        this.m_arr_wayfind = new Array();
        this.m_arr_nodes_visit = new Array();
        this.m_arr_nodes_via = new Array();
        this.m_arr_nodes_path = new Array();
        this.m_arr_nodes_dis = new Array();

        this.m_arr_way_node1 = new Array();
        this.m_arr_way_node2 = new Array();

        this.m_line_start = new Object();
        this.m_line_target = new Object();
    }

    setInitXml(){
        // console.log("setInitXml()");


        var i = 0, j = 0, k = 0;
        var i_found = 0;
        var i_line_seq = 0,i_node_seq = 0;
        var i_line_cnt = 0;
        var i_node_cnt = 0;
        var obj,obj2;
        var str_debug = "";
        var arr_tmp = new Array();
        var arr_tmp_nodes = new Array();

        var tmp_ptn1 = {x:0,y:0};
        var tmp_ptn2 = {x:0,y:0};

        this.m_util = new EltovWayUtil();

        i_line_cnt = this.m_route.length;

        // 라인만들기
        for(i = 0; i < i_line_cnt; i++){
            obj = this.m_route[i];
            if(obj.B_CODE == this.m_conf.b_code && obj.FLOOR == this.m_conf.floor){
                
                var lines = {
                    name : "LINE_" + i_line_seq,
                    pos1 : {x:obj.POS_X1,y:obj.POS_Y1},
                    pos2 : {x:obj.POS_X2,y:obj.POS_Y2},
                    node1 : -1,
                    node2 : -1,
                    node_name1 : "",
                    node_name2 : "",
                    active:true,
                    direction:obj.DIRECTION,
                    stime0:obj.STIME0,
                    etime0:obj.ETIME0,
                    stime1:obj.STIME1,
                    etime1:obj.ETIME1,
                    stime2:obj.STIME2,
                    etime2:obj.ETIME2,
                    arr_pos1 : new Array(),
                    arr_pos2 : new Array()
                };
                i_line_seq++;

                // 노드 만들기
                this.m_arr_lines.push(lines);
                if(this.getNodeExist(lines.pos1) == false){
                    var nodes1 = {
                        num : i_node_seq,
                        name : "NODE1_" + i_node_seq,
                        line_name : lines.name,
                        line_start : 1,
                        pos : {x:lines.pos1.x,y:lines.pos1.y},
                        arr_num : new Array(),
                        arr_names : new Array(),
                        arr_dis : new Array()
                    };
                    i_node_seq++;
                    this.m_arr_nodes.push(nodes1);
                }

                if(this.getNodeExist(lines.pos2) == false){
                    var nodes2 = {
                        num : i_node_seq,
                        name : "NODE2_" + i_node_seq,
                        line_name : lines.name,
                        line_start : 2,
                        pos : {x:lines.pos2.x,y:lines.pos2.y},
                        arr_num : new Array(),
                        arr_names : new Array(),
                        arr_dis : new Array()
                    };
                    i_node_seq++;
                    this.m_arr_nodes.push(nodes2);
                }
            }
        }

        i_line_cnt = this.m_arr_lines.length;
        i_node_cnt = this.m_arr_nodes.length;

        // 라인에 노드 넘버 추가하기
        for(i = 0; i < i_line_cnt; i++){
            obj = this.m_arr_lines[i];
            for(j = 0; j < i_node_cnt; j++){
                if(this.m_util.getNearPos(obj.pos1,this.m_arr_nodes[j].pos) == true){
                    obj.node1 = j;
                    obj.node_name1 = this.m_arr_nodes[j].name;
                }
                if(this.m_util.getNearPos(obj.pos2,this.m_arr_nodes[j].pos) == true){
                    obj.node2 = j;
                    obj.node_name2 = this.m_arr_nodes[j].name;
                }
            }
        }

        // 인접한 라인 찾기
        this.setFindNearLines();

        // 인접한 노드 찾기
        for(i = 0; i < i_node_cnt; i++){
            obj = this.m_arr_nodes[i];
            tmp_ptn1.x = obj.pos.x;
            tmp_ptn1.y = obj.pos.y;
            for(j = 0; j < i_line_cnt; j++){ // 내라인을 찾고
                obj2 = this.m_arr_lines[j];
                if(obj2.node1 == i){
                    obj.arr_num.push(obj2.node2);
                    obj.arr_names.push(obj2.node_name2);
                    tmp_ptn2.x = this.m_arr_nodes[obj2.node2].pos.x;
                    tmp_ptn2.y = this.m_arr_nodes[obj2.node2].pos.y;

                    obj.arr_dis.push(this.m_util.getPointLen2(tmp_ptn1,tmp_ptn2));
                }else if(obj2.node2 == i){
                    obj.arr_num.push(obj2.node1);
                    obj.arr_names.push(obj2.node_name1);
                    tmp_ptn2.x = this.m_arr_nodes[obj2.node1].pos.x;
                    tmp_ptn2.y = this.m_arr_nodes[obj2.node1].pos.y;

                    obj.arr_dis.push(this.m_util.getPointLen2(tmp_ptn1,tmp_ptn2));
                }
            }
            this.m_arr_nodes_visit.push(0);
            this.m_arr_nodes_dis.push(0);
            this.m_arr_nodes_via.push(0);
            this.m_arr_nodes_path.push(0);
        }

        for(i = 0; i < i_node_cnt; i++){
            obj = this.m_arr_nodes[i];
            if(obj.arr_num.length == 0){
                // console.log("NO NEIGHBOR = " + obj.name);
            }else{
            }
        }
        //this.setActiveCheck();
    }

    setFindNearLines(){
        // console.log("setFindNearLines()");

        var i = 0, j = 0;
        var obj,obj2;

        var i_line_cnt = this.m_arr_lines.length;

        // 인접한 동선 찾기
        for(i = 0; i < i_line_cnt; i++){
            obj = this.m_arr_lines[i];
            for(j = 0; j < i_line_cnt; j++){

                if(i == j) continue;
                obj2 = this.m_arr_lines[j];
                if(this.m_util.getNearPos(obj.pos1,obj2.pos1) == true){
                    this.setMakeNearLine(obj.arr_pos1,obj2);
                }
                if(this.m_util.getNearPos(obj.pos1,obj2.pos2) == true){
                    this.setMakeNearLine(obj.arr_pos1,obj2);
                }
                if(this.m_util.getNearPos(obj.pos2,obj2.pos1) == true){
                    this.setMakeNearLine(obj.arr_pos2,obj2);
                }
                if(this.m_util.getNearPos(obj.pos2,obj2.pos2) == true){
                    this.setMakeNearLine(obj.arr_pos2,obj2);
                }
            }
        }

    }

    ////////////////////////////////////////////////////////////////////
    // WAYFIND


    setWayFindStart(p_conf,p_start,p_target){
        // console.log("setWayFindStart()");


        var i = 0, i_cnt = 0, i_len = 0,i_cross = 0;
        var i_node_cnt = 0,i_line_cnt = 0;
        var i_tmp_len1 = 0,i_tmp_len2 = 0,i_tmp_len3 = 0;
        var b_close = false;
        var line_obj;
        var tmp_point = {x:0,y:0};

        var i_start_min = -1;  // 시작점과 가장 가까운
        var i_target_min = -1;  // 목표점과 가장 가까운
        var i_start_node = -1;
        var i_target_node = -1;

        var my_s_point = {x:0,y:0};
        var my_t_point = {x:0,y:0};

        my_s_point.x = Number(p_start.x);
        my_s_point.y = Number(p_start.y);
        my_t_point.x = Number(p_target.x);
        my_t_point.y = Number(p_target.y);

        var start_point = {x:0,y:0};
        var target_point = {x:0,y:0};

        // 변수 클리어
        this.m_line_start = null;
        this.m_line_target = null;
        this.m_arr_wayfind = [];
        
        i_line_cnt = this.m_arr_lines.length;

        //console.log("i_line_cnt = " + i_line_cnt);

        for(i = 0; i < i_line_cnt; i++){
            line_obj = this.m_arr_lines[i];

            if(line_obj.active == false) continue;

            // 교차점을 찾자.

            // 시작점
            b_close = this.m_util.getPointAngle(my_s_point,line_obj.pos1,line_obj.pos2);
            if(b_close == true){  // 교차점이 있으면 가장 짧은 라인을 찾자.
                tmp_point = this.m_util.m_point;
                i_len = this.m_util.getPointLen2(my_s_point,tmp_point);
                if(i_start_min == -1 || i_len < i_start_min){
                    i_start_min = i_len;
                    i_start_node = -1; // 가장 근접한곳이 라인의 직각
                    this.m_line_start = line_obj;
                    start_point.x = tmp_point.x;
                    start_point.y = tmp_point.y;
                }
            }

            // 교차점은 없지만 더 짧은길이 있는지 확인
            i_len = this.m_util.getPointLen2(my_s_point,line_obj.pos1);
            if(i_start_min == -1 || i_len < i_start_min){
                i_start_min = i_len;
                this.m_line_start = line_obj;
                i_start_node = line_obj.node1; // 가장 근접한곳이 인의 끝
                start_point.x = line_obj.pos1.x;
                start_point.y = line_obj.pos1.y;
            }

            i_len = this.m_util.getPointLen2(my_s_point,line_obj.pos2);
            if(i_start_min == -1 || i_len < i_start_min){
                i_start_min = i_len;
                this.m_line_start = line_obj;
                i_start_node = line_obj.node2; // 가장 근접한곳이 인의 끝
                start_point.x = line_obj.pos2.x;
                start_point.y = line_obj.pos2.y;
            }

            // 목표점
            b_close = this.m_util.getPointAngle(my_t_point,line_obj.pos1,line_obj.pos2);
            if(b_close == true){  // 교차점이 있으면 가장 짧은 라인을 찾자.
                tmp_point = this.m_util.m_point;
                i_len = this.m_util.getPointLen2(my_t_point,tmp_point);
                if(i_target_min == -1 || i_len < i_target_min){
                    i_target_min = i_len;
                    i_target_node = -1; // 가장 근접한곳이 라인의 직각
                    this.m_line_target = line_obj;
                    target_point.x = tmp_point.x;
                    target_point.y = tmp_point.y;
                    //console.log("TARGET 01 = i_len " + target_point.x + " , " + target_point.y);
                    //console.log("1 = " + my_t_point.x + "x" + my_t_point.y + " , " + line_obj.pos1.x + "x" + line_obj.pos1.y + " , " + line_obj.pos2.x + "x" + line_obj.pos2.y);
                }
            }

            // 교차점은 없지만 더 짧은길이 있는지 확인
            i_len = this.m_util.getPointLen2(my_t_point,line_obj.pos1);
            if(i_target_min == -1 || i_len < i_target_min){
                i_target_min = i_len;
                this.m_line_target = line_obj;
                i_target_node = line_obj.node1; // 가장 근접한곳이 인의 끝
                target_point.x = line_obj.pos1.x;
                target_point.y = line_obj.pos1.y;
            }

            i_len = this.m_util.getPointLen2(my_t_point,line_obj.pos2);
            if(i_target_min == -1 || i_len < i_target_min){
                i_target_min = i_len;
                i_target_node = line_obj.node2; // 가장 근접한곳이 인의 끝
                this.m_line_target = line_obj;
                target_point.x = line_obj.pos2.x;
                target_point.y = line_obj.pos2.y;
            }

            if(i_cross == 0){
                b_close = this.m_util.getPointCross(my_s_point,my_t_point,line_obj.pos1,line_obj.pos2);
                if(b_close == true){
                    i_cross++;
                }
            }
        }

        // 두점사이에 길이 없고 두점의 차이가 매우 작을 경우에는 바로 경로를 이어 버리고 끝낸다.

        if(i_cross == 0){
            i_len = this.m_util.getPointLen2(my_s_point,my_t_point);
            if(i_len <= 20){
                this.m_arr_wayfind.push(start_point);
                this.m_arr_wayfind.push(target_point);
                // console.log("WAYFIND SUCC-01");
                return "SUCC";
            }
        }

        if( i_target_min == -1 || i_target_min == -1){  // 길이 없다.
            return "FAIL-02";
        }


        this.m_arr_wayfind.push(my_s_point);
        this.m_arr_wayfind.push(start_point);

        // 같은 동선에 있는가?
        if(this.m_line_start.name == this.m_line_target.name){
            this.m_arr_wayfind.push(target_point);
            this.m_arr_wayfind.push(my_t_point);
            // console.log("WAYFIND SUCC-02");
            return "SUCC";
        }

        // 인접한 선분이 있는가?  이것이 어떤 의미인지 좀더 확인이 필요하다.
        i_cross = 0;
        i_cnt = this.m_line_start.arr_pos1.length;
        for(i = 0; i < i_cnt; i++){
            line_obj = this.m_line_start.arr_pos1[i];
            if(line_obj.name == this.m_line_target.name){
                if(this.m_util.getNearPos(this.m_line_start.pos1, target_point) == false){
                    this.m_arr_wayfind.push(this.m_line_start.pos1);
                }
                i_cross++;
                break;
            }
        }

        // 이것이 어떤 의미인지 좀더 확인이 필요하다. 아마도 가까운것은 바로 이어 벼리려는것 같다.
        if(i_cross == 0){
            i_cnt = this.m_line_start.arr_pos2.length;
            for(i = 0; i < i_cnt; i++){
                line_obj = this.m_line_start.arr_pos2[i];
                if(line_obj.name == this.m_line_target.name){
                    if(this.m_util.getNearPos(this.m_line_start.pos2, target_point) == false){
                        this.m_arr_wayfind.push(this.m_line_start.pos2);
                    }
                    i_cross++;
                    break;
                }
            }
        }

        if(i_cross > 0){
            this.m_arr_wayfind.push(target_point);
            this.m_arr_wayfind.push(my_t_point);
            //console.log("WAYFIND SUCC-03");
            return "SUCC";
        }

        // 시작된 타입이 라인의 직각에 있다
        // 이경우 둘중 두군데 모두 체크 한다.

        if(i_start_node == -1){
            //console.log("직각으로 이루어졌음");

            this.m_arr_way_node1 = [];
            this.m_arr_way_node2 = [];

            // 첫번째 노드
            i_tmp_len1 = this.getFindPathIng("NODE1",this.m_line_start.node1,i_target_node);
            // 두번째 노드
            i_tmp_len2 = this.getFindPathIng("NODE2",this.m_line_start.node2,i_target_node);

            if(i_tmp_len1 < i_tmp_len2){
                for(i = 0; i < this.m_arr_way_node1.length; i++){
                    this.m_arr_wayfind.push(this.m_arr_way_node1[i]);
                }
            }else{
                for(i = 0; i < this.m_arr_way_node2.length; i++){
                    this.m_arr_wayfind.push(this.m_arr_way_node2[i]);
                }
            }
        }else{
            this.getFindPathIng("NONE",i_start_node,-1);
        }

        this.m_arr_wayfind.push(target_point);
        this.m_arr_wayfind.push(my_t_point);

        return "SUCC";
    }


    // 실제 길찾기 함수
    getFindPathIng(p_type,p_start,p_end){
        // console.log("getFindPathIng()");

        var i = 0,j = 0,k = 0;
        var i_path_cnt = 0;
        var i_ret_len = -1, i_ret_len2 = -1, i_ret_len3 = -1;
        var i_node_cnt = 0;
        var i_min = 0,i_dis = 0, i_sel = 0;

        i_node_cnt = this.m_arr_nodes.length;

        for(i = 0; i < i_node_cnt; i++){  // 변수 클리어
            this.m_arr_nodes_visit[i] = 0;
            this.m_arr_nodes_via[i] = 0;
            this.m_arr_nodes_path[i] = 0;
            this.m_arr_nodes_dis[i] = this.m_value_max_dis;
        }

        this.m_arr_nodes_dis[p_start] = 0;
        
        //console.log("p_startp_start = " + p_start);

        for(i = 0; i < i_node_cnt; i++){  // 짧은 동선을 찾자
            i_min = this.m_value_max_dis;
            for(j = 0; j < i_node_cnt; j++){
                if(this.m_arr_nodes_visit[j] == 0 && this.m_arr_nodes_dis[j] < i_min){
                    i_sel = j;
                    i_min = this.m_arr_nodes_dis[j];
                }
            }
            this.m_arr_nodes_visit[i_sel] = 1;
            if(i_min == this.m_value_max_dis){  // 더 작은것을 못찾았다.
                i_ret_len = -1;
                //console.log("CAN'T");
                break;
            }

            for(j = 0; j < i_node_cnt; j++){
                i_dis = this.m_value_max_dis;
                for(k = 0; k < this.m_arr_nodes[i_sel].arr_num.length; k++){
                    if(this.m_arr_nodes[i_sel].arr_num[k] == j){
                        i_dis = this.m_arr_nodes[i_sel].arr_dis[k];
                        break;
                    }
                }
                if(this.m_arr_nodes_dis[j] > this.m_arr_nodes_dis[i_sel] + i_dis){
                    this.m_arr_nodes_dis[j] = this.m_arr_nodes_dis[i_sel] + i_dis;
                    this.m_arr_nodes_via[j] = i_sel;
                }
            }
        }

        if(p_end == -1){
            i_ret_len2 = this.m_arr_nodes_dis[this.m_line_target.node1];
            i_ret_len3 = this.m_arr_nodes_dis[this.m_line_target.node2];
            if(i_ret_len2 < i_ret_len3){
                i_ret_len = i_ret_len2;
                i_sel = this.m_line_target.node1;
            }else{
                i_ret_len = i_ret_len3;
                i_sel = this.m_line_target.node2;
            }
        }else{
            i_sel = p_end;
            i_ret_len = this.m_arr_nodes_dis[p_end];
        }

        if(p_type != ""){
            for(i = 0; i < i_node_cnt; i++){
                this.m_arr_nodes_path[i_path_cnt++] = i_sel;
                if(i_sel == p_start){
                    break;
                }
                i_sel = this.m_arr_nodes_via[i_sel];
            }

            //trace("getFindPathIng 2-5 = " + path_cnt + "," + m_node_cnt);

            if(i_path_cnt > i_node_cnt) i_path_cnt = i_node_cnt;

            // 마지막 동선까지 한다.
            for(i = i_path_cnt-1; i >= 0; i--){
                j = this.m_arr_nodes_path[i];
                if(j < i_node_cnt && j >= 0){
                    if(p_type == "NONE"){
                        this.m_arr_wayfind.push(this.m_arr_nodes[j].pos);
                    }else if(p_type == "NODE1"){
                        this.m_arr_way_node1.push(this.m_arr_nodes[j].pos);
                    }else if(p_type == "NODE2"){
                        this.m_arr_way_node2.push(this.m_arr_nodes[j].pos);

                    }
                }
            }
        }

        return i_ret_len;
    }



    getTotalLength(){
        // console.log("getTotalLength()");

        var i = 0;
        var i_total_len = 0;

        if(this.m_arr_wayfind.length > 1){
            for(i = 0; i < this.m_arr_wayfind.length -1; i++){
                i_total_len += this.m_util.getPointLen2(this.m_arr_wayfind[i],this.m_arr_wayfind[i+1]);
            }
        }

        return i_total_len;
    }


    // WAY LINE
    // setDebugMessage(){
    //     console.log("setDebugMessage()");


    //     this.m_parent.setWayFindEnd();
    // }

    setDraw2DWayLine(p_option,p_data,p_icon,p_fnc){
        // console.log("setDraw2DWayLine()");


        var i = 0;
        var interval_speed = 15;
        var move_speed = 10;
        var max_speed = this.m_parent.m_my_conf.wayfind_speed;
        var INTERVAL_ID;
        var curr_cnt = 1;
        var near_len = 4;

        this.m_line_draw = true;

        var m_this = this;

        var arr_lines = p_data;
        
        curr_cnt = 1;
        var cpoint = {x:arr_lines[0].x, y:arr_lines[0].y};
        var tpoint = {x:arr_lines[1].x, y:arr_lines[1].y};
        var per_x = tpoint.x - cpoint.x;
        var per_y = tpoint.y - cpoint.y;

        p_icon.style.transform = "translate(" + Number(cpoint.x) + "px," + Number(cpoint.y) + "px)";

        try{

            INTERVAL_ID = setInterval( function(){

                if(Math.abs(per_x) > Math.abs(per_y)){
                    if(Math.abs(cpoint.x - tpoint.x) < max_speed){ move_speed = 0;
                    }else{ move_speed = max_speed; }

                    if(move_speed > 0){
                        if(per_x > 0){
                            cpoint.x = cpoint.x + move_speed;
                            cpoint.y = cpoint.y + (per_y / per_x) * move_speed;
                        }else{
                            cpoint.x = cpoint.x - move_speed;
                            cpoint.y = cpoint.y - (per_y / per_x) * move_speed;
                        }
                    }else{
                        cpoint.x = tpoint.x;
                        cpoint.y = tpoint.y;
                    }
                }else{
                    if(Math.abs(cpoint.y - tpoint.y) < max_speed){ move_speed = 0;
                    }else{ move_speed = max_speed; }

                    if(move_speed > 0){
                        if(per_y > 0){
                            cpoint.y = cpoint.y + move_speed;
                            cpoint.x = cpoint.x + (per_x / per_y) * move_speed;
                        }else{
                            cpoint.y = cpoint.y - move_speed;
                            cpoint.x = cpoint.x - (per_x / per_y) * move_speed;
                        }
                    }else{
                        cpoint.x = tpoint.x;
                        cpoint.y = tpoint.y;
                    }
                }

                p_icon.style.transform = "translate(" + Number(cpoint.x) + "px," + Number(cpoint.y) + "px)";
                if(p_option.action_type == "MOVE"){
                    m_this.m_parent.setWayFindDrawMove(Number(cpoint.x),Number(cpoint.y));
                }

                if(Math.abs(cpoint.x - tpoint.x) <= near_len && Math.abs(cpoint.y - tpoint.y) <= near_len){

                    var x1 = cpoint.x;
                    var y1 = cpoint.y;
                    curr_cnt++;
                    if(curr_cnt >= arr_lines.length){
                        clearInterval(INTERVAL_ID);
                        //console.log("INTERVAL_ID");
                        m_this.m_parent.setWayFindDrawEnd();
                    }else{
                        tpoint.x = arr_lines[curr_cnt].x;
                        tpoint.y = arr_lines[curr_cnt].y;

                        per_x = tpoint.x - x1;
                        per_y = tpoint.y - y1;
                    }
                }
            },interval_speed);
        }catch(e){
            clearInterval(INTERVAL_ID);
            console.log("setDrawWayLine Error");
        }
    }


    ////////////////////////////////////////////////////////////////////
    // MAKE


    // setActiveCheck(){
    //     console.log("setActiveCheck()");


    //     var i = 0, j = 0, i_ok = 0;
    //     var i_stime = 0, i_etime = 0;
    //     var i_line_cnt = 0, i_node_cnt = 0;
    //     var obj,obj2;

    //     var str_tmp = "";

    //     var today = new Date();
    //     var hours = today.getHours();
    //     var minutes = today.getMinutes();

    //     if(hours < 10) str_tmp = "0" + hours;
    //     else str_tmp = "" + hours;
    //     if(minutes < 10) str_tmp += "0" + minutes;
    //     else str_tmp += "" + minutes;

    //     var i_times = Number(str_tmp);
        
    //     i_line_cnt = this.m_arr_lines.length;

    //     for(i = 0; i < i_line_cnt; i++){
    //         obj = this.m_arr_lines[i];
    //         i_ok = 1;

    //         i_stime = Number(obj.stime0);
    //         i_etime = Number(obj.etime0);

    //         if(i_stime > i_times && i_etime < i_etime){
    //             i_ok = 0;
    //         }
    //         if(i_ok == 1){
    //             i_stime = Number(obj.stime1);
    //             i_etime = Number(obj.etime1);

    //             if(i_stime > i_times && i_etime < i_etime){
    //                 i_ok = 0;
    //             }
    //         }
    //         if(i_ok == 1){
    //             i_stime = Number(obj.stime2);
    //             i_etime = Number(obj.etime2);

    //             if(i_stime > i_times && i_etime < i_etime){
    //                 i_ok = 0;
    //             }
    //         }

    //         if(i_ok == 1){
    //             obj.active = true;
    //         }else{
    //             obj.active = false;
    //         }
    //         /*
    //         if(i_stime <= i_times && i_times <= i_etime){
    //             i_ok = 1;
    //             obj.active = true;
    //         }else{
    //             obj.active = false;
    //         }
    //         */
    //     }

    //     i_node_cnt = this.m_arr_nodes.length;

    //     var tmp_ptn1 = {x:0,y:0};
    //     var tmp_ptn2 = {x:0,y:0};


    //     // 인접한 노드 찾기
    //     for(i = 0; i < i_node_cnt; i++){
    //         obj = this.m_arr_nodes[i];
    //         obj.arr_num = [];
    //         obj.arr_names = [];
    //         obj.arr_dis = [];
    //     }

    //     for(i = 0; i < i_node_cnt; i++){
    //         obj = this.m_arr_nodes[i];

    //         tmp_ptn1.x = obj.pos.x;
    //         tmp_ptn1.y = obj.pos.y;
    //         for(j = 0; j < i_line_cnt; j++){ // 내라인을 찾고
    //             obj2 = this.m_arr_lines[j];
    //             if(obj2.active == false) continue;
    //             if(obj2.node1 == i){
    //                 if(obj2.direction == "1") continue
    //                 obj.arr_num.push(obj2.node2);
    //                 obj.arr_names.push(obj2.node_name2);
    //                 tmp_ptn2.x = this.m_arr_nodes[obj2.node2].pos.x;
    //                 tmp_ptn2.y = this.m_arr_nodes[obj2.node2].pos.y;
    //                 obj.arr_dis.push(this.m_util.getPointLen2(tmp_ptn1,tmp_ptn2));
    //             }else if(obj2.node2 == i){
    //                 if(obj2.direction == "2") continue
    //                 obj.arr_num.push(obj2.node1);
    //                 obj.arr_names.push(obj2.node_name1);
    //                 tmp_ptn2.x = this.m_arr_nodes[obj2.node1].pos.x;
    //                 tmp_ptn2.y = this.m_arr_nodes[obj2.node1].pos.y;

    //                 obj.arr_dis.push(this.m_util.getPointLen2(tmp_ptn1,tmp_ptn2));
    //             }
    //         }
    //     }

    // }
    

    setMakeNearLine(p_obj,p_near){
        // console.log("setMakeNearLine()");

        var lines = {
            name : p_near.name,
            pos1 : {
                x:p_near.pos1.x,
                y:p_near.pos1.y},
            pos2 : {
                x:p_near.pos2.x,
                y:p_near.pos2.y}
        }
        p_obj.push(lines);
    }

    // 이미 있는지 확인하자    
    getNodeExist(p_pos){
        // console.log("getNodeExist()");

        var i = 0;
        var b_found = false;
        
        for(i = 0; i < this.m_arr_nodes.length; i++){
            if(this.m_util.getNearPos(this.m_arr_nodes[i].pos,p_pos) == true){
                b_found = true;
                break;
            }
        }
        return b_found;
    }


    // 이미 있는지 확인하자    
    // getLineExist(p_name1,p_name2){
    //     console.log("getLineExist()");

    //     var i = 0;
    //     var i_found = 0;

    //     for(i = 0; i < this.m_arr_lines.length; i++){
    //         if(this.m_arr_lines[i].name1 == p_name1 && this.m_arr_lines[i].name2 == p_name2){
    //             i_found = 1;
    //             break;
    //         }else if(this.m_arr_lines[i].name2 == p_name1 && this.m_arr_lines[i].name1 == p_name2){
    //             i_found = 1;
    //             break;
    //         }
    //     }
    //     return i_found;
    // }
}

