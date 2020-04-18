import express from 'express';
import { Document, DocumentUtil } from './document';
import fs from 'fs';
import path from 'path';

let libraryPath = process.argv[2];

interface DocumentModel {
    name: string;
    pages: number;
    id: string;
}

(async () => {
    let documents: Document[] = [];
    let items = await fs.promises.readdir(libraryPath);
    for (let item of items) {
        let itemPath = path.resolve(libraryPath, item);
        let itemStat = await fs.promises.stat(itemPath);
        if (itemStat.isDirectory()) {
            let doc = await DocumentUtil.fromPath(itemPath);
            if (doc != null) {
                documents.push(doc);
            }
        }
    }

    let app = express();

    // App static files
    app.use('/app', express.static(path.resolve(__dirname, '..', '..', 'client', 'lib')));

    // Home page redirection
    app.get('/', (req, res) => {
        res.redirect('/app/index.html');
    });

    // Return DocumentModel[]
    app.get('/api/documents', (req, res) => {
        let result: DocumentModel[] = [];
        for (let doc of documents) {
            result.push({
                id: doc.id,
                name: doc.name,
                pages: doc.pageFiles.length
            })
        }
        res.send(JSON.stringify(result));
    });

    // Return the page in image format
    app.get('/api/documents/:id/:page', (req, res) => {
        let id: string = req.params.id;
        let page: number = parseInt(req.params.page);
        let doc = DocumentUtil.findDocument(documents, id);
        if (doc == null) {
            res.sendStatus(404);
            return;
        }
        if (page < 0 || page >= doc.pageFiles.length) {
            res.sendStatus(404);
            return;
        }

        res.sendFile(doc.pageFiles[page]);
        return;
    });

    app.listen(3001, () => {
        console.info('Server listening on port 3001');
    });
})();