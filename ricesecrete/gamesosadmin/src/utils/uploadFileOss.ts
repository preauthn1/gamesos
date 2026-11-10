import FileAPI from "@/api/file.api";
//上传文件
//'name' => $fileName, 'url' => $result['ObjectURL'], 'uid' => $uid
export function uploadFileOss(
  folder: string,
  uid: string,
  _obj: any,
  callback: (fileData: any) => void
) {
  console.log("上传文件", _obj);
  FileAPI.presigned(folder, _obj.name)
    .then((res: any) => {
      const key = decodeURI(res.key);
      const url = res.url;
      console.log("oss", res);
      fetch(key, {
        method: "PUT",
        body: _obj, // 直接上传整个文件
        headers: {
          "Content-Type": "",
        },
      })
        .then((res) => {
          console.log("上传成功", res);
          callback({
            name: _obj.name,
            url: url,
            uid: uid,
          });
        })
        .catch((err) => {
          const fileDatas = {
            name: _obj.name,
            url: "",
            uid: uid,
          };
          callback(fileDatas);
          console.log(err);
        });
    })
    .finally(() => {});
}
