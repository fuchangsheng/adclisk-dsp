var cate = new Array(new Option("--请选择--","0"), new Option("安全安保","51"), 
                     new Option("办公文教","52"), new Option("彩票","53"), 
                     new Option("车辆物流","54"), new Option("成人用品","55"), 
                     new Option("出版传媒","56"), new Option("电脑硬件","57"),
                     new Option("电子电工","58"), new Option("房地产建筑装修","59"),
                     new Option("分类平台","60"), new Option("服装鞋帽","61"),
                     new Option("箱包饰品","62"), new Option("化工原料制品","63"),
                     new Option("机械设备","64"), new Option("家庭日用品","65"),
                     new Option("家用电器","66"), new Option("教育培训","67"),
                     new Option("节能环保","68"), new Option("金融服务","69"),
                     new Option("礼品","70"), new Option("旅游住宿","71"),
                     new Option("美容化妆","72"), new Option("母婴护理","73"),
                     new Option("农林牧渔","74"), new Option("软件","75"),
                     new Option("商务服务","76"), new Option("生活服务","77"),
                     new Option("食品保健品","78"), new Option("手机数码","79"),
                     new Option("通讯服务设备","80"), new Option("网络服务","81"),
                     new Option("医疗服务","82"), new Option("游戏","83"),
                     new Option("运动休闲娱乐","84"), new Option("招商加盟","85"),
                     new Option("学术公管社会组织","86"), new Option("国际组织","87"),
                     new Option("其他","99"));
                 
var shis = new Array();
shis[0] = new Array(new Option("--请选择--","0"));
shis[1] = new Array(new Option("安保服务","5101"), new Option("安保器材","5102"), new Option("安全防伪","5103"), new Option("防盗报警","5104"), new Option("交通消防","5105"), new Option("智能楼宇","5106"));
shis[2] = new Array(new Option("办公设备","5201"), new Option("教具","5202"), new Option("文具","5203"));
shis[3] = new Array(new Option("彩票","5301"));
shis[4] = new Array(new Option("物流","5401"), new Option("车辆","5402"), new Option("火车","5403"), new Option("船舶","5404"), new Option("飞机","5405"));
shis[5] = new Array(new Option("成人用品","5501"));
shis[6] = new Array(new Option("出版印刷","5601"), new Option("影视传媒","5602"), new Option("广播有线电视","5603"));
shis[7] = new Array(new Option("电脑整机","5701"), new Option("电脑配件","5702"), new Option("网络设备","5703"), new Option("电脑服务","5704"));
shis[8] = new Array(new Option("电子元器件","5801"), new Option("电机设备","5802"), new Option("电线电缆","5803"), new Option("供电设备","5804"), new Option("照明设备","5805"), new Option("仪器仪表","5806"));
shis[9] = new Array(new Option("建筑工程","5901"), new Option("房屋租售","5902"), new Option("物业管理","5903"), new Option("装修服务","5904"), new Option("建筑装修材料","5905"));
shis[10] = new Array(new Option("网上商城","6001"), new Option("导购网站","6002"), new Option("团购网站","6003"), new Option("社交平台","6004"), new Option("分类服务平台","6005"), new Option("生活服务网站","6006"), new Option("休闲娱乐网站","6007"));
shis[11] = new Array(new Option("服装","6101"), new Option("鞋帽","6102"), new Option("纺织原料","6103"));
shis[12] = new Array(new Option("箱包","6201"), new Option("饰品","6202"));
shis[13] = new Array(new Option("涂料","6301"), new Option("化工原料","6302"), new Option("橡胶","6303"), new Option("塑料","6304"), new Option("能源","6305"), new Option("冶金","6306"), new Option("包装材料","6307"));
shis[14] = new Array(new Option("通用机械设备","6401"), new Option("通用零配件","6402"), new Option("建筑工程机械","6403"), new Option("勘探机械","6404"), new Option("化工机械","6405"), new Option("木材石材加工机械","6406"), 
                     new Option("印刷机械","6407"), new Option("模具","6408"), new Option("食品机械","6409"), new Option("农林机械","6410"), new Option("纸制造加工设备","6411"), new Option("制鞋纺织机械","6412"),
                     new Option("商业设备","6413"), new Option("包装机械","6414"), new Option("制药设备","6415"), new Option("冶炼铸造设备","6416"), new Option("机床机械","6417"), new Option("五金工具","6418"), 
                     new Option("物流设备","6419"), new Option("清洁通风设备","6420"), new Option("焊接材料设备","6421"), new Option("玻璃橡塑设备","6422"), new Option("金属材料","6423"), new Option("电子产品制造设备","6424"));
