var express = require('express')
const { TensorflowPredictor } = require('../ai/ai')
var router = express.Router()

var predictor = new TensorflowPredictor()
predictor.loadModel()
/**
 * @swagger
 *
 * /compute:
 *   post:
 *     description: Computes the prediction for the sign language input
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: file
 *         description: The input picture
 *         in: formData
 *         required: true
 *         type: file

 *     responses:
 *       200:
 *         description: login
 */
router.post('/compute', function (req, res, next) {
  if (!req.is('multipart/form-data')) {
    res.send(400)
  } else {
    predictor.predict(req.files.file.data).then(pred => {
      res.json({
        prediction: pred
      })
    })
  }
})

module.exports = router
