var ServerConfig = {
    server : 'hgmeap-pluginserver-chayan', //��̨�����ʶ
    url: '/RiskExamService/SysHandler/SysHandler.ashx?', //��̨�����ַ
    downLoadUrl: '/RiskExamFile/GetPaperFile.ashx?',//�渽��֤���ص�ַ
    fileServer : 'hgmeap-pluginserver-chayan',  //�ļ������ʶ
    fileUrl: "/RiskExamFile/RiskExamFile.ashx?", //�ļ������ַ
    debug: false
};
if (ServerConfig.debug) {
    ServerConfig.server = 'localhost';
    ServerConfig.fileServer = 'localhost'; 
};