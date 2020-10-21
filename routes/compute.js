var express = require('express')
var router = express.Router()

/**
 * @swagger
 *
 * /compute:
 *   post:
 *     description: Computes the prediction for the sign language input
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: input
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
    res.json({
      prediction: 'A'
    })
  }
})

module.exports = router
