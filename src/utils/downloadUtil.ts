import JSZip from "jszip";
import {saveAs} from "file-saver";

export class DownloadUtil {
    zip

    constructor() {
        this.zip = new JSZip();
    }

    // add file to zip
    addFileInZip(fileName: string, content: string, folderName = "", option = {}) {
        if (folderName !== "") {
            const folder = this.zip.folder(folderName);
            folder?.file(fileName, content, option);
        } else {
            this.zip.file(fileName, content, option);
        }
    }

    // add folder to zip
    addFolderInZip(folderName: string) {
        return this.zip.folder(folderName);
    }

    // package into blob (binary)
    packageZip2blob() {
        return this.zip.generateAsync({type: "blob"});
    }

    // package and download
    packageZipAndDownload(zipName: string, type = "blob") {
        // @ts-ignore
        this.zip.generateAsync({type}).then((content) => {
            // @ts-ignore
            saveAs(content, zipName);
        })
    }
}

