const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

//Param middleware - this will only run when a condition is met
//The param here is id, the 4th arg is val = id
//router.param here is just listening for the request. The middleware is the checkId
//If there was no id this middleware would be ignored
router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