shis[15] = new Array(new Option("家具","6501"), new Option("家纺家饰","6502"), new Option("厨具餐具","6503"), new Option("日化用品","6504"));
shis[16] = new Array(new Option("大型家电","6601"), new Option("厨用电器","6602"), new Option("卫浴家电","6603"), new Option("健康电器","6604"), new Option("生活小家电","6605"));
shis[17] = new Array(new Option("学前教育","6701"), new Option("小初高教育","6702"), new Option("高教自考","6703"), new Option("留学","6704"), new Option("IT培训","6705"), 
                     new Option("语言培训","6706"), new Option("职业培训","6707"), new Option("文体培训","6708"), new Option("企业培训拓展","6709"), new Option("特殊人群教育","6710"));
shis[18] = new Array(new Option("污染处理","6801"), new Option("废旧回收","6802"), new Option("节能","6803"));
shis[19] = new Array(new Option("理财","6901"), new Option("银行","6902"), new Option("保险","6903"), new Option("投资担保","6904"), new Option("典当","6905"));
shis[20] = new Array(new Option("礼品","7001"));
shis[21] = new Array(new Option("旅游","7101"), new Option("宾馆酒店","7102"), new Option("交通票务","7103"), new Option("文体票务","7104"));
shis[22] = new Array(new Option("化妆品","7201"), new Option("美容","7202"));
shis[23] = new Array(new Option("母婴护理","7301"));
shis[24] = new Array(new Option("兽医兽药","7401"), new Option("农药","7402"), new Option("化肥","7403"), new Option("养殖","7404"), new Option("种植","7405"), new Option("园林景观","7406"));
shis[25] = new Array(new Option("操作系统","7501"), new Option("中间件软件","7502"), new Option("应用软件","7503"), new Option("杀毒软件","7504"), new Option("监控安全软件","7505"), 
                     new Option("数据库软件","7506"), new Option("企业软件","7507"), new Option("行业专用软件","7508"), new Option("支付结算软件","7509"), new Option("教学软件","7510"));
shis[26] = new Array(new Option("出国","7601"), new Option("招聘","7602"), new Option("翻译","7603"), new Option("设计","7604"), new Option("广告","7605"), new Option("公关策划","7606"), 
                     new Option("咨询","7607"), new Option("拍卖","7608"), new Option("代理","7609"), new Option("调查","7610"), new Option("法律服务","7611"), new Option("会计审计","7612"), new Option("铃声短信","7613"));
shis[27] = new Array(new Option("搬家","7701"), new Option("家政","7702"), new Option("征婚交友","7703"), new Option("仪式典礼","7704"), new Option("摄影","7705"), new Option("汽车租赁","7706"), new Option("家电维修","7707"), new Option("居民服务","7708"));
shis[28] = new Array(new Option("生活食材","7801"), new Option("休闲零食","7802"), new Option("饮料","7803"), new Option("保健食品","7804"), new Option("烟酒","7805"), new Option("餐馆","7806"));
shis[29] = new Array(new Option("手机","7901"), new Option("数码产品","7902"));
shis[30] = new Array(new Option("通讯服务","8001"), new Option("通讯设备","8002"));
shis[31] = new Array(new Option("网站建设","8101"), new Option("域名空间","8102"));
shis[32] = new Array(new Option("男科","8201"), new Option("妇科","8202"), new Option("美容整形","8203"), new Option("专科医院","8204"), new Option("中医","8205"), 
                     new Option("体检机构","8206"), new Option("综合医院","8207"), new Option("药品","8208"), new Option("医疗器械","8209"));
shis[33] = new Array(new Option("游戏开发","8301"), new Option("游戏运营","8302"), new Option("游戏周边","8303"));
shis[34] = new Array(new Option("体育器械","8401"), new Option("休闲活动","8402"), new Option("运势测算","8403"), new Option("宠物服务","8404"), new Option("玩具模型","8405"), new Option("乐器","8406"));
shis[35] = new Array(new Option("服装饰品加盟","8501"), new Option("美容化妆加盟","8502"), new Option("礼品加盟","8503"), new Option("食品保健品加盟","8504"), new Option("生活服务加盟","8505"), new Option("教育培训加盟","8506"), new Option("机械电子建材加盟","8507"), 
                     new Option("汽车加盟","8508"), new Option("旅游住宿加盟","8509"), new Option("干洗加盟","8510"), new Option("综合招商","8511"), new Option("养殖加盟","8514"));
shis[36] = new Array(new Option("学术公管社会组织","8601"));
shis[37] = new Array(new Option("国际组织","8701"));
shis[38] = new Array(new Option("其他","9901"));

export { cate, shis };