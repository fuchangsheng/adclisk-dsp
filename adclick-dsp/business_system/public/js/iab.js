var iab_cate = new Array(new Option("--请选择--","0"), new Option("艺术与娱乐","1"), 
                     new Option("汽车", "2"), new Option("商业", "3"), 
                     new Option("职业", "4"), new Option("教育", "5"), 
                     new Option("家庭与育儿", "6"), new Option("健康与健身", "7"),
                     new Option("食物与饮料", "8"), new Option("爱好与兴趣", "9"),
                     new Option("家居与园艺", "10"), new Option("法律，政府与政治", "11"),
                     new Option("新闻", "12"), new Option("个人理财", "13"),
                     new Option("社会", "14"), new Option("科学", "15"),
                     new Option("宠物", "16"), new Option("体育", "17"),
                     new Option("造型与时尚", "18"), new Option("计算机技术", "19"),
                     new Option("旅行", "20"), new Option("房地产", "21"),
                     new Option("购物", "22"), new Option("宗教与信仰", "23"),
                     new Option("未分类", "24"), new Option("无标准内容", "25"),
                     new Option("非法", "26"));


var trade = new Array();
trade[0] = new Array(new Option("--请选择--","0"));

trade[1] = new Array(new Option("书籍与文学", "IAB1-1"), new Option("明星粉丝/八卦", "IAB1-2"), new Option("美术", "IAB1-3"), new Option("幽默", "IAB1-4"),
                     new Option("电影", "IAB1-5"), new Option("音乐", "IAB1-6"), new Option("电视", "IAB1-7"));

trade[2] = new Array(new Option("汽车配件", "IAB2-1"), new Option("汽车修理", "IAB2-2"), new Option("汽车售卖", "IAB2-3"), new Option("汽车文化", "IAB2-4"),
                     new Option("二手车", "IAB2-5"), new Option("敞篷车", "IAB2-6"), new Option("固定顶棚车", "IAB2-7"), new Option("跨界车", "IAB2-8"),
                     new Option("柴油机", "IAB2-9"), new Option("电动汽车", "IAB2-10"), new Option("掀背车", "IAB2-11"), new Option("混合动力", "IAB2-12"),
                     new Option("豪华车", "IAB2-13"), new Option("小货车", "IAB2-14"), new Option("摩托车", "IAB2-15"), new Option("越野车", "IAB2-16"),
                     new Option("高性能轿车", "IAB2-17"), new Option("皮卡", "IAB2-18"), new Option("道路救援车", "IAB2-19"), new Option("轿车", "IAB2-20"),
                     new Option("卡车与配件", "IAB2-21"), new Option("老式汽车", "IAB2-22"), new Option("旅行车", "IAB2-23"));

trade[3] = new Array(new Option("广告", "IAB3-1"), new Option("农业", "IAB3-2"), new Option("生物技术", "IAB3-3"), new Option("商业软件", "IAB3-4"),
                     new Option("建筑业", "IAB3-5"), new Option("林业", "IAB3-6"), new Option("政府", "IAB3-7"), new Option("绿色解决方案", "IAB3-8"),
                     new Option("人力资源", "IAB3-9"), new Option("物流", "IAB3-10"), new Option("市场", "IAB3-11"), new Option("金属", "IAB3-12"));

trade[4] = new Array(new Option("职业生涯规划", "IAB4-1"), new Option("大学", "IAB4-2"), new Option("助学金", "IAB4-3"), new Option("招聘会", "IAB4-4"),
                     new Option("求职", "IAB4-5"), new Option("简历报告/建议", "IAB4-6"), new Option("护理", "IAB4-7"), new Option("奖学金", "IAB4-8"),
                     new Option("远程办公", "IAB4-9"), new Option("美国军事", "IAB4-10"), new Option("职业建议", "IAB4-11"));

