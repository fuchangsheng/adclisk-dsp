#include "dmtec_client.h"
#include <iostream>
#include <stdint.h>
#include <thrift/protocol/TBinaryProtocol.h>
#include <thrift/transport/TSocket.h>
#include <thrift/transport/TTransportUtils.h>

namespace DmtecCtr{
ClientOptions::ClientOptions(){
    connect_timeout_ms = 200;
    timeout_ms         = 200;
    max_retry          = 3;
}

DmtecClient::~DmtecClient(){
    try{
        _transport->close();
    }
    catch(...){
        //nothing
    }
}

int DmtecClient::init(const std::string ctr_server, const ClientOptions *opt){
    _socket.reset(new TSocket(ctr_server, 9090));
    _transport.reset(new TBufferedTransport(_socket));
    _protocol.reset(new TBinaryProtocol(_transport));

	try {
		_transport->open();
	}
	catch(...){
		return -1;
	}

	_client.reset(new DmtecCtrClient(_protocol));
	return 0;
}

int DmtecClient::call(const CtrRequest *request, CtrResponse *response){
	try {
		_client->call(*request, *response);
	}
	catch(...){
        
        std::cout<<"icatch...\n";
		return -1;
	}
	return 0;
}

}



int main(){
   using namespace DmtecCtr;
   DmtecClient client;
   client.init("localhost", new ClientOptions());
   client.call(NULL, NULL);
   std::cout<<"ok\n";
}
