/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#include "ctr_types.h"

#include <algorithm>
#include <ostream>

#include <thrift/TToString.h>

namespace DmtecCtr {


Creative::~Creative() throw() {
}


void Creative::__set_user_id(const int32_t val) {
  this->user_id = val;
}

void Creative::__set_plan_id(const int32_t val) {
  this->plan_id = val;
}

void Creative::__set_unit_id(const int32_t val) {
  this->unit_id = val;
}

void Creative::__set_idea_id(const int32_t val) {
  this->idea_id = val;
}

void Creative::__set_creative_type(const int32_t val) {
  this->creative_type = val;
}

void Creative::__set_creative_width(const int32_t val) {
  this->creative_width = val;
}

void Creative::__set_creative_height(const int32_t val) {
  this->creative_height = val;
}

uint32_t Creative::read(::apache::thrift::protocol::TProtocol* iprot) {

  apache::thrift::protocol::TInputRecursionTracker tracker(*iprot);
  uint32_t xfer = 0;
  std::string fname;
  ::apache::thrift::protocol::TType ftype;
  int16_t fid;

  xfer += iprot->readStructBegin(fname);

  using ::apache::thrift::protocol::TProtocolException;


  while (true)
  {
    xfer += iprot->readFieldBegin(fname, ftype, fid);
    if (ftype == ::apache::thrift::protocol::T_STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->user_id);
          this->__isset.user_id = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 2:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->plan_id);
          this->__isset.plan_id = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 3:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->unit_id);
          this->__isset.unit_id = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 4:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->idea_id);
          this->__isset.idea_id = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 5:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->creative_type);
          this->__isset.creative_type = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 6:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->creative_width);
          this->__isset.creative_width = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 7:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->creative_height);
          this->__isset.creative_height = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      default:
        xfer += iprot->skip(ftype);
        break;
    }
    xfer += iprot->readFieldEnd();
  }

  xfer += iprot->readStructEnd();

  return xfer;
}

uint32_t Creative::write(::apache::thrift::protocol::TProtocol* oprot) const {
  uint32_t xfer = 0;
  apache::thrift::protocol::TOutputRecursionTracker tracker(*oprot);
  xfer += oprot->writeStructBegin("Creative");

  xfer += oprot->writeFieldBegin("user_id", ::apache::thrift::protocol::T_I32, 1);
  xfer += oprot->writeI32(this->user_id);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("plan_id", ::apache::thrift::protocol::T_I32, 2);
  xfer += oprot->writeI32(this->plan_id);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("unit_id", ::apache::thrift::protocol::T_I32, 3);
  xfer += oprot->writeI32(this->unit_id);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("idea_id", ::apache::thrift::protocol::T_I32, 4);
  xfer += oprot->writeI32(this->idea_id);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("creative_type", ::apache::thrift::protocol::T_I32, 5);
  xfer += oprot->writeI32(this->creative_type);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("creative_width", ::apache::thrift::protocol::T_I32, 6);
  xfer += oprot->writeI32(this->creative_width);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("creative_height", ::apache::thrift::protocol::T_I32, 7);
  xfer += oprot->writeI32(this->creative_height);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldStop();
  xfer += oprot->writeStructEnd();
  return xfer;
}

void swap(Creative &a, Creative &b) {
  using ::std::swap;
  swap(a.user_id, b.user_id);
  swap(a.plan_id, b.plan_id);
  swap(a.unit_id, b.unit_id);
  swap(a.idea_id, b.idea_id);
  swap(a.creative_type, b.creative_type);
  swap(a.creative_width, b.creative_width);
  swap(a.creative_height, b.creative_height);
  swap(a.__isset, b.__isset);
}

Creative::Creative(const Creative& other0) {
  user_id = other0.user_id;
  plan_id = other0.plan_id;
  unit_id = other0.unit_id;
  idea_id = other0.idea_id;
  creative_type = other0.creative_type;
  creative_width = other0.creative_width;
  creative_height = other0.creative_height;
  __isset = other0.__isset;
}
Creative& Creative::operator=(const Creative& other1) {
  user_id = other1.user_id;
  plan_id = other1.plan_id;
  unit_id = other1.unit_id;
  idea_id = other1.idea_id;
  creative_type = other1.creative_type;
  creative_width = other1.creative_width;
  creative_height = other1.creative_height;
  __isset = other1.__isset;
  return *this;
}
void Creative::printTo(std::ostream& out) const {
  using ::apache::thrift::to_string;
  out << "Creative(";
  out << "user_id=" << to_string(user_id);
  out << ", " << "plan_id=" << to_string(plan_id);
  out << ", " << "unit_id=" << to_string(unit_id);
  out << ", " << "idea_id=" << to_string(idea_id);
  out << ", " << "creative_type=" << to_string(creative_type);
  out << ", " << "creative_width=" << to_string(creative_width);
  out << ", " << "creative_height=" << to_string(creative_height);
  out << ")";
}


