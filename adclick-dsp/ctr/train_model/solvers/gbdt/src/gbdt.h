#include <iostream>
#include <vector>
#include <memory>
#include <mutex>
#include <cstring>

#include "common.h"
uint32_t const kMaxLineSize = 1000000;

struct TreeNode
{
    TreeNode() : idx(0), feature(-1), threshold(0), gamma(0) {} 
    uint32_t idx;
    int32_t feature;
    float threshold, gamma;
    void save_model(FILE *fp){
        fprintf(fp, "%d %d %f %f\n",static_cast<int>(idx),static_cast<int>(feature),threshold,gamma);
    }
};

class CART 
{
public:
    CART() : tnodes(max_tnodes+1)
    {
        for(uint32_t i = 1; i <= max_tnodes; ++i)
            tnodes[i].idx = i;
    }
    void fit(Problem const &prob, std::vector<float> const &R, 
        std::vector<float> &F1);
    std::pair<uint32_t, float> predict(float const * const x) const;
    void save_model(FILE *fp);
    static uint32_t max_depth, max_tnodes;

private:
    static std::mutex mtx;
    static bool verbose;
    std::vector<TreeNode> tnodes;
};

class GBDT
{
public:
    GBDT() = default;
    GBDT(uint32_t const nr_tree) : trees(nr_tree), bias(0) {}
    void fit(Problem const &Tr, Problem const &Va);
    float predict(float const * const x) const;
    void save_model(FILE *fp);
    std::vector<uint32_t> get_indices(float const * const x) const;
private:
    std::vector<CART> trees;
    float bias;
};
