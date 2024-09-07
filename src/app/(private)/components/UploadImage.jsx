import { LuUpload } from "react-icons/lu";
import { memo, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const UploadImage = ({ info, onFiles, files }) => {
  const [rejected, setRejected] = useState([]);
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      onFiles(() => [
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
      setRejected([]);
    }

    if (rejectedFiles?.length) {
      setRejected(rejectedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000 * 5, //limit 5MB
    onDrop,
  });
  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <div className="flex flex-row-reverse items-center justify-center gap-4">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="mt-3 text-center cursor-pointer">
          <LuUpload fontSize="1.8rem" color="gray" />
        </div>
      </div>
      {/* Preview */}
      <section className="flex flex-col items-center">
        <p className="text-danger">
          {rejected.length ? "Cannot upload photos larger than 5MB " : ""}
        </p>
        <div
          className={`relative p-3 border border-solid rounded-full  w-44 h-44 ${
            rejected.length ? "border-danger" : "border-blue1"
          }`}
        >
          {(files.length || info) && (
            <Image
              src={
                files.length ? files[0].preview : info || "/image/toan-3.jpg"
              }
              alt={files[0]?.name}
              width={200}
              height={200}
              onLoad={() => {
                URL.revokeObjectURL(files[0]?.preview);
              }}
              className="object-cover w-full h-full rounded-full"
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default memo(UploadImage);
