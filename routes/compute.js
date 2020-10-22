const { buffer } = require('@tensorflow/tfjs')
var express = require('express')
const sharp = require('sharp')
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

/**
 * @swagger
 *
 *
 *
 * definitions:
 *   GameInput:
 *     type: object
 *     required:
 *       - image
 *       - bbox
 *     properties:
 *       image:
 *         type: string
 *         description: Base64 encoded picture
 *       bbox:
 *         type: array
 *         items: number
 * /game/compute:
 *   post:
 *     description: Computes the prediction for the sign language input
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/GameInput'
 *     responses:
 *       200:
 *         description: login
 */
router.post('/game/compute', function (req, res, next) {
  if (!req.is('application/json')) {
    res.send(400)
  } else {
    const bbox = req.body.bbox
    const image = Buffer.from(req.body.image, 'base64')
    console.log(image)
    const croppedImage = sharp(image)
      .extract({ left: bbox[0], top: bbox[1], width: bbox[2], height: bbox[3] })
      .toBuffer()
      .then(image => {
        predictor.predict(image).then(pred => {
          res.json({
            prediction: pred
          })
        })
      })
  }
})

module.exports = router