trade[5] = new Array(new Option("中学教育", "IAB5-1"), new Option("成人教育", "IAB5-2"), new Option("艺术史", "IAB5-3"), new Option("大学管理", "IAB5-4"),
                     new Option("大学生活", "IAB5-5"), new Option("远程教育", "IAB5-6"), new Option("英语(第二语言)", "IAB5-7"), new Option("语言学习", "IAB5-8"),
                     new Option("研究生", "IAB5-9"), new Option("家庭学校", "IAB5-10"), new Option("家庭作业/学习技巧", "IAB5-11"), new Option("小学教育", "IAB5-12"),
                     new Option("私立学校", "IAB5-13"), new Option("特殊教育", "IAB5-14"), new Option("商业学习", "IAB5-15"));

trade[6] = new Array(new Option("收养", "IAB6-1"), new Option("婴幼儿", "IAB6-2"), new Option("幼儿园/学前教育", "IAB6-3"), new Option("家庭环境", "IAB6-4"),
                     new Option("养育小学生", "IAB6-5"), new Option("养育青少年", "IAB6-6"), new Option("怀孕", "IAB6-7"), new Option("特殊儿童", "IAB6-8"),
                     new Option("老年人照顾", "IAB6-9"));

trade[7] = new Array(new Option("锻炼", "IAB7-1"), new Option("注意力缺陷", "IAB7-2"), new Option("艾滋病/HIV", "IAB7-3"), new Option("过敏", "IAB7-4"),
                     new Option("替代医学", "IAB7-5"), new Option("关节炎", "IAB7-6"), new Option("哮喘", "IAB7-7"), new Option("自闭症", "IAB7-8"),
                     new Option("双相障碍", "IAB7-9"), new Option("脑肿瘤", "IAB7-10"), new Option("癌症", "IAB7-11"), new Option("胆固醇", "IAB7-12"),
                     new Option("慢性疲劳综合征", "IAB7-13"), new Option("慢性疼痛", "IAB7-14"), new Option("感冒流感", "IAB7-15"), new Option("耳聋", "IAB7-16"),
                     new Option("牙科护理", "IAB7-17"), new Option("抑郁", "IAB7-18"), new Option("皮肤病", "IAB7-19"), new Option("糖尿病", "IAB7-20"),
                     new Option("癫痫", "IAB7-21"), new Option("胃食管反流病/酸反流", "IAB7-22"), new Option("头痛/偏头痛", "IAB7-23"), new Option("心脏病", "IAB7-24"),
                     new Option("草本植物", "IAB7-25"), new Option("自然疗法", "IAB7-26"), new Option("肠易激综合征/克罗恩病", "IAB7-27"), new Option("近亲结婚/药物滥用", "IAB7-28"),
                     new Option("失禁", "IAB7-29"), new Option("不孕不育", "IAB7-30"), new Option("男性健康", "IAB7-31"), new Option("营养品", "IAB7-32"),
                     new Option("整形外科", "IAB7-33"), new Option("恐慌/焦虑症", "IAB7-34"), new Option("儿科", "IAB7-35"), new Option("物理治疗", "IAB7-36"),
                     new Option("生理学/精神病学", "IAB7-37"), new Option("男士健康", "IAB7-38"), new Option("性欲", "IAB7-39"), new Option("睡眠障碍", "IAB7-40"),
                     new Option("戒烟", "IAB7-41"), new Option("药物滥用", "IAB7-42"), new Option("甲状腺疾病", "IAB7-43"), new Option("减肥", "IAB7-44"),
                     new Option("女士健康", "IAB7-45"));

trade[8] = new Array(new Option("美国菜", "IAB8-1"), new Option("烧烤", "IAB8-2"), new Option("卡津菜/克里奥尔菜", "IAB8-3"), new Option("中餐", "IAB8-4"),
                     new Option("鸡尾酒/啤酒", "IAB8-5"), new Option("咖啡/茶", "IAB8-6"), new Option("特殊美食", "IAB8-7"), new Option("甜点与烘焙", "IAB8-8"),
                     new Option("外出就餐", "IAB8-9"), new Option("食物过敏", "IAB8-10"), new Option("法国菜", "IAB8-11"), new Option("健康/低脂烹饪", "IAB8-12"),
                     new Option("意大利菜", "IAB8-13"), new Option("日本菜", "IAB8-14"), new Option("墨西哥菜", "IAB8-15"), new Option("素食主义者", "IAB8-16"),
                     new Option("素食者", "IAB8-17"), new Option("葡萄酒", "IAB8-18"));

