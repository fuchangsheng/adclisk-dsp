#ifndef FORMAT_H
#define FORMAT_H

#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <vector>
#include <cmath>
#include <functional>
#include <unordered_map>
#include "dmtec_ctr.h"

//std::string frequent_feats_path = "./frequent_feats";


class Format {
public:
	void load_frequent_feats() ;
	void display() ;
	std::string struct2libsvm(const CtrRequest &req);
    void struct2arr(const CtrRequest &req, std::vector<int> features, std::vector<double> value);
    std::vector<int> struct2ffm(const CtrRequest &req, std::vector<int> gbdt_res);

private:
    std::unordered_map<std::string, int> frequent_feats_rank;
	int frequent_feats_number;
};

#endif
