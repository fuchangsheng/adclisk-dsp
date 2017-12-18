#ifndef TREE_H
#define TREE_H

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>


static const int MAX_DEPTH = 5;
static const int TREE_NUM  = 40;


struct Node{
    bool   leaf      = false;
    int    feature   = 0;
    double condition = 0;
    int    bigger    = 0;
    int    smaller   = 0;
    int    miss      = 0;
    
};

struct Cart{
    Node   node[1<<(MAX_DEPTH+1)];
    int    depth = 0;
    int    nodes = 0;
};


class Tree{
public:
    Tree(): tree_num(0), max_used_feature(0){}

    int         init();
    void        display();
    std::vector<int> predict(std::string );
    std::vector<int> predict(std::vector<int>, std::vector<double>);
private:
    int  tree_num;
    int  max_used_feature;
    std::string path;
    Cart cart[TREE_NUM];
    void dfs(Cart cart, int num);
};

#endif
