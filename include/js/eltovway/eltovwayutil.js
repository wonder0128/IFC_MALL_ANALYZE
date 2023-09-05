/******************************************
   name :  eltov2dutil.js
   auth :  ELTOV
   date :  2021.08.02
   desc :  엘토브 맵 각종 함수들
*******************************************/



class EltovWayUtil{

    constructor(p_conf,p_main_disp){

        this.m_near_len = 5;
        this.m_point = {x:0,y:0};
    }

    // 널체크 
    getChkNull(p_src,p_default){
        console.log("getChkNull()");

        if(p_src == null || p_src == undefined){ return p_default;
        }else{ return p_src + ""; }
    }

    getPointAngle(p_my,p_pos1,p_pos2){
        console.log("getPointAngle()");


        var m = 0,n = 0,c = 0;
        var t_x = 0,t_y = 0;
        var floor_point = 10000000;

        var p_angle = {x:0,y:0};

        if(p_pos1.y == p_pos2.y){
            p_angle.x = p_my.x; p_angle.y = p_pos1.y;
        }else if(p_pos1.x == p_pos2.x){ 
            p_angle.x = p_pos1.x; p_angle.y = p_my.y;
        }else{
            m = (p_pos1.y - p_pos2.y) / (p_pos2.x - p_pos1.x);
            n = -1/m;
            c = (p_pos1.y - p_my.y) - (n * (p_my.x - p_pos1.x));

            t_x = c / (m - n);
            t_y = 0 - ( n * t_x + c);

            p_angle.x = p_pos1.x + t_x;
            p_angle.y = p_pos1.y + t_y;
        }

        this.m_point.x = p_angle.x;
        this.m_point.y = p_angle.y;

        return this.getPointCross(p_my,p_angle,p_pos1,p_pos2)
    }

    getPointCross(p_my,p_angle,p_pos1,p_pos2){
        console.log("getPointCross()");


        var m = 0,n = 0,c = 0;
        var t_x = 0,t_y = 0;
        var floor_point = 10000000;

        var under = (p_pos2.y - p_pos1.y)*(p_angle.x - p_my.x) - (p_pos2.x - p_pos1.x)*(p_angle.y - p_my.y);
        if(under == 0){
            return false; 
        }

        var _t = (p_pos2.x - p_pos1.x)*(p_my.y - p_pos1.y) - (p_pos2.y - p_pos1.y)*(p_my.x - p_pos1.x);
        var _s = (p_angle.x - p_my.x)*(p_my.y - p_pos1.y) - (p_angle.y - p_my.y)*(p_my.x - p_pos1.x);

        var t = _t / under;
        var s = _s / under;

        t = Math.floor(t * floor_point)/floor_point;
        s = Math.floor(s * floor_point)/floor_point;

        if( t < 0 || t > 1 || s < 0 || s > 1 ){
            return false;
        }
        if( _t == 0 && _s == 0 ){
            return false;
        }

        return true;
    }


    // 2점의 전체 길이
    getPointLen2(p_p1,p_p2){
        console.log("getPointLen2()");

        var i_len = 0;

        i_len = Math.sqrt( (p_p1.x - p_p2.x) * (p_p1.x - p_p2.x) + (p_p1.y - p_p2.y) * (p_p1.y - p_p2.y) );

        return i_len;
    }

    // 3점의 전체 길이
    // getPointLen3(p_p1,p_p2){
    //     console.log("getPointLen3()");
    //     var i_len1 = 0;
    //     var i_len2 = 0;
    //     var i_len3 = 0;

    //     i_len1 = Math.sqrt( (p_p1.x - p_p2.x) * (p_p1.x - p_p2.x) + (p_p1.y - p_p2.y) * (p_p1.y - p_p2.y) );
    //     i_len2 = Math.sqrt( (p_p1.x - p_p3.x) * (p_p1.x - p_p3.x) + (p_p1.y - p_p3.y) * (p_p1.y - p_p3.y) );
    //     i_len3 = Math.sqrt( (p_p2.x - p_p3.x) * (p_p2.x - p_p3.x) + (p_p2.y - p_p3.y) * (p_p2.y - p_p3.y) );

    //     return (i_len1 + i_len2 + i_len3);
    // }

    // 인접한 동선

    getNearPos(p_p1,p_p2){
        console.log("getNearPos()");

        if((Math.abs(p_p1.x - p_p2.x) <= this.m_near_len && Math.abs(p_p1.y - p_p2.y) <= this.m_near_len )){
            return true;
        }else{
            return false;
        }
    }

    // setRemoveChildAll(p_obj){
    //     console.log("setRemoveChildAll()");

    //     while ( p_obj.hasChildNodes() ) {
    //         p_obj.removeChild( p_obj.firstChild );
    //     }
    // }

