import React, { useEffect, useState } from "react";
// import Icon from "components/AppIcon";
import { cn } from "../../utils/cn";

const FileUploader = ({
  label,
  required,
  error,
  description,
  inputId,
  // onChange,
  // onRemoveImage,
  isLoading = false,
  progress = 0,
  previewUrl = null,
  ...props
}) => {
  // const ref = useRef(null);
  const [preview, setPreview] = useState(null);

  // if BE returns a public url after complete, show it
  useEffect(() => {
    (() => {
      if (previewUrl) setPreview(previewUrl);
    })();
  }, [previewUrl]);

  // const handleFileChange = (e) => {
  //   const file = e.target?.files?.[0];
  //   if (!file) return;

  //   // generate preview
  //   const reader = new FileReader();
  //   reader.onload = (event) => {
  //     setPreview(event.target.result);
  //   };
  //   reader.readAsDataURL(file);

  //   if (onChange) onChange(e);

  //   // reset input to allow re-uploading the same file again
  //   if (ref.current) ref.current.value = "";
  // };

  //   useEffect(() => {
  //     if (props.filename !== "") {
  //       setPreview(props.filename);
  //     }
  //   }, []);

  // const handleRemoveImage = () => {
  //   setPreview(null);
  //   onRemoveImage();
  //   if (ref.current) ref.current.value = "";
  // };

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none block text-foreground"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {/* Upload box */}
      <div
        className={cn(
          "flex items-center justify-between w-full border-2 border-dashed border-[#E5E7EB] rounded-lg px-4 py-2 bg-white",
          error && "border-destructive focus-visible:ring-destructive",
        )}
      >
        {preview ? (
          <div className="relative h-32 rounded-lg overflow-hidden mb-2">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {/* <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-error text-white rounded-full p-1 hover:bg-error/90"
            >
              <Icon name="X" size={14} />
            </button> */}
          </div>
        ) : (
          <span className="text-[#1F29378C] text-sm truncate max-w-[70%] font-medium mb-2">
            {props.filename || props.placeholder || "Upload file"}
          </span>
        )}

        {/* <label className="cursor-pointer">
          <span className="px-3 py-1.5 border border-[#E5E7EB] rounded-md text-sm font-medium text-brand-gray-800 flex items-center gap-1">
            <Icon name="FolderOpen" size={16} /> Choose File
          </span>
          <input
            type="file"
            id={inputId}
            accept="image/*"
            className="hidden"
            ref={ref}
            onChange={handleFileChange}
            {...props}
            disabled
          />
        </label> */}
      </div>
      {isLoading && (
        <div className="px-4 pb-2">
          <div className="h-2 w-full bg-muted rounded">
            <div
              className="h-2 bg-primary rounded transition-all"
              style={{ width: `${progress || 1}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {progress || 0}%
          </p>
        </div>
      )}

      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default FileUploader;
