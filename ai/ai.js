const { imag } = require('@tensorflow/tfjs')
const tf = require('@tensorflow/tfjs')
const pixels = require('image-pixels')
const sharp = require('sharp')
const labels = Array(26)
  .fill()
  .map((_, i) => String.fromCharCode('A'.charCodeAt(0) + i))

require('@tensorflow/tfjs-node')

class TensorflowPredictor {
  constructor () {}

  async loadModel () {
    const PORT = process.env.PORT || 3000
    this.model = await tf.loadLayersModel(
      'http://localhost:' + PORT + '/model/model.json'
    )
  }

  async predict (image) {
    const newImage = await sharp(image)
      .resize(28, 28)
      .greyscale()
      .toBuffer()

    const extractedPixels = await pixels(newImage, { type: 'png' })
    const imageAsTensor = tf.browser.fromPixels(extractedPixels, 1)
    const intTensor = tf.cast(imageAsTensor, 'int32')
    const normalization = tf.scalar(255)
    const input = intTensor.div(normalization)
    const prediction = this.model.predict(input.reshape([1, 28, 28, 1]))
    const predLabel = prediction.argMax(1).dataSync()[0]
    const confidence = prediction.dataSync()[predLabel]
    const cpred = correct_prediction(predLabel)
    return { prediction: predToLabel(cpred), confidence: confidence }
  }
}

exports.TensorflowPredictor = TensorflowPredictor

const correct_prediction = pred => {
  if (pred >= 9) {
    return pred + 1
  }
  return pred
}

const predToLabel = pred => {
  if (pred != 25) {
    return String.fromCharCode(65 + pred)
  }
  return 'OTHER'
}
