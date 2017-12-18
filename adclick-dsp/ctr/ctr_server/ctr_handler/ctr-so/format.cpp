#include "format.h"

using std::vector;
using std::string;
std::string itos(int num) {
    std::string ret = "";
    while (num) {
        char t = num % 10 + '0';
        num /= 10;

        ret += t;
    }
    return std::string(ret.rbegin(), ret.rend());
}

void Format::load_frequent_feats() {
    std::ifstream in("./frequent_feats");

    if (!in.is_open()){
        std::cerr << "Can't load frequent features" << std::endl;
        return ;
    }
    std::string tmp;
    int cnt = 1;
    while (in >> tmp) 
        frequent_feats_rank[tmp] = cnt++;
    frequent_feats_number = cnt;
} 

void Format::display() {
    for (auto it = frequent_feats_rank.begin(); it != frequent_feats_rank.end(); ++it) {
        std::cout << it->first << "|" << it->second << std::endl;
    }
}

std::string Format::struct2libsvm(const CtrRequest &req) {
    return "none";
}

void Format::struct2arr(const CtrRequest &req, vector<int> features, vector<double> value){
   return ;
}

vector<int> Format::struct2ffm(const CtrRequest &req, vector<int> gbdt_res){
    vector<int> ret;
    
    return ret;
}
