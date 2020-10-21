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
    this.model = await tf.loadLayersModel(
      'https://dna-hackathon-backend.herokuapp.com//model/model.json'
    )
  }

  async predict (image) {
    const newImage = await sharp(image)
      .resize(28, 28)
      .greyscale()
      .toBuffer()
    let extractedPixels = await pixels(newImage, { type: 'png' })
    const imageAsTensor = tf.browser.fromPixels(extractedPixels, 1)
    const prediction = this.model.predict(tf.stack([imageAsTensor]))
    const label = prediction.argMax(1).dataSync()[0]

    return labels[label]
  }
}

exports.TensorflowPredictor = TensorflowPredictor
