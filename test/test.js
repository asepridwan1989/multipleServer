const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const mongoose = require('mongoose')
const app = require('../app')
chai.use(chaiHttp)
// const route = chai.request(app)

describe('test database blog', function(){

  it('should be get array', function(done){
    this.timeout(10000)
    chai
      .request(app)
      .get('/articles')
      .end(function(err, res){
          res.status.should.equal(200)
          res.body.should.be.a('array')
          done()
      })
  })

  it('should be added', function(done){
    // this.timeout(5000)
    chai
      .request(app)
      .post('/articles')
      .send({title:'java script', content:'how to learning javascript'})
      .end(function(err, res){
        console.log(res.body.data)
          res.status.should.equal(201)
          res.body.data.should.be.a('object')
          done()
      })
  })

  it('should be updated', function(done){
    this.timeout(10000)
    chai
    .request(app)
    .put('/articles/5af97b01d731ba3a4a52c34e')
    .send({ title: 'udin', content: 'how to be an udin' })
    .end(function (err, res) {
      console.log(res.body)
        res.statusCode.should.equal(201)
        res.body.should.be.a('object')
        done()
    });
  })

  it('should be deleted', function(done){
    this.timeout(10000)
    chai
    .request(app)
    .delete('/articles/5af97b01d731ba3a4a52c34e')
    .end(function (err, res) {
      console.log(res.message)
        // res.statusCode.should.equal(201)
        // res.body.should.be.a('object')
        done()
    });
  })

  after(function(done){
    mongoose.connection.db.dropCollection('articles', function(err, result) {
        done()
    });
  })
})
