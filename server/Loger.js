const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    query: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    status: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: false
    },
    ip: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: false,
        default: 'anonymous'
    }
});

const Log = mongoose.model('userLogs', logSchema);

const logRequest = (req, res, next) => {
    if (req.path === '/ping') return next();
    
    const start = Date.now();
    res.on('finish', async () => {
        const duration = Date.now() - start;
        const log = {
            timestamp: new Date(),
            method: req.method,
            path: req.path,
            query: req.query,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.headers['user-agent'],
            ip: req.ip,
            owner: req.tokenDetails?.owner || 'anonymous'
        };

        try {
            await Log.create(log);
            // console.log('Log saved to database:', log);
        } catch (error) {
            console.error('Error saving log to database:', error);
        }
    });
    next();
};

module.exports = logRequest;