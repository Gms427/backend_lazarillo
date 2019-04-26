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
        this.days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        this.router = express_1.Router();
        this.config();
    }
    getNearestStop(x, y) {
        console.log(x, y);
        const l = paradas_1.paradas.paradas.length;
        var p = 0;
        var dmin = 0;
        for (let i = 0; i < l; i++) {
            let d = Math.abs(x - paradas_1.paradas.paradas[i].coordinates[1]) + Math.abs(y - paradas_1.paradas.paradas[i].coordinates[0]);
            if (d < dmin || dmin == 0) {
                dmin = d;
                p = paradas_1.paradas.paradas[i].cod_ubic_parada;
            }
        }
        return p;
    }
    // getBusTime(m: minutes, s: seconds){
    //   const
    //
    // }
    config() {
        this.router.post('/', (req, res) => {
            const coordinates = req.body;
            res.send(coordinates);
        });
        // http://localhost:3000?x=-34.8817596&y=-56.1150852
        this.router.get('/', (req, res) => {
            const coordinates = req.query;
            let parada = 780;
            const x = coordinates.x;
            const y = coordinates.y;
            var nearestStop = this.getNearestStop(x, y);
            console.log(nearestStop);
            // GET a la api de la IMM
            //`http://www.montevideo.gub.uy/transporteRest/lineas/${nearestStop}`
            let currentDate = new Date();
            let currentTime = currentDate.getHours().toString() + ":" + currentDate.getMinutes().toString();
            let dayType = "";
            let currentDay = this.days[currentDate.getDay()];
            switch (currentDay.toLowerCase()) {
                case "domingo":
                    dayType = "DOMINGO";
                    break;
                case "sábado":
                    dayType = "SABADO";
                    break;
                default:
                    dayType = "HABIL";
            }
            let url = `http://www.montevideo.gub.uy/transporteRest/pasadas/${nearestStop}/${dayType}/${currentTime}`;
            console.log(url);
            const options = {
                url: url,
                method: 'GET',
                jar: true,
                headers: {
                    'User-Agent': 'Super Agent/0.0.1',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            request_1.default(options, (error, response, body) => {
                res.json(JSON.parse(body));
            });
            //res.send(coordinates);
        });
    }
}
const indexRouter = new IndexRoutes();
exports.default = indexRouter.router;
