namespace cpp DmtecCtr

typedef i32 MyInteger

struct Creative {
    1: i32 user_id;
    2: i32 plan_id;
    3: i32 unit_id;
    4: i32 idea_id;
    5: i32 creative_type;
    6: i32 creative_width;
    7: i32 creative_height;
}

struct CtrRequest {
    1: string sid;
    2: string user_id;
    3: string ip;
    4: string prov;
    5: string city;
    6: string url;
    7: i32    adview_type;

    8: i32 weekday;
    9: i32 hour;

    10: string ua;
    11: list<string> site_category;
    12: string site_quality;
    13: list<string> page_category;
    14: string page_quality;
    15: string page_type;
    16: list<string> user_interests;
    17: list<string> page_keywords;

    18: list<Creative> creatives;
}

struct CtrResponse {
    1: list<double> ctr;
}

service DmtecCtr{
    CtrRequest echo(1:CtrRequest req),
    i32 echo_num(1:i32 num),
    CtrResponse call(1:CtrRequest req)
}
