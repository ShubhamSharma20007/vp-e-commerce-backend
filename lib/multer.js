import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(
    import.meta.url)
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/uploads')
//     },
//     filename: function (req, file, cb) {
//         const extensionName = path.extname(file.originalname)
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix + extensionName)
//     }
// })
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/uploads')); // Use absolute path
    },
    filename: function (req, file, cb) {
        const extensionName = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extensionName);
    }
});

const upload = multer({ storage: storage })

export default upload