trade[9] = new Array(new Option("艺术/技术", "IAB9-1"), new Option("艺术与工艺", "IAB9-2"), new Option("珠饰", "IAB9-3"), new Option("观鸟", "IAB9-4"),
                     new Option("棋盘游戏/拼图", "IAB9-5"), new Option("蜡烛与肥皂制造", "IAB9-6"), new Option("卡牌游戏", "IAB9-7"), new Option("国际象棋", "IAB9-8"),
                     new Option("雪茄", "IAB9-9"), new Option("收集", "IAB9-10"), new Option("漫画书", "IAB9-11"), new Option("绘画/素描", "IAB9-12"),
                     new Option("自由写作", "IAB9-13"), new Option("族谱", "IAB9-14"), new Option("出版", "IAB9-15"), new Option("吉他", "IAB9-16"),
                     new Option("家庭录音", "IAB9-17"), new Option("投资与专利", "IAB9-18"), new Option("首饰制作", "IAB9-19"), new Option("魔法与幻想", "IAB9-20"),
                     new Option("针线活", "IAB9-21"), new Option("绘画", "IAB9-22"), new Option("摄影", "IAB9-23"), new Option("电台", "IAB9-24"),
                     new Option("角色扮演游戏", "IAB9-25"), new Option("科幻与幻想", "IAB9-26"), new Option("剪贴簿", "IAB9-27"), new Option("编剧", "IAB9-28"),
                     new Option("邮票与硬币", "IAB9-29"), new Option("电视/电脑游戏", "IAB9-30"), new Option("木工", "IAB9-31"));

trade[10] = new Array(new Option("器械", "IAB10-1"), new Option("娱乐", "IAB10-2"), new Option("环境安全", "IAB10-3"), new Option("园艺", "IAB10-4"),
                      new Option("上门维修", "IAB10-5"), new Option("家庭影院", "IAB10-6"), new Option("室内装修", "IAB10-7"), new Option("园林美化", "IAB10-8"),
                      new Option("重建与建造", "IAB10-9"));

trade[11] = new Array(new Option("移民", "IAB11-1"), new Option("法律问题", "IAB11-2"), new Option("美国政府资源", "IAB11-3"), new Option("政治", "IAB11-4"),
                      new Option("评论", "IAB11-5"));

trade[12] = new Array(new Option("国际新闻", "IAB12-1"), new Option("国内新闻", "IAB12-2"), new Option("当地新闻", "IAB12-3"));

trade[13] = new Array(new Option("初始投资", "IAB13-1"), new Option("信用/债务和贷款", "IAB13-2"), new Option("金融新闻", "IAB13-3"), new Option("财务规划", "IAB13-4"),
                      new Option("对冲基金", "IAB13-5"), new Option("保险", "IAB13-6"), new Option("投资", "IAB13-7"), new Option("共有基金", "IAB13-8"),
                      new Option("期权", "IAB13-9"), new Option("退休规划", "IAB13-10"), new Option("股票", "IAB13-11"), new Option("税收规划", "IAB13-12"));

trade[14] = new Array(new Option("约会", "IAB14-1"), new Option("离婚事务所", "IAB14-2"), new Option("同性恋生活", "IAB14-3"), new Option("结婚", "IAB14-4"),
                      new Option("老人生活", "IAB14-5"), new Option("青少年", "IAB14-6"), new Option("婚礼", "IAB14-7"), new Option("民族风俗", "IAB14-8"));

