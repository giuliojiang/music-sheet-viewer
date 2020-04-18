import fs from 'fs';

export class Document {

    constructor(
        private readonly name: string,
        private readonly path: string,
        private readonly pageFiles: string[]
    ) { }

    static async fromPath(path: string): Promise<Document> {
        let files = await fs.promises.readdir(path);
        for (let f of files) {
            console.info(f);
        }
        return null;
    }

}