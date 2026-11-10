import request from "@/utils/request";

const FileAPI = {
  /**
   * 文件预签名
   * @param folder
   * @param filename
   * @returns
   */
  presigned(folder: string, filename: string) {
    return request<any, FileInfo>({
      url: "/manage/v1/file/presigned",
      method: "post",
      data: { folder: folder, filename: filename },
    });
  },

  /**
   * 上传文件
   *
   * @param formData
   */
  upload(formData: FormData) {
    return request<any, FileInfo>({
      url: "/manage/v1/file/upload",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * 上传文件
   */
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request<any, FileInfo>({
      url: "/manage/v1/file/upload",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * 删除文件
   *
   * @param filePath 文件完整路径
   */
  delete(filePath?: string) {
    return request({
      url: "/manage/v1/file/delete",
      method: "post",
      data: { url: filePath },
    });
  },

  /**
   * 下载文件
   * @param url
   * @param fileName
   */
  download(url: string, fileName?: string) {
    return request({
      url: "/manage/v1/file/download_file",
      method: "get",
      params: {
        url: url,
        file_name: fileName,
      },
      responseType: "blob",
    }).then((res) => {
      const blob = new Blob([res.data]);
      const a = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName || "下载文件";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  },
};

export default FileAPI;

/**
 * 文件API类型声明
 */
export interface FileInfo {
  /** 文件名 */
  name: string;
  /** 文件标识 */
  uid: string;
  /// 文件类型
  type: string;
  /** 文件路径 */
  url: string;
  /**签名url */
  key?:string;
}
