import { JSX, useState } from "react";

interface InputFileProps {
    onFileSelected?: (file: File[]) => void;
}

export const InputFile = (props: InputFileProps): JSX.Element => {
    const onFileSelected = props.onFileSelected;
    const [files, setFiles] = useState<File[]>([]);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            const newFiles = Array.from(selectedFiles);
            addFiles(newFiles);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        const newFiles = Array.from(droppedFiles);
        addFiles(newFiles);
    };

    const addFiles = (newFiles: File[]) => {
        const uniqueFiles = newFiles.filter(newFile => {
            return !files.some(existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size);
        })

        if (uniqueFiles.length > 0) {
            const updatedFiles = [...files, ...uniqueFiles];
            setFiles(updatedFiles);
            if (onFileSelected) {
                onFileSelected(updatedFiles);
            }
        }
    }

    return (
        <div className="w-[100%] 
                        h-[110px] 
                        bg-(--color-white) 
                        cursor-pointer 
                        text-xl 
                        text-(--color-placeholder) 
                        text-center 
                        p-[14px]"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                id="fileInput"
                type="file"
                className="hidden"
                multiple
                onChange={handleFiles}
            />
            <label
                htmlFor="fileInput"
                className={`block text-(--color-placeholder) text-2xl ${files.length !== 0 ? 'hidden' : 'block'} mt-[26px]`}
            >
                Перетащите файлы сюда или кликните для выбора
            </label>
            <ul className="text-left">
                {files.map((file, index) => (
                    <li key={index} className="text-(--color-red) underline text-sm font-bold">
                        {file.name.split('.')[0]}
                    </li>
                ))}
            </ul>

        </div>
    );
}