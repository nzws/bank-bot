import anyRouter from 'any-router';

import { Help, Login } from './controllers/meta';
import { Balance, Log, RakutenSend } from './controllers/bank';

const router = new anyRouter();

router.add(':help', Help);
router.add(':login', Login);
router.add(':balance', Balance);
router.add(':log', Log);
router.add(':rakuten-send', RakutenSend);

export default router;
