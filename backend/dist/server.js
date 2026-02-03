"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = __importDefault(require("cloudinary"));
dotenv_1.default.config();
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const forums_1 = __importDefault(require("./routes/forums"));
const content_1 = __importDefault(require("./routes/content"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/forums', forums_1.default);
app.use('/api/content', content_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'ACSP Backend API' });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
const PORT = process.env.PORT || 5000;
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/acsp')
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
//# sourceMappingURL=server.js.map