CtrRequest::~CtrRequest() throw() {
}


void CtrRequest::__set_sid(const std::string& val) {
  this->sid = val;
}

void CtrRequest::__set_user_id(const std::string& val) {
  this->user_id = val;
}

void CtrRequest::__set_ip(const std::string& val) {
  this->ip = val;
}

void CtrRequest::__set_prov(const std::string& val) {
  this->prov = val;
}

void CtrRequest::__set_city(const std::string& val) {
  this->city = val;
}

void CtrRequest::__set_url(const std::string& val) {
  this->url = val;
}

void CtrRequest::__set_adview_type(const int32_t val) {
  this->adview_type = val;
}

void CtrRequest::__set_weekday(const int32_t val) {
  this->weekday = val;
}

void CtrRequest::__set_hour(const int32_t val) {
  this->hour = val;
}

void CtrRequest::__set_ua(const std::string& val) {
  this->ua = val;
}

void CtrRequest::__set_site_category(const std::vector<std::string> & val) {
  this->site_category = val;
}

void CtrRequest::__set_site_quality(const std::string& val) {
  this->site_quality = val;
}

void CtrRequest::__set_page_category(const std::vector<std::string> & val) {
  this->page_category = val;
}

void CtrRequest::__set_page_quality(const std::string& val) {
  this->page_quality = val;
}

void CtrRequest::__set_page_type(const std::string& val) {
  this->page_type = val;
}

void CtrRequest::__set_user_interests(const std::vector<std::string> & val) {
  this->user_interests = val;
}

void CtrRequest::__set_page_keywords(const std::vector<std::string> & val) {
  this->page_keywords = val;
}

void CtrRequest::__set_creatives(const std::vector<Creative> & val) {
  this->creatives = val;
}

