#include <iostream>
#include <string>
#include <vector>
#include <cstdio>
#include <unistd.h>
#include <sys/time.h>
#include "ffm.h"
#include "tree.h"
#include "format.h"
#include "dmtec_ctr.h"



static Ffm ffm;
static Tree tree;
static int init_status = INIT_NO;

static FILE *fp = fopen("/home/susan/dmetcctr.log", "a");
class Test{
public:
	Test(){
		timeval tv;
		gettimeofday(&tv, NULL);
		printf("Test init pid:%d ppid:%d\n",getpid(), getppid());
		fprintf(fp, "!!!test init time:%ld-%ld\n",tv.tv_sec%1000, tv.tv_usec);
	}
	~Test(){
		timeval tv;
		gettimeofday(&tv, NULL);
		printf("Test destory pid:%d ppid:%d\n",getpid(), getppid());
		fprintf(fp, "!!!test destory time:%ld-%ld\n",tv.tv_sec%1000, tv.tv_usec);
	}
};

Test t;



int load_ffm_model() {
	if (ffm.init() != 0)
		return -1;
	return 0;
}

int load_gbdt_model() {
	if (tree.init() != 0)
		return -1;
	return 0;
}

int init() {
	if(load_gbdt_model() != 0)
		return -1;
	if(load_ffm_model() != 0)
		return -1;
	init_status = INIT_OK;
	return 0;
}

int is_init() {
	static int cnt = 0;
	timeval tv;
	gettimeofday(&tv, NULL);
	printf("is_init pid:%d ppid:%d\n",getpid(), getppid());
	fprintf(fp, "is_init pid:%d cnt:%d s:%ld us:%ld\n",getpid(), ++cnt, tv.tv_sec%1000, tv.tv_usec);
	return init_status;
}

char* get_ctr(const char *str) {
	static int cnt = 0;
	timeval tv;
	gettimeofday(&tv, NULL);
	fprintf(fp, "get_ctr pid:%d cnt:%d s:%ld us:%ld\n",getpid(), ++cnt, tv.tv_sec%1000, tv.tv_usec);
	static char p[] = "1.0";
	return p;
}
