import FileAPI from "@/api/file.api";
import COS from "cos-js-sdk-v5";

//上传文件
//'name' => $fileName, 'url' => $result['ObjectURL'], 'uid' => $uid
export function uploadFileCos(
  folder: string,
  uid: string,
  _obj: any,
  callback: (fileData: any) => void
) {
  FileAPI.presigned(folder, _obj.name)
    .then((res: any) => {
      const credentials = res.credentials;
      if (!credentials) return console.error("credentials invalid");
      const cos = new COS({
        getAuthorization: function (options, callback) {
          callback({
            TmpSecretId: credentials.tmpSecretId,
            TmpSecretKey: credentials.tmpSecretKey,
            XCosSecurityToken: credentials.sessionToken,
            StartTime: res.startTime, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
            ExpiredTime: res.expiredTime, // 时间戳，单位秒，如：1580000900
          });
        },
      });
      cos.putObject(
        {
          Bucket: res.bucket,
          Region: res.region,
          Body: _obj,
          //SliceSize: 1024 * 1024 * 5,
          Key: res.key,
          onProgress: function (progressData) {
            // state.percent = parseInt(progressData.percent * 10000) / 100
            // state.speed = parseInt((progressData.speed / 10242 / 1024) * 100) / 100
            // console.log('进度: ' + state.percent + '%; 速度: ' + state.speed + 'Mb/s')
            // console.log('进度: ' + state.percent + '%')
            console.log("上传中", JSON.stringify(progressData));
          },
        },
        function (err, data) {
          // console.log("错误日志", err);
          if (err) {
            const fileDatas = {
              name: _obj.name,
              url: "",
              uid: uid,
            };
            callback(fileDatas);
          }
          // console.log(data);
          const fileData = {
            name: _obj.name,
            url: decodeURI(`https://${data.Location}`),
            uid: uid,
          };
          callback(fileData);
        }
      );
    })
    .finally(() => {});
}
