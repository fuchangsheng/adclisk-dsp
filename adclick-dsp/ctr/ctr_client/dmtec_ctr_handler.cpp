#include <string>
#include "dmtec_ctr_handler.h"
#include "flags.h"                      
#include "dsp_log.h"                    

namespace DmtecCtr {

	int DmtecCtrHandler::init(const std::string &ctr_server) {
		ClientOptions option;
		option.timeout_ms = FLAGS_ctr_timeout_ms;
		option.max_retry = FLAGS_ctr_max_retry;       // Don't retry.
		if (_client.init(ctr_server, &option) != 0) {
			LOG(FATAL) << "Fail to init ctr RpcClient: " << ctr_server;
			return -1;
		}
		return 0;
	}

	int DmtecCtrHandler::call(const CtrRequest *request, CtrResponse *response) {
		if (_client.call(*response, *request) != 0) {
			LOG(WARNING) << "Fail to call ctr rpc server";
			return -1;
		}
		return 0;
	}

}