import { Router } from 'express';
import {
  getLowestPEStocks,
  getLargestDeclinesStocks,
} from '@/controllers/stocksController';

const router = Router();

router.get('/low-pe', getLowestPEStocks);
router.get('/largest-declines', getLargestDeclinesStocks);

export default router;
