import { Router, Request, Response } from 'express';
import request from 'request';

class IndexRoutes {

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config() : void {
        
        this.router.post('/', (req: Request, res: Response) => {
            const coordinates = req.body;
            res.send(coordinates);
        });
        
        // http://localhost:3000?x=34.565675&y=21.342423
        this.router.get('/', (req: Request, res: Response) => {
            const coordinates = req.query;
            let parada = 780;
            // GET a la api de la IMM
            const options = {
                url: `http://www.montevideo.gub.uy/transporteRest/lineas/${parada}`,
                method: 'GET',
                jar: true,
                headers: {
                    'User-Agent':       'Super Agent/0.0.1',
                    'Content-Type':     'application/x-www-form-urlencoded'
                }
            }

            request(options, (error, response, body) => {
                res.send(body);
            });

            //res.send(coordinates);
        });
    }
}

const indexRouter = new IndexRoutes();
export default indexRouter.router;