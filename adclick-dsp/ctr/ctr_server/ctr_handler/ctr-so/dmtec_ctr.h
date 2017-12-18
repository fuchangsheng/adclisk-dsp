#ifndef DMTEC_CTR_H
#define DMTEC_CTR_H




#define INIT_OK 0
#define INIT_NO -1
#define INIT_AGAIN 1

struct CtrRequest {
	int none = 0;
};

struct CtrResponse {
	int none = 0;
};

int load_ffm_model();
int load_gbdt_model();
int init();

int is_init();


char* get_ctr(const char* req_json);

#endif