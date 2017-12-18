#ifndef DMTEC_CTR_HANDLER_H
#define DMTEC_CTR_HANDLER_H

#include "gen-cpp/dmtec_ctr.h"
#include "gen-cpp/dmtec_client.h"

namespace DmtecCtr {

	class DmtecCtrHandler {
	public:
		int init(const std::string &str_server);
		int call(const CtrRequest *request, CtrResponse *response);
	private:
		DmtecClient _client;
	};
}

#endif
