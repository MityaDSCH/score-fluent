module.exports = function(app) {
  return function(req, res) {
    console.log(req.body);
    res.json({success: true});
  }
}
