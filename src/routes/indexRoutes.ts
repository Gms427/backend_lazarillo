import { Router, Request, Response } from 'express';
import request from 'request';
import { paradas } from '../paradas';

class IndexRoutes {

    public router: Router = Router();

    constructor(){
        this.config();
    }

    getNearestStop(x: number, y: number){
        console.log(x,y);
        const l = paradas.paradas.length;
        var p = 0;
        var dmin = 0;
        for(let i = 0; i < l; i++){
            let d = Math.abs(x - paradas.paradas[i].coordinates[1]) + Math.abs(y - paradas.paradas[i].coordinates[0]);
            if(d < dmin || dmin == 0){
                dmin = d;
                p = paradas.paradas[i].cod_ubic_parada;
            }
        }
        return p;
    }

    config() : void {
        
        this.router.post('/', (req: Request, res: Response) => {
            const coordinates = req.body;
            res.send(coordinates);
        });
        


        // http://localhost:3000?x=-34.8817596&y=-56.1150852
        this.router.get('/', (req: Request, res: Response) => {
            const coordinates = req.query;
            let parada = 780;
            const x = coordinates.x;
            const y = coordinates.y;

            var nearestStop = this.getNearestStop(x,y);
            console.log(nearestStop);

            // GET a la api de la IMM
            const options = {
                url: `http://www.montevideo.gub.uy/transporteRest/lineas/${nearestStop}`,
                method: 'GET',
                jar: true,
                headers: {
                    'User-Agent': 'Super Agent/0.0.1',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            
            request(options, (error: any, response: any, body: any) => {
                res.json(JSON.parse(body));
            });

            //res.send(coordinates);
        });
    }
}

const indexRouter = new IndexRoutes();
export default indexRouter.router;
