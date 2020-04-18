import fs from 'fs';
import path from 'path';
import cryptoRandomString from 'crypto-random-string';

export interface Document {
    name: string;
    pageFiles: string[];
    id: string;
}

export class DocumentUtil {
    static async fromPath(directory: string): Promise<Document> {
        let files = await fs.promises.readdir(directory);
        let validFiles: string[] = [];
        for (let f of files) {
            let fpath = path.resolve(directory, f);
            let extension = path.extname(fpath).toLowerCase();
            if (extension == '.png' || extension == '.jpg') {
                validFiles.push(fpath);
            }
        }

        if (validFiles.length > 0) {
            validFiles.sort();
            return {
                name: path.basename(directory),
                pageFiles: validFiles,
                id: cryptoRandomString({
                    length: 16,
                    type: "hex"
                })
            };
        } else {
            return null;
        }
    }

    static findDocument(documents: Document[], id: string): Document {
        for (let doc of documents) {
            if (doc.id == id) {
                return doc;
            }
        }
        return null;
    }
}
