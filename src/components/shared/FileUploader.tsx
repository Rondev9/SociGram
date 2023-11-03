import React, { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
      setFileType(acceptedFiles[0].type);
      console.log("acceptedFiles: ", acceptedFiles);
    },
    [file]
  );
  console.log("fileUrl: ", fileUrl);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg"],
      "video/*": [".mp4", ".mkv"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <div>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            {fileType.startsWith("image") ? (
              <img src={fileUrl} alt="image" className="file_uploader-img" />
            ) : (
              // if it's a video
              <video width="320" height="240" controls>
                <source src={fileUrl} type={fileType} />
                Oops! Your browser does not support the video preview.
              </video>
            )}
          </div>
          <div>
            {fileType.startsWith("image") ? (
              <p className="file_uploader-label">
                Click or drag image to replace
              </p>
            ) : (
              <p className="file_uploader-label">
                Click or drag video to replace
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file-upload"
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag n Drop here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <Button className="shad-button_dark_4">Browse from computer</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