uint32_t CtrRequest::read(::apache::thrift::protocol::TProtocol* iprot) {

  apache::thrift::protocol::TInputRecursionTracker tracker(*iprot);
  uint32_t xfer = 0;
  std::string fname;
  ::apache::thrift::protocol::TType ftype;
  int16_t fid;

  xfer += iprot->readStructBegin(fname);

  using ::apache::thrift::protocol::TProtocolException;


  while (true)
  {
    xfer += iprot->readFieldBegin(fname, ftype, fid);
    if (ftype == ::apache::thrift::protocol::T_STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->sid);
          this->__isset.sid = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 2:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->user_id);
          this->__isset.user_id = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 3:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->ip);
          this->__isset.ip = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 4:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->prov);
          this->__isset.prov = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 5:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->city);
          this->__isset.city = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 6:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->url);
          this->__isset.url = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 7:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->adview_type);
          this->__isset.adview_type = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 8:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->weekday);
          this->__isset.weekday = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 9:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->hour);
          this->__isset.hour = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 10:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->ua);
          this->__isset.ua = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 11:
        if (ftype == ::apache::thrift::protocol::T_LIST) {
          {
            this->site_category.clear();
            uint32_t _size2;
            ::apache::thrift::protocol::TType _etype5;
            xfer += iprot->readListBegin(_etype5, _size2);
            this->site_category.resize(_size2);
            uint32_t _i6;
            for (_i6 = 0; _i6 < _size2; ++_i6)
            {
              xfer += iprot->readString(this->site_category[_i6]);
            }
            xfer += iprot->readListEnd();
          }
          this->__isset.site_category = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 12:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->site_quality);
          this->__isset.site_quality = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 13:
        if (ftype == ::apache::thrift::protocol::T_LIST) {
          {
            this->page_category.clear();
            uint32_t _size7;
            ::apache::thrift::protocol::TType _etype10;
            xfer += iprot->readListBegin(_etype10, _size7);
            this->page_category.resize(_size7);
            uint32_t _i11;
            for (_i11 = 0; _i11 < _size7; ++_i11)
            {
              xfer += iprot->readString(this->page_category[_i11]);
            }
            xfer += iprot->readListEnd();
          }
          this->__isset.page_category = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 14:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->page_quality);
          this->__isset.page_quality = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 15:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->page_type);
          this->__isset.page_type = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 16:
        if (ftype == ::apache::thrift::protocol::T_LIST) {
          {
            this->user_interests.clear();
            uint32_t _size12;
            ::apache::thrift::protocol::TType _etype15;
            xfer += iprot->readListBegin(_etype15, _size12);
            this->user_interests.resize(_size12);
            uint32_t _i16;
            for (_i16 = 0; _i16 < _size12; ++_i16)
            {
              xfer += iprot->readString(this->user_interests[_i16]);
            }
            xfer += iprot->readListEnd();
          }
          this->__isset.user_interests = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 17:
        if (ftype == ::apache::thrift::protocol::T_LIST) {
          {
            this->page_keywords.clear();
            uint32_t _size17;
            ::apache::thrift::protocol::TType _etype20;
            xfer += iprot->readListBegin(_etype20, _size17);
            this->page_keywords.resize(_size17);
            uint32_t _i21;
            for (_i21 = 0; _i21 < _size17; ++_i21)
            {
              xfer += iprot->readString(this->page_keywords[_i21]);
            }
            xfer += iprot->readListEnd();
          }
          this->__isset.page_keywords = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 18:
        if (ftype == ::apache::thrift::protocol::T_LIST) {
          {
            this->creatives.clear();
            uint32_t _size22;
            ::apache::thrift::protocol::TType _etype25;
            xfer += iprot->readListBegin(_etype25, _size22);
            this->creatives.resize(_size22);
            uint32_t _i26;
            for (_i26 = 0; _i26 < _size22; ++_i26)
            {
              xfer += this->creatives[_i26].read(iprot);
            }
            xfer += iprot->readListEnd();
          }
          this->__isset.creatives = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      default:
        xfer += iprot->skip(ftype);
        break;
    }
    xfer += iprot->readFieldEnd();
  }

  xfer += iprot->readStructEnd();

  return xfer;
}

