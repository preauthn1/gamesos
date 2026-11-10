import FileAPI from "@/api/file.api";
//上传文件
//'name' => $fileName, 'url' => $result['ObjectURL'], 'uid' => $uid
export function uploadFileS3(
  folder: string,
  uid: string,
  _obj: any,
  callback: (fileData: any) => void,
  onProgress?: (progress: number) => void // Optional progress callback
) {
  FileAPI.presigned(folder, _obj.name)
    .then((res: any) => {
      const key = decodeURI(res.key);
      const url = res.url;

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      // Handle upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress); // Report progress percentage
        }
      };

      // Handle successful upload
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          callback({
            name: _obj.name,
            url: url,
            uid: uid,
          });
        } else {
          // Handle error case
          const fileDatas = {
            name: _obj.name,
            url: "",
            uid: uid,
          };
          callback(fileDatas);
        }
      };

      // Handle network errors
      xhr.onerror = () => {
        const fileDatas = {
          name: _obj.name,
          url: "",
          uid: uid,
        };
        callback(fileDatas);
      };

      // Open and send the request
      xhr.open("PUT", key, true);
      xhr.setRequestHeader(
        "Content-Type",
        _obj.type || "application/octet-stream"
      );
      xhr.send(_obj);
    })
    .catch((error) => {
      console.error("Error getting presigned URL:", error);
      const fileDatas = {
        name: _obj.name,
        url: "",
        uid: uid,
      };
      callback(fileDatas);
    })
    .finally(() => {});
}