trade[15] = new Array(new Option("占星术", "IAB15-1"), new Option("生物学", "IAB15-2"), new Option("化学", "IAB15-3"), new Option("地质学", "IAB15-4"),
                      new Option("超自然现象", "IAB15-5"), new Option("物理学", "IAB15-6"), new Option("天文学", "IAB15-7"), new Option("地理学", "IAB15-8"),
                      new Option("植物学", "IAB15-9"), new Option("气候学", "IAB15-10"));

trade[16] = new Array(new Option("鱼缸", "IAB16-1"), new Option("鸟", "IAB16-2"), new Option("猫", "IAB16-3"), new Option("狗", "IAB16-4"),
                      new Option("大型动物", "IAB16-5"), new Option("爬行动物", "IAB16-6"), new Option("兽医", "IAB16-7"));

trade[17] = new Array(new Option("赛车", "IAB17-1"), new Option("棒球", "IAB17-2"), new Option("自行车赛", "IAB17-3"), new Option("健美", "IAB17-4"),
                      new Option("拳击", "IAB17-5"), new Option("皮划艇", "IAB17-6"), new Option("拉拉队", "IAB17-7"), new Option("攀登", "IAB17-8"),
                      new Option("板球", "IAB17-9"), new Option("花样滑冰", "IAB17-10"), new Option("飞钓", "IAB17-11"), new Option("足球", "IAB17-12"),
                      new Option("淡水钓鱼", "IAB17-13"), new Option("钓鱼比赛", "IAB17-14"), new Option("高尔夫", "IAB17-15"), new Option("赛马", "IAB17-16"),
                      new Option("马", "IAB17-17"), new Option("狩猎/射击", "IAB17-18"), new Option("轮滑", "IAB17-19"), new Option("武术", "IAB17-20"),
                      new Option("山地自行车", "IAB17-21"), new Option("纳斯卡赛车", "IAB17-22"), new Option("奥林匹克", "IAB17-23"), new Option("彩弹游戏", "IAB17-24"),
                      new Option("电力机车", "IAB17-25"), new Option("职业篮球", "IAB17-26"), new Option("职业冰球", "IAB17-27"), new Option("斗牛", "IAB17-28"),
                      new Option("橄榄球", "IAB17-29"), new Option("跑步/慢跑", "IAB17-30"), new Option("帆船", "IAB17-31"), new Option("海钓", "IAB17-32"),
                      new Option("潜水", "IAB17-33"), new Option("滑板运动", "IAB17-34"), new Option("滑雪", "IAB17-35"), new Option("单板滑雪", "IAB17-36"),
                      new Option("冲浪", "IAB17-37"), new Option("游泳", "IAB17-38"), new Option("乒乓球", "IAB17-39"), new Option("网球", "IAB17-40"),
                      new Option("排球", "IAB17-41"), new Option("步行", "IAB17-42"), new Option("水橇滑水", "IAB17-43"), new Option("世界足球", "IAB17-44"));

trade[18] = new Array(new Option("美", "IAB18-1"), new Option("人体艺术", "IAB18-2"), new Option("时尚", "IAB18-3"), new Option("珠宝首饰", "IAB18-4"),
                      new Option("服饰", "IAB18-5"), new Option("配饰", "IAB18-6"));