uint32_t CtrRequest::write(::apache::thrift::protocol::TProtocol* oprot) const {
  uint32_t xfer = 0;
  apache::thrift::protocol::TOutputRecursionTracker tracker(*oprot);
  xfer += oprot->writeStructBegin("CtrRequest");

  xfer += oprot->writeFieldBegin("sid", ::apache::thrift::protocol::T_STRING, 1);
  xfer += oprot->writeString(this->sid);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("user_id", ::apache::thrift::protocol::T_STRING, 2);
  xfer += oprot->writeString(this->user_id);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("ip", ::apache::thrift::protocol::T_STRING, 3);
  xfer += oprot->writeString(this->ip);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("prov", ::apache::thrift::protocol::T_STRING, 4);
  xfer += oprot->writeString(this->prov);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("city", ::apache::thrift::protocol::T_STRING, 5);
  xfer += oprot->writeString(this->city);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("url", ::apache::thrift::protocol::T_STRING, 6);
  xfer += oprot->writeString(this->url);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("adview_type", ::apache::thrift::protocol::T_I32, 7);
  xfer += oprot->writeI32(this->adview_type);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("weekday", ::apache::thrift::protocol::T_I32, 8);
  xfer += oprot->writeI32(this->weekday);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("hour", ::apache::thrift::protocol::T_I32, 9);
  xfer += oprot->writeI32(this->hour);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("ua", ::apache::thrift::protocol::T_STRING, 10);
  xfer += oprot->writeString(this->ua);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("site_category", ::apache::thrift::protocol::T_LIST, 11);
  {
    xfer += oprot->writeListBegin(::apache::thrift::protocol::T_STRING, static_cast<uint32_t>(this->site_category.size()));
    std::vector<std::string> ::const_iterator _iter27;
    for (_iter27 = this->site_category.begin(); _iter27 != this->site_category.end(); ++_iter27)
    {
      xfer += oprot->writeString((*_iter27));
    }
    xfer += oprot->writeListEnd();
  }
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("site_quality", ::apache::thrift::protocol::T_STRING, 12);
  xfer += oprot->writeString(this->site_quality);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("page_category", ::apache::thrift::protocol::T_LIST, 13);
  {
    xfer += oprot->writeListBegin(::apache::thrift::protocol::T_STRING, static_cast<uint32_t>(this->page_category.size()));
    std::vector<std::string> ::const_iterator _iter28;
    for (_iter28 = this->page_category.begin(); _iter28 != this->page_category.end(); ++_iter28)
    {
      xfer += oprot->writeString((*_iter28));
    }
    xfer += oprot->writeListEnd();
  }
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("page_quality", ::apache::thrift::protocol::T_STRING, 14);
  xfer += oprot->writeString(this->page_quality);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("page_type", ::apache::thrift::protocol::T_STRING, 15);
  xfer += oprot->writeString(this->page_type);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("user_interests", ::apache::thrift::protocol::T_LIST, 16);
  {
    xfer += oprot->writeListBegin(::apache::thrift::protocol::T_STRING, static_cast<uint32_t>(this->user_interests.size()));
    std::vector<std::string> ::const_iterator _iter29;
    for (_iter29 = this->user_interests.begin(); _iter29 != this->user_interests.end(); ++_iter29)
    {
      xfer += oprot->writeString((*_iter29));
    }
    xfer += oprot->writeListEnd();
  }
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("page_keywords", ::apache::thrift::protocol::T_LIST, 17);
  {
    xfer += oprot->writeListBegin(::apache::thrift::protocol::T_STRING, static_cast<uint32_t>(this->page_keywords.size()));
    std::vector<std::string> ::const_iterator _iter30;
    for (_iter30 = this->page_keywords.begin(); _iter30 != this->page_keywords.end(); ++_iter30)
    {
      xfer += oprot->writeString((*_iter30));
    }
    xfer += oprot->writeListEnd();
  }
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("creatives", ::apache::thrift::protocol::T_LIST, 18);
  {
    xfer += oprot->writeListBegin(::apache::thrift::protocol::T_STRUCT, static_cast<uint32_t>(this->creatives.size()));
    std::vector<Creative> ::const_iterator _iter31;
    for (_iter31 = this->creatives.begin(); _iter31 != this->creatives.end(); ++_iter31)
    {
      xfer += (*_iter31).write(oprot);
    }
    xfer += oprot->writeListEnd();
  }
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldStop();
  xfer += oprot->writeStructEnd();
  return xfer;
}

void swap(CtrRequest &a, CtrRequest &b) {
  using ::std::swap;
  swap(a.sid, b.sid);
  swap(a.user_id, b.user_id);
  swap(a.ip, b.ip);
  swap(a.prov, b.prov);
  swap(a.city, b.city);
  swap(a.url, b.url);
  swap(a.adview_type, b.adview_type);
  swap(a.weekday, b.weekday);
  swap(a.hour, b.hour);
  swap(a.ua, b.ua);
  swap(a.site_category, b.site_category);
  swap(a.site_quality, b.site_quality);
  swap(a.page_category, b.page_category);
  swap(a.page_quality, b.page_quality);
  swap(a.page_type, b.page_type);
  swap(a.user_interests, b.user_interests);
  swap(a.page_keywords, b.page_keywords);
  swap(a.creatives, b.creatives);
  swap(a.__isset, b.__isset);
}

