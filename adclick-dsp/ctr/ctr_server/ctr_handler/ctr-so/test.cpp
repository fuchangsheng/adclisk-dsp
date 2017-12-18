#include <stdio.h>
#include "dmtec_ctr.h"

int main(){
	printf("is_init:%d\n",is_init);
	printf("%s", get_ctr("df"));
}