trade[19] = new Array(new Option("三维图像", "IAB19-1"), new Option("动画", "IAB19-2"), new Option("杀毒软件", "IAB19-3"), new Option("C/C++", "IAB19-4"),
                      new Option("照相与摄像", "IAB19-5"), new Option("手机", "IAB19-6"), new Option("计算机认证", "IAB19-7"), new Option("计算机网络", "IAB19-8"),
                      new Option("计算机外设", "IAB19-9"), new Option("计算机概述", "IAB19-10"), new Option("数据中心", "IAB19-11"), new Option("数据库", "IAB19-12"),
                      new Option("桌面出版", "IAB19-13"), new Option("桌面视频", "IAB19-14"), new Option("邮件", "IAB19-15"), new Option("绘图软件", "IAB19-16"),
                      new Option("家庭影院", "IAB19-17"), new Option("互联网技术", "IAB19-18"), new Option("Java", "IAB19-19"), new Option("JavaScript", "IAB19-20"),
                      new Option("Mac Support", "IAB19-21"), new Option("MP3/数码音响", "IAB19-22"), new Option("网络会议", "IAB19-23"), new Option("网络初学者", "IAB19-24"),
                      new Option("网络安全", "IAB19-25"), new Option("掌上电脑", "IAB19-26"), new Option("PC Support", "IAB19-27"), new Option("手提式打字机", "IAB19-28"),
                      new Option("娱乐", "IAB19-29"), new Option("共享/免费软件", "IAB19-30"), new Option("Unix", "IAB19-31"), new Option("Visual Basic", "IAB19-32"),
                      new Option("网络剪辑艺术", "IAB19-33"), new Option("网页设计/HTML", "IAB19-34"), new Option("网络搜索", "IAB19-35"), new Option("Windows", "IAB19-36"));

trade[20] = new Array(new Option("探险旅行", "IAB20-1"), new Option("非洲", "IAB20-2"), new Option("空中旅行", "IAB20-3"), new Option("澳洲和新西兰", "IAB20-4"),
                      new Option("床和早餐", "IAB20-5"), new Option("穷游", "IAB20-6"), new Option("商务旅行", "IAB20-7"), new Option("美国近海岸", "IAB20-8"),
                      new Option("露营", "IAB20-9"), new Option("加拿大", "IAB20-10"), new Option("加勒比海", "IAB20-11"), new Option("乘船巡游", "IAB20-12"),
                      new Option("东欧", "IAB20-13"), new Option("欧洲", "IAB20-14"), new Option("法国", "IAB20-15"), new Option("希腊", "IAB20-16"),
                      new Option("蜜月/度假", "IAB20-17"), new Option("酒店", "IAB20-18"), new Option("意大利", "IAB20-19"), new Option("日本", "IAB20-20"),
                      new Option("墨西哥和美国中部", "IAB20-21"), new Option("国家公园", "IAB20-22"), new Option("美国南部", "IAB20-23"), new Option("温泉", "IAB20-24"),
                      new Option("主题公园", "IAB20-25"), new Option("亲子旅游", "IAB20-26"), new Option("大不列颠联合王国", "IAB20-27"));

trade[21] = new Array(new Option("公寓", "IAB21-1"), new Option("建筑师", "IAB21-2"), new Option("售卖房屋", "IAB21-3"));

trade[22] = new Array(new Option("抢购和赠品", "IAB22-1"), new Option("优惠券", "IAB22-2"), new Option("货比三家", "IAB22-3"), new Option("发动机", "IAB22-4"));

trade[23] = new Array(new Option("宗教", "IAB23-1"), new Option("无神论/不可知论", "IAB23-2"), new Option("佛教", "IAB23-3"), new Option("天主教", "IAB23-4"),
                      new Option("基督教", "IAB23-5"), new Option("印度教", "IAB23-6"), new Option("伊斯兰教", "IAB23-7"), new Option("犹太教", "IAB23-8"),
                      new Option("摩门教", "IAB23-9"), new Option("异教徒/巫术", "IAB23-10"));

trade[24] = new Array(new Option("未分类", "IAB24-1"));

trade[25] = new Array(new Option("自由港", "IAB25-1"), new Option("暴力/极端读物", "IAB25-2"), new Option("色情文学", "IAB25-3"), new Option("亵渎读物", "IAB25-4"),
                      new Option("愤世嫉俗读物", "IAB25-5"), new Option("构造中", "IAB25-6"), new Option("激励读物", "IAB25-7"));

trade[26] = new Array(new Option("非法内容", "IAB26-1"), new Option("盗版软件", "IAB26-2"), new Option("间谍软件/恶意软件", "IAB26-3"), new Option("著作权侵权", "IAB26-4"));