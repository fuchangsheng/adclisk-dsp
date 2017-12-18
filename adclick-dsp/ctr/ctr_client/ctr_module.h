/********************************************
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * Author: zhangqi <zhangqi04@baidu.com>
 * File: ctr_module.h
 * Date: 2016-06-06
 * Version: 1.0.0.0
 * Brief:
 ********************************************/

#ifndef INF_BCE_CLOUD_DSP_CTR_MODULE_H
#define INF_BCE_CLOUD_DSP_CTR_MODULE_H

#include "bidding_module.h"     // BiddingModule

#ifdef DMTEC_CTR
#include "dmtec_ctr_handler.h"

using DmtecCtr::CtrRequest;
using DmtecCtr::CtrResponse;

#else
#include "bce_ctr_handler.h"    // BceCtrHandler

#endif


namespace bce {
namespace dsp {

class CtrModule : public BiddingModule {
public:
    int init();
    int run(BidRequest *request, BidResponse *response);

private:
#ifdef DMTEC_CTR
	DmtecCtrHandler _ctr_handler;
#else
    BceCtrHandler _ctr_handler;
#endif
};

} // end namespace dsp
} // end namespace bce

#endif // INF_BCE_CLOUD_DSP_CTR_MODULE_H
