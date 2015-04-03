var ServerConfig = {
    server : 'hgmeap-pluginserver-chayan', //后台服务标识
    url: '/RiskExamService/SysHandler/SysHandler.ashx?', //后台服务地址
    downLoadUrl: '/RiskExamFile/GetPaperFile.ashx?',//随附单证下载地址
    fileServer : 'hgmeap-pluginserver-chayan',  //文件服务标识
    fileUrl: "/RiskExamFile/RiskExamFile.ashx?", //文件服务地址
    debug: false
};
if (ServerConfig.debug) {
    ServerConfig.server = 'localhost';
    ServerConfig.fileServer = 'localhost'; 
};