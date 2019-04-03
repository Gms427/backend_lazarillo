"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const request_1 = __importDefault(require("request"));
const paradas_1 = require("../paradas");
class IndexRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', (req, res) => {
            const coordinates = req.body;
            res.send(coordinates);
        });
        // http://localhost:3000?x=34.565675&y=21.342423
        this.router.get('/', (req, res) => {
            const coordinates = req.query;
            let parada = 780;
            // GET a la api de la IMM
            const options = {
                url: `http://www.montevideo.gub.uy/transporteRest/lineas/${parada}`,
                method: 'GET',
                jar: true,
                headers: {
                    'User-Agent': 'Super Agent/0.0.1',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            request_1.default(options, (error, response, body) => {
                res.send(paradas_1.paradas);
            });
            //res.send(coordinates);
        });
    }
}
const indexRouter = new IndexRoutes();
exports.default = indexRouter.router;