    getPosTransform(p_obj){
        console.log("getPosTransform()");

        var i = 0;
        var ret_obj = { left:0, top:0, scale:1, rotate:0 };
        var str_tmp = "";
        var arr_tmp = [];
        var arr_match = [];

        var str_trans = p_obj.style.transform;
        //var str_trans = "translate(110px, 210px) scale(1, 1) rotate(110deg)";
        var regex = /(\w+)\((.+?)\)/g;
        var p1 = /px/gi;
        var p2 = /deg/gi;

        while( arr_match = regex.exec(str_trans)){
            if(arr_match.length == 3){
                if(arr_match[1] == "translate"){
                    arr_tmp = arr_match[2].split(',');
                    if(arr_tmp.length == 2){
                        str_tmp = arr_tmp[0].replace(p1,"");
                        ret_obj.left = parseFloat(str_tmp);
                        str_tmp = arr_tmp[1].replace(p1,"");
                        ret_obj.top = parseFloat(str_tmp);
                    }
                }else if(arr_match[1] == "scale"){
                    arr_tmp = arr_match[2].split(',');
                    if(arr_tmp.length == 2){
                        ret_obj.scale = parseFloat(arr_tmp[0]);
                    }
                }else if(arr_match[1] == "rotate"){
                    str_tmp = arr_match[2].replace(p2,"");
                    ret_obj.rotate = parseFloat(str_tmp);
                }
            }
            i++;
            if(i >= 10) break;
        }
        
        return ret_obj;
    }

    getCalLimit(p_disp_width,p_disp_height,p_map_width,p_map_height,p_scale){
        console.log("getCalLimit()");


        var ret_obj = { left:0, top:0, right:0, bottom:0 };

        var min_width = 300 - (p_map_width + ((p_disp_width/2) / p_scale));
        var max_width = (p_disp_width/2) / p_scale - 300;
        var min_height = 300 - (p_map_height + ((p_disp_height/2) / p_scale));
        var max_height = (p_disp_height/2) / p_scale - 300;

        ret_obj.left = min_width;
        ret_obj.right = max_width;
        ret_obj.top = min_height;
        ret_obj.bottom = max_height;

        return ret_obj;
    }

    getCalScale(p_canvas,p_map){  // CANVAS크기, 맵크기
        console.log("getCalScale()");

        var new_scale = {w:p_canvas.w,h:p_canvas.h};

        var i_canvas_rate = p_canvas.h / p_canvas.w;

        if(p_map.w < p_canvas.w && p_map.w < p_canvas.h){  // 맵크기가 작으면 스케일 1
            return 1;
        }else{  // 맵크기가 더 크면
            var i_map_rate = p_map.h / p_map.w;

            if(i_canvas_rate < i_map_rate){  // 가로가 더 긴것
                new_scale.h = p_canvas.h;
                new_scale.w = p_canvas.h * (p_map.w / p_map.h);
            }else{
                new_scale.w = p_canvas.w;
                new_scale.h = p_canvas.w * (p_map.h / p_map.w);
            }
            var i_scale = new_scale.w / p_map.w;
            i_scale = Math.floor(i_scale * 1000) / 1000;
            return i_scale;
        }
    }

    getChgAnglePos(p_pos){
        console.log("getChgAnglePos()");


        var ret_pos = {x:0,y:0};

        var x1 = p_pos.p_x - p_pos.c_x;
        var y1 = p_pos.p_y - p_pos.c_y;

        var i_len = Math.sqrt( (p_pos.c_x - p_pos.p_x) * (p_pos.c_x - p_pos.p_x) + (p_pos.c_y - p_pos.p_y) * (p_pos.c_y - p_pos.p_y) );

        var i_rad = Math.atan2(y1,x1);

        var new_angle = (i_rad*180)/Math.PI;
        //console.log(new_angle);

        ret_pos.x = Math.cos(i_rad + p_pos.rad) * i_len + p_pos.c_x;
        ret_pos.y = Math.sin(i_rad + p_pos.rad) * i_len + p_pos.c_y;

        return ret_pos;

        /*
        var ret_pos = {x:0,y:0};
        var c_x = this.m_my_conf.map_width / 2;
        var c_y = this.m_my_conf.map_height / 2;

        var x1 = p_x - c_x;
        var y1 = p_y - c_y;

        var i_len = Math.sqrt( (c_x - p_x) * (c_x - p_x) + (c_y - p_y) * (c_y - p_y) );

        var rad = Math.atan2(y1,x1);

        var new_angle = (rad*180)/Math.PI;
        console.log(new_angle);
        //return (rad*180)/Math.PI;

        ret_pos.x = Math.cos(rad + this.m_my_conf.map_rad) * i_len + c_x;
        ret_pos.y = Math.sin(rad + this.m_my_conf.map_rad) * i_len + c_y;

        return ret_pos;
        */
    }
}

