#include "tree.h"

using std::string;
using std::cout;
using std::endl;
using std::cerr;
using std::vector;

int Tree::init(){
    std::ifstream in(path.c_str());
    if(!in.is_open()){
        cerr << "Fatal: open model file fail!\n";
        return -1;
    }

    string line;
    int number = 0;
    int cnt    = -1;

    while(in>>line){
        if(line.find("boost") != -1){
            ++cnt;
        }
        else if(line.find("leaf") != -1){
            
            sscanf(line.c_str(), "%d:", &number);
            ++cart[cnt].nodes;

            cart[cnt].node[number].leaf = true;
        }
        else if(line.find("[") != -1){
            int    feature;
            double condition;

            sscanf(line.c_str(), "%d:[f%d<%lf]", &number, &feature, &condition);
            ++cart[cnt].nodes;

            cart[cnt].node[number].feature   = feature;
            cart[cnt].node[number].condition = condition; 
            max_used_feature = max_used_feature > feature ? max_used_feature : feature;
        }
        else if(line.find("yes") != -1){
            int yes;
            int no;
            int miss;

            sscanf(line.c_str(), "yes=%d,no=%d,missing=%d", &yes, &no, &miss);
            
            cart[cnt].node[number].smaller = yes;
            cart[cnt].node[number].bigger  = no;
            cart[cnt].node[number].miss    = miss;
        }
        else{
            cerr << "Fatal unknow expr" << endl;
			return -1;
        }
    }
    tree_num = cnt + 1;
	return 0;
}

void Tree::dfs(Cart cart, int num = 0){
    if(!num)
        cout << "\nDepth:" << cart.depth << " Nodes:" << cart.nodes << endl;

    if(!cart.node[num].leaf){
        cout << num << ": " << cart.node[num].feature << ", " << cart.node[num].condition << endl;
        dfs(cart, cart.node[num].smaller);
        dfs(cart, cart.node[num].bigger);
    }
    else{
        cout << "leaf: " << num << endl;
    }
}

void Tree::display(){

    cout<<"Tree_num: "<<tree_num<<endl;
}

vector<int> Tree::predict(string libsvm){
    int            dummy;
    int            feature;
    int            val;
    vector<int>    features;
    vector<double> value;
    char           ch;
    std::istringstream  in(libsvm);

    in >> dummy;
    while(in >> feature >> ch >> val){
        features.push_back(feature);
        value.push_back(val);
    }
    
    return predict(features, value);
}

//feature number must start from 1
vector<int> Tree::predict(vector<int> features, vector<double> value){
    vector<double> features_index(max_used_feature+1, -1);
    vector<int>    ret;

    for(int i = 0; i < features.size(); ++i){
        if(features[i] > max_used_feature)
            continue;
        features_index[features[i]] = i;
    }
    int base    = 1;
    int num     = 0;
    int feature = 0;
    double v    = 0;
    for(int i = 0; i < tree_num; ++i){
        num = 0;

        while(!cart[i].node[num].leaf){
            feature = cart[i].node[num].feature;
            if(features_index[feature] == -1){
                num = cart[i].node[num].miss;
                continue;
            }

            v = value[features_index[feature]];
            if(v < cart[i].node[num].condition){
                num = cart[i].node[num].smaller;
                continue;
            }
            num = cart[i].node[num].bigger;
        }
        
        ret.push_back(base + num);
        base += cart[i].nodes;
    }
    return ret;
}

