#ifndef DMTEC_CLINET_H
#define DMTEC_CLINET_H

#include "dmtec_ctr.h"
#include <stdint.h>
#include <thrift/protocol/TBinaryProtocol.h>
#include <thrift/transport/TSocket.h>
#include <thrift/transport/TTransportUtils.h>

namespace DmtecCtr{

using namespace ::apache::thrift;
using namespace ::apache::thrift::protocol;
using namespace ::apache::thrift::transport;


struct ClientOptions{
    ClientOptions();

    int32_t connect_timeout_ms;

    int32_t timeout_ms;

    int32_t max_retry;
};

class DmtecClient{
public:
    ~DmtecClient();

    int init(const std::string ctr_server, const ClientOptions *opt);
    int call(const CtrRequest *request, CtrResponse *response);
private:
    boost::shared_ptr<TTransport> _socket;
    boost::shared_ptr<TTransport> _transport;
    boost::shared_ptr<TProtocol>  _protocol;
    boost::shared_ptr<DmtecCtrClient> _client;
};

}
#endif