CtrRequest::CtrRequest(const CtrRequest& other32) {
  sid = other32.sid;
  user_id = other32.user_id;
  ip = other32.ip;
  prov = other32.prov;
  city = other32.city;
  url = other32.url;
  adview_type = other32.adview_type;
  weekday = other32.weekday;
  hour = other32.hour;
  ua = other32.ua;
  site_category = other32.site_category;
  site_quality = other32.site_quality;
  page_category = other32.page_category;
  page_quality = other32.page_quality;
  page_type = other32.page_type;
  user_interests = other32.user_interests;
  page_keywords = other32.page_keywords;
  creatives = other32.creatives;
  __isset = other32.__isset;
}
CtrRequest& CtrRequest::operator=(const CtrRequest& other33) {
  sid = other33.sid;
  user_id = other33.user_id;
  ip = other33.ip;
  prov = other33.prov;
  city = other33.city;
  url = other33.url;
  adview_type = other33.adview_type;
  weekday = other33.weekday;
  hour = other33.hour;
  ua = other33.ua;
  site_category = other33.site_category;
  site_quality = other33.site_quality;
  page_category = other33.page_category;
  page_quality = other33.page_quality;
  page_type = other33.page_type;
  user_interests = other33.user_interests;
  page_keywords = other33.page_keywords;
  creatives = other33.creatives;
  __isset = other33.__isset;
  return *this;
}
void CtrRequest::printTo(std::ostream& out) const {
  using ::apache::thrift::to_string;
  out << "CtrRequest(";
  out << "sid=" << to_string(sid);
  out << ", " << "user_id=" << to_string(user_id);
  out << ", " << "ip=" << to_string(ip);
  out << ", " << "prov=" << to_string(prov);
  out << ", " << "city=" << to_string(city);
  out << ", " << "url=" << to_string(url);
  out << ", " << "adview_type=" << to_string(adview_type);
  out << ", " << "weekday=" << to_string(weekday);
  out << ", " << "hour=" << to_string(hour);
  out << ", " << "ua=" << to_string(ua);
  out << ", " << "site_category=" << to_string(site_category);
  out << ", " << "site_quality=" << to_string(site_quality);
  out << ", " << "page_category=" << to_string(page_category);
  out << ", " << "page_quality=" << to_string(page_quality);
  out << ", " << "page_type=" << to_string(page_type);
  out << ", " << "user_interests=" << to_string(user_interests);
  out << ", " << "page_keywords=" << to_string(page_keywords);
  out << ", " << "creatives=" << to_string(creatives);
  out << ")";
}


CtrResponse::~CtrResponse() throw() {
}


void CtrResponse::__set_ctr(const std::vector<double> & val) {
  this->ctr = val;
}

uint32_t CtrResponse::read(::apache::thrift::protocol::TProtocol* iprot) {

  apache::thrift::protocol::TInputRecursionTracker tracker(*iprot);
  uint32_t xfer = 0;
  std::string fname;
  ::apache::thrift::protocol::TType ftype;
  int16_t fid;

  xfer += iprot->readStructBegin(fname);

  using ::apache::thrift::protocol::TProtocolException;


  while (true)
  {
    xfer += iprot->readFieldBegin(fname, ftype, fid);
    if (ftype == ::apache::thrift::protocol::T_STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
        if (ftype == ::apache::thrift::protocol::T_LIST) {
          {
            this->ctr.clear();
            uint32_t _size34;
            ::apache::thrift::protocol::TType _etype37;
            xfer += iprot->readListBegin(_etype37, _size34);
            this->ctr.resize(_size34);
            uint32_t _i38;
            for (_i38 = 0; _i38 < _size34; ++_i38)
            {
              xfer += iprot->readDouble(this->ctr[_i38]);
            }
            xfer += iprot->readListEnd();
          }
          this->__isset.ctr = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      default:
        xfer += iprot->skip(ftype);
        break;
    }
    xfer += iprot->readFieldEnd();
  }

  xfer += iprot->readStructEnd();

  return xfer;
}

uint32_t CtrResponse::write(::apache::thrift::protocol::TProtocol* oprot) const {
  uint32_t xfer = 0;
  apache::thrift::protocol::TOutputRecursionTracker tracker(*oprot);
  xfer += oprot->writeStructBegin("CtrResponse");

  xfer += oprot->writeFieldBegin("ctr", ::apache::thrift::protocol::T_LIST, 1);
  {
    xfer += oprot->writeListBegin(::apache::thrift::protocol::T_DOUBLE, static_cast<uint32_t>(this->ctr.size()));
    std::vector<double> ::const_iterator _iter39;
    for (_iter39 = this->ctr.begin(); _iter39 != this->ctr.end(); ++_iter39)
    {
      xfer += oprot->writeDouble((*_iter39));
    }
    xfer += oprot->writeListEnd();
  }
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldStop();
  xfer += oprot->writeStructEnd();
  return xfer;
}

void swap(CtrResponse &a, CtrResponse &b) {
  using ::std::swap;
  swap(a.ctr, b.ctr);
  swap(a.__isset, b.__isset);
}

CtrResponse::CtrResponse(const CtrResponse& other40) {
  ctr = other40.ctr;
  __isset = other40.__isset;
}
CtrResponse& CtrResponse::operator=(const CtrResponse& other41) {
  ctr = other41.ctr;
  __isset = other41.__isset;
  return *this;
}
void CtrResponse::printTo(std::ostream& out) const {
  using ::apache::thrift::to_string;
  out << "CtrResponse(";
  out << "ctr=" << to_string(ctr);
  out << ")";
}

} // namespace
