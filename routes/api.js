const express = require('express');
const router = express.Router();
const sendMailSafetyNets = require('../controllers/api/sendMailSafetyNets');
const sendMailMissingTrailer = require('../controllers/api/sendMailMissingTrailer');
const sendMailTrailerNotPrepared = require('../controllers/api/sendMailTrailerNotPrepared');
const sendMailTrailerWronglyLeft = require('../controllers/api/sendMailTrailerWronglyLeft');
const sendMailTrailerCanNotLoad = require('../controllers/api/sendMailTrailerCanNotLoad');
const sendMailSBNotPrepared = require('../controllers/api/sendMailSBNotPrepared');
const sendMailSBWronglyLeft = require('../controllers/api/sendMailSBWronglyLeft');
const sendMailSBCanNotLoad = require('../controllers/api/sendMailSBCanNotLoad');
const sendMailSlowReservation = require('../controllers/api/sendMailSlowReservation');
const sendMailKamagSupport = require('../controllers/api/sendMailKamagSupport');
const saveUserData = require('../controllers/api/saveUserData');
const saveUserOutPass = require('../controllers/api/saveUserOutPass');
const sendMailWhatIsSB = require('../controllers/api/sendMailWhatIsSB');
const sendMailZwroty = require('../controllers/api/sendMailZwroty');
const sendMailSpareParts = require('../controllers/api/sendMailSpareParts');
const sendMailMissorts = require('../controllers/api/sendMailMissorts');
const sendMailDefectKamag = require('../controllers/api/sendMailDefectKamag');

const selectCapacity = require('../controllers/order/selectCapacity');
const updateCapacity = require('../controllers/order/updateCapacity');

router.post('/api/sendMailSafetyNets', sendMailSafetyNets);
router.post('/api/sendMailMissingTrailer', sendMailMissingTrailer);
router.post('/api/sendMailTrailerNotPrepared', sendMailTrailerNotPrepared);
router.post('/api/sendMailTrailerWronglyLeft', sendMailTrailerWronglyLeft);
router.post('/api/sendMailTrailerCanNotLoad', sendMailTrailerCanNotLoad);
router.post('/api/sendMailSBNotPrepared', sendMailSBNotPrepared);
router.post('/api/sendMailSBWronglyLeft', sendMailSBWronglyLeft);
router.post('/api/sendMailSBCanNotLoad', sendMailSBCanNotLoad);
router.post('/api/sendMailSlowReservation', sendMailSlowReservation);
router.post('/api/sendMailKamagSupport', sendMailKamagSupport);
router.post('/api/saveUserData', saveUserData);
router.post('/api/saveUserOutPass', saveUserOutPass);
router.post('/api/sendMailWhatIsSB', sendMailWhatIsSB);
router.post('/api/sendMailZwroty', sendMailZwroty);
router.post('/api/sendMailSpareParts', sendMailSpareParts);
router.post('/api/sendMailMissorts', sendMailMissorts);
router.post('/api/sendMailDefectKamag', sendMailDefectKamag);

router.post('/order/selectCapacity', selectCapacity);
router.post('/order/updateCapacity', updateCapacity);


module.exports = router;