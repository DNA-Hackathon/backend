var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

 
const swaggerDefinition = {
  basePath: '/'
};
 
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // <-- not in the definition, but in the options
};

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerSpec = swaggerJSDoc(options);

var computeRouter = require('./routes/compute')
const fileUpload = require('express-fileupload')

var app = express()


// view engine setup
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'ai')))

app.use('/', computeRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})


module.exports